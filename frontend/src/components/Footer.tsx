import { Github, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

export const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn("border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 mt-auto", className)}>
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <span>© {currentYear} Nina Logs.</span>
          <span className="hidden sm:inline">Feito com</span>
          <Heart className="h-3 w-3 text-red-500 fill-current inline mx-1" />
          <span className="hidden sm:inline">para o João.</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/caarlosandree/teste-logs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors flex items-center gap-2"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
