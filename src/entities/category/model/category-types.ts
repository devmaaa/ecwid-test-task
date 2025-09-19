import type { EcwidCategoryDto } from '@/shared/types/dto'

export type CategoryId = number

export type Category = {
  id: CategoryId
  name: string
  parentId: number
  productCount: number
  imageUrl?: string
}

export const mapCategoryDto = (dto: EcwidCategoryDto): Category => ({
  id: dto.id,
  name: dto.name,
  parentId: dto.parentId ?? 0,
  productCount: dto.productCount ?? 0,
  imageUrl: dto.imageUrl
})
