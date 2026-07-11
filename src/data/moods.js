export const moods = {
  heavy: {
    id: 'heavy',
    label: 'Heavy',
    tagline: 'Like carrying the weight of everything',
    song: {
      file: '/music/heavy.mp3',
      title: 'Field of Dreams',
      artist: 'Low Roar',
      album: 'Low Roar',
    },
    color: '#e8b94a',       // brand-ochre
    textOnColor: '#0a0a0a', // dark ink (light background)
    cardClass: 'mood-heavy',
    bgImage: '/img/heavy.jpg',
    responses: [
      "It is okay to put the burden down for a while. You don't have to carry it all right now.",
      "The weight you feel is real, but it is not permanent. Rest your shoulders.",
      "Even mountains erode over time. This heavy feeling will slowly pass.",
      "You've been so strong for so long. Give yourself permission to just be.",
      "Breathe out the tension. Let the ground hold you up instead.",
      "It's heavy because it mattered. But it's okay to let it go now.",
      "You are not required to hold the world together today.",
      "Drop your shoulders. Unclench your jaw. Exhale.",
      "Sometimes the bravest thing you can do is simply stop carrying the load.",
      "The anchor feels heavy until you realize you can untie the rope.",
      "You do not have to be the pillar for everyone else right now.",
      "It takes immense strength to carry what you have. Rest now.",
      "Let gravity take the burden from you. You are allowed to fall soft.",
      "Your worth is not measured by the weight you can endure.",
      "The heaviest clouds always rain, and then the sky is clear again.",
      "Put it down. Even for just this one moment, put it down."
    ]
  },
  anxious: {
    id: 'anxious',
    label: 'Anxious',
    tagline: 'Like the ground might give way',
    song: {
      file: '/music/anxious.mp3',
      title: 'Aspirin',
      artist: 'Low Roar',
      album: 'Low Roar',
    },
    color: '#1a3a3a',       // brand-teal
    textOnColor: '#ffffff', // white (dark background)
    cardClass: 'mood-anxious',
    bgImage: '/img/anxious.jpg',
    responses: [
      "The ground is solid beneath you, even when it feels like it's shifting.",
      "You are safe in this exact moment. Let the racing thoughts slow down.",
      "This feeling of panic is just a wave. It will crest, and it will recede.",
      "Focus on the rhythm of your breath. In. Out. You are right here.",
      "Your mind is trying to protect you, but there is no danger here. You can rest.",
      "Let the quiet wash over the noise. You don't need all the answers right now.",
      "The storm in your mind cannot harm the shelter of your soul.",
      "This adrenaline will fade. Your heartbeat will slow. Peace will return.",
      "You do not have to figure out tomorrow today. Just be here, now.",
      "Every chaotic thought is just a cloud passing across the sky of your mind.",
      "It is okay to step away from the edge of your worries.",
      "Your fear is loud, but your resilience is quiet and unbreakable.",
      "Anchor yourself to this moment. The future has not happened yet.",
      "Breathe in the calm. Breathe out the rush. Repeat.",
      "You are not the panic you feel. You are the stillness underneath it.",
      "This too is temporary. The shaking will stop, and you will stand firm."
    ]
  },
  melancholic: {
    id: 'melancholic',
    label: 'Melancholic',
    tagline: 'Like the color drained from everything',
    song: {
      file: '/music/melancholic.mp3',
      title: 'Big Parade',
      artist: 'Low Roar',
      album: 'Low Roar',
    },
    color: '#b8a4ed',       // brand-lavender
    textOnColor: '#0a0a0a', // dark ink (light background)
    cardClass: 'mood-melancholic',
    bgImage: '/img/melan.jpg',
    responses: [
      "It is okay to sit in the gray for a while. The color will return when it's ready.",
      "There is a gentle beauty in this stillness. You don't have to force a smile.",
      "Allow yourself to feel the emptiness without judgment. It is just a season.",
      "You are seen, even in the shadows. The light always finds its way back.",
      "It is okay if all you did today was just get through it.",
      "Sorrow is just love looking for a place to rest. Be gentle with yourself.",
      "The winter of the soul is necessary for the spring that follows.",
      "You don't need to fix this feeling. You just need to let it exist.",
      "Tears are the ink of the unspoken heart. Let them flow.",
      "There is no rush to feel better. Take all the time you need in the quiet.",
      "Even the moon has phases where it is entirely dark. You are allowed to retreat.",
      "Your sadness is valid, and it does not make you broken.",
      "Embrace the melancholy as a quiet friend, not an enemy to fight.",
      "The numbness will eventually thaw. Until then, you are safe here.",
      "It is perfectly fine to just exist right now. No performance required.",
      "A quiet ache is still proof that you have a beating heart."
    ]
  },
  overwhelmed: {
    id: 'overwhelmed',
    label: 'Overwhelmed',
    tagline: 'Like drowning in a quiet room',
    song: {
      file: '/music/overwelmed.mp3',
      title: 'Hummingbird',
      artist: 'Low Roar',
      album: 'Low Roar',
    },
    color: '#ff6b5a',       // brand-coral
    textOnColor: '#ffffff', // white (dark background)
    cardClass: 'mood-overwhelmed',
    bgImage: '/img/overwelm.jpg',
    responses: [
      "One thing at a time. One moment at a time. The rest can wait.",
      "You do not have to solve everything today. Just focus on your next breath.",
      "The tide is high right now, but you are a strong swimmer. Just float.",
      "Let the chaos swirl around you. In the center, you can remain still.",
      "Close your eyes and shut out the world. You are allowed to take a break.",
      "It feels like too much, but you have survived every overwhelmed day before this.",
      "Step back from the noise. You don't have to answer the world right now.",
      "Drop the balls you are juggling. They will not shatter. You will.",
      "Saying 'no' to the pressure is saying 'yes' to yourself.",
      "You cannot pour from an empty cup. It is time to rest.",
      "The mountain of tasks will wait. Taking a moment for yourself will not.",
      "In the eye of the storm, there is absolute peace. Find your center.",
      "Let the floodwaters recede. You do not need to fight the current.",
      "Everything feels urgent, but very few things truly are. Breathe.",
      "You are doing enough. You have done enough. You are enough.",
      "Give yourself permission to pause the world for just five minutes."
    ]
  },
}

export const releaseTypes = {
  burn: {
    id: 'burn',
    label: 'Burn',
    description: 'Watch your words consumed by fire. Embers rise. Nothing remains.',
    color: '#ff6b5a',
    textOnColor: '#ffffff',
    completionMessage: 'Reduced to ash. You\'re lighter now.',
  },
  float: {
    id: 'float',
    label: 'Float',
    description: 'Your words become balloons. They drift upward and disappear.',
    color: '#b8a4ed',
    textOnColor: '#0a0a0a',
    completionMessage: 'Gone with the wind. Breathe.',
  },
  dissolve: {
    id: 'dissolve',
    label: 'Dissolve',
    description: 'Ink bleeds into water. Ripples spread. The surface calms.',
    color: '#1a3a3a',
    textOnColor: '#ffffff',
    completionMessage: 'Washed away. The surface is calm.',
  },
  plant: {
    id: 'plant',
    label: 'Plant',
    description: 'Your worry crumbles into soil. A sprout emerges. Something grows.',
    color: '#a4d4c5',
    textOnColor: '#0a0a0a',
    completionMessage: 'From worry, something grows.',
  },
}

export function getMood(id) {
  return moods[id] || null
}

export function getReleaseType(id) {
  return releaseTypes[id] || null
}
