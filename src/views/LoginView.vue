<template>
  <div
    :class="[
      'min-h-[calc(100vh-4rem)] flex items-center justify-center',
      'py-8 sm:py-12 px-4 sm:px-6 lg:px-8',
    ]"
  >
    <div class="max-w-md w-full space-y-6 sm:space-y-8">
      <div class="text-center">
        <div class="flex justify-center items-center gap-2 mb-5 sm:mb-6">
          <Rocket class="w-8 h-8 text-rocket-purple-500" />
          <h1 class="text-2xl sm:text-3xl font-bold text-rocket-gray-900 dark:text-white">
            RocketTasks
          </h1>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-rocket-gray-900 dark:text-white">
          Entre na sua conta
        </h2>
        <p class="mt-2 text-sm text-rocket-gray-600 dark:text-rocket-gray-400">
          Ou
          <router-link
            to="/register"
            :class="[
              'font-medium text-rocket-purple-500 hover:text-rocket-purple-600',
              'dark:text-rocket-purple-400 dark:hover:text-rocket-purple-300 transition-colors',
            ]"
          >
            crie uma nova conta
          </router-link>
        </p>
      </div>

      <form
        class="space-y-5 sm:space-y-6 bg-white dark:bg-rocket-gray-800 p-5 sm:p-8 rounded-xl border border-rocket-gray-200 dark:border-rocket-gray-700 shadow-sm"
        @submit.prevent="handleLogin"
      >
        <div class="space-y-4">
          <div>
            <label for="username" class="sr-only">Usuário</label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
              >
                <User class="h-5 w-5 text-rocket-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                v-model="form.username"
                type="text"
                required
                autocomplete="username"
                placeholder="Digite o nome do seu usuário"
                :class="[
                  'block w-full pl-10 pr-3 py-3 border border-rocket-gray-300',
                  'dark:border-rocket-gray-700 placeholder-rocket-gray-400 dark:placeholder-rocket-gray-500',
                  'text-rocket-gray-900 dark:text-white rounded-lg bg-white dark:bg-rocket-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-rocket-purple-500 focus:border-rocket-purple-500 transition-colors',
                ]"
              />
            </div>
          </div>

          <div>
            <label for="password" class="sr-only">Senha</label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
              >
                <Lock class="h-5 w-5 text-rocket-gray-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="Digite a sua senha"
                :class="[
                  'block w-full pl-10 pr-12 py-3 border border-rocket-gray-300',
                  'dark:border-rocket-gray-700 placeholder-rocket-gray-400 dark:placeholder-rocket-gray-500',
                  'text-rocket-gray-900 dark:text-white rounded-lg bg-white dark:bg-rocket-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-rocket-purple-500 focus:border-rocket-purple-500 transition-colors',
                ]"
              />
              <button
                type="button"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-rocket-gray-400 hover:text-rocket-gray-600 dark:hover:text-rocket-gray-300 transition-colors"
                @click="togglePasswordVisibility"
              >
                <Eye v-if="showPassword" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            :class="[
              'w-full inline-flex items-center justify-center gap-2 py-3 px-4',
              'border border-transparent text-sm font-medium rounded-lg text-white',
              'bg-rocket-purple-500 hover:bg-rocket-purple-600 active:bg-rocket-purple-700',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rocket-purple-500',
              'dark:focus:ring-offset-rocket-gray-800',
              'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
            ]"
          >
            <LogIn class="w-5 h-5" />
            Entrar
          </button>
        </div>
      </form>

      <div
        v-if="authStore.error"
        role="alert"
        class="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 p-4 text-center font-medium rounded-lg"
      >
        <p>{{ authStore.error }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Eye, EyeOff, Lock, LogIn, Rocket, User } from 'lucide-vue-next'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'LoginView',
  components: {
    Lock,
    Rocket,
    User,
    Eye,
    EyeOff,
    LogIn,
  },
  setup() {
    const loading = ref(false)
    const showPassword = ref(false)
    const authStore = useAuthStore()

    const form = ref({
      username: '',
      password: '',
    })

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const handleLogin = async () => {
      try {
        await authStore.login({ username: form.value.username, password: form.value.password })
      } catch (error) {
        console.log('Erro capturado', error)
      }
    }

    return {
      form,
      loading,
      showPassword,
      togglePasswordVisibility,
      handleLogin,
      authStore,
    }
  },
}
</script>
