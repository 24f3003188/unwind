<template>
  <div
    class="write-page"
    :style="pageStyle"
  >
    <!-- Song Reveal overlay -->
    <SongReveal
      v-if="showReveal"
      :song="currentMood.song"
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
      :song="currentMood.song"
      :show="showPill"
      :mood-color="currentMood.color"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useReleasesStore } from '../stores/releases'
import { getMood } from '../data/moods'
import { useMusic } from '../composables/useMusic'
import SongReveal from '../components/write/SongReveal.vue'
import WriteEditor from '../components/write/WriteEditor.vue'
import MusicPill from '../components/write/MusicPill.vue'
import AppButton from '../components/common/AppButton.vue'

const router = useRouter()
const store = useReleasesStore()
const music = useMusic()

// Redirect if no mood selected
if (!store.activeMood) {
  router.replace('/mood')
}

const currentMood = computed(() => getMood(store.activeMood) || getMood('heavy'))

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

const pageStyle = computed(() => {
  return {
    backgroundImage: `url(${currentMood.value.bgImage})`,
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
  music.load(currentMood.value.song)

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

function onRevealComplete() {
  showReveal.value = false
  phase.value = 'write'
  showEditor.value = true
  showPill.value = true
}

function goToRelease() {
  isReleasing.value = true
  
  let i = text.value.length
  const initialLength = i
  
  function backspaceNext() {
    if (i > 0) {
      // Dynamic speed: slow down as it gets closer to the end for a dramatic release feel
      let currentSpeed = 40;
      if (i < 20) {
        currentSpeed = 40 + ((20 - i) * 6); // Slows down to ~150ms for the last character
      } else if (initialLength > 100) {
        currentSpeed = 10; // Zoom through long texts
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

.write-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%);
  z-index: 1;
  pointer-events: none;
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
