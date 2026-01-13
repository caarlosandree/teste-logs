import { useQuery } from '@tanstack/react-query'
import { healthService } from '@/services/healthService'
import type { HealthResponse } from '@/types/Log'

export const useHealth = () => {
  return useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: healthService.check,
    refetchInterval: 10000, // Atualiza a cada 10 segundos (reduzido de 5s)
    staleTime: 5000, // Considera os dados stale após 5 segundos
    refetchOnWindowFocus: false, // Não refaz ao focar na janela
  })
}
