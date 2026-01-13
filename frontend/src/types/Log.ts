export interface LogStatusResponse {
  is_running: boolean
  total_logs: number
  rate_per_second: number
}

export interface UpdateRateRequest {
  rate_per_second: number
}

export interface UpdateRateResponse {
  message: string
  rate_per_second: number
}

export interface HealthResponse {
  status: string
}

export interface ErrorResponse {
  error: string
}
