import { createApp } from 'vue'
import App from '@app/entry/app.vue'
import { installAppProviders } from '@/app/providers'
import '@/app/assets/style.css'
import { useUiStore } from '@shared/stores/ui-store.ts'

const bootstrap = () => {
  const app = createApp(App)
  installAppProviders(app)
  const uiStore = useUiStore()
  uiStore.initializeTheme()
  app.mount('#app')
}

bootstrap()
