import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'theme'
const DARK_CLASS = 'dark'

export function useTheme() {
  const isDark = ref(false)

  const applyTheme = (dark: boolean): void => {
    isDark.value = dark
    const root = document.documentElement
    if (dark) {
      root.classList.add(DARK_CLASS)
    } else {
      root.classList.remove(DARK_CLASS)
    }
  }

  const toggleTheme = (): void => {
    const next = !isDark.value
    applyTheme(next)
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
  }

  const initializeTheme = (): void => {
    if (document.documentElement.classList.contains(DARK_CLASS)) {
      isDark.value = true
      return
    }

    const savedTheme = localStorage.getItem(STORAGE_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(savedTheme === 'dark' || (!savedTheme && prefersDark))
  }

  onMounted(() => {
    initializeTheme()
  })

  return {
    isDark,
    toggleTheme,
    initializeTheme,
  }
}
