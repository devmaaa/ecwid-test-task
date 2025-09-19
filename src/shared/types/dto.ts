export type EcwidPagination = {
  total: number
  count: number
  offset: number
  limit: number
}

export type EcwidImageDto = {
  id: number
  url?: string
  imageUrl?: string
  originalImageUrl?: string
  thumbnail?: string
  thumbnailUrl?: string
  smallThumbnailUrl?: string
  hdThumbnailUrl?: string
  width?: number
  height?: number
  orderBy?: number
  borderInfo?: {
    dominatingColor?: {
      red: number
      green: number
      blue: number
      alpha?: number
    }
    homogeneity?: boolean
  }
}

export type EcwidCategoryDto = {
  id: number
  name: string
  parentId: number
  url: string
  description?: string
  productCount: number
  imageUrl?: string
}

export type EcwidProductCategoryDto = {
  id: number
  enabled?: boolean
  name?: string
  nameTranslated?: string
}

export type EcwidProductDto = {
  id: number
  sku: string
  name: string
  price: number
  compareToPrice?: number
  defaultDisplayedPriceFormatted?: string
  description?: string
  imageUrl?: string
  galleryImages?: EcwidImageDto[]
  categories?: EcwidProductCategoryDto[]
  quantity?: number
  inStock?: boolean
}

export type EcwidProductListResponse = {
  items: EcwidProductDto[]
} & EcwidPagination

export type EcwidCategoryListResponse = {
  items: EcwidCategoryDto[]
} & EcwidPagination
