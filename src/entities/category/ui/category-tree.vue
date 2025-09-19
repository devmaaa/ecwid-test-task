<template>
  <aside class="space-y-4 rounded-xl border border-subtle bg-surface p-4 transition-colors">
    <header class="flex items-center justify-between">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Categories</h2>
      <slot name="header" />
    </header>

    <div v-if="loading" class="space-y-2">
      <div v-for="n in 6" :key="n" class="h-3 rounded bg-surface-muted" />
    </div>

    <ul v-else class="space-y-2">
      <li v-for="node in tree" :key="node.category.id">
        <template v-if="selectable">
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-body transition hover:bg-surface-muted"
            :class="{
              'bg-accent text-accent-contrast hover:bg-accent-strong':
                node.category.id === activeCategoryId
            }"
            @click="handleSelect(node.category.id)"
          >
            <span>{{ node.category.name }}</span>
          </button>
        </template>
        <CategoryLink v-else :category="node.category" />

        <ul v-if="node.children.length" class="mt-1 space-y-1 pl-4">
          <li v-for="child in node.children" :key="child.id">
            <template v-if="selectable">
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-body transition hover:bg-surface-muted"
                :class="{
                  'bg-accent text-accent-contrast hover:bg-accent-strong':
                    child.id === activeCategoryId
                }"
                @click="handleSelect(child.id)"
              >
                <span>{{ child.name }}</span>
              </button>
            </template>
            <CategoryLink v-else :category="child" :show-count="false" />
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CategoryLink from '@entities/category/ui/category-link.vue'
import type { Category } from '@entities/category/model/category-types.ts'

const props = withDefaults(
  defineProps<{
    categories: Category[]
    loading?: boolean
    selectable?: boolean
    activeCategoryId?: number | null
    showCount?: boolean
  }>(),
  {
    categories: () => [],
    loading: false,
    selectable: false,
    activeCategoryId: null,
    showCount: true
  }
)

const emit = defineEmits<{ (event: 'select', categoryId: number | null): void }>()

const loading = computed(() => props.loading)
const selectable = computed(() => props.selectable)
const activeCategoryId = computed(() => props.activeCategoryId)

const tree = computed(() => {
  const byParent = new Map<number, Category[]>()

  for (const category of props.categories) {
    if (!byParent.has(category.parentId)) {
      byParent.set(category.parentId, [])
    }

    byParent.get(category.parentId)?.push(category)
  }

  const roots = byParent.get(0) ?? []

  return roots.map((category) => ({
    category,
    children: byParent.get(category.id) ?? []
  }))
})

const handleSelect = (categoryId: number) => {
  emit('select', categoryId)
}
</script>
