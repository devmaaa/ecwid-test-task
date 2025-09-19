<template>
  <RouterLink
    :to="link"
    class="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-body transition hover:bg-surface-muted"
    :class="{ 'bg-accent text-accent-contrast hover:bg-accent-strong': isActive }"
  >
    <slot>
      {{ category.name }}
    </slot>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import type { Category } from '@entities/category/model/category-types.ts'

const props = withDefaults(
  defineProps<{
    category: Category
    showCount?: boolean
  }>(),
  {
    showCount: true
  }
)

const route = useRoute()

const link = computed(() => ({
  name: 'category',
  params: { categoryId: props.category.id }
}))

const isActive = computed(
  () => route.name === 'category' && Number(route.params.categoryId) === props.category.id
)
</script>
