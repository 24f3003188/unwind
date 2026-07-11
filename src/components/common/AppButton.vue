<template>
  <button
    :class="['app-button', variant, { disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'cta', 'ghost'].includes(v),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 16px;
  line-height: 1;
  padding: 12px 24px;
  min-height: 44px;
  border-radius: var(--rounded-sm); /* 4px in Netflix scale */
  cursor: pointer;
  border: none;
  transition: transform var(--duration-fast) var(--ease-out),
              background-color var(--duration-fast) var(--ease-out),
              opacity var(--duration-normal) var(--ease-out);
  white-space: nowrap;
}

.app-button:active {
  transform: scale(0.97);
}

/* Primary (Netflix Play Button style): White bg, black text */
.app-button.primary {
  background-color: #ffffff;
  color: #141414;
  font-weight: 700; /* Bolder for play */
}

.app-button.primary:hover {
  background-color: rgba(255, 255, 255, 0.75);
}

/* CTA: Netflix Red */
.app-button.cta {
  background-color: var(--brand-netflix);
  color: #ffffff;
}

.app-button.cta:hover {
  background-color: var(--brand-netflix-dark);
}

/* Secondary / More Info style */
.app-button.secondary,
.app-button.ghost {
  background-color: rgba(109, 109, 110, 0.7);
  color: #ffffff;
}

.app-button.secondary:hover,
.app-button.ghost:hover {
  background-color: rgba(109, 109, 110, 0.4);
}

/* Disabled */
.app-button.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
