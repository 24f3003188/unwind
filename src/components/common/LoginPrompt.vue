<template>
  <transition name="fade-up">
    <div v-if="visible" class="login-overlay" @click.self="$emit('close')">
      <div class="login-prompt">
        <h2 class="login-title">{{ title }}</h2>
        <p class="login-body">{{ body }}</p>
        <div class="login-actions">
          <AppButton variant="primary" @click="$emit('login')">
            <svg width="18" height="18" viewBox="0 0 48 48" style="margin-right: 8px;">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </AppButton>
          <button class="login-dismiss" @click="$emit('close')">Not now</button>
        </div>
        <p class="login-hint">You can still release your thoughts without signing in.</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import AppButton from './AppButton.vue'

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Sign in to Unwind.',
  },
  body: {
    type: String,
    default: 'Sign in with your Google account to save your thoughts and revisit them anytime.',
  }
})

defineEmits(['login', 'close'])
</script>

<style scoped>
.login-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
}

.login-prompt {
  background: var(--surface-soft);
  border: 1px solid var(--hairline);
  border-radius: var(--rounded-lg);
  padding: var(--space-xxl) var(--space-xl);
  max-width: 420px;
  width: 100%;
  text-align: center;
}

.login-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: var(--space-sm);
}

.login-body {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
}

.login-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.login-dismiss {
  background: none;
  border: none;
  color: var(--muted);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out);
}

.login-dismiss:hover {
  color: var(--ink);
}

.login-hint {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--muted-soft);
  margin-top: var(--space-lg);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .login-prompt {
    padding: var(--space-xl) var(--space-lg);
  }
}
</style>
