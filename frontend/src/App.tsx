import { QueryProvider } from '@/providers/QueryProvider'
import { LogController } from '@/components/LogController'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Footer } from '@/components/Footer'
import { Zap, Server, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useHealth } from '@/hooks/queries'

function Navbar() {
  const { data: health, isLoading: healthLoading } = useHealth()
  const isBackendOnline = health?.status === 'ok'

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg shadow-blue-600/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">Nina Logs</h1>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-1.5 py-0.5 rounded bg-muted">
              Dashboard V2
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border">
            <Server className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Backend:</span>
            {healthLoading ? (
              <LoadingSpinner size="sm" />
            ) : isBackendOnline ? (
              <Badge variant="success" className="h-5 px-1.5 gap-1">
                <CheckCircle2 className="h-3 w-3" /> Online
              </Badge>
            ) : (
              <Badge variant="destructive" className="h-5 px-1.5 gap-1">
                <AlertCircle className="h-3 w-3" /> Offline
              </Badge>
            )}
          </div>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="logs-ui-theme">
      <QueryProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 transition-colors duration-300 flex flex-col">
          {/* Background Gradients */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2" />
          </div>
          
          {/* Navbar */}
          <Navbar />
          
          {/* Main content */}
          <main className="flex-1 relative z-10">
            <LogController />
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </QueryProvider>
    </ThemeProvider>
  )
}

export default App
