package handler

import (
	"context"
	"net/http"

	"teste-logs/backend/internal/dto"
	"teste-logs/backend/internal/service"

	"github.com/labstack/echo/v4"
)

type LogHandler struct {
	logGeneratorService service.LogGeneratorService
	ratePerSecond       int
}

func NewLogHandler(logGeneratorService service.LogGeneratorService, ratePerSecond int) *LogHandler {
	return &LogHandler{
		logGeneratorService: logGeneratorService,
		ratePerSecond:       ratePerSecond,
	}
}

func (h *LogHandler) StartLogGeneration(c echo.Context) error {
	status := h.logGeneratorService.GetStatus()

	if status.IsRunning {
		return c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: "Geração de logs já está em execução",
		})
	}

	ctx := context.Background()
	err := h.logGeneratorService.Start(ctx, h.ratePerSecond)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Erro ao iniciar geração de logs",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Geração de logs iniciada",
	})
}

func (h *LogHandler) StopLogGeneration(c echo.Context) error {
	err := h.logGeneratorService.Stop()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Erro ao parar geração de logs",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Geração de logs parada",
	})
}

func (h *LogHandler) GetLogStatus(c echo.Context) error {
	status := h.logGeneratorService.GetStatus()

	response := dto.LogStatusResponse{
		IsRunning:     status.IsRunning,
		TotalLogs:     status.TotalLogs,
		RatePerSecond: status.RatePerSecond,
	}

	return c.JSON(http.StatusOK, response)
}

func (h *LogHandler) UpdateLogRate(c echo.Context) error {
	var req dto.UpdateRateRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: "Formato de requisição inválido",
		})
	}

	if req.RatePerSecond <= 0 {
		return c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: "Taxa deve ser maior que zero",
		})
	}

	if req.RatePerSecond > 10000 {
		return c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: "Taxa máxima permitida é 10000 logs por segundo",
		})
	}

	ctx := context.Background()
	err := h.logGeneratorService.UpdateRate(ctx, req.RatePerSecond)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: err.Error(),
		})
	}

	response := dto.UpdateRateResponse{
		Message:       "Taxa de logs atualizada com sucesso",
		RatePerSecond: req.RatePerSecond,
	}

	return c.JSON(http.StatusOK, response)
}

func (h *LogHandler) HealthCheck(c echo.Context) error {
	response := dto.HealthResponse{
		Status: "ok",
	}

	return c.JSON(http.StatusOK, response)
}
