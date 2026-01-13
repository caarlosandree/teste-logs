import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './theme/theme-context'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 hover:bg-card"
      aria-label="Alternar tema"
      title="Alternar entre tema claro e escuro"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 dark:text-amber-400" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-500 dark:text-indigo-400" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
