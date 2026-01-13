import api from '@/lib/axios'
import type {
  LogStatusResponse,
  UpdateRateRequest,
  UpdateRateResponse,
} from '@/types/Log'

export const logService = {
  start: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/logs/start')
    return response.data
  },

  stop: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/logs/stop')
    return response.data
  },

  getStatus: async (): Promise<LogStatusResponse> => {
    const response = await api.get<LogStatusResponse>('/logs/status')
    return response.data
  },

  updateRate: async (
    data: UpdateRateRequest
  ): Promise<UpdateRateResponse> => {
    const response = await api.put<UpdateRateResponse>('/logs/rate', data)
    return response.data
  },
}
