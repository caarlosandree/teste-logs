import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Play, Square, Activity, Zap, TrendingUp, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useLogStatus } from '@/hooks/queries'
import { useStartLogs, useStopLogs, useUpdateLogRate } from '@/hooks/mutations'
import { updateRateSchema, type UpdateRateFormData } from '@/schemas/logSchema'
import { LogsPerSecondChart } from './LogsPerSecondChart'
import { cn } from '@/lib/utils'

export const LogController = () => {
  const { data: status, isLoading: statusLoading } = useLogStatus()
  const startMutation = useStartLogs()
  const stopMutation = useStopLogs()
  const updateRateMutation = useUpdateLogRate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateRateFormData>({
    resolver: zodResolver(updateRateSchema),
    defaultValues: {
      rate_per_second: 2000,
    },
  })

  // Atualiza o valor do formulário quando o status muda
  useEffect(() => {
    if (status?.rate_per_second) {
      reset({ rate_per_second: status.rate_per_second })
    }
  }, [status?.rate_per_second, reset])

  const currentRate = watch('rate_per_second')

  const onSubmit = async (data: UpdateRateFormData) => {
    try {
      await updateRateMutation.mutateAsync(data)
      reset({ rate_per_second: data.rate_per_second })
    } catch (error) {
      console.error('Erro ao atualizar taxa:', error)
    }
  }

  const handleStart = async () => {
    try {
      await startMutation.mutateAsync()
    } catch (error) {
      console.error('Erro ao iniciar logs:', error)
    }
  }

  const handleStop = async () => {
    try {
      await stopMutation.mutateAsync()
    } catch (error) {
      console.error('Erro ao parar logs:', error)
    }
  }

  const isRunning = status?.is_running || false
  const rate = status?.rate_per_second || currentRate || 2000
  const totalLogs = status?.total_logs || 0

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 relative z-10 space-y-8">
      {/* Header Stats & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Control Panel */}
          <Card className="p-6 space-y-6 overflow-hidden relative shadow-xl border">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full pointer-events-none" />
            
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Play className="h-4 w-4 text-blue-500" />
                Controle de Geração
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie o fluxo de logs em tempo real.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleStart} 
                disabled={isRunning || startMutation.isPending}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-0 shadow-lg hover:shadow-emerald-600/40 transition-all duration-200 h-12 font-semibold"
              >
                <Play className="mr-2 h-4 w-4" /> 
                {startMutation.isPending ? 'Iniciando...' : 'Iniciar'}
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleStop}
                disabled={!isRunning || stopMutation.isPending}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-lg hover:shadow-red-600/40 transition-all duration-200 h-12 font-semibold"
              >
                <Square className="mr-2 h-4 w-4" /> 
                {stopMutation.isPending ? 'Parando...' : 'Parar'}
              </Button>
            </div>

            {startMutation.isError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {startMutation.error instanceof Error
                    ? startMutation.error.message
                    : 'Erro ao iniciar logs'}
                </AlertDescription>
              </Alert>
            )}

            {stopMutation.isError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {stopMutation.error instanceof Error
                    ? stopMutation.error.message
                    : 'Erro ao parar logs'}
                </AlertDescription>
              </Alert>
            )}
          </Card>

          {/* Rate Config */}
          <Card className="p-6 shadow-xl border">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Taxa de Disparo
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Ajuste a quantidade de logs por segundo.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="relative group">
                <Input 
                  type="number" 
                  {...register('rate_per_second', {
                    valueAsNumber: true,
                  })}
                  min={1}
                  max={10000}
                  className="pr-16 font-mono text-lg transition-all focus:border-blue-500 h-12"
                  placeholder="2000"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground text-sm">
                  logs/s
                </div>
              </div>
              {errors.rate_per_second && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.rate_per_second.message}
                </p>
              )}
              <Button 
                type="submit" 
                variant="outline" 
                className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 h-12"
                disabled={updateRateMutation.isPending}
              >
                {updateRateMutation.isPending ? 'Atualizando...' : 'Atualizar Taxa'}
              </Button>
              {updateRateMutation.isError && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {updateRateMutation.error instanceof Error
                      ? updateRateMutation.error.message
                      : 'Erro ao atualizar taxa'}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </Card>
        </div>

        {/* Right Column: Analytics (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center text-center py-6 border shadow-lg">
              <div className={cn("p-3 rounded-full mb-3 transition-colors duration-500", isRunning ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-muted text-muted-foreground")}>
                <Activity className={cn("h-6 w-6", isRunning && "animate-pulse")} />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Status Atual</p>
              <h4 className={cn("text-xl font-bold mt-1", isRunning ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                {isRunning ? 'Em Execução' : 'Parado'}
              </h4>
            </Card>

            <Card className="p-4 flex flex-col items-center justify-center text-center py-6 border shadow-lg">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-3">
                <Zap className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Taxa Definida</p>
              <h4 className="text-xl font-bold mt-1 tabular-nums">
                {rate.toLocaleString('pt-BR')} <span className="text-xs text-muted-foreground font-normal">logs/s</span>
              </h4>
            </Card>

            <Card className="p-4 flex flex-col items-center justify-center text-center py-6 border shadow-lg">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 mb-3">
                <Zap className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Total Gerado</p>
              <h4 className="text-xl font-bold mt-1 tabular-nums">
                {totalLogs.toLocaleString('pt-BR')}
              </h4>
            </Card>
          </div>

          {/* Chart Area */}
          <LogsPerSecondChart />
        </div>
      </div>
    </div>
  )
}
