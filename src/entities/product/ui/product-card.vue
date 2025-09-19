<template>
  <Card :padded="false" class="flex h-full flex-col overflow-hidden">
    <RouterLink :to="productLink" class="group relative block h-48 bg-surface-muted">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        class="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-sm text-muted">
        No image
      </div>
      <span
        v-if="!product.inStock"
        class="absolute left-2 top-2 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600"
      >
        Out of stock
      </span>
    </RouterLink>
    <div class="flex flex-1 flex-col gap-4 p-4">
      <div class="flex-1 space-y-2">
        <RouterLink
          :to="productLink"
          class="line-clamp-2 text-base font-semibold text-heading transition hover:text-accent"
        >
          {{ product.name }}
        </RouterLink>
        <p v-if="product.description" class="line-clamp-2 text-sm text-muted">
          {{ product.description }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-lg font-semibold text-heading">{{ product.displayPrice }}</span>
        <slot name="actions" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { RouterLink } from 'vue-router'
import Card from '@shared/ui/card.vue'
import type { Product } from '@entities/product/model/product-types.ts'

const props = defineProps<{
  product: Product
}>()

const product = toRef(props, 'product')

const productLink = computed(() => ({
  name: 'product',
  params: { productId: product.value.id }
}))
</script>
