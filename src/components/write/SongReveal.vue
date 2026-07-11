<template>
  <div class="song-reveal" :class="{ 'fade-out': fadingOut }">
    <div class="reveal-content">
      <h2
        class="song-title-text reveal-title"
        :style="{ color: textColor }"
      >
        {{ song.title }}
      </h2>
      <p
        class="song-artist-text reveal-artist"
        :style="{ color: textColor }"
      >
        {{ song.artist }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  song: {
    type: Object,
    required: true,
  },
  textColor: {
    type: String,
    default: '#ffffff',
  },
  holdDuration: {
    type: Number,
    default: 4000,
  },
})

const emit = defineEmits(['complete'])

const fadingOut = ref(false)

onMounted(() => {
  // After hold duration, start fading out
  setTimeout(() => {
    fadingOut.value = true
  }, props.holdDuration)

  // After fade-out animation completes, emit complete
  setTimeout(() => {
    emit('complete')
  }, props.holdDuration + 2000) // 2s fade-out duration
})
</script>

<style scoped>
.song-reveal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  pointer-events: none;
}

.reveal-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.reveal-title {
  opacity: 0;
  transform: translateY(15px);
  animation: revealIn 1.5s ease-out forwards;
}

.reveal-artist {
  opacity: 0;
  transform: translateY(10px);
  animation: revealIn 1.2s ease-out 0.5s forwards;
}

.fade-out .reveal-title,
.fade-out .reveal-artist {
  animation: revealOut 2s ease-in forwards;
}

@keyframes revealIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes revealOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Lower opacity for artist line */
.reveal-artist {
  --target-opacity: 0.55;
}

.reveal-artist:not(.fade-out *) {
  animation: revealInSubtle 1.2s ease-out 0.5s forwards;
}

@keyframes revealInSubtle {
  to {
    opacity: 0.55;
    transform: translateY(0);
  }
}
</style>
