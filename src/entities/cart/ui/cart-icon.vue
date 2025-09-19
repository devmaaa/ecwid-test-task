<template>
  <RouterLink
    to="/cart"
    class="relative inline-flex items-center gap-2 rounded-md border border-subtle bg-surface px-3 py-2 text-sm font-medium text-body transition hover:bg-surface-muted"
  >
    <span aria-hidden="true">🛒</span>
    <span>Cart</span>
    <span
      v-if="totalItems > 0"
      class="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-contrast"
    >
      {{ totalItems }}
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@entities/cart/model/cart-store.ts'

const cartStore = useCartStore()
const { totalItems } = storeToRefs(cartStore)
</script>
