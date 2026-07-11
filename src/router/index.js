import { createRouter, createWebHistory } from 'vue-router'
import { useMusic } from '../composables/useMusic'

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
const musicPages = new Set(['write'])

router.beforeEach((to, from) => {
  // If leaving a music page and NOT going to another music page → kill audio
  if (musicPages.has(from.name) && !musicPages.has(to.name)) {
    const music = useMusic()
    music.destroy()
  }
})

export default router

