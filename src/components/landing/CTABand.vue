<template>
  <section class="cta-band">
    <div class="container cta-inner">
      <h2 class="display-sm cta-title">Ready to let something go?</h2>
      <p class="body-md cta-subtitle">It takes two minutes. No account. Nothing saved. Just you and the page.</p>
      <AppButton variant="primary" @click="$router.push('/mood')">
        Start Writing
      </AppButton>
    </div>
  </section>
</template>

<script setup>
import AppButton from '../common/AppButton.vue'
</script>

<style scoped>
.cta-band {
  background-color: var(--surface-soft);
  border-radius: var(--rounded-xl);
  margin: 0 var(--space-lg);
  margin-bottom: var(--space-section);
}

.cta-inner {
  padding: 80px var(--space-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-md);
}

.cta-title {
  color: var(--ink);
}

.cta-subtitle {
  color: var(--body);
  max-width: 420px;
}

@media (max-width: 768px) {
  .cta-band {
    margin: 0 var(--space-md);
    margin-bottom: var(--space-xxl);
  }

  .cta-inner {
    padding: var(--space-xxl) var(--space-lg);
  }
}
</style>
