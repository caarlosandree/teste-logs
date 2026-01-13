package dto

type LogStatusResponse struct {
	IsRunning     bool  `json:"is_running"`
	TotalLogs     int64 `json:"total_logs"`
	RatePerSecond int   `json:"rate_per_second"`
}

type UpdateRateRequest struct {
	RatePerSecond int `json:"rate_per_second" validate:"required,min=1,max=10000"`
}

type UpdateRateResponse struct {
	Message       string `json:"message"`
	RatePerSecond int    `json:"rate_per_second"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type HealthResponse struct {
	Status string `json:"status"`
}
