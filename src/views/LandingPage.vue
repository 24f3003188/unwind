<template>
  <div class="netflix-catalog">
    <!-- Hero Billboard -->
    <div class="billboard" :style="{ backgroundImage: `url(${featuredMood.bgImage})` }">
      <!-- Vignettes for text readability and smooth fade into background -->
      <div class="billboard-vignette-bottom"></div>
      <div class="billboard-vignette-left"></div>
      
      <div class="billboard-content container">
        <h1 class="billboard-title">{{ featuredMood.label }}</h1>
        <p class="billboard-tagline">{{ featuredMood.tagline }}</p>
        
        <div class="billboard-actions">
          <AppButton variant="primary" @click="startExperience" class="play-btn">
            <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </AppButton>
          <AppButton variant="secondary" @click="scrollToCatalog">
            More Info
          </AppButton>
        </div>
      </div>
    </div>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useReleasesStore } from '../stores/releases'
import MoodCard from '../components/mood/MoodCard.vue'
import AppButton from '../components/common/AppButton.vue'
import { moods } from '../data/moods'

const router = useRouter()
const store = useReleasesStore()

const moodList = Object.values(moods)
// Default featured mood is Heavy
const featuredMood = ref(moods.heavy)

function setFeaturedMood(mood) {
  featuredMood.value = mood
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToCatalog() {
  const el = document.getElementById('catalog')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function startExperience() {
  store.setMood(featuredMood.value.id)
  store.setText('') // clear old text
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
  margin-bottom: var(--space-lg);
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
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

/* === Catalog Row === */
.catalog-row {
  position: relative;
  z-index: 10;
  margin-top: -8vh; /* Overlap with the billboard bottom gradient */
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
  gap: 8px; /* Netflix uses tight 8px gaps between cards */
}

.is-featured {
  border: 2px solid #ffffff;
}

@media (max-width: 1024px) {
  .mood-grid {
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
}
</style>
