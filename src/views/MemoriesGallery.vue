<template>
  <div class="memories-page">
    <!-- Hero Section -->
    <div class="memories-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <div class="profile-section">
          <img 
            v-if="auth.user?.user_metadata?.avatar_url" 
            :src="auth.user.user_metadata.avatar_url" 
            class="hero-avatar"
            referrerpolicy="no-referrer"
          />
          <div class="hero-text">
            <h1 class="hero-title">{{ auth.user?.user_metadata?.full_name || 'Your' }} Memories</h1>
            <p class="hero-subtitle">{{ memories.length }} {{ memories.length === 1 ? 'thought' : 'thoughts' }} kept forever</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="memories-content container">
      <!-- Loading -->
      <div v-if="loading" class="state-message">
        <p>Gathering your thoughts...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="memories.length === 0" class="state-message">
        <p class="empty-title">Nothing here yet.</p>
        <p class="empty-body">Next time you write, choose "Keep it forever" to save your thoughts here.</p>
        <AppButton variant="primary" @click="$router.push('/browse')" style="margin-top: var(--space-lg);">
          Write something
        </AppButton>
      </div>

      <!-- Memories Grid -->
      <div v-else>
        <h2 class="row-title">All Memories</h2>
        <div class="memories-grid">
          <div 
            v-for="memory in memories" 
            :key="memory.id" 
            class="memory-card"
            @click="$router.push('/replay/' + memory.id)"
          >
            <div class="card-bg" :style="{ backgroundImage: `url(${getMemoryBg(memory.mood_id)})` }">
              <div class="card-overlay"></div>
            </div>
            <div class="card-content">
              <div class="card-top">
                <span class="mood-badge" :style="{ backgroundColor: getMoodColor(memory.mood_id) }">
                  {{ getMoodName(memory.mood_id) }}
                </span>
              </div>
              <p class="memory-snippet">"{{ memory.text_content.substring(0, 100) }}{{ memory.text_content.length > 100 ? '...' : '' }}"</p>
              <div class="card-bottom">
                <span class="memory-date">{{ formatDate(memory.created_at) }}</span>
                <span class="replay-hint">Replay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { getMood, getSongIndexFromId } from '../data/moods'
import AppButton from '../components/common/AppButton.vue'

const router = useRouter()
const auth = useAuthStore()

const memories = ref([])
const loading = ref(true)

onMounted(async () => {
  // Check if there's a pending memory from before login redirect
  const pendingText = localStorage.getItem('pendingMemoryText')
  const pendingMood = localStorage.getItem('pendingMemoryMood')
  
  if (pendingText && pendingMood && auth.user) {
    await supabase.from('memories').insert({
      user_id: auth.user.id,
      mood_id: pendingMood,
      text_content: pendingText
    })
    localStorage.removeItem('pendingMemoryText')
    localStorage.removeItem('pendingMemoryMood')
  }

  if (!auth.user) {
    router.push('/')
    return
  }

  fetchMemories()
})

async function fetchMemories() {
  loading.value = true
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false })

  if (!error && data) {
    memories.value = data
  }
  loading.value = false
}

function getMoodName(id) {
  const mood = getMood(id)
  return mood ? mood.label : 'Unknown'
}

function getMoodColor(id) {
  const mood = getMood(id)
  return mood ? mood.color : '#808080'
}

function getMemoryBg(id) {
  const mood = getMood(id)
  const index = getSongIndexFromId(id)
  return mood ? (mood.bgImages[index] || mood.bgImage) : ''
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.memories-page {
  background-color: var(--canvas);
  min-height: 100vh;
}

/* === Hero === */
.memories-hero {
  position: relative;
  width: 100%;
  height: 280px;
  background-color: var(--surface-soft);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--canvas) 0%, transparent 60%),
              linear-gradient(to right, rgba(20,20,20,0.7) 0%, transparent 70%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding-bottom: var(--space-xl);
}

.profile-section {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.hero-avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--rounded-full);
  object-fit: cover;
  border: 3px solid rgba(255,255,255,0.15);
}

.hero-title {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.1;
  margin-bottom: var(--space-xxs);
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--muted);
}

/* === Content === */
.memories-content {
  padding-top: var(--space-xl);
  padding-bottom: var(--space-section);
}

.row-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: #e5e5e5;
  margin-bottom: var(--space-lg);
}

/* === States === */
.state-message {
  text-align: center;
  margin-top: 80px;
}

.empty-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: var(--space-sm);
}

.empty-body {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--muted);
}

/* === Grid === */
.memories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

/* === Card === */
.memory-card {
  position: relative;
  border-radius: var(--rounded-sm);
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 16 / 10;
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}

.memory-card:hover {
  transform: scale(1.04);
  z-index: 5;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6);
}

.card-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform var(--duration-slow) var(--ease-out);
}

.memory-card:hover .card-bg {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%);
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-md);
}

.card-top {
  display: flex;
  justify-content: flex-start;
}

.mood-badge {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  color: #000;
  padding: 3px 10px;
  border-radius: var(--rounded-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.memory-snippet {
  font-family: var(--font-handwritten);
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.memory-date {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--muted);
}

.replay-hint {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--muted);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.memory-card:hover .replay-hint {
  opacity: 1;
}

/* === Responsive === */
@media (max-width: 1024px) {
  .memories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .memories-hero {
    height: 220px;
  }
  .hero-avatar {
    width: 56px;
    height: 56px;
  }
  .hero-title {
    font-size: 28px;
  }
  .memories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .memories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
