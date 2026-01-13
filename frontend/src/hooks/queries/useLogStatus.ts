import { useQuery } from '@tanstack/react-query'
import { logService } from '@/services/logService'
import type { LogStatusResponse } from '@/types/Log'

export const useLogStatus = () => {
  return useQuery<LogStatusResponse>({
    queryKey: ['logs', 'status'],
    queryFn: logService.getStatus,
    refetchInterval: 2000, // Atualiza a cada 2 segundos (reduzido de 1s)
    staleTime: 1000, // Considera os dados stale após 1 segundo
    refetchOnWindowFocus: false, // Não refaz ao focar na janela
  })
}
