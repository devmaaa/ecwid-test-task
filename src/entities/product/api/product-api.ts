import { httpClient } from '@shared/api/http-client.ts'
import type { EcwidProductDto, EcwidProductListResponse } from '@/shared/types/dto'
import type { ProductFilters } from '@entities/product'

const PRODUCT_BASE_FIELDS = [
  'id',
  'sku',
  'name',
  'price',
  'compareToPrice',
  'imageUrl',
  'description',
  'categories(id,name,nameTranslated,enabled)',
  'inStock'
].join(',')

const PRODUCTS_RESPONSE_FIELDS = [
  `items(${PRODUCT_BASE_FIELDS})`,
  'total',
  'count',
  'offset',
  'limit'
].join(',')

const PRODUCT_RESPONSE_FIELDS = [
  PRODUCT_BASE_FIELDS,
  'galleryImages(id,url,imageUrl,originalImageUrl,thumbnail,thumbnailUrl,smallThumbnailUrl,hdThumbnailUrl,width,height,orderBy,borderInfo(dominatingColor(red,green,blue,alpha),homogeneity))'
].join(',')

export const fetchProducts = async (params: ProductFilters): Promise<EcwidProductListResponse> => {
  const { limit = 20, offset = 0, keyword, categoryId, sortBy } = params

  const response = await httpClient.get<EcwidProductListResponse>('/products', {
    params: {
      limit,
      offset,
      keyword,
      categories: categoryId,
      sortBy,
      responseFields: PRODUCTS_RESPONSE_FIELDS
    }
  })

  return response.data
}

export const fetchProductById = async (productId: number): Promise<EcwidProductDto> => {
  const response = await httpClient.get<EcwidProductDto>(`/products/${productId}`, {
    params: {
      responseFields: PRODUCT_RESPONSE_FIELDS
    }
  })

  return response.data
}
