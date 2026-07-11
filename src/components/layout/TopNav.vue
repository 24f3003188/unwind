<template>
  <nav class="top-nav">
    <div class="nav-inner container">
      <router-link to="/" class="nav-logo">unwind</router-link>

      <div class="nav-actions" v-if="$route.path !== '/browse'">
        <AppButton variant="primary" @click="$router.push('/browse')">
          Browse Catalog
        </AppButton>
      </div>

      <!-- Mobile hamburger -->
      <button v-if="$route.path !== '/browse'" class="nav-hamburger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
        <span :class="['hamburger-line', { open: mobileOpen }]"></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition name="fade-up">
      <div v-if="mobileOpen && $route.path !== '/browse'" class="mobile-menu">
        <AppButton variant="primary" @click="$router.push('/browse'); mobileOpen = false" style="width: 100%;">
          Browse Catalog
        </AppButton>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useReleasesStore } from '../../stores/releases'
import AppButton from '../common/AppButton.vue'

const store = useReleasesStore()
const mobileOpen = ref(false)
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
}

.nav-logo {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 20px;
  letter-spacing: 0.1em;
  color: var(--ink);
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
}

.nav-link {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 14px;
  color: var(--muted);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.nav-link:hover {
  color: var(--ink);
}

.nav-link.router-link-active {
  color: var(--ink);
}

.nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--brand-mint);
  color: var(--ink);
  font-size: 11px;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  border-radius: var(--rounded-pill);
  padding: 0 6px;
}

.nav-actions {
  display: flex;
  align-items: center;
}

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

.hamburger-line::before {
  top: -6px;
}

.hamburger-line::after {
  top: 6px;
}

.hamburger-line.open {
  background-color: transparent;
}

.hamburger-line.open::before {
  transform: translateY(6px) rotate(45deg);
}

.hamburger-line.open::after {
  transform: translateY(-6px) rotate(-45deg);
}

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

@media (max-width: 768px) {
  .nav-links,
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
