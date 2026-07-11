import { ref, onUnmounted } from 'vue'

const audioElement = ref(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const currentSong = ref(null)

let fadeInterval = null
let timeUpdateHandler = null

export function useMusic() {
  function load(song) {
    // Clean up previous
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.removeEventListener('timeupdate', onTimeUpdate)
      audioElement.value.removeEventListener('ended', onEnded)
      audioElement.value.removeEventListener('loadedmetadata', onLoaded)
    }

    currentSong.value = song
    const audio = new Audio(song.file)
    audio.volume = 0 // Start silent for fade-in
    audio.loop = true
    audio.preload = 'auto'

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('loadedmetadata', onLoaded)

    audioElement.value = audio
  }

  function onTimeUpdate() {
    if (audioElement.value) {
      currentTime.value = audioElement.value.currentTime
    }
  }

  function onEnded() {
    isPlaying.value = false
  }

  function onLoaded() {
    if (audioElement.value) {
      duration.value = audioElement.value.duration
    }
  }

  async function play() {
    if (!audioElement.value) return
    try {
      await audioElement.value.play()
      isPlaying.value = true
    } catch (err) {
      console.warn('Audio play failed:', err)
    }
  }

  function pause() {
    if (!audioElement.value) return
    audioElement.value.pause()
    isPlaying.value = false
  }

  function toggle() {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  function toggleMute() {
    if (!audioElement.value) return
    isMuted.value = !isMuted.value
    audioElement.value.muted = isMuted.value
  }

  function setVolume(vol) {
    volume.value = vol
    if (audioElement.value) {
      audioElement.value.volume = vol
    }
  }

  function seek(time) {
    if (audioElement.value) {
      audioElement.value.currentTime = time
    }
  }

  /**
   * Fade audio volume from current to target over durationMs
   * Returns a promise that resolves when fade is complete
   */
  function fadeVolume(targetVolume, durationMs = 3000) {
    return new Promise((resolve) => {
      if (!audioElement.value) {
        resolve()
        return
      }

      if (fadeInterval) clearInterval(fadeInterval)

      const startVolume = audioElement.value.volume
      const diff = targetVolume - startVolume
      const steps = Math.ceil(durationMs / 30) // ~30ms intervals
      const stepSize = diff / steps
      let currentStep = 0

      fadeInterval = setInterval(() => {
        currentStep++
        if (currentStep >= steps) {
          audioElement.value.volume = targetVolume
          volume.value = targetVolume
          clearInterval(fadeInterval)
          fadeInterval = null
          resolve()
        } else {
          const newVol = Math.max(0, Math.min(1, startVolume + stepSize * currentStep))
          audioElement.value.volume = newVol
          volume.value = newVol
        }
      }, 30)
    })
  }

  /**
   * Start playing with a fade-in from silence
   */
  async function playWithFadeIn(fadeMs = 3000) {
    if (!audioElement.value) return
    audioElement.value.volume = 0
    await play()
    await fadeVolume(0.7, fadeMs)
  }

  /**
   * Stop playing with a fade-out to silence
   */
  async function stopWithFadeOut(fadeMs = 2000) {
    if (!audioElement.value) return
    await fadeVolume(0, fadeMs)
    pause()
  }

  function destroy() {
    if (fadeInterval) clearInterval(fadeInterval)
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.removeEventListener('timeupdate', onTimeUpdate)
      audioElement.value.removeEventListener('ended', onEnded)
      audioElement.value.removeEventListener('loadedmetadata', onLoaded)
      audioElement.value.src = ''
      audioElement.value = null
    }
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    // State
    audioElement,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    volume,
    currentSong,

    // Actions
    load,
    play,
    pause,
    toggle,
    toggleMute,
    setVolume,
    seek,
    fadeVolume,
    playWithFadeIn,
    stopWithFadeOut,
    destroy,

    // Utils
    formatTime,
  }
}
