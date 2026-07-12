<template>
  <div id="unwind-app">
    <TopNav v-show="!isCinematicRoute" />
    <main class="router-wrapper">
      <router-view v-slot="{ Component, route }">
        <transition name="page">
          <div class="router-view-container" :key="route.path">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>
    <AppFooter v-show="!isCinematicRoute" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import TopNav from './components/layout/TopNav.vue'
import AppFooter from './components/layout/AppFooter.vue'

const route = useRoute()
const auth = useAuthStore()

onMounted(() => {
  auth.initializeAuth()
})

// Hide nav/footer on cinematic, immersive pages
const cinematicRoutes = ['write', 'replay']
const isCinematicRoute = computed(() => cinematicRoutes.includes(route.name))
</script>

<style>
#unwind-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.router-wrapper {
  flex: 1;
  display: grid;
  grid-template-areas: "router";
}

.router-view-container {
  grid-area: router;
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
