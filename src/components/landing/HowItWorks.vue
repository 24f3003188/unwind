<template>
  <section id="how-it-works" class="how-section">
    <div class="container">
      <span class="caption-uppercase section-label">How It Works</span>
      <h2 class="display-md section-title">Three simple steps</h2>

      <div class="steps-grid">
        <div class="step-card" v-for="(step, i) in steps" :key="i">
          <div class="step-number">{{ String(i + 1).padStart(2, '0') }}</div>
          <h3 class="title-md step-title">{{ step.title }}</h3>
          <p class="body-md step-desc">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    title: 'Feel',
    description: 'Tell us how you\'re feeling. We\'ll match you with the right music and atmosphere.',
  },
  {
    title: 'Write',
    description: 'Pour out what\'s on your mind. The music plays. No judgment, no saving, no audience.',
  },
  {
    title: 'Release',
    description: 'Let your words disappear and find comfort in the gentle silence that follows.',
  },
]
</script>

<style scoped>
.how-section {
  padding: var(--space-section) 0;
}

.section-label {
  display: block;
  margin-bottom: var(--space-md);
}

.section-title {
  margin-bottom: var(--space-xxl);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

.step-card {
  background: var(--surface-card);
  border-radius: var(--rounded-lg);
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.step-number {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 48px;
  letter-spacing: -2px;
  color: var(--muted-soft);
  line-height: 1;
  margin-bottom: var(--space-xs);
}

.step-title {
  color: var(--ink);
}

.step-desc {
  color: var(--body);
}

@media (max-width: 768px) {
  .steps-grid {
    grid-template-columns: 1fr;
  }

  .how-section {
    padding: var(--space-xxl) 0;
  }
}
</style>
