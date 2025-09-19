<template>
  <div :class="classes">
    <div v-if="title || description" class="mb-4 border-b border-slate-100 pb-4">
      <h3 v-if="title" class="text-lg font-semibold text-slate-900">{{ title }}</h3>
      <p v-if="description" class="mt-1 text-sm text-slate-500">{{ description }}</p>
    </div>
    <slot />
    <div v-if="$slots.footer" class="mt-6 border-t border-slate-100 pt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    padded?: boolean
    title?: string
    description?: string
  }>(),
  {
    padded: true
  }
)

const classes = computed(() =>
  [
    'rounded-xl border border-subtle bg-surface shadow-card transition-colors',
    props.padded ? 'p-6' : ''
  ]
    .join(' ')
    .trim()
)
</script>
