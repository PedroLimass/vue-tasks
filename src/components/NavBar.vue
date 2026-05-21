<template>
  <header
    class="bg-white dark:bg-rocket-gray-900 border-b border-rocket-gray-200 dark:border-rocket-gray-800 sticky top-0 z-50"
  >
    <div class="flex items-center gap-4 px-4 py-3">
      <Rocket class="w-8 h-8 text-rocket-purple-500" />

      <span
        v-if="isAuthenticated"
        class="text-rocket-gray-700 dark:text-rocket-gray-300 font-medium"
      >
        Olá, {{ username }}
      </span>

      <template v-if="!isAuthenticated">
        <MenuItem redirectTo="/login" title="Login" />
        <MenuItem redirectTo="/register" title="Cadastre-se" />
      </template>

      <MenuItem v-if="isAuthenticated" redirectTo="/tasks" title="Tarefas" />

      <button
        v-if="isAuthenticated"
        type="button"
        class="ml-auto px-4 py-2 rounded-lg text-rocket-gray-600 dark:text-rocket-gray-300 bg-transparent border border-rocket-gray-200 dark:border-rocket-gray-800 cursor-pointer transition-all duration-200 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400"
        @click="handleLogout"
      >
        Sair
      </button>

      <button
        type="button"
        :class="[
          'px-4 py-2 rounded-lg text-rocket-gray-600 dark:text-rocket-gray-300 bg-transparent',
          'border border-rocket-gray-200 dark:border-rocket-gray-800 cursor-pointer',
          'transition-all duration-200 font-medium',
          'hover:bg-rocket-gray-50 dark:hover:bg-rocket-gray-800',
          'hover:text-rocket-purple-500 dark:hover:text-rocket-purple-400',
          { 'ml-auto': !isAuthenticated },
        ]"
        @click="toggleTheme"
      >
        {{ isDark ? 'Modo Claro' : 'Modo Escuro' }}
      </button>
    </div>
  </header>
</template>

<script lang="ts">
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/authStore'
import { Rocket } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import MenuItem from './MenuItem.vue'

export default {
  name: 'NavBar',
  components: {
    MenuItem,
    Rocket,
  },
  setup() {
    const { isDark, toggleTheme } = useTheme()
    const authStore = useAuthStore()

    const { isAuthenticated, userName: username } = storeToRefs(authStore)

    const handleLogout = () => {
      authStore.logout()
    }

    return {
      isDark,
      toggleTheme,
      isAuthenticated,
      username,
      handleLogout,
    }
  },
}
</script>
