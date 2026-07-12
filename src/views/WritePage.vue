<template>
  <div
    class="write-page"
    :style="pageStyle"
  >
    <!-- Song Reveal overlay -->
    <SongReveal
      v-if="showReveal"
      :song="activeSong"
      text-color="#ffffff"
      :hold-duration="4000"
      @complete="onRevealComplete"
    />

    <!-- Back Button -->
    <transition name="fade-up">
      <button 
        v-if="showEditor && !isReleasing" 
        class="back-nav-btn"
        @click="goBackToCatalog"
      >
        <span class="arrow">←</span> Back
      </button>
    </transition>

    <!-- Writing area (appears after reveal) -->
    <transition name="fade-up">
      <div v-if="showEditor" class="write-content">
        <WriteEditor v-model="text" :readonly="isReleasing" />

        <transition name="fade-up">
          <div v-if="text.length > 0 && !isReleasing" class="release-action-panel">
            <button class="release-btn keep-btn" @click="keepForever">
              Keep it forever
            </button>
            <button
              class="release-btn"
              :style="releaseBtnStyle"
              @click="goToRelease"
            >
              I'm ready to let this go
            </button>
          </div>
        </transition>

        <!-- Final Actions after quote is typed -->
        <transition name="fade-up">
          <div v-if="isComplete" class="final-action-panel">
            <AppButton variant="primary" @click="beginAgain">Begin again</AppButton>
            <AppButton variant="secondary" @click="goHome">Home</AppButton>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Music Pill -->
    <MusicPill
      :song="activeSong"
      :show="showPill"
      :mood-color="currentMood.color"
    />
    <!-- Login Prompt -->
    <LoginPrompt 
      :visible="showLoginPrompt"
      title="Keep it forever."
      body="To save your thoughts, sign in with your Google account. Your words will be waiting for you whenever you want to revisit them."
      @login="proceedWithLogin"
      @close="showLoginPrompt = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useReleasesStore } from '../stores/releases'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'
import { getMood } from '../data/moods'
import { useMusic } from '../composables/useMusic'
import SongReveal from '../components/write/SongReveal.vue'
import WriteEditor from '../components/write/WriteEditor.vue'
import MusicPill from '../components/write/MusicPill.vue'
import AppButton from '../components/common/AppButton.vue'
import LoginPrompt from '../components/common/LoginPrompt.vue'

const router = useRouter()
const store = useReleasesStore()
const auth = useAuthStore()
const music = useMusic()

// Redirect if no mood selected
if (!store.activeMood) {
  router.replace('/mood')
}

const currentMood = computed(() => getMood(store.activeMood) || getMood('heavy'))
const activeSong = computed(() => currentMood.value.songs[store.activeSongIndex] || currentMood.value.song)
const activeBgImage = computed(() => currentMood.value.bgImages[store.activeSongIndex] || currentMood.value.bgImage)

const text = ref(store.activeText || '')

// === Sequence State ===
const phase = ref('darken')   // 'darken' → 'reveal' → 'write' → 'releasing'
const showReveal = ref(false)
const showEditor = ref(false)
const showPill = ref(false)
const isReleasing = ref(false)
const isComplete = ref(false)
const bgOpacity = ref(0)
const randomResponse = ref('')
const showLoginPrompt = ref(false)

const pageStyle = computed(() => {
  return {
    backgroundImage: `url(${activeBgImage.value})`,
    opacity: bgOpacity.value,
    transition: 'opacity 4s ease',
  }
})

const releaseBtnStyle = computed(() => {
  return {
    color: '#ffffff',
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
  }
})

// === Cinematic Sequence ===
onMounted(async () => {
  // Load the song
  music.load(activeSong.value, false, playNextSong)

  // Start music instantly since they clicked 'Play' on the previous screen
  music.playWithFadeIn(2000)
  showReveal.value = true
  phase.value = 'reveal'

  // Fade in the background image very slowly for cinematic effect
  requestAnimationFrame(() => {
    // Slight delay so the screen is pitch black for a beat
    setTimeout(() => {
      bgOpacity.value = 1
    }, 500)
  })
})

function playNextSong() {
  const songs = currentMood.value.songs
  let nextIndex = store.activeSongIndex + 1
  if (nextIndex >= songs.length) nextIndex = 0
  
  store.setSongIndex(nextIndex)
  
  // Note: activeSong and activeBgImage are computed and will update automatically
  music.load(activeSong.value, false, playNextSong)
  music.playWithFadeIn(2000)
}

function onRevealComplete() {
  showReveal.value = false
  phase.value = 'write'
  showEditor.value = true
  showPill.value = true
}

async function keepForever() {
  if (text.value.trim().length === 0) return

  if (!auth.user) {
    // Show the login prompt overlay instead of immediately redirecting
    showLoginPrompt.value = true
    return
  }

  // Already logged in, save directly
  const compoundMoodId = `${store.activeMood}-${store.activeSongIndex}`
  
  const { error } = await supabase.from('memories').insert({
    user_id: auth.user.id,
    mood_id: compoundMoodId,
    text_content: text.value
  })

  if (!error) {
    store.resetSession()
    router.push('/memories')
  } else {
    console.error('Error saving memory:', error)
    alert('Failed to save memory.')
  }
}

async function proceedWithLogin() {
  // Save to local storage to process after successful login redirect
  const compoundMoodId = `${store.activeMood}-${store.activeSongIndex}`
  localStorage.setItem('pendingMemoryText', text.value)
  localStorage.setItem('pendingMemoryMood', compoundMoodId)
  showLoginPrompt.value = false
  await auth.signInWithGoogle()
}

function goToRelease() {
  isReleasing.value = true
  
  let i = text.value.length
  const initialLength = i
  
  function backspaceNext() {
    if (i > 0) {
      // Progress: 0 at start → 1 at end
      const progress = 1 - (i / initialLength)
      
      // Start slow (~120ms), accelerate through the middle, then ease into the final few chars
      let currentSpeed
      
      if (i <= 5) {
        // Final 5 characters: slow down dramatically for emotional weight
        currentSpeed = 200 + ((5 - i) * 80)
      } else {
        // Exponential acceleration curve: starts at ~120ms, drops to ~8ms
        currentSpeed = Math.max(8, 120 * Math.pow(1 - progress, 2.5))
      }

      text.value = text.value.slice(0, -1)
      i--
      setTimeout(backspaceNext, currentSpeed)
    } else {
      // Deep breath pause before the quote appears
      setTimeout(typeQuote, 1500)
    }
  }
  
  backspaceNext()
}

function typeQuote() {
  const responses = currentMood.value.responses || ["You are safe now."]
  randomResponse.value = responses[Math.floor(Math.random() * responses.length)]
  
  let i = 0
  
  function typeNext() {
    if (i < randomResponse.value.length) {
      const char = randomResponse.value.charAt(i)
      text.value += char
      i++
      
      // Slight hesitation on punctuation for a human, empathetic cadence
      let charSpeed = 60
      if (char === '.' || char === ',') {
        charSpeed = 400
      } else if (char === ' ') {
        charSpeed = 90
      }
      
      setTimeout(typeNext, charSpeed)
    } else {
      // Show action buttons after reading delay
      setTimeout(() => {
        isComplete.value = true
      }, 1500)
    }
  }
  
  typeNext()
}

function beginAgain() {
  // Soft reset on the same page, music keeps playing
  text.value = ''
  store.setText('')
  isReleasing.value = false
  isComplete.value = false
}

function goHome() {
  store.resetSession()
  router.push('/')
}

function goBackToCatalog() {
  // Keeps the session state if they want, or clears it. 
  // Let's just go back to the catalog.
  router.push('/browse')
}

// Sync text to store on changes
onBeforeUnmount(() => {
  if (!isReleasing.value) {
    store.setText(text.value)
  }
})
</script>

<style scoped>
.write-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  width: 100%;
  max-width: 680px;
  padding-bottom: 160px; /* Space for the fixed button */
  min-height: 50vh;
  justify-content: center;
}

.release-action-panel, .final-action-panel {
  position: fixed;
  bottom: 100px;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
  width: 100%;
  z-index: 10;
  padding: 0 var(--space-md);
}

.release-btn {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 15px;
  padding: 14px 28px;
  border: 1px solid;
  border-radius: var(--rounded-md);
  background: transparent;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  letter-spacing: 0.02em;
}

.release-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.release-btn:active {
  transform: scale(0.97);
}

.keep-btn {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.keep-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .write-page {
    padding: var(--space-lg);
    padding-bottom: 100px;
  }
  
  .back-nav-btn {
    top: var(--space-md);
    left: var(--space-md);
  }
}
</style>
