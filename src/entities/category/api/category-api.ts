import { httpClient } from '@shared/api/http-client.ts'
import type { EcwidCategoryDto, EcwidCategoryListResponse } from '@shared/types/dto'

export type FetchCategoriesParams = {
  limit?: number
  offset?: number
  parentId?: number
}

const CATEGORY_RESPONSE_FIELDS =
  'items(id,name,parentId,productCount,imageUrl),total,count,offset,limit'

export const fetchCategories = async (
  params: FetchCategoriesParams = {}
): Promise<EcwidCategoryListResponse> => {
  const { limit = 100, offset = 0, parentId } = params

  const response = await httpClient.get<EcwidCategoryListResponse>('/categories', {
    params: {
      limit,
      offset,
      parentId,
      responseFields: CATEGORY_RESPONSE_FIELDS
    }
  })

  return response.data
}

export const fetchCategoryById = async (categoryId: number): Promise<EcwidCategoryDto> => {
  const response = await httpClient.get<EcwidCategoryDto>(`/categories/${categoryId}`)

  return response.data
}
