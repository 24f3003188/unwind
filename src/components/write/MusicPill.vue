<template>
  <div class="music-pill" :class="{ visible: show }">
    <button class="pill-btn play-btn" @click="music.toggle()" :aria-label="music.isPlaying.value ? 'Pause' : 'Play'">
      <svg v-if="music.isPlaying.value" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="3" y="2" width="4" height="12" rx="1" />
        <rect x="9" y="2" width="4" height="12" rx="1" />
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 2.5v11l9-5.5z" />
      </svg>
    </button>

    <div class="pill-info">
      <span class="pill-title">{{ song.title }}</span>
      <span class="pill-divider">·</span>
      <span class="pill-artist">{{ song.artist }}</span>
    </div>

    <button class="pill-btn volume-btn" @click="music.toggleMute()" :aria-label="music.isMuted.value ? 'Unmute' : 'Mute'">
      <svg v-if="!music.isMuted.value" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    </button>

    <!-- Progress bar -->
    <div class="pill-progress" v-if="music.duration.value > 0">
      <div
        class="pill-progress-fill"
        :style="{ width: progressPercent + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMusic } from '../../composables/useMusic'

const props = defineProps({
  song: {
    type: Object,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
  moodColor: {
    type: String,
    default: '#0a0a0a',
  },
})

const music = useMusic()

const progressPercent = computed(() => {
  if (music.duration.value <= 0) return 0
  return (music.currentTime.value / music.duration.value) * 100
})
</script>

<style scoped>
.music-pill {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  z-index: 200;

  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px 16px;
  padding-bottom: 14px; /* extra for progress bar */

  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--rounded-pill);

  color: rgba(255, 255, 255, 0.9);
  transition: transform 0.6s var(--ease-out), opacity 0.6s var(--ease-out);
  opacity: 0;
  pointer-events: none;
}

.music-pill.visible {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.pill-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--rounded-full);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  transition: background var(--duration-fast);
  flex-shrink: 0;
}

.pill-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.pill-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
}

.pill-title {
  opacity: 0.9;
}

.pill-divider {
  opacity: 0.4;
}

.pill-artist {
  opacity: 0.55;
}

.pill-progress {
  position: absolute;
  bottom: 6px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1px;
  overflow: hidden;
}

.pill-progress-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1px;
  transition: width 0.3s linear;
}

@media (max-width: 768px) {
  .music-pill {
    bottom: 16px;
    padding: 8px 12px;
    padding-bottom: 12px;
    gap: var(--space-xs);
  }

  .pill-artist,
  .pill-divider {
    display: none;
  }

  .volume-btn {
    display: none;
  }
}
</style>
