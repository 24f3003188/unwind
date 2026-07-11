<template>
  <div class="not-found-page">
    <div class="background-overlay"></div>
    
    <div class="content-wrapper container">
      <h1 class="title">404</h1>
      <h2 class="subtitle">This space doesn't exist.</h2>
      <p class="description">
        You may have drifted too far. Let's get you back to familiar ground.
      </p>
      
      <div class="actions">
        <AppButton variant="primary" @click="$router.push('/browse')">
          Return to Catalog
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppButton from '../components/common/AppButton.vue'
</script>

<style scoped>
.not-found-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #141414;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(20,20,20,0.8) 0%, #141414 100%);
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  padding: 0 4%;
}

.title {
  font-family: var(--font-cinematic);
  font-size: 120px;
  font-weight: 500;
  color: var(--brand-netflix);
  letter-spacing: 0.05em;
  line-height: 1;
  margin-bottom: var(--space-md);
  text-shadow: 0 4px 16px rgba(229, 9, 20, 0.3);
}

.subtitle {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: var(--space-sm);
}

.description {
  font-family: var(--font-body);
  font-size: 18px;
  color: #bcbcbc;
  margin-bottom: var(--space-xl);
  line-height: 1.5;
}

.actions {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .title {
    font-size: 80px;
  }
  .subtitle {
    font-size: 24px;
  }
  .description {
    font-size: 15px;
  }
}
</style>
