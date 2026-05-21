import type { AuthResponse } from '@/stores/authStore'
import { api } from './api'

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userId: string | number
  username: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials)
    return response.data
  },

  async register(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials)
    return response.data
  },
}
