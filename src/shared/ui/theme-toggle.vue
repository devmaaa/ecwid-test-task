<template>
  <Button variant="ghost" size="sm" class="h-9 w-9 rounded-full p-0" @click="handleToggle">
    <span v-if="isDark" aria-hidden="true">🌙</span>
    <span v-else aria-hidden="true">☀️</span>
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import Button from '@shared/ui/button.vue'
import { useUiStore } from '@shared/stores/ui-store.ts'

const uiStore = useUiStore()
const { theme } = storeToRefs(uiStore)

const isDark = computed(() => theme.value === 'dark')

const handleToggle = () => {
  uiStore.toggleTheme()
}
</script>
