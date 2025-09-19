import type { EcwidProductDto } from '@/shared/types/dto'

export type ProductId = number

export type ProductCategory = {
  id: number
  name?: string
  enabled?: boolean
  nameTranslated?: string
}

export type ProductImage = {
  id: number
  url?: string
  imageUrl?: string
  originalImageUrl?: string
  thumbnailUrl?: string
  smallThumbnailUrl?: string
  hdThumbnailUrl?: string
  width?: number
  height?: number
  orderBy?: number
}

export type Product = {
  id: ProductId
  sku: string
  name: string
  price: number
  compareToPrice?: number
  description?: string
  descriptionHtml?: string
  imageUrl?: string
  categories: ProductCategory[]
  inStock: boolean
  displayPrice: string
  galleryImages?: ProductImage[]
}

export type ProductFilters = {
  keyword?: string
  categoryId?: number
  limit?: number
  offset?: number
  sortBy?: 'NAME_ASC' | 'NAME_DESC' | 'PRICE_ASC' | 'PRICE_DESC'
}

export const mapProductDto = (dto: EcwidProductDto): Product => {
  const descriptionHtml = dto.description ?? ''
  const description = descriptionHtml ? extractText(descriptionHtml) : undefined

  return {
    id: dto.id,
    sku: dto.sku,
    name: dto.name,
    price: dto.price,
    compareToPrice: dto.compareToPrice,
    description,
    descriptionHtml: descriptionHtml || undefined,
    imageUrl: dto.imageUrl ?? dto.galleryImages?.[0]?.url,
    categories:
      dto.categories?.map((category) => ({
        id: category.id,
        name: category.name,
        enabled: category.enabled,
        nameTranslated: category.nameTranslated
      })) ?? [],
    inStock: dto.inStock ?? true,
    displayPrice: dto.defaultDisplayedPriceFormatted ?? `$${dto.price.toFixed(2)}`,
    galleryImages: dto.galleryImages?.map((image) => ({
      id: image.id,
      url: image.url,
      imageUrl: image.imageUrl,
      originalImageUrl: image.originalImageUrl,
      thumbnailUrl: image.thumbnailUrl ?? image.thumbnail,
      smallThumbnailUrl: image.smallThumbnailUrl,
      hdThumbnailUrl: image.hdThumbnailUrl,
      width: image.width,
      height: image.height,
      orderBy: image.orderBy
    }))
  }
}

const extractText = (html: string): string => {
  if (typeof window !== 'undefined' && 'DOMParser' in window) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const text = doc.body.textContent || ''
    return text.replace(/\s+/g, ' ').trim()
  }

  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
