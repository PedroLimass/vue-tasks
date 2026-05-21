import { onMounted, ref } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value

    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      return
    }
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
      return
    }

    isDark.value = false
    document.documentElement.classList.remove('dark')
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
