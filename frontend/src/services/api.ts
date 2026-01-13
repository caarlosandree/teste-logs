import api from '@/lib/axios'
import type { ApiResponse } from '@/types'

export const apiService = {
  get: async <T>(url: string): Promise<T> => {
    const response = await api.get<ApiResponse<T>>(url)
    return response.data.data
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.post<ApiResponse<T>>(url, data)
    return response.data.data
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.put<ApiResponse<T>>(url, data)
    return response.data.data
  },

  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.patch<ApiResponse<T>>(url, data)
    return response.data.data
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<ApiResponse<T>>(url)
    return response.data.data
  },
}
