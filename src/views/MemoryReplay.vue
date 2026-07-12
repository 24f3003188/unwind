<template>
  <div class="memory-replay-page" :style="pageStyle">
    
    <!-- Song Reveal -->
    <SongReveal
      v-if="showReveal && currentMood"
      :song="activeSong"
      text-color="#ffffff"
      :hold-duration="4000"
      @complete="onRevealComplete"
    />
    
    <!-- Replay Navigation -->
    <transition name="fade-up">
      <button 
        v-if="!showReveal" 
        class="back-nav-btn"
        @click="goBack"
      >
        <span class="arrow">←</span> Memories
      </button>
    </transition>
    
    <!-- Loading Error -->
    <div v-if="error" class="error-msg">{{ error }}</div>

    <!-- Text Container -->
    <transition name="fade-up">
      <div v-if="showEditor && memory" class="write-content">
        <div class="write-editor">
          <div class="grow-wrap" :data-replicated-value="typedText + ' '">
            <textarea
              class="editor-textarea handwritten"
              :value="typedText"
              readonly
            ></textarea>
          </div>
        </div>
      </div>
    </transition>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { getMood, getSongIndexFromId } from '../data/moods'
import { useMusic } from '../composables/useMusic'
import SongReveal from '../components/write/SongReveal.vue'

const route = useRoute()
const router = useRouter()
const music = useMusic()

const memory = ref(null)
const currentMood = ref(null)
const activeSong = ref(null)
const activeBgImage = ref('')
const currentSongIndex = ref(0)
const error = ref('')

const showReveal = ref(false)
const showEditor = ref(false)
const bgOpacity = ref(0)
const typedText = ref('')

let typeTimeout = null

const pageStyle = computed(() => {
  return {
    backgroundImage: currentMood.value ? `url(${activeBgImage.value})` : 'none',
    opacity: bgOpacity.value,
    transition: 'opacity 4s ease',
  }
})

onMounted(async () => {
  // Fetch memory
  const { data, error: dbError } = await supabase
    .from('memories')
    .select('*')
    .eq('id', route.params.id)
    .single()
    
  if (dbError || !data) {
    error.value = "Couldn't find this memory."
    bgOpacity.value = 1
    return
  }
  
  memory.value = data
  currentMood.value = getMood(data.mood_id) || getMood('heavy')
  const songIndex = getSongIndexFromId(data.mood_id)
  currentSongIndex.value = songIndex
  
  if (currentMood.value) {
    activeSong.value = currentMood.value.songs[songIndex] || currentMood.value.song
    activeBgImage.value = currentMood.value.bgImages[songIndex] || currentMood.value.bgImage
  }
  
  // Setup music - pass loop=false so it ends naturally
  music.load(activeSong.value, false, playNextSong)
  music.playWithFadeIn(2000)
  
  showReveal.value = true
  
  // Cinematic fade in
  requestAnimationFrame(() => {
    setTimeout(() => {
      bgOpacity.value = 1
    }, 500)
  })
})

function onRevealComplete() {
  showReveal.value = false
  showEditor.value = true
  
  // Start algorithmic typing
  setTimeout(startCinematicTyping, 1000)
}

function playNextSong() {
  if (!currentMood.value) return
  const songs = currentMood.value.songs
  let nextIndex = currentSongIndex.value + 1
  if (nextIndex >= songs.length) nextIndex = 0
  
  currentSongIndex.value = nextIndex
  activeSong.value = currentMood.value.songs[nextIndex]
  activeBgImage.value = currentMood.value.bgImages[nextIndex]
  
  music.load(activeSong.value, false, playNextSong)
  music.playWithFadeIn(2000)
}

function startCinematicTyping() {
  const fullText = memory.value.text_content
  if (!fullText) return
  
  // Calculate dynamic speed based on audio duration
  // We want to finish exactly 35 seconds before the song ends
  const songDurationSeconds = music.duration.value > 0 ? music.duration.value : 180 // fallback to 3 mins
  const targetDurationMs = (songDurationSeconds - 35) * 1000
  
  // Base characters
  const charCount = fullText.length
  
  // Estimate punctuation/newline pauses
  let punctuationCount = 0
  let newlineCount = 0
  for (let c of fullText) {
    if (c === '.' || c === ',' || c === '—') punctuationCount++
    if (c === '\n') newlineCount++
  }
  
  const estimatedPauseTime = (punctuationCount * 400) + (newlineCount * 1000)
  const remainingTimeForChars = Math.max(10000, targetDurationMs - estimatedPauseTime) // min 10 seconds
  const baseSpeed = remainingTimeForChars / charCount
  
  let i = 0
  
  function typeNext() {
    if (i < fullText.length) {
      const char = fullText[i]
      typedText.value += char
      i++
      
      let speed = baseSpeed + (Math.random() * 40 - 20)
      
      if (char === '.' || char === ',' || char === '—') speed += 400
      if (char === '\n') speed += 1000
      
      // Prevent massive unnatural speeds
      if (speed < 10) speed = 10
      if (speed > 3000) speed = 3000
      
      // Auto-scroll logic if page needs scrolling
      if (i % 10 === 0) {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
      }
      
      typeTimeout = setTimeout(typeNext, speed)
    }
  }
  
  typeNext()
}

function goBack() {
  music.stopWithFadeOut(1500).then(() => {
    router.push('/memories')
  })
}

onBeforeUnmount(() => {
  if (typeTimeout) clearTimeout(typeTimeout)
  music.destroy()
})
</script>

<style scoped>
.memory-replay-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: calc(var(--nav-height) + var(--space-xl)) var(--space-xl) var(--space-2xl) var(--space-xl);
  position: relative;
  background-color: var(--canvas);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.back-nav-btn {
  position: fixed;
  top: var(--space-lg);
  left: var(--space-xl);
  z-index: 20;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color var(--duration-fast) var(--ease-out);
}

.back-nav-btn:hover {
  color: #ffffff;
}

.arrow {
  font-size: 18px;
  transition: transform var(--duration-fast) var(--ease-out);
}

.back-nav-btn:hover .arrow {
  transform: translateX(-4px);
}

.write-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 680px;
}

.write-editor {
  width: 100%;
}

.grow-wrap {
  display: grid;
  width: 100%;
}

.grow-wrap::after {
  content: attr(data-replicated-value);
  white-space: pre-wrap;
  visibility: hidden;
  grid-area: 1 / 1 / 2 / 2;
  font-family: var(--font-handwritten);
  font-weight: 400;
  font-size: 18px;
  line-height: 1.8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0;
  text-align: center;
  word-wrap: break-word;
}

.editor-textarea {
  grid-area: 1 / 1 / 2 / 2;
  width: 100%;
  height: 100%;
  min-height: 40px;
  border: none;
  background: transparent;
  outline: none;
  color: #ffffff;
  padding: 0;
  text-align: center;
  resize: none;
  overflow: hidden;
  font-family: var(--font-handwritten);
  font-weight: 400;
  font-size: 18px;
  line-height: 1.8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.error-msg {
  position: relative;
  z-index: 2;
  color: #fff;
  font-family: var(--font-display);
  font-size: 24px;
  margin-top: 100px;
}

@media (max-width: 768px) {
  .memory-replay-page {
    padding: calc(var(--nav-height) + var(--space-lg)) var(--space-lg);
  }
  .back-nav-btn {
    top: var(--space-md);
    left: var(--space-md);
  }
  .editor-textarea, .grow-wrap::after {
    font-size: 14px;
  }
}
</style>
