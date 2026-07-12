import { createRouter, createWebHistory } from 'vue-router'
import { useMusic } from '../composables/useMusic'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeLandingPage.vue'),
  },
  {
    path: '/browse',
    name: 'browse',
    component: () => import('../views/LandingPage.vue'),
  },
  {
    path: '/write',
    name: 'write',
    component: () => import('../views/WritePage.vue'),
  },
  {
    path: '/memories',
    name: 'memories',
    component: () => import('../views/MemoriesGallery.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/replay/:id',
    name: 'replay',
    component: () => import('../views/MemoryReplay.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Music flow pages — music is allowed to keep playing across these
const musicPages = new Set(['write', 'replay'])

router.beforeEach(async (to, from) => {
  // Check auth
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    
    // Ensure auth is initialized before checking
    if (!auth.isInitialized) {
      await auth.initializeAuth()
    }
    
    if (!auth.user) {
      return { path: '/browse' }
    }
  }

  // If leaving a music page and NOT going to another music page → kill audio
  if (musicPages.has(from.name) && !musicPages.has(to.name)) {
    const music = useMusic()
    music.destroy()
  }
})

export default router

