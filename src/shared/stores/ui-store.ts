import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const THEME_STORAGE_KEY = 'theme_mode'

export type Theme = 'light' | 'dark'

const getInitialPreference = (): Theme => {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null

  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return 'light'
}

const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  root.setAttribute('data-theme', theme)
}

export const useUiStore = defineStore('ui', () => {
  const theme = ref<Theme>(getInitialPreference())

  const setThemePreference = (next: Theme) => {
    theme.value = next
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    }
  }

  const toggleTheme = () => {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    setThemePreference(next)
  }

  const initializeTheme = () => {
    applyThemeToDocument(theme.value)
  }

  watch(
    theme,
    (next) => {
      applyThemeToDocument(next)
    },
    { immediate: true }
  )

  const setTheme = (next: Theme) => {
    setThemePreference(next)
  }

  return {
    theme,
    initializeTheme,
    setTheme,
    toggleTheme
  }
})
