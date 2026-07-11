<template>
  <footer class="app-footer">
    <div class="container footer-content">
      <div class="footer-left">
        <div class="logo">unwind</div>
        <p class="made-by">Made with ❤️ by Atharv</p>
        <p class="copyright">© {{ new Date().getFullYear() }} Unwind</p>
      </div>
      
      <div class="footer-right">
        <h4 class="form-title">Request a Mood</h4>
        <p class="form-desc">Don't see how you're feeling? Let me know.</p>
        <form @submit.prevent="submitForm" class="mood-form">
          <input 
            type="text" 
            v-model="moodRequest" 
            name="mood"
            placeholder="e.g. Nostalgic, Furious..." 
            required 
            class="mood-input"
            :disabled="submitting || success"
          />
          <button type="submit" class="submit-btn" :disabled="submitting || success">
            {{ submitting ? 'Sending...' : success ? 'Sent!' : 'Request' }}
          </button>
        </form>
        <p v-if="error" class="error-msg">Something went wrong. Try again.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const moodRequest = ref('')
const submitting = ref(false)
const success = ref(false)
const error = ref(false)

async function submitForm() {
  if (!moodRequest.value.trim()) return
  
  submitting.value = true
  error.value = false
  
  try {
    const response = await fetch('https://formspree.io/f/mdaqnaor', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: `Mood Request: ${moodRequest.value}` })
    })
    
    if (response.ok) {
      success.value = true
      moodRequest.value = ''
      setTimeout(() => { success.value = false }, 4000)
    } else {
      error.value = true
    }
  } catch (e) {
    error.value = true
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.app-footer {
  background-color: #0a0a0a;
  padding: var(--space-xl) 0;
  border-top: 1px solid rgba(255,255,255,0.05);
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-xl);
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.logo {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 24px;
  letter-spacing: 0.1em;
  color: #ffffff;
  margin-bottom: var(--space-xs);
}

.made-by, .copyright {
  font-size: 14px;
  color: #888888;
}

.footer-right {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 300px;
}

.form-title {
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
}

.form-desc {
  font-size: 14px;
  color: #888888;
  margin-bottom: var(--space-sm);
}

.mood-form {
  display: flex;
  gap: var(--space-xs);
}

.mood-input {
  flex: 1;
  background-color: #1a1a1a;
  border: 1px solid #333;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: var(--rounded-sm);
  font-size: 14px;
  font-family: var(--font-body);
  transition: border-color var(--duration-fast);
}

.mood-input:focus {
  outline: none;
  border-color: var(--brand-netflix);
}

.mood-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn {
  background-color: #ffffff;
  color: #000000;
  border: none;
  padding: 0 20px;
  border-radius: var(--rounded-sm);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color var(--duration-fast);
}

.submit-btn:hover:not(:disabled) {
  background-color: #e5e5e5;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-msg {
  color: var(--brand-netflix);
  font-size: 13px;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: var(--space-xl);
  }
  
  .footer-right {
    width: 100%;
  }
}
</style>
