import { AuthError } from '@/services/api'
import { authService } from '@/services/authService'
import { storage } from '@/utils/storage'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

interface AuthUser {
  id: string | number
  username: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  userId: number
  username: string
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(storage.get('token') ?? null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value)
  const userName = computed(() => user.value?.username ?? '')

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)
      token.value = response.token

      user.value = {
        id: response.userId,
        username: response.username,
      }

      storage.set('token', response.token)
      storage.set('user', JSON.stringify(user.value))

      router.push('/tasks')

      return response
    } catch (err) {
      if (err instanceof AuthError) {
        error.value = err.message
        throw err
      }

      if (err instanceof AxiosError) {
        error.value = err.response?.data?.message ?? 'Erro ao fazer o login'
      } else {
        error.value = 'Erro ao fazer o login'
      }

      console.error('Erro ao fazer login', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.register(credentials)
      token.value = response.token
      user.value = {
        id: response.userId,
        username: response.username,
      }

      storage.set('token', response.token)
      storage.set('user', JSON.stringify(user.value))

      router.push('/tasks')

      return response
    } catch (err) {
      if (err instanceof AuthError) {
        error.value = err.message
        throw err
      }

      if (err instanceof AxiosError) {
        error.value = err.response?.data?.message ?? 'Erro ao criar conta'
      } else {
        error.value = 'Erro ao criar conta'
      }

      console.error('Erro ao criar conta:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = (): void => {
    token.value = null
    user.value = null
    error.value = null
    storage.remove('token')
    storage.remove('user')
    router.push('/login')
  }

  const checkAuth = () => {
    const savedToken = storage.get('token')
    const savedUser = storage.get('user')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser) as AuthUser
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    currentUser,
    isLoading,
    hasError,
    userName,
    login,
    checkAuth,
    register,
    logout,
  }
})
