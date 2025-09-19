<template>
  <button :type="type" :class="classes" :disabled="disabled || loading" @click="handleClick">
    <span
      v-if="loading"
      class="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent align-middle"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    block?: boolean
    loading?: boolean
    disabled?: boolean
    type?: ButtonType
  }>(),
  {
    variant: 'primary',
    size: 'md',
    block: false,
    loading: false,
    disabled: false,
    type: 'button'
  }
)

const emit = defineEmits<{ (event: 'click', value: MouseEvent): void }>()

const classes = computed(() => {
  const base =
    'inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'border-transparent bg-accent text-accent-contrast hover:bg-accent-strong focus-visible:outline-[color:var(--color-accent)]',
    secondary:
      'border-subtle bg-surface text-heading hover:bg-surface-muted focus-visible:outline-[color:var(--color-border-strong)]',
    ghost:
      'border-transparent bg-transparent text-heading hover:bg-surface-muted focus-visible:outline-[color:var(--color-border-strong)]'
  }

  const widthClass = props.block ? 'w-full' : ''

  return [base, sizeClasses[props.size], variantClasses[props.variant], widthClass].join(' ').trim()
})

const type = computed(() => props.type)
const loading = computed(() => props.loading)
const disabled = computed(() => props.disabled)

const handleClick = (event: MouseEvent) => {
  if (disabled.value || loading.value) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>
