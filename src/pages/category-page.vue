<template>
  <section class="space-y-6">
    <header class="space-y-4">
      <RouterLink to="/" class="text-sm font-medium text-muted hover:text-heading"
        >← Back to home</RouterLink
      >
      <div
        class="flex flex-col gap-6 rounded-xl border border-subtle bg-surface p-6 transition-colors md:flex-row"
      >
        <div class="w-full max-w-xs overflow-hidden rounded-lg bg-surface-muted">
          <img
            v-if="category?.imageUrl"
            :src="category.imageUrl"
            :alt="category.name"
            class="h-40 w-full object-cover"
          />
          <div v-else class="flex h-40 items-center justify-center text-sm text-muted">
            No image available
          </div>
        </div>
        <div class="flex flex-1 flex-col justify-between gap-4">
          <div>
            <h1 class="text-3xl font-semibold text-heading">
              {{ categoryTitle }}
            </h1>
            <p class="mt-2 text-sm text-muted">
              Products in this category and related subcategories.
            </p>
          </div>
          <div v-if="childCategories.length" class="space-y-3">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Subcategories</h2>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <RouterLink
                v-for="child in childCategories"
                :key="child.id"
                :to="{ name: 'category', params: { categoryId: child.id } }"
                class="group flex items-center gap-3 rounded-lg border border-subtle bg-surface px-3 py-2 text-sm font-medium text-body transition hover:border-accent hover:text-heading"
              >
                <div class="h-10 w-10 overflow-hidden rounded bg-surface-muted">
                  <img
                    v-if="child.imageUrl"
                    :src="child.imageUrl"
                    :alt="child.name"
                    class="h-full w-full object-cover"
                  />
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center text-xs text-muted"
                  >
                    No image
                  </div>
                </div>
                <span class="flex-1 truncate">{{ child.name }}</span>
                <span
                  class="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-semibold text-muted"
                >
                  {{ child.productCount }}
                </span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </header>

    <ProductList
      :products="products"
      :loading="productLoading"
      :error="productError"
      :hasMore="false"
    >
      <template #card-actions="{ product }">
        <AddToCartButton :product="product" />
      </template>
    </ProductList>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'
import { AddToCartButton, ProductList, useProductStore } from '@entities/product'
import { useCategoryStore } from '@entities/category'

const LIMIT = 12

const route = useRoute()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const {
  items: products,
  isLoading: productLoading,
  error: productError
} = storeToRefs(productStore)
const { categories } = storeToRefs(categoryStore)

const categoryId = computed(() => {
  const id = Number(route.params.categoryId)
  return Number.isNaN(id) ? undefined : id
})

const category = computed(() => categoryStore.findById(categoryId.value))

const childCategories = computed(() => categoryStore.getChildren(categoryId.value))

const categoryTitle = computed(() => categoryStore.getCategoryTitle(categoryId.value))

const loadProducts = async () => {
  if (!categoryId.value) return

  await productStore.loadProducts({
    limit: LIMIT,
    offset: 0,
    categoryId: categoryId.value
  })
}

const bootstrap = async () => {
  if (!categoryId.value) return

  productStore.resetProducts()

  if (!categories.value.length) {
    await categoryStore.loadCategories({}, { replace: true })
  }

  if (!categories.value.some((entry) => entry.id === categoryId.value)) {
    await categoryStore.loadCategoryById(categoryId.value)
  }
  await categoryStore.ensureChildrenLoaded(categoryId.value)

  await loadProducts()
}

watch(
  categoryId,
  async (newValue) => {
    if (!newValue) return
    await bootstrap()
  },
  { immediate: true }
)
</script>
