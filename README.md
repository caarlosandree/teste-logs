# Nina Logs - Dashboard de Monitoramento de Logs

Uma aplicação full-stack para geração e monitoramento de logs em tempo real, construída com Go no backend e React/TypeScript no frontend.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Stack Tecnológico](#stack-tecnológico)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Executando a Aplicação](#executando-a-aplicação)
- [Funcionalidades](#funcionalidades)
- [API Endpoints](#api-endpoints)
- [Desenvolvimento](#desenvolvimento)
  - [Scripts Úteis](#scripts-úteis)
  - [Lint e Formatação](#lint-e-formatação)
  - [Testes](#testes)
- [Configuração](#configuração)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Visão Geral

O Nina Logs é uma plataforma de monitoramento de logs que permite:
- Gerar logs em tempo real com taxa configurável
- Monitorar o status do sistema através de uma interface web moderna
- Controlar a geração de logs (iniciar/parar/ajustar taxa)
- Visualizar métricas e gráficos de performance
- Dashboard responsivo com tema claro/escuro

## 🛠 Stack Tecnológico

### Backend
- **Go 1.25.4** - Linguagem de programação
- **Echo v4** - Framework HTTP
- **Zap** - Logging estruturado de alta performance
- **Viper** - Gerenciamento de configurações

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** (com rolldown-vite) - Build tool
- **Tailwind CSS** - Framework de estilização
- **shadcn/ui** - Componentes UI
- **TanStack Query** - Gerenciamento de estado servidor
- **React Hook Form + Zod** - Formulários e validação
- **Zustand** - Gerenciamento de estado cliente
- **Recharts** - Visualização de dados
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
teste-logs/
├── backend/                 # Backend Go
│   ├── cmd/
│   │   └── server/
│   │       └── main.go      # Ponto de entrada
│   ├── internal/
│   │   ├── config/          # Configurações
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── handler/         # Handlers HTTP
│   │   └── service/         # Lógica de negócio
│   ├── pkg/
│   │   └── logger/          # Logger customizado
│   ├── logs/                # Arquivos de log
│   ├── go.mod               # Dependências Go
│   └── Makefile             # Scripts de automação
├── frontend/                # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   │   └── ui/          # Componentes shadcn/ui
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # Serviços de API
│   │   ├── types/           # Tipos TypeScript
│   │   └── schemas/         # Schemas Zod
│   ├── public/              # Assets estáticos
│   ├── package.json         # Dependências npm
│   └── vite.config.ts       # Configuração Vite
└── README.md                # Este arquivo
```

## ✅ Pré-requisitos

- **Go 1.25.4** ou superior
- **Node.js 18** ou superior
- **npm** ou **yarn**
- **Git**

## 🚀 Instalação e Configuração

### Backend

1. Navegue até o diretório do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
go mod download
```

3. Copie o arquivo de ambiente (se necessário):
```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente no arquivo `.env`:
```env
SERVER_PORT=8080
LOG_LEVEL=info
LOG_FILE_PATH=logs/app.log
LOG_RATE_PER_SECOND=10
```

### Frontend

1. Navegue até o diretório do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo de ambiente (se necessário):
```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente no arquivo `.env`:
```env
VITE_API_URL=http://localhost:8080
```

## 🏃 Executando a Aplicação

### Opção 1: Executar ambos os serviços

Em terminais separados:

**Terminal 1 - Backend:**
```bash
cd backend
make run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Opção 2: Usando Makefile (Backend)

O backend possui um Makefile com comandos úteis:

```bash
make help          # Mostra todos os comandos disponíveis
make run           # Executa o servidor
make build         # Compila o binário
make test          # Executa os testes
make lint          # Executa o linter
make fmt           # Formata o código
make clean         # Limpa arquivos gerados
```

### Acessando a Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/api/v1/health

## ⚡ Funcionalidades

### Backend
- ✅ Servidor HTTP REST API
- ✅ Geração de logs configurável
- ✅ Endpoints de controle (start/stop/rate)
- ✅ Health check
- ✅ Logging estruturado
- ✅ CORS configurado
- ✅ Graceful shutdown

### Frontend
- ✅ Dashboard moderno e responsivo
- ✅ Controle de geração de logs
- ✅ Monitoramento em tempo real
- ✅ Gráficos de visualização
- ✅ Tema claro/escuro
- ✅ Indicador de status do backend
- ✅ Interface otimizada com React Compiler

## 📡 API Endpoints

### Logs Control
- `POST /api/v1/logs/start` - Inicia geração de logs
- `POST /api/v1/logs/stop` - Para geração de logs
- `PUT /api/v1/logs/rate` - Atualiza taxa de geração
- `GET /api/v1/logs/status` - Status atual da geração

### System
- `GET /api/v1/health` - Health check do sistema

### Exemplo de Resposta

```json
{
  "status": "ok",
  "timestamp": "2024-01-12T15:30:00Z"
}
```

## 🛠 Desenvolvimento

### Scripts Úteis

#### Backend
```bash
make dev            # Executa em modo desenvolvimento
make test           # Executa testes unitários
make test-coverage  # Executa testes com cobertura
make lint           # Verifica código com golangci-lint
make fmt            # Formata código Go
make clean          # Limpa build e logs
```

#### Frontend
```bash
npm run dev         # Servidor de desenvolvimento
npm run build       # Build para produção
npm run preview     # Preview do build
npm run lint        # Verifica código com ESLint
npm run typecheck   # Verifica tipos TypeScript
```

### Lint e Formatação

#### Backend
- **golangci-lint** para análise de código
- **gofmt** para formatação automática
- Execute `make fmt` antes de commits

#### Frontend
- **ESLint** para análise de código
- **TypeScript** para verificação de tipos
- **Prettier** configurado via ESLint

### Testes

#### Backend
```bash
make test              # Executa todos os testes
make test-coverage     # Gera relatório de cobertura
```

#### Frontend
```bash
npm run test           # Executa testes (quando implementados)
npm run test:coverage  # Gera cobertura de testes
```

## ⚙️ Configuração

### Backend Variáveis de Ambiente

| Variável | Descrição | Default |
|----------|-----------|---------|
| `SERVER_PORT` | Porta do servidor HTTP | `8080` |
| `LOG_LEVEL` | Nível do log (debug, info, warn, error) | `info` |
| `LOG_FILE_PATH` | Caminho do arquivo de log | `logs/app.log` |
| `LOG_RATE_PER_SECOND` | Taxa inicial de geração de logs | `10` |

### Frontend Variáveis de Ambiente

| Variável | Descrição | Default |
|----------|-----------|---------|
| `VITE_API_URL` | URL da API do backend | `http://localhost:8080` |

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Regras de Commit

Este projeto segue o padrão de Conventional Commits:
- `feat:` novas funcionalidades
- `fix:` correções de bugs
- `docs:` documentação
- `style:` formatação, semântica
- `refactor:` refatoração
- `test:` testes
- `chore:` manutenção

## 📝 Notas Adicionais

### Performance
- O backend utiliza goroutines para geração concorrente de logs
- O frontend implementa React Compiler para otimização automática
- Cache configurado para requisições frequentes

### Segurança
- CORS configurado para domínios específicos
- Validação de inputs em todos os endpoints
- Sem exposição de dados sensíveis no frontend

### Monitoramento
- Logs estruturados com contexto
- Métricas de performance disponíveis
- Health check para monitoramento de saúde

## 📄 Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ usando Go, React e TypeScript**
