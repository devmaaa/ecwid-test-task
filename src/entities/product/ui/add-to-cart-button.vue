<template>
  <Button :disabled="!product.inStock || disabled" @click="handleClick">
    <slot>
      <span v-if="product.inStock">Add to cart</span>
      <span v-else>Unavailable</span>
    </slot>
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '@shared/ui/button.vue'
import { useCartStore } from '@entities/cart'
import type { Product } from '@entities/product/model/product-types.ts'

const props = withDefaults(
  defineProps<{
    product: Product
    quantity?: number
    disabled?: boolean
  }>(),
  {
    quantity: 1,
    disabled: false
  }
)

const emit = defineEmits<{ (event: 'added'): void }>()

const cartStore = useCartStore()

const product = computed(() => props.product)
const disabled = computed(() => props.disabled)

const handleClick = () => {
  if (!product.value.inStock) return
  cartStore.addItem(product.value, props.quantity)
  emit('added')
}
</script>
