<template>
  <header
    class="bg-white/90 dark:bg-rocket-gray-900/90 backdrop-blur border-b border-rocket-gray-200 dark:border-rocket-gray-800 sticky top-0 z-40"
  >
    <div class="max-w-7xl mx-auto flex items-center gap-3 px-4 sm:px-6 py-3">
      <router-link
        :to="isAuthenticated ? '/tasks' : '/login'"
        class="flex items-center gap-2 shrink-0"
        aria-label="Ir para o início"
      >
        <Rocket class="w-7 h-7 text-rocket-purple-500" />
        <span class="hidden sm:inline font-bold text-rocket-gray-900 dark:text-white">
          RocketTasks
        </span>
      </router-link>

      <span
        v-if="isAuthenticated"
        class="hidden md:inline truncate max-w-[12rem] text-rocket-gray-700 dark:text-rocket-gray-300 font-medium"
      >
        Olá, {{ username }}
      </span>

      <nav class="hidden md:flex items-center gap-2 ml-auto">
        <template v-if="!isAuthenticated">
          <MenuItem redirect-to="/login" title="Login" />
          <MenuItem redirect-to="/register" title="Cadastre-se" />
        </template>
        <MenuItem v-else redirect-to="/tasks" title="Tarefas" />

        <button
          type="button"
          :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
          :title="isDark ? 'Modo claro' : 'Modo escuro'"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg text-rocket-gray-600 dark:text-rocket-gray-300 border border-rocket-gray-200 dark:border-rocket-gray-700 hover:bg-rocket-gray-50 dark:hover:bg-rocket-gray-800 hover:text-rocket-purple-500 dark:hover:text-rocket-purple-400 transition-colors"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </button>

        <button
          v-if="isAuthenticated"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-rocket-gray-600 dark:text-rocket-gray-300 border border-rocket-gray-200 dark:border-rocket-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          @click="handleLogout"
        >
          <LogOut class="w-4 h-4" />
          Sair
        </button>
      </nav>

      <div class="flex md:hidden items-center gap-2 ml-auto">
        <button
          type="button"
          :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg text-rocket-gray-600 dark:text-rocket-gray-300 border border-rocket-gray-200 dark:border-rocket-gray-700 hover:bg-rocket-gray-50 dark:hover:bg-rocket-gray-800 transition-colors"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Abrir menu"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg text-rocket-gray-600 dark:text-rocket-gray-300 border border-rocket-gray-200 dark:border-rocket-gray-700 hover:bg-rocket-gray-50 dark:hover:bg-rocket-gray-800 transition-colors"
          @click="toggleMenu"
        >
          <X v-if="isMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <nav
        v-if="isMenuOpen"
        id="mobile-menu"
        class="md:hidden border-t border-rocket-gray-200 dark:border-rocket-gray-800 bg-white dark:bg-rocket-gray-900"
      >
        <div class="px-4 py-3 space-y-2">
          <p
            v-if="isAuthenticated"
            class="px-3 pt-1 pb-2 text-sm text-rocket-gray-500 dark:text-rocket-gray-400"
          >
            Olá, <span class="font-semibold">{{ username }}</span>
          </p>

          <template v-if="!isAuthenticated">
            <MenuItem redirect-to="/login" title="Login" full-width @click="closeMenu" />
            <MenuItem redirect-to="/register" title="Cadastre-se" full-width @click="closeMenu" />
          </template>
          <MenuItem v-else redirect-to="/tasks" title="Tarefas" full-width @click="closeMenu" />

          <button
            v-if="isAuthenticated"
            type="button"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            @click="handleLogoutMobile"
          >
            <LogOut class="w-4 h-4" />
            Sair
          </button>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script lang="ts">
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/authStore'
import { LogOut, Menu, Moon, Rocket, Sun, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MenuItem from './MenuItem.vue'

export default {
  name: 'NavBar',
  components: {
    MenuItem,
    Rocket,
    Sun,
    Moon,
    Menu,
    X,
    LogOut,
  },
  setup() {
    const { isDark, toggleTheme } = useTheme()
    const authStore = useAuthStore()
    const route = useRoute()

    const { isAuthenticated, userName: username } = storeToRefs(authStore)
    const isMenuOpen = ref(false)

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    const closeMenu = () => {
      isMenuOpen.value = false
    }

    const handleLogout = () => {
      authStore.logout()
    }

    const handleLogoutMobile = () => {
      closeMenu()
      authStore.logout()
    }

    watch(
      () => route.fullPath,
      () => {
        closeMenu()
      },
    )

    return {
      isDark,
      toggleTheme,
      isAuthenticated,
      username,
      isMenuOpen,
      toggleMenu,
      closeMenu,
      handleLogout,
      handleLogoutMobile,
    }
  },
}
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
