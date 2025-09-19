<template>
  <section class="space-y-6">
    <header v-if="title" class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-900">{{ title }}</h2>
      <slot name="header" />
    </header>

    <div
      v-if="error"
      class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
    >
      {{ error }}
    </div>

    <div
      v-if="!loading && !products.length && !error"
      class="flex flex-col items-center justify-center rounded-md border border-dashed border-subtle py-12 text-center text-muted"
    >
      <slot name="empty"> No products found. </slot>
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ProductCard v-for="product in products" :key="product.id" :product="product">
        <template #actions>
          <slot name="card-actions" :product="product" />
        </template>
      </ProductCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import ProductCard from '@entities/product/ui/product-card.vue'
import type { Product } from '@entities/product/model/product-types.ts'

const props = withDefaults(
  defineProps<{
    products: Product[]
    loading?: boolean
    error?: string | null
    title?: string
  }>(),
  {
    products: () => [],
    loading: false,
    error: null,
    title: ''
  }
)
const { products, loading, error, title } = toRefs(props)
</script>
