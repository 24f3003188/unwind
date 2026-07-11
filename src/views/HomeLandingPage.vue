<template>
  <div class="home-landing">
    <!-- Cinematic background crossfading from the heavy mood image -->
    <div class="hero-bg" :style="{ backgroundImage: `url(${bgImage})` }">
      <div class="hero-overlay"></div>
    </div>
    
    <div class="content-wrapper container">
      <h1 class="title">unwind</h1>
      <h2 class="subtitle">A cinematic space to write it down,<br/>and let it go.</h2>
      <p class="description">
        Choose your mood. Let the music guide you. Write without judgment, and release it into the void.
      </p>
      
      <div class="actions">
        <AppButton variant="cta" class="start-btn" @click="$router.push('/browse')">
          Get Started
          <span class="chevron">›</span>
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppButton from '../components/common/AppButton.vue'

// Use gero.jpg as the cinematic hero background
const bgImage = ref('/img/gero.jpg')
</script>

<style scoped>
.home-landing {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #141414;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 1;
  animation: slowZoom 20s ease-in-out infinite alternate;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(20,20,20,0.1) 0%, rgba(20,20,20,0.7) 100%),
              linear-gradient(to top, #141414 0%, transparent 50%);
}

.content-wrapper {
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  padding: 0 4%;
}

.title {
  font-family: var(--font-display);
  font-size: 80px;
  font-weight: 700;
  color: var(--brand-netflix);
  letter-spacing: 0.05em;
  margin-bottom: var(--space-md);
  text-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.subtitle {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: var(--space-md);
  line-height: 1.2;
}

.description {
  font-family: var(--font-body);
  font-size: 20px;
  color: #bcbcbc;
  margin-bottom: var(--space-xl);
  max-width: 600px;
  line-height: 1.5;
}

.start-btn {
  font-size: 24px !important;
  padding: 16px 48px !important;
  font-weight: 600 !important;
}

.chevron {
  font-size: 32px;
  line-height: 0;
  margin-left: 8px;
  position: relative;
  top: -2px;
}

@keyframes slowZoom {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

@media (max-width: 768px) {
  .title {
    font-size: 56px;
  }
  .subtitle {
    font-size: 28px;
  }
  .description {
    font-size: 16px;
  }
  .start-btn {
    font-size: 20px !important;
    padding: 14px 32px !important;
  }
}
</style>
