import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const value = ref<T>(defaultValue)

  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(key)
    if (stored) {
      try {
        value.value = JSON.parse(stored)
      } catch (e) {
        console.error(`Failed to parse localStorage for key ${key}`, e)
      }
    }
  }

  watch(
    value,
    (newValue) => {
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue))
        } catch (e) {
          console.error(`Failed to write to localStorage for key ${key}`, e)
        }
      }
    },
    { deep: true }
  )

  return value
}
