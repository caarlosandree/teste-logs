import { useEffect, useState, useRef } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { useLogStatus } from '@/hooks/queries'
import { Activity } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-context'

interface DataPoint {
  time: string
  logs: number
  total: number
}

export const LogsPerSecondChart = () => {
  const { data: status } = useLogStatus()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [data, setData] = useState<DataPoint[]>([])
  const previousTotalLogsRef = useRef<number>(0)
  const previousTimeRef = useRef<number>(0)
  const intervalRef = useRef<number | null>(null)
  const wasRunningRef = useRef<boolean>(false)

  useEffect(() => {
    if (!status) return

    // Limpa dados quando para
    if (wasRunningRef.current && !status.is_running) {
      setTimeout(() => {
        setData([])
        previousTotalLogsRef.current = 0
        previousTimeRef.current = 0
      }, 0)
    }

    wasRunningRef.current = status.is_running

    // Limpa intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Se não está rodando, não cria intervalo
    if (!status.is_running) {
      return
    }

    // Inicializa se necessário
    if (previousTotalLogsRef.current === 0) {
      previousTotalLogsRef.current = status.total_logs
      previousTimeRef.current = Date.now()
    } else if (previousTimeRef.current === 0) {
      previousTimeRef.current = Date.now()
    }

    // Atualiza a cada segundo
    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const timeDiff = (now - previousTimeRef.current) / 1000 // em segundos

      if (timeDiff >= 1 && previousTotalLogsRef.current >= 0) {
        const logsDiff = status.total_logs - previousTotalLogsRef.current
        const logsPerSecond = Math.max(0, Math.round(logsDiff / timeDiff))

        setData((prev) => {
          const newData = [
            ...prev,
            {
              time: new Date(now).toLocaleTimeString('pt-BR'),
              logs: logsPerSecond,
              total: status.total_logs,
            },
          ]

          // Mantém apenas os últimos 30 pontos (30 segundos)
          return newData.slice(-30)
        })

        previousTimeRef.current = now
        previousTotalLogsRef.current = status.total_logs
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [status])

  const isRunning = status?.is_running || false

  return (
    <Card className="p-6 h-[400px] flex flex-col border shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold">Monitoramento em Tempo Real</h3>
          <p className="text-sm text-muted-foreground">Volume de logs por segundo (últimos 30s)</p>
        </div>
        {isRunning && (
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold animate-pulse">
            <span className="h-2 w-2 rounded-full bg-emerald-500 block"></span>
            AO VIVO
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl mb-4 border border-blue-200/50 dark:border-blue-700/50">
              <Activity className="h-12 w-12 text-blue-500 dark:text-blue-400 animate-pulse" />
            </div>
            <p className="text-lg font-semibold">Aguardando dados...</p>
            <p className="text-sm mt-1">Inicie a geração de logs para visualizar</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={isDark ? "#1e293b" : "#e2e8f0"} 
              />
              <XAxis 
                dataKey="time" 
                hide={true}
              />
              <YAxis 
                stroke={isDark ? "#475569" : "#94a3b8"}
                tick={{fill: isDark ? "#475569" : "#64748b", fontSize: 12}}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  borderColor: isDark ? '#1e293b' : '#e2e8f0',
                  borderRadius: '8px',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  backdropFilter: 'blur(8px)',
                }}
                itemStyle={{ color: '#3b82f6' }}
                labelStyle={{ color: isDark ? '#94a3b8' : '#64748b', marginBottom: '4px' }}
                formatter={(value: number | undefined) =>
                  value !== undefined ? [`${value} logs/s`, 'Taxa'] : ['', '']
                }
                labelFormatter={(label) => `Hora: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="logs" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorLogs)" 
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
