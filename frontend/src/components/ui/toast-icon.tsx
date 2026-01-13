import { AlertCircle, CheckCircle2, Info } from "lucide-react"

export const getToastIcon = (variant: string) => {
  switch (variant) {
    case "destructive":
      return <AlertCircle className="h-5 w-5" />
    case "success":
      return <CheckCircle2 className="h-5 w-5" />
    case "warning":
      return <AlertCircle className="h-5 w-5" />
    case "info":
      return <Info className="h-5 w-5" />
    default:
      return null
  }
}
