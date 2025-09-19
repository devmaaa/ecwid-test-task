<template>
  <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-slate-700">
    {{ label }}
  </label>
  <div class="relative">
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :class="inputClasses"
      :disabled="disabled"
      @input="handleInput"
    />
    <slot name="suffix" />
  </div>
  <p v-if="description && !error" class="mt-1 text-xs text-slate-500">{{ description }}</p>
  <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null
    label?: string
    description?: string
    error?: string
    type?: string
    placeholder?: string
    id?: string
    autocomplete?: string
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    type: 'text',
    placeholder: '',
    autocomplete: 'off',
    disabled: false
  }
)

const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()

const modelValue = computed(() => (props.modelValue ?? '').toString())

const inputClasses = computed(() => {
  const base =
    'w-full rounded-md border px-3 py-2 text-sm transition focus:outline-none focus:ring-2'

  const state = props.error
    ? 'border-red-500 bg-surface text-heading focus:border-red-500 focus:ring-red-200'
    : 'border-subtle bg-surface text-body placeholder:text-muted focus:border-strong focus:ring-[color:var(--color-border-strong)]'

  return `${base} ${state}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
