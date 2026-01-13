package service

import (
	"context"
	"fmt"
	"math/rand"
	"sync"
	"sync/atomic"
	"time"

	"teste-logs/backend/pkg/logger"

	"go.uber.org/zap"
)

type LogGeneratorService interface {
	Start(ctx context.Context, ratePerSecond int) error
	Stop() error
	UpdateRate(ctx context.Context, ratePerSecond int) error
	GetStatus() LogGeneratorStatus
}

type LogGeneratorStatus struct {
	IsRunning     bool
	TotalLogs     int64
	RatePerSecond int
}

type logGeneratorService struct {
	mu            sync.RWMutex
	isRunning     bool
	totalLogs     int64
	ratePerSecond int
	cancelFunc    context.CancelFunc
	currentCtx    context.Context
	logger        *zap.Logger
}

func NewLogGeneratorService() LogGeneratorService {
	return &logGeneratorService{
		logger: logger.GetLogger(),
	}
}

func (s *logGeneratorService) Start(ctx context.Context, ratePerSecond int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.isRunning {
		return nil
	}

	newCtx, cancel := context.WithCancel(ctx)
	s.cancelFunc = cancel
	s.currentCtx = newCtx
	s.isRunning = true
	s.ratePerSecond = ratePerSecond
	atomic.StoreInt64(&s.totalLogs, 0)

	if s.logger != nil {
		s.logger.Info("Iniciando geração de logs",
			zap.Int("rate_per_second", ratePerSecond),
		)
	}

	go s.generateLogs(newCtx, ratePerSecond)

	return nil
}

func (s *logGeneratorService) UpdateRate(ctx context.Context, ratePerSecond int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if ratePerSecond <= 0 {
		return fmt.Errorf("taxa deve ser maior que zero")
	}

	if ratePerSecond > 10000 {
		return fmt.Errorf("taxa máxima permitida é 10000 logs por segundo")
	}

	if !s.isRunning {
		s.ratePerSecond = ratePerSecond
		return nil
	}

	newCtx, cancel := context.WithCancel(ctx)
	oldCancel := s.cancelFunc
	s.cancelFunc = cancel
	s.currentCtx = newCtx
	oldRatePerSecond := s.ratePerSecond
	s.ratePerSecond = ratePerSecond

	if oldCancel != nil {
		oldCancel()
	}

	go s.generateLogs(newCtx, ratePerSecond)

	s.logger.Info("Taxa de logs atualizada",
		zap.Int("taxa_anterior", oldRatePerSecond),
		zap.Int("taxa_nova", ratePerSecond),
	)

	return nil
}

func (s *logGeneratorService) Stop() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if !s.isRunning {
		return nil
	}

	if s.cancelFunc != nil {
		s.cancelFunc()
	}

	s.isRunning = false
	s.cancelFunc = nil
	s.currentCtx = nil

	return nil
}

func (s *logGeneratorService) GetStatus() LogGeneratorStatus {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return LogGeneratorStatus{
		IsRunning:     s.isRunning,
		TotalLogs:     atomic.LoadInt64(&s.totalLogs),
		RatePerSecond: s.ratePerSecond,
	}
}

func (s *logGeneratorService) generateLogs(ctx context.Context, ratePerSecond int) {
	const numWorkers = 10
	logsPerWorkerPerSecond := ratePerSecond / numWorkers

	if logsPerWorkerPerSecond <= 0 {
		logsPerWorkerPerSecond = 1
	}

	interval := time.Second / time.Duration(logsPerWorkerPerSecond)

	if interval <= 0 {
		interval = time.Millisecond
	}

	if s.logger != nil {
		s.logger.Info("Iniciando workers de geração de logs",
			zap.Int("rate_per_second", ratePerSecond),
			zap.Int("num_workers", numWorkers),
			zap.Int("logs_per_worker", logsPerWorkerPerSecond),
			zap.Duration("interval", interval),
		)
	}

	var wg sync.WaitGroup
	wg.Add(numWorkers)

	for i := 0; i < numWorkers; i++ {
		go func(workerID int) {
			defer wg.Done()
			ticker := time.NewTicker(interval)
			defer ticker.Stop()

			for {
				select {
				case <-ctx.Done():
					return
				case <-ticker.C:
					s.writeLog(workerID)
				}
			}
		}(i)
	}

	wg.Wait()
}

func (s *logGeneratorService) writeLog(workerID int) {
	if s.logger == nil {
		return
	}

	levels := []string{"info", "debug", "warn", "error"}
	messages := []string{
		"Processando requisição",
		"Operação concluída com sucesso",
		"Aviso: operação pode demorar",
		"Erro ao processar dados",
		"Cache atualizado",
		"Validação de dados realizada",
		"Transação iniciada",
		"Transação finalizada",
	}

	level := levels[rand.Intn(len(levels))]
	message := messages[rand.Intn(len(messages))]
	userID := rand.Intn(1000) + 1
	requestID := rand.Int63n(1000000)

	logEntry := s.logger.With(
		zap.Int("worker_id", workerID),
		zap.String("level", level),
		zap.Int("user_id", userID),
		zap.Int64("request_id", requestID),
		zap.String("message", message),
		zap.Time("timestamp", time.Now()),
	)

	switch level {
	case "info":
		logEntry.Info(message)
	case "debug":
		logEntry.Debug(message)
	case "warn":
		logEntry.Warn(message)
	case "error":
		logEntry.Error(message)
	}

	atomic.AddInt64(&s.totalLogs, 1)
}
