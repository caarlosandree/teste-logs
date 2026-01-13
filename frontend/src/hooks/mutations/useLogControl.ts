import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logService } from '@/services/logService'
import type { UpdateRateRequest } from '@/types/Log'

export const useStartLogs = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logService.start(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs', 'status'] })
    },
  })
}

export const useStopLogs = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logService.stop(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs', 'status'] })
    },
  })
}

export const useUpdateLogRate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateRateRequest) => logService.updateRate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs', 'status'] })
    },
  })
}
