import { storage } from '@/utils/storage'
import axios, { AxiosError, isAxiosError, type AxiosResponse } from 'axios'

const DEFAULT_UNAUTHORIZED_MESSAGE = 'Usuário e/ou senha inválidos!'

export class AuthError extends Error {
  readonly isAuthError = true as const
  readonly response?: AxiosResponse

  constructor(message: string, response?: AxiosResponse) {
    super(message)
    this.name = 'AuthError'
    this.response = response
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError
}

function getMessageFromResponse(
  response: AxiosResponse | undefined,
  fallback: string,
): string {
  const data = response?.data
  if (
    data &&
    typeof data === 'object' &&
    'message' in data &&
    typeof (data as { message: unknown }).message === 'string'
  ) {
    return (data as { message: string }).message
  }
  return fallback
}

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = storage.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      storage.remove('token')
      storage.remove('user')

      const message = getMessageFromResponse(error.response, DEFAULT_UNAUTHORIZED_MESSAGE)
      return Promise.reject(new AuthError(message, error.response))
    }

    return Promise.reject(error)
  },
)
