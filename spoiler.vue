<template>
  <div
    v-if="box"
    class="vp-spoiler-box"
    :class="{ 
      'is-revealed': isRevealed, 
      'is-hovered': isHovered,
      'is-scribble': scribble 
    }"
    @click="toggleReveal"
    @keydown.enter="toggleReveal"
    @keydown.space.prevent="toggleReveal"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    ref="boxRef"
    role="button"
    :aria-expanded="isRevealed"
    tabindex="0"
  >
    <div class="vp-spoiler-glow" aria-hidden="true"></div>

    <transition name="vp-spoiler-fade">
      <div class="vp-spoiler-title-wrapper" v-if="!isRevealed" aria-hidden="true">
        <span class="vp-spoiler-title-base">{{ title }}</span>
        <span class="vp-spoiler-title-glow">{{ title }}</span>
      </div>
    </transition>

    <div class="vp-spoiler-content" @click.stop="contentClick" :aria-hidden="!isRevealed">
      <slot></slot>
    </div>
  </div>

  <span
    v-else
    class="vp-spoiler-inline"
    :class="{ 'is-revealed': isRevealed, 'is-scribble': scribble }"
    @click.stop="toggleReveal"
    @keydown.enter.stop="toggleReveal"
    @keydown.space.prevent.stop="toggleReveal"
    role="button"
    :aria-expanded="isRevealed"
    tabindex="0"
  >
    <span class="vp-spoiler-inline-content">
      <slot></slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount } from 'vue'

const props = defineProps({
  box: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'reveal content'
  },
  scribble: {
    type: Boolean,
    default: false
  }
})

const isRevealed = ref(false)
const isHovered = ref(false)
const boxRef = shallowRef<HTMLElement | null>(null)
let rafId: number | null = null

const toggleReveal = () => {
  isRevealed.value = !isRevealed.value
  if (isRevealed.value) {
    isHovered.value = false
    cancelRaf()
  }
}

const contentClick = (event: Event) => {
  if (isRevealed.value) event.stopPropagation()
}

const handleMouseMove = (e: MouseEvent) => {
  if (isRevealed.value || !boxRef.value) return
  isHovered.value = true
  cancelRaf()
  rafId = requestAnimationFrame(() => {
    if (!boxRef.value) return
    const rect = boxRef.value.getBoundingClientRect()
    boxRef.value.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    boxRef.value.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  })
}

const handleMouseLeave = () => {
  isHovered.value = false
  cancelRaf()
}

const cancelRaf = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

onBeforeUnmount(() => cancelRaf())
</script>