package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"

	"teste-logs/backend/internal/config"
	"teste-logs/backend/internal/handler"
	"teste-logs/backend/internal/service"
	"teste-logs/backend/pkg/logger"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		fmt.Printf("Erro ao carregar configuração: %v\n", err)
		os.Exit(1)
	}

	err = logger.InitLogger(cfg.Log.Level, cfg.Log.FilePath)
	if err != nil {
		fmt.Printf("Erro ao inicializar logger: %v\n", err)
		os.Exit(1)
	}
	defer logger.Logger.Sync()

	logger.Logger.Info("Iniciando servidor",
		zap.String("port", cfg.Server.Port),
		zap.String("log_level", cfg.Log.Level),
		zap.Int("log_rate_per_second", cfg.LogGenerator.RatePerSecond),
	)

	logGeneratorService := service.NewLogGeneratorService()
	logHandler := handler.NewLogHandler(logGeneratorService, cfg.LogGenerator.RatePerSecond)

	e := echo.New()
	e.Use(middleware.Recover())
	
	// Middleware de logging com filtro para rotas de polling
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Skipper: func(c echo.Context) bool {
			// Não loga requisições de health check e status (polling frequente)
			uri := c.Request().RequestURI
			return uri == "/api/v1/health" || uri == "/api/v1/logs/status"
		},
	}))
	
	// Configuração de CORS com cache de preflight
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.OPTIONS},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: true,
		MaxAge:           86400, // Cache preflight por 24 horas
	}))

	setupRoutes(e, logHandler)

	go func() {
		if err := e.Start(":" + cfg.Server.Port); err != nil && err != http.ErrServerClosed {
			logger.Logger.Fatal("Erro ao iniciar servidor", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	logger.Logger.Info("Encerrando servidor...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := e.Shutdown(ctx); err != nil {
		logger.Logger.Fatal("Erro ao encerrar servidor", zap.Error(err))
	}

	logGeneratorService.Stop()

	logger.Logger.Info("Servidor encerrado")
}

func setupRoutes(e *echo.Echo, logHandler *handler.LogHandler) {
	v1 := e.Group("/api/v1")
	{
		logs := v1.Group("/logs")
		{
			logs.POST("/start", logHandler.StartLogGeneration)
			logs.POST("/stop", logHandler.StopLogGeneration)
			logs.PUT("/rate", logHandler.UpdateLogRate)
			logs.GET("/status", logHandler.GetLogStatus)
		}

		v1.GET("/health", logHandler.HealthCheck)
	}
}
