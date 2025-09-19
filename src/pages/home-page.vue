<template>
  <div class="grid gap-8 lg:grid-cols-[260px_1fr]">
    <div class="space-y-4">
      <button
        type="button"
        class="w-full rounded-md border border-subtle bg-surface px-3 py-2 text-sm font-medium text-body transition hover:bg-surface-muted"
        :class="{
          'bg-accent text-accent-contrast hover:bg-accent-strong border-transparent':
            !currentCategoryId
        }"
        @click="handleCategorySelect(null)"
      >
        All categories
      </button>
      <CategoryTree
        :categories="categories"
        :loading="categoriesLoading"
        selectable
        :active-category-id="currentCategoryId ?? null"
        @select="handleCategorySelect"
      />
    </div>

    <section class="space-y-6">
      <Card padded class="space-y-6 shadow-sm">
        <header class="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div class="w-full max-w-sm">
            <SearchInput
              v-model="search"
              label="Quick search"
              placeholder="Search products…"
              :loading="productLoading"
            />
          </div>
        </header>
      </Card>

      <Card padded class="shadow-sm">
        <ProductList
          :products="products"
          :loading="productLoading"
          :error="productError"
          :hasMore="false"
          title=""
        >
          <template #card-actions="{ product }">
            <AddToCartButton :product="product" />
          </template>
        </ProductList>
      </Card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from '@shared/lib/debounce.ts'
import { CategoryTree, useCategoryStore } from '@entities/category'
import { AddToCartButton, ProductList, useProductStore } from '@entities/product'
import Card from '@shared/ui/card.vue'
import SearchInput from '@shared/ui/search-input.vue'

const LIMIT = 12

const route = useRoute()
const router = useRouter()

const productStore = useProductStore()
const {
  items: products,
  isLoading: productLoading,
  error: productError
} = storeToRefs(productStore)

const categoryStore = useCategoryStore()
const { categories, isLoading: categoriesLoading } = storeToRefs(categoryStore)

const search = ref(typeof route.query.keyword === 'string' ? route.query.keyword : '')
const lastCategoryId = ref<number | undefined>(undefined)
const lastKeyword = ref('')

const currentCategoryId = computed(() => {
  const category = route.query.category
  if (typeof category === 'string' && category !== '') {
    const parsed = Number(category)
    return Number.isNaN(parsed) ? undefined : parsed
  }
  return undefined
})

const normalizeKeyword = (value: string) => value.trim()

const sanitizeQuery = (query: Record<string, unknown>) => {
  const result: Record<string, string> = {}
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (typeof value === 'string' && value.trim() === '') return
    result[key] = String(value)
  })
  return result
}

const updateQuery = (patch: Record<string, unknown>) => {
  const nextQuery = {
    ...route.query,
    ...patch
  }

  const sanitized = sanitizeQuery(nextQuery)

  router.replace({
    name: 'home',
    query: sanitized
  })
}

const debouncedSearchUpdate = debounce((value: string) => {
  const normalized = normalizeKeyword(value)
  const currentKeyword = typeof route.query.keyword === 'string' ? route.query.keyword : ''
  if (normalized === currentKeyword) return

  updateQuery({ keyword: normalized || undefined })
}, 400)

watch(search, (value) => {
  debouncedSearchUpdate(value)
})

const syncProducts = async () => {
  if ('page' in route.query) {
    updateQuery({ page: undefined })
    return
  }

  const keyword = typeof route.query.keyword === 'string' ? route.query.keyword : ''
  const categoryId = currentCategoryId.value

  search.value = keyword

  const keywordChanged = lastKeyword.value !== keyword
  const categoryChanged = lastCategoryId.value !== categoryId

  if (keywordChanged || categoryChanged) {
    productStore.resetProducts()
    lastKeyword.value = keyword
    lastCategoryId.value = categoryId
  }

  await productStore.loadProducts({
    limit: LIMIT,
    offset: 0,
    keyword: keyword || undefined,
    categoryId
  })
}

watch(
  () => ({
    category: route.query.category,
    keyword: route.query.keyword
  }),
  () => {
    void syncProducts()
  },
  { immediate: true }
)

const handleCategorySelect = (categoryId: number | null) => {
  updateQuery({ category: categoryId ? categoryId : undefined })
}

onMounted(() => {
  if (!categories.value.length) {
    void categoryStore.loadCategories()
  }
})

onBeforeUnmount(() => {
  debouncedSearchUpdate.cancel()
})
</script>
