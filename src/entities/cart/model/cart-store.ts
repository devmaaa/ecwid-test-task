import { computed } from 'vue'
import { defineStore } from 'pinia'
import type { CartItem } from '@entities/cart/model/cart-types.ts'
import type { Product } from '@entities/product/model/product-types.ts'
import { useLocalStorage } from '@shared/lib/use-local-storage.ts'

export const useCartStore = defineStore('cart', () => {
  const items = useLocalStorage<CartItem[]>('ecwid_cart', [])

  const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0))

  const totalPrice = computed(() =>
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const addItem = (product: Product, quantity = 1) => {
    const existingItem = items.value.find((item) => item.productId === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        displayPrice: product.displayPrice,
        quantity,
        imageUrl: product.imageUrl
      })
    }
  }

  const removeItem = (productId: number) => {
    items.value = items.value.filter((item) => item.productId !== productId)
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const normalizedQuantity = Math.max(1, quantity)
    const item = items.value.find((entry) => entry.productId === productId)

    if (item) {
      item.quantity = normalizedQuantity
    }
  }

  const clear = () => {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clear
  }
})
