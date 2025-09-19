<template>
  <label class="block space-y-2">
    <span v-if="label" class="text-xs font-semibold uppercase tracking-wide text-muted">{{
      label
    }}</span>
    <div class="relative">
      <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
        🔍
      </span>
      <input
        :type="type"
        :value="model"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        class="w-full rounded-md border border-subtle bg-surface pl-9 pr-10 py-2 text-sm text-body shadow-sm transition focus:border-strong focus:outline-none focus:ring-2 focus:ring-[color:var(--color-border-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        @input="handleInput"
      />
      <span v-if="loading" class="absolute inset-y-0 right-3 flex items-center" aria-hidden="true">
        <span
          class="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-accent border-r-transparent"
        />
      </span>
    </div>
    <p v-if="description" class="text-xs text-muted">{{ description }}</p>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    label?: string
    description?: string
    loading?: boolean
    disabled?: boolean
    type?: string
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'Search…',
    type: 'search',
    autocomplete: 'off'
  }
)

const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()

const model = computed(() => props.modelValue)
const loading = computed(() => props.loading ?? false)
const disabled = computed(() => props.disabled ?? false)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
