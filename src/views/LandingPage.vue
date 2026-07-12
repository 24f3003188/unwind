<template>
  <div class="netflix-catalog">
    <!-- Hero Billboard -->
    <div class="billboard" :style="{ backgroundImage: `url(${activeBgImage})` }">
      <!-- Vignettes for text readability and smooth fade into background -->
      <div class="billboard-vignette-bottom"></div>
      <div class="billboard-vignette-left"></div>
      
      <div class="billboard-content container">
        <h1 class="billboard-title">{{ featuredMood.label }}</h1>
        <p class="billboard-tagline">{{ featuredMood.tagline }}</p>
        <p class="billboard-song-name">{{ activeSong.title }} — {{ activeSong.artist }}</p>
        
        <div class="billboard-actions">
          <AppButton variant="primary" @click="startExperience" class="play-btn">
            <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </AppButton>
          <AppButton variant="secondary" @click="toggleSongPicker">
            More Info
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Song Picker (slides down when More Info is clicked) -->
    <transition name="fade-up">
      <div v-if="showSongPicker" class="song-picker-section container">
        <h2 class="row-title">Choose Your Song</h2>
        <div class="song-picker-grid">
          <div 
            v-for="(song, index) in featuredMood.songs" 
            :key="index"
            :class="['song-card', { active: selectedSongIndex === index }]"
            :style="{ backgroundImage: `url(${featuredMood.bgImages[index]})` }"
            @click="selectSong(index)"
          >
            <div class="song-card-overlay"></div>
            <div class="song-card-content">
              <div class="song-card-check" v-if="selectedSongIndex === index">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <div class="song-card-number">{{ index + 1 }}</div>
              <div class="song-card-info">
                <span class="song-card-title">{{ song.title }}</span>
                <span class="song-card-artist">{{ song.artist }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Catalog Row -->
    <div id="catalog" class="catalog-row container">
      <h2 class="row-title">Trending Moods</h2>
      <div class="mood-grid">
        <MoodCard
          v-for="mood in moodList"
          :key="mood.id"
          :mood="mood"
          @select="setFeaturedMood(mood)"
          :class="{ 'is-featured': mood.id === featuredMood.id }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReleasesStore } from '../stores/releases'
import MoodCard from '../components/mood/MoodCard.vue'
import AppButton from '../components/common/AppButton.vue'
import { moods } from '../data/moods'

const router = useRouter()
const store = useReleasesStore()

const moodList = Object.values(moods)
const featuredMood = ref(moods.heavy)
const selectedSongIndex = ref(0)
const showSongPicker = ref(false)

const activeSong = computed(() => featuredMood.value.songs[selectedSongIndex.value])
const activeBgImage = computed(() => featuredMood.value.bgImages[selectedSongIndex.value])

function setFeaturedMood(mood) {
  featuredMood.value = mood
  selectedSongIndex.value = 0
  showSongPicker.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function selectSong(index) {
  selectedSongIndex.value = index
}

function toggleSongPicker() {
  showSongPicker.value = !showSongPicker.value
  if (showSongPicker.value) {
    // Scroll to the song picker after it renders
    setTimeout(() => {
      const el = document.querySelector('.song-picker-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }
}

function startExperience() {
  store.setMood(featuredMood.value.id)
  store.setSongIndex(selectedSongIndex.value)
  store.setText('')
  router.push('/write')
}
</script>

<style scoped>
.netflix-catalog {
  background-color: var(--canvas);
  min-height: 100vh;
  padding-bottom: var(--space-section);
}

/* === Billboard === */
.billboard {
  position: relative;
  width: 100%;
  height: 85vh;
  background-size: cover;
  background-position: center;
  transition: background-image 1s var(--ease-out);
}

.billboard-vignette-bottom {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--canvas) 0%, transparent 40%);
  z-index: 1;
}

.billboard-vignette-left {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(20,20,20,0.8) 0%, transparent 60%);
  z-index: 1;
}

.billboard-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 15vh;
}

.billboard-title {
  font-family: var(--font-display);
  font-size: 72px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: var(--space-sm);
  line-height: 1.1;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.billboard-tagline {
  font-size: 20px;
  font-weight: 400;
  color: #ffffff;
  max-width: 600px;
  margin-bottom: var(--space-xs);
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.billboard-song-name {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--muted);
  margin-bottom: var(--space-lg);
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.billboard-actions {
  display: flex;
  gap: var(--space-md);
}

.play-btn {
  font-size: 18px !important;
  padding: 12px 32px !important;
}

.play-icon {
  width: 24px;
  height: 24px;
}

/* === Song Picker === */
.song-picker-section {
  position: relative;
  z-index: 10;
  padding-top: var(--space-xl);
  padding-bottom: var(--space-xl);
}

.song-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.song-card {
  position: relative;
  border-radius: var(--rounded-sm);
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 16 / 7;
  background-size: cover;
  background-position: center;
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
  border: 2px solid transparent;
}

.song-card:hover {
  transform: scale(1.03);
  z-index: 5;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
}

.song-card.active {
  border-color: #ffffff;
  box-shadow: 0 0 20px rgba(255,255,255,0.15);
}

.song-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%);
}

.song-card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-xl);
}

.song-card-check {
  color: #ffffff;
  display: flex;
  align-items: center;
}

.song-card-check svg {
  width: 24px;
  height: 24px;
}

.song-card-number {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--muted);
  min-width: 30px;
  transition: color var(--duration-fast) var(--ease-out);
}

.song-card.active .song-card-number {
  color: #ffffff;
}

.song-card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.song-card-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.song-card-artist {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--muted);
}

/* === Catalog Row === */
.catalog-row {
  position: relative;
  z-index: 10;
  margin-top: -8vh;
}

.row-title {
  font-size: 20px;
  font-weight: 600;
  color: #e5e5e5;
  margin-bottom: var(--space-md);
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.is-featured {
  border: 2px solid #ffffff;
}

@media (max-width: 1024px) {
  .mood-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .song-picker-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .billboard-title {
    font-size: 48px;
  }
  .billboard-tagline {
    font-size: 16px;
  }
  .mood-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .song-picker-grid {
    grid-template-columns: 1fr;
  }
  .song-card {
    aspect-ratio: auto;
    min-height: 80px;
  }
}
</style>
