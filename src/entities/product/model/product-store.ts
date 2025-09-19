import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchProductById, fetchProducts } from '@entities/product/api/product-api.ts'
import type { Product, ProductFilters, ProductId } from '@entities/product/model/product-types.ts'
import { mapProductDto } from '@entities/product/model/product-types.ts'

export const useProductStore = defineStore('product', () => {
  const items = ref<Product[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<ProductFilters>({
    limit: 12,
    offset: 0
  })
  const selectedProduct = ref<Product | null>(null)

  const loadProducts = async (params: ProductFilters) => {
    isLoading.value = true
    error.value = null

    try {
      const request: ProductFilters = {
        limit: params.limit ?? 12,
        offset: params.offset ?? 0,
        keyword: params.keyword,
        categoryId: params.categoryId,
        sortBy: params.sortBy
      }

      filters.value = request
      const response = await fetchProducts(request)
      items.value = response.items.map(mapProductDto)
      total.value = response.total
      return items.value
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadProductById = async (productId: ProductId) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetchProductById(productId)
      const product = mapProductDto(response)
      selectedProduct.value = product

      const existingIndex = items.value.findIndex((item) => item.id === productId)
      if (existingIndex >= 0) {
        items.value.splice(existingIndex, 1, product)
      } else {
        items.value = [...items.value, product]
      }

      return product
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const resetProducts = () => {
    items.value = []
    total.value = 0
    filters.value = {
      limit: 12,
      offset: 0
    }
  }

  return {
    items,
    isLoading,
    error,
    filters,
    selectedProduct,
    loadProducts,
    loadProductById,
    resetProducts
  }
})
