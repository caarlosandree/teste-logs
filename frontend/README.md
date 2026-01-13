# Nina Logs - Frontend

Sistema moderno de controle e monitoramento de logs em tempo real.

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework UI com React Compiler para otimizações automáticas
- **TypeScript** - Tipagem estática para maior segurança no código
- **Vite** - Build tool ultra-rápido com rolldown-vite experimental
- **Tailwind CSS** - Framework de estilização utilitário
- **shadcn/ui** - Componentes UI modernos e acessíveis
- **React Hook Form + Zod** - Formulários com validação robusta
- **TanStack Query** - Gerenciamento de estado servidor e cache
- **Zustand** - Estado global client-side
- **Axios** - Cliente HTTP com interceptors
- **Recharts** - Visualização de dados e gráficos
- **Lucide React** - Ícones modernos

## ✨ Features

- 🎨 **Design Moderno** - Interface intuitiva com tema claro/escuro
- 📊 **Monitoramento em Tempo Real** - Gráficos atualizados dinamicamente
- 🚀 **Performance** - Otimizado com React Compiler
- 📱 **Responsivo** - Funciona perfeitamente em todos dispositivos
- ♿ **Acessível** - Componentes com suporte a leitores de tela
- 🌙 **Tema Adaptativo** - Suporte a modo claro/escuro/sistema

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Lint
npm run lint

# Type checking
npm run typecheck
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes UI
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── LogController.tsx
│   ├── LogsPerSecondChart.tsx
│   ├── Footer.tsx
│   └── theme-provider.tsx
├── hooks/              # Hooks customizados
│   ├── mutations/      # Hooks de mutação
│   └── queries/        # Hooks de consulta
├── lib/                # Utilitários
├── providers/          # Context providers
├── schemas/            # Schemas de validação
├── services/           # Serviços de API
├── stores/             # Zustand stores
└── types/              # Tipos TypeScript
```

## 🎨 Customização

### Cores do Tema

As cores estão definidas em `src/index.css` utilizando CSS custom properties:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... */
}
```

### Componentes

Os componentes seguem o padrão shadcn/ui e podem ser customizados através de classes Tailwind:

```tsx
import { Button } from '@/components/ui/button'

<Button className="bg-custom hover:bg-custom-hover">
  Custom Button
</Button>
```

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## 📊 Gráficos

O projeto utiliza Recharts para visualização de dados. O gráfico de logs por segundo é atualizado automaticamente a cada segundo quando os logs estão em execução.

## 🔄 Estado Global

O estado é gerenciado com:
- **Zustand** para estado client-side
- **TanStack Query** para estado servidor
- **React Context** para tema e configurações

## 🚀 Deploy

O build de produção gera arquivos estáticos otimizados na pasta `dist/`.

```bash
npm run build
npm run preview
```

## 📝 Licença

MIT License