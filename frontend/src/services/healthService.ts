import api from '@/lib/axios'
import type { HealthResponse } from '@/types/Log'

export const healthService = {
  check: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>('/health')
    return response.data
  },
}
