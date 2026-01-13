.PHONY: help build run test lint fmt clean deps install-tools

# Variáveis
APP_NAME=server
MAIN_PATH=./cmd/server
BUILD_DIR=./bin
BINARY_NAME=$(BUILD_DIR)/$(APP_NAME)

# Cores para output
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(GREEN)Comandos disponíveis:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

build: ## Compila o servidor
	@echo "$(GREEN)Compilando servidor...$(NC)"
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BINARY_NAME) $(MAIN_PATH)
	@echo "$(GREEN)✓ Servidor compilado em $(BINARY_NAME)$(NC)"

run: ## Executa o servidor
	@echo "$(GREEN)Executando servidor...$(NC)"
	@go run $(MAIN_PATH)

test: ## Executa os testes
	@echo "$(GREEN)Executando testes...$(NC)"
	@go test -v ./...

test-coverage: ## Executa testes com cobertura
	@echo "$(GREEN)Executando testes com cobertura...$(NC)"
	@go test -v -coverprofile=coverage.out ./...
	@go tool cover -html=coverage.out -o coverage.html
	@echo "$(GREEN)✓ Relatório de cobertura gerado em coverage.html$(NC)"

lint: ## Executa o linter (golangci-lint)
	@echo "$(GREEN)Executando linter...$(NC)"
	@if command -v golangci-lint >/dev/null 2>&1; then \
		golangci-lint run; \
	else \
		echo "$(YELLOW)⚠ golangci-lint não encontrado. Instale com: make install-tools$(NC)"; \
	fi

fmt: ## Formata o código
	@echo "$(GREEN)Formatando código...$(NC)"
	@go fmt ./...
	@gofmt -w .
	@echo "$(GREEN)✓ Código formatado$(NC)"

fmt-check: ## Verifica se o código está formatado
	@echo "$(GREEN)Verificando formatação...$(NC)"
	@if [ $$(gofmt -l . | wc -l) -ne 0 ]; then \
		echo "$(RED)✗ Código não está formatado. Execute: make fmt$(NC)"; \
		gofmt -l .; \
		exit 1; \
	else \
		echo "$(GREEN)✓ Código está formatado$(NC)"; \
	fi

clean: ## Remove arquivos gerados
	@echo "$(GREEN)Limpando arquivos gerados...$(NC)"
	@rm -rf $(BUILD_DIR)
	@rm -f coverage.out coverage.html
	@rm -rf logs/*.log
	@echo "$(GREEN)✓ Limpeza concluída$(NC)"

deps: ## Baixa dependências
	@echo "$(GREEN)Baixando dependências...$(NC)"
	@go mod download
	@go mod tidy
	@echo "$(GREEN)✓ Dependências atualizadas$(NC)"

deps-verify: ## Verifica integridade das dependências
	@echo "$(GREEN)Verificando integridade das dependências...$(NC)"
	@go mod verify
	@echo "$(GREEN)✓ Dependências verificadas$(NC)"

install-tools: ## Instala ferramentas de desenvolvimento
	@echo "$(GREEN)Instalando ferramentas de desenvolvimento...$(NC)"
	@go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	@echo "$(GREEN)✓ Ferramentas instaladas$(NC)"

check: fmt-check lint test ## Executa todas as verificações (fmt, lint, test)
	@echo "$(GREEN)✓ Todas as verificações passaram$(NC)"

dev: run ## Alias para run (executa o servidor)

all: clean deps fmt lint test build ## Executa limpeza, dependências, formatação, lint, testes e build
