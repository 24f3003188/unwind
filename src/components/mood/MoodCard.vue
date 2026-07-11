<template>
  <div
    class="mood-card"
    :style="cardStyle"
    :class="{ hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="$emit('select', mood.id)"
    role="button"
    tabindex="0"
    @keydown.enter="$emit('select', mood.id)"
  >
    <div class="mood-content">
      <h3 class="mood-label">{{ mood.label }}</h3>
      <p class="mood-tagline">{{ mood.tagline }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  mood: {
    type: Object,
    required: true,
  },
})

defineEmits(['select'])

const hovered = ref(false)

const cardStyle = computed(() => ({
  backgroundImage: `url(${props.mood.bgImage})`,
}))
</script>

<style scoped>
.mood-card {
  border-radius: var(--rounded-md);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 180px;
  cursor: pointer;
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out),
              z-index 0s;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  z-index: 1;
}

/* Dark gradient overlay for text readability */
.mood-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(20,20,20,0.9) 0%, transparent 60%);
  z-index: 1;
}

.mood-content {
  position: relative;
  z-index: 2;
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xxs);
}

.mood-card:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.8);
  z-index: 10;
}

.mood-card:active {
  transform: scale(0.97);
  transition-duration: 100ms;
}

.mood-label {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 24px;
  line-height: 1.15;
  color: #ffffff;
}

.mood-tagline {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  color: #bcbcbc;
}

@media (max-width: 768px) {
  .mood-card {
    min-height: 120px;
  }

  .mood-label {
    font-size: 18px;
  }
}
</style>
