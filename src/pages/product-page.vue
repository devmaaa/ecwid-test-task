<template>
  <section class="mx-auto max-w-4xl space-y-6">
    <RouterLink to="/" class="text-sm font-medium text-muted hover:text-heading"
      >← Back to home</RouterLink
    >

    <div
      v-if="productLoading"
      class="rounded-xl border border-subtle bg-surface p-6 text-center text-sm text-muted"
    >
      Loading product…
    </div>

    <div
      v-else-if="productError"
      class="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
    >
      {{ productError }}
    </div>

    <div
      v-else-if="product"
      class="grid gap-8 rounded-xl border border-subtle bg-surface p-6 transition-colors md:grid-cols-2"
    >
      <div class="flex flex-col gap-4">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full rounded-lg object-cover"
        />
        <div
          v-else
          class="flex h-64 items-center justify-center rounded-lg bg-surface-muted text-sm text-muted"
        >
          No image available
        </div>
      </div>
      <div class="flex flex-col gap-6">
        <div>
          <h1 class="text-3xl font-semibold text-heading">{{ product.name }}</h1>
          <p class="mt-2 text-lg font-semibold text-heading">{{ product.displayPrice }}</p>
        </div>
        <div
          v-if="product.descriptionHtml"
          class="prose max-w-none text-body"
          v-html="product.descriptionHtml"
        />
        <p v-else-if="product.description" class="text-sm text-muted">{{ product.description }}</p>
        <div>
          <AddToCartButton :product="product" :disabled="!product.inStock" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'
import { AddToCartButton, useProductStore } from '@entities/product'

const route = useRoute()
const productStore = useProductStore()
const {
  selectedProduct: product,
  isLoading: productLoading,
  error: productError
} = storeToRefs(productStore)

const productId = computed(() => {
  const id = Number(route.params.productId)
  return Number.isNaN(id) ? undefined : id
})

const loadProduct = async () => {
  if (!productId.value) return
  await productStore.loadProductById(productId.value)
}

watch(productId, () => {
  void loadProduct()
})

onMounted(() => {
  void loadProduct()
})
</script>
