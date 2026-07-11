<template>
  <section class="hero-band">
    <div class="hero-inner container">
      <div class="hero-content">
        <span class="caption-uppercase hero-label">A Therapeutic Writing Experience</span>
        <h1 class="display-xl hero-title">
          Write it down.<br>Let it go.
        </h1>
        <p class="body-md hero-subtitle">
          Choose how you feel. Let the music carry you. Write freely.
          Then let it go, and find a moment of peace.
        </p>
        <div class="hero-actions">
          <AppButton variant="primary" @click="$router.push('/mood')">
            Start Writing
          </AppButton>
          <AppButton variant="secondary" @click="scrollToHow">
            Learn more
          </AppButton>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-illustration">
          <div class="illustration-shape shape-1"></div>
          <div class="illustration-shape shape-2"></div>
          <div class="illustration-shape shape-3"></div>
          <div class="illustration-shape shape-4"></div>
          <div class="illustration-glow"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import AppButton from '../common/AppButton.vue'

function scrollToHow() {
  const el = document.getElementById('how-it-works')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero-band {
  padding: var(--space-section) 0;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  align-items: center;
}

.hero-inner {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: var(--space-xxl);
  align-items: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.hero-label {
  color: var(--muted);
}

.hero-title {
  max-width: 600px;
}

.hero-subtitle {
  max-width: 480px;
  color: var(--body);
  font-size: 18px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-xs);
}

/* === Abstract illustration (CSS-only, Clay-inspired) === */
.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-illustration {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  max-width: 440px;
}

.illustration-shape {
  position: absolute;
  border-radius: var(--rounded-xl);
  transition: transform 0.6s var(--ease-out);
}

.illustration-shape.shape-1 {
  width: 65%;
  height: 55%;
  background: var(--brand-peach);
  top: 10%;
  left: 5%;
  border-radius: 40% 60% 50% 40% / 50% 40% 60% 50%;
  animation: float-1 8s ease-in-out infinite;
}

.illustration-shape.shape-2 {
  width: 50%;
  height: 50%;
  background: var(--brand-lavender);
  top: 25%;
  right: 5%;
  border-radius: 50% 40% 60% 50% / 40% 60% 40% 60%;
  animation: float-2 10s ease-in-out infinite;
  opacity: 0.85;
}

.illustration-shape.shape-3 {
  width: 35%;
  height: 35%;
  background: var(--brand-mint);
  bottom: 10%;
  left: 20%;
  border-radius: 60% 40% 50% 50% / 50% 50% 40% 60%;
  animation: float-3 7s ease-in-out infinite;
}

.illustration-shape.shape-4 {
  width: 22%;
  height: 22%;
  background: var(--brand-ochre);
  bottom: 25%;
  right: 15%;
  border-radius: 50%;
  animation: float-4 9s ease-in-out infinite;
}

.illustration-glow {
  position: absolute;
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  background: radial-gradient(circle, rgba(255, 176, 132, 0.2) 0%, transparent 70%);
  pointer-events: none;
}

@keyframes float-1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(8px, -12px) rotate(2deg); }
  66% { transform: translate(-5px, 6px) rotate(-1deg); }
}

@keyframes float-2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-10px, 8px) rotate(-2deg); }
}

@keyframes float-3 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(12px, -8px); }
}

@keyframes float-4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-6px, -10px) scale(1.08); }
}

@media (max-width: 768px) {
  .hero-band {
    padding: var(--space-xxl) 0;
    min-height: auto;
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  .hero-visual {
    order: -1;
  }

  .hero-illustration {
    max-width: 280px;
  }

  .hero-title {
    max-width: 100%;
  }

  .hero-subtitle {
    max-width: 100%;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions .app-button {
    width: 100%;
  }
}
</style>
