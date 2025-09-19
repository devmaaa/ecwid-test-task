<template>
  <section class="mx-auto max-w-4xl space-y-6">
    <Card title="Your cart">
      <div
        v-if="orderPlaced"
        class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
      >
        🎉 Congratulations on your purchase! Your order is on its way.
      </div>

      <div v-else-if="!items.length" class="text-center text-sm text-muted">
        Your cart is empty.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in items"
          :key="item.productId"
          class="flex flex-col gap-4 rounded-lg border border-subtle bg-surface p-4 transition-colors sm:flex-row sm:items-center"
        >
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.name"
            class="h-20 w-20 flex-shrink-0 rounded object-cover"
          />
          <div class="flex flex-1 flex-col">
            <h3 class="text-base font-semibold text-heading">{{ item.name }}</h3>
            <p class="text-sm text-muted">{{ item.displayPrice }}</p>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-muted">Qty</label>
            <input
              :value="item.quantity"
              type="number"
              min="1"
              class="w-16 rounded-md border border-subtle bg-surface px-2 py-1 text-sm text-body"
              @change="
                (event) =>
                  updateQuantity(item.productId, Number((event.target as HTMLInputElement).value))
              "
            />
          </div>
          <button
            type="button"
            class="text-sm font-medium text-red-500 hover:underline"
            @click="remove(item.productId)"
          >
            Remove
          </button>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-col items-end gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm text-muted">
            Total items:
            <span class="font-semibold text-heading">{{ totalItems }}</span>
          </div>
          <div class="text-lg font-semibold text-heading">
            {{ totalFormatted }}
          </div>
          <Button
            :disabled="!items.length"
            variant="primary"
            class="sm:w-auto"
            @click="handlePlaceOrder"
          >
            Place order
          </Button>
        </div>
      </template>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Card from '@shared/ui/card.vue'
import Button from '@shared/ui/button.vue'
import { formatPrice } from '@shared/lib/format-price.ts'
import { useCartStore } from '@entities/cart/model/cart-store.ts'

const cartStore = useCartStore()
const { items, totalItems, totalPrice } = storeToRefs(cartStore)

const orderPlaced = ref(false)

watch(
  items,
  (newItems) => {
    if (newItems.length) {
      orderPlaced.value = false
    }
  },
  { deep: true }
)

const remove = (productId: number) => {
  cartStore.removeItem(productId)
}

const updateQuantity = (productId: number, quantity: number) => {
  if (Number.isNaN(quantity)) return
  cartStore.updateQuantity(productId, quantity)
}

const totalFormatted = computed(() => formatPrice(totalPrice.value))

const handlePlaceOrder = () => {
  if (!items.value.length) return
  cartStore.clear()
  orderPlaced.value = true
}
</script>
