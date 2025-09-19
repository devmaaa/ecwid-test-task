type CartItemId = number

export type CartItem = {
  productId: CartItemId
  name: string
  price: number
  displayPrice: string
  quantity: number
  imageUrl?: string
}
