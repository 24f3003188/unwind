import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const isInitialized = ref(false)

  async function initializeAuth() {
    if (isInitialized.value) return

    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user || null

    supabase.auth.onAuthStateChange((_event, currentSession) => {
      session.value = currentSession
      user.value = currentSession?.user || null
    })

    isInitialized.value = true
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/memories'
      }
    })
    if (error) throw error
  }
  
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    user,
    session,
    isInitialized,
    initializeAuth,
    signInWithGoogle,
    signOut
  }
})
