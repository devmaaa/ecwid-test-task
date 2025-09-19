import type { App } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/app/router'

const pinia = createPinia()

export const installAppProviders = (app: App) => {
  app.use(pinia)
  app.use(router)
}

export { pinia }
