import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@pages/home-page.vue')
    },
    {
      path: '/categories/:categoryId',
      name: 'category',
      props: true,
      component: () => import('@pages/category-page.vue')
    },
    {
      path: '/products/:productId',
      name: 'product',
      props: true,
      component: () => import('@pages/product-page.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@pages/cart-page.vue')
    }
  ]
})
