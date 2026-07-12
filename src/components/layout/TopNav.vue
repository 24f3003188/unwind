<template>
  <nav class="top-nav">
    <div class="nav-inner container">
      <router-link to="/" class="nav-logo">unwind</router-link>

      <div class="nav-actions">
        <router-link v-if="auth.user" to="/memories" class="nav-link">Memories</router-link>

        <AppButton variant="primary" @click="$router.push('/browse')">
          Browse Catalog
        </AppButton>

        <!-- Profile Avatar (logged in) -->
        <button v-if="auth.user" class="profile-btn" @click="profileOpen = !profileOpen">
          <img 
            :src="auth.user.user_metadata?.avatar_url || ''" 
            :alt="auth.user.user_metadata?.full_name || 'Profile'"
            class="profile-avatar"
            referrerpolicy="no-referrer"
          />
        </button>

        <!-- Login (logged out) -->
        <AppButton v-else variant="secondary" @click="showLogin = true">
          Sign In
        </AppButton>
      </div>

      <!-- Profile Dropdown -->
      <transition name="fade-up">
        <div v-if="profileOpen && auth.user" class="profile-dropdown">
          <div class="profile-info">
            <img 
              :src="auth.user.user_metadata?.avatar_url || ''" 
              class="dropdown-avatar"
              referrerpolicy="no-referrer"
            />
            <div class="profile-text">
              <span class="profile-name">{{ auth.user.user_metadata?.full_name || 'User' }}</span>
              <span class="profile-email">{{ auth.user.email }}</span>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <router-link to="/memories" class="dropdown-item" @click="profileOpen = false">Memories</router-link>
          <button class="dropdown-item logout-item" @click="handleLogout">Sign Out</button>
        </div>
      </transition>

      <!-- Mobile hamburger -->
      <button class="nav-hamburger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
        <span :class="['hamburger-line', { open: mobileOpen }]"></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition name="fade-up">
      <div v-if="mobileOpen" class="mobile-menu">
        <router-link v-if="auth.user" to="/memories" class="mobile-link" @click="mobileOpen = false">Memories</router-link>
        <router-link to="/browse" class="mobile-link" @click="mobileOpen = false">Browse Catalog</router-link>
        <div class="dropdown-divider" style="margin: var(--space-sm) 0;"></div>
        <div v-if="auth.user" class="mobile-profile-row">
          <img :src="auth.user.user_metadata?.avatar_url || ''" class="mobile-avatar" referrerpolicy="no-referrer" />
          <span class="mobile-name">{{ auth.user.user_metadata?.full_name || 'User' }}</span>
        </div>
        <a v-if="!auth.user" href="#" class="mobile-link" @click.prevent="showLogin = true; mobileOpen = false">Sign In</a>
        <a v-else href="#" class="mobile-link" @click.prevent="handleLogout">Sign Out</a>
      </div>
    </transition>

    <!-- Login Prompt -->
    <LoginPrompt 
      :visible="showLogin" 
      @login="handleLogin" 
      @close="showLogin = false" 
    />
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import AppButton from '../common/AppButton.vue'
import LoginPrompt from '../common/LoginPrompt.vue'

const auth = useAuthStore()
const mobileOpen = ref(false)
const profileOpen = ref(false)
const showLogin = ref(false)

function handleLogin() {
  showLogin.value = false
  auth.signInWithGoogle()
}

function handleLogout() {
  profileOpen.value = false
  mobileOpen.value = false
  auth.signOut()
}

// Close dropdown when clicking outside
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-btn') && !e.target.closest('.profile-dropdown')) {
      profileOpen.value = false
    }
  })
}
</script>

<style scoped>
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: linear-gradient(to bottom, rgba(20,20,20,0.9) 0%, rgba(20,20,20,0) 100%);
  height: var(--nav-height);
  display: flex;
  align-items: center;
  transition: background-color var(--duration-normal) var(--ease-out);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  position: relative;
}

.nav-logo {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 20px;
  letter-spacing: 0.1em;
  color: var(--ink);
  text-decoration: none;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.nav-link {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 14px;
  color: var(--body);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--ink);
}

/* === Profile Avatar === */
.profile-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--rounded-full);
  border: none;
  cursor: pointer;
  padding: 0;
  background: transparent;
  transition: opacity var(--duration-fast) var(--ease-out);
  overflow: hidden;
}

.profile-btn:hover {
  opacity: 0.8;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--rounded-full);
  object-fit: cover;
}

/* === Profile Dropdown === */
.profile-dropdown {
  position: absolute;
  top: calc(100% + var(--space-xs));
  right: 4%;
  background-color: var(--surface-soft);
  border: 1px solid var(--hairline);
  border-radius: var(--rounded-lg);
  min-width: 240px;
  z-index: 200;
  padding: var(--space-sm) 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.profile-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--rounded-full);
  object-fit: cover;
}

.profile-text {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.profile-email {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--muted);
}

.dropdown-divider {
  height: 1px;
  background: var(--hairline);
  margin: var(--space-xs) 0;
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--body);
  padding: var(--space-sm) var(--space-lg);
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-out);
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--ink);
}

.logout-item {
  color: var(--muted);
}

/* === Hamburger === */
.nav-hamburger {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: none;
  border: none;
}

.hamburger-line {
  display: block;
  width: 20px;
  height: 2px;
  background-color: var(--ink);
  border-radius: 1px;
  position: relative;
  transition: background-color var(--duration-fast);
}

.hamburger-line::before,
.hamburger-line::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--ink);
  border-radius: 1px;
  left: 0;
  transition: transform var(--duration-normal) var(--ease-out);
}

.hamburger-line::before { top: -6px; }
.hamburger-line::after { top: 6px; }

.hamburger-line.open { background-color: transparent; }
.hamburger-line.open::before { transform: translateY(6px) rotate(45deg); }
.hamburger-line.open::after { transform: translateY(-6px) rotate(-45deg); }

/* === Mobile Menu === */
.mobile-menu {
  display: none;
  position: absolute;
  top: var(--nav-height);
  left: 0;
  right: 0;
  background-color: var(--canvas);
  border-bottom: 1px solid var(--hairline);
  padding: var(--space-lg);
}

.mobile-link {
  display: block;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 16px;
  color: var(--body);
  padding: var(--space-sm) 0;
  text-decoration: none;
}

.mobile-profile-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
}

.mobile-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--rounded-full);
  object-fit: cover;
}

.mobile-name {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--ink);
  font-weight: 500;
}

@media (max-width: 768px) {
  .nav-actions {
    display: none;
  }

  .nav-hamburger {
    display: flex;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
  }
}
</style>
