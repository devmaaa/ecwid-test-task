<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
        @click.self="handleClose"
      >
        <transition name="scale">
          <div class="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-card transition-colors">
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 v-if="title" class="text-lg font-semibold text-heading">
                  {{ title }}
                </h2>
                <p v-if="description" class="mt-1 text-sm text-muted">
                  {{ description }}
                </p>
              </div>
              <button
                v-if="!persistent"
                type="button"
                class="text-muted transition hover:text-heading"
                aria-label="Close"
                @click="handleClose"
              >
                ×
              </button>
            </div>
            <div class="max-h-[70vh] overflow-y-auto">
              <slot />
            </div>
            <div v-if="$slots.footer" class="mt-6 flex justify-end gap-2">
              <slot name="footer" />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    description?: string
    persistent?: boolean
  }>(),
  {
    modelValue: false,
    persistent: false
  }
)

const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>()

const handleClose = () => {
  if (props.persistent) return
  emit('update:modelValue', false)
}

const onEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEscape)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition:
    transform 150ms ease,
    opacity 150ms ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.96);
  opacity: 0;
}
</style>
