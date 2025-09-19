import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchCategories, fetchCategoryById } from '@entities/category/api/category-api.ts'
import type { FetchCategoriesParams } from '@entities/category/api/category-api.ts'
import type { Category } from '@entities/category/model/category-types.ts'
import { mapCategoryDto } from '@entities/category/model/category-types.ts'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const fetchedParents = new Set<number>()

  const upsertCategories = (nextItems: Category[]) => {
    const merged = new Map<number, Category>()

    for (const item of categories.value) {
      merged.set(item.id, item)
    }

    for (const item of nextItems) {
      merged.set(item.id, item)
    }

    categories.value = Array.from(merged.values())
  }

  const rootCategories = computed(() =>
    categories.value.filter((category) => category.parentId === 0)
  )

  const categoriesMap = computed(() => {
    const map = new Map<number, Category>()
    for (const category of categories.value) {
      map.set(category.id, category)
    }
    return map
  })

  const loadCategories = async (
    params: FetchCategoriesParams = {},
    options: { replace?: boolean; force?: boolean } = {}
  ) => {
    const parentId = params.parentId ?? 0

    if (!options.force && fetchedParents.has(parentId)) {
      return categories.value.filter((category) => category.parentId === parentId)
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await fetchCategories(params)
      const nextItems = response.items.map(mapCategoryDto)

      fetchedParents.add(parentId)

      const shouldReplace = options.replace ?? (categories.value.length === 0 && parentId === 0)

      if (shouldReplace) {
        categories.value = nextItems
      } else {
        upsertCategories(nextItems)
      }

      return nextItems
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const ensureChildrenLoaded = async (parentId: number) => {
    const normalizedParent = parentId ?? 0

    if (normalizedParent === 0) return

    if (fetchedParents.has(normalizedParent)) {
      return
    }

    await loadCategories({ parentId: normalizedParent })
  }

  const loadCategoryById = async (categoryId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetchCategoryById(categoryId)
      const category = mapCategoryDto(response)
      upsertCategories([category])
      return category
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const findById = (id?: number) => {
    if (typeof id !== 'number') return undefined
    return categoriesMap.value.get(id)
  }

  const getChildren = (parentId?: number) => {
    const targetParent = typeof parentId === 'number' ? parentId : 0
    return categories.value.filter((category) => category.parentId === targetParent)
  }

  const getCategoryTitle = (id?: number) => findById(id)?.name ?? 'Category'

  return {
    categories,
    isLoading,
    error,
    rootCategories,
    categoriesMap,
    loadCategories,
    loadCategoryById,
    ensureChildrenLoaded,
    findById,
    getChildren,
    getCategoryTitle
  }
})
