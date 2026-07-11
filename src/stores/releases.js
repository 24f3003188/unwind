import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useReleasesStore = defineStore('releases', () => {
  // === Active Session ===
  const activeMood = ref(null)
  const activeText = ref('')
  const activeReleaseType = ref(null)

  // === Release History (persisted to localStorage) ===
  const history = ref(loadHistory())

  function loadHistory() {
    try {
      const stored = localStorage.getItem('unwind-history')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem('unwind-history', JSON.stringify(history.value))
    } catch {
      // localStorage full or unavailable — silent fail
    }
  }

  // === Computed ===
  const gardenPlants = computed(() =>
    history.value.filter(r => r.releaseType === 'plant')
  )

  const releaseCount = computed(() => history.value.length)
  const plantCount = computed(() => gardenPlants.value.length)

  // === Actions ===
  function setMood(moodId) {
    activeMood.value = moodId
  }

  function setText(text) {
    activeText.value = text
  }

  function setReleaseType(typeId) {
    activeReleaseType.value = typeId
  }

  function completeRelease() {
    if (!activeMood.value || !activeReleaseType.value) return

    const entry = {
      id: crypto.randomUUID(),
      mood: activeMood.value,
      releaseType: activeReleaseType.value,
      date: new Date().toISOString(),
      textLength: activeText.value.length,
    }

    // For plant releases, generate a seed for procedural plant rendering
    if (activeReleaseType.value === 'plant') {
      entry.plantSeed = Math.random()
      entry.plantHash = hashText(activeText.value)
    }

    history.value.unshift(entry) // newest first
    saveHistory()

    // Clear session (but keep mood for potential "begin again")
    activeText.value = ''
    activeReleaseType.value = null
  }

  function resetSession() {
    activeMood.value = null
    activeText.value = ''
    activeReleaseType.value = null
  }

  // Simple string hash for procedural plant generation
  function hashText(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  }

  return {
    // State
    activeMood,
    activeText,
    activeReleaseType,
    history,

    // Computed
    gardenPlants,
    releaseCount,
    plantCount,

    // Actions
    setMood,
    setText,
    setReleaseType,
    completeRelease,
    resetSession,
  }
})
