<template>
  <div class="garden-plant" :style="{ animationDelay: swayDelay }">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
      <!-- Stem -->
      <path
        :d="stemPath"
        stroke="#5a9e6f"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
      />

      <!-- Leaves -->
      <ellipse
        v-for="(leaf, i) in leaves"
        :key="'leaf-' + i"
        :cx="leaf.x"
        :cy="leaf.y"
        :rx="leaf.rx"
        :ry="leaf.ry"
        :transform="`rotate(${leaf.angle} ${leaf.x} ${leaf.y})`"
        fill="#a4d4c5"
      />

      <!-- Flower petals -->
      <ellipse
        v-for="(petal, i) in petals"
        :key="'petal-' + i"
        :cx="petal.x"
        :cy="petal.y"
        :rx="petal.rx"
        :ry="petal.ry"
        :transform="`rotate(${petal.angle} ${petal.x} ${petal.y})`"
        :fill="petalColor"
      />

      <!-- Flower center -->
      <circle
        :cx="width / 2 + stemCurve"
        :cy="topY"
        r="5"
        fill="#e8b94a"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  plant: {
    type: Object,
    required: true,
  },
})

const width = 80
const height = 200

// Deterministic random from seed
function seededRandom(seed) {
  let s = seed
  return function() {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rand = seededRandom(
  parseInt(props.plant.plantHash || '1a3f', 16) + (props.plant.plantSeed || 0.5) * 1000
)

const stemCurve = (rand() - 0.5) * 15
const plantHeight = 100 + rand() * 80
const topY = height - plantHeight

const stemPath = computed(() => {
  const startX = width / 2
  const startY = height
  const endX = startX + stemCurve
  const endY = topY
  const cpX = startX + stemCurve * 0.7
  const cpY = (startY + endY) / 2
  return `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`
})

// Generate leaves
const leafCount = Math.floor(2 + rand() * 3)
const leaves = computed(() => {
  const result = []
  for (let i = 0; i < leafCount; i++) {
    const t = (i + 1) / (leafCount + 1)
    const lx = width / 2 + stemCurve * t
    const ly = height - plantHeight * t
    const side = i % 2 === 0 ? 1 : -1
    result.push({
      x: lx + side * (10 + rand() * 6),
      y: ly,
      rx: 10 + rand() * 5,
      ry: 5 + rand() * 2,
      angle: side * (20 + rand() * 20),
    })
  }
  return result
})

// Generate petals
const petalCount = 5 + Math.floor(rand() * 3)
const petalColors = ['#ffb084', '#b8a4ed', '#ff4d8b', '#e8b94a']
const petalColor = petalColors[Math.floor(rand() * petalColors.length)]

const petals = computed(() => {
  const result = []
  const cx = width / 2 + stemCurve
  const cy = topY
  const petalSize = 8 + rand() * 5

  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * 360
    const rad = (angle * Math.PI) / 180
    result.push({
      x: cx + Math.cos(rad) * petalSize,
      y: cy + Math.sin(rad) * petalSize,
      rx: petalSize * 0.55,
      ry: petalSize * 0.35,
      angle,
    })
  }
  return result
})

const swayDelay = `${rand() * 2}s`
</script>

<style scoped>
.garden-plant {
  animation: sway 4s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes sway {
  0%, 100% { transform: rotate(-1.5deg); }
  50% { transform: rotate(1.5deg); }
}
</style>
