# RocketTasks

Aplicação de gerenciamento de tarefas construída com **Vue 3 + TypeScript + Vite**, com autenticação por token, modo escuro persistido e interface responsiva.

> Projeto de estudo construído seguindo a identidade visual da Rocketseat (paleta roxa/cinzas), explorando Composition API, Pinia, Vue Router e Tailwind CSS v4.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração do backend](#configuração-do-backend)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Arquitetura](#arquitetura)
- [Tema (Light / Dark)](#tema-light--dark)
- [Responsividade](#responsividade)
- [Convenções de código](#convenções-de-código)
- [Testes](#testes)
- [Roadmap](#roadmap)

---

## Funcionalidades

- Autenticação (login e cadastro) com persistência de token em `localStorage`
- Listagem de tarefas separadas em **Pendentes** e **Concluídas**
- Criação, edição inline (duplo clique) e exclusão com modal de confirmação
- Marcar como concluída / reabrir tarefa
- **Drag & drop** entre as listas para alterar o status
- Modal de confirmação acessível (`role="dialog"`, ESC para fechar, foco gerenciado)
- **Modo escuro** com detecção automática via `prefers-color-scheme` e persistência
- Interface **responsiva** (mobile-first) com menu hambúrguer e bottom-sheet em telas pequenas
- Indicador de erro contextual nas requisições
- Interceptor HTTP que injeta o token e trata `401` globalmente

---

## Stack

| Camada              | Tecnologia                                       |
| ------------------- | ------------------------------------------------ |
| Framework           | [Vue 3](https://vuejs.org/) (Options + Composition API) |
| Linguagem           | [TypeScript](https://www.typescriptlang.org/)    |
| Build               | [Vite](https://vite.dev/)                        |
| Estado              | [Pinia](https://pinia.vuejs.org/)                |
| Roteamento          | [Vue Router](https://router.vuejs.org/)          |
| Estilização         | [Tailwind CSS v4](https://tailwindcss.com/)      |
| HTTP                | [Axios](https://axios-http.com/)                 |
| Ícones              | [lucide-vue-next](https://lucide.dev/)           |
| Testes unitários    | [Vitest](https://vitest.dev/) + `@vue/test-utils`|
| Testes E2E          | [Cypress](https://www.cypress.io/)               |
| Lint / Format       | ESLint, Oxlint, Prettier                         |

---

## Pré-requisitos

- **Node.js** `^20.19.0 || >=22.12.0`
- **npm** (vem com Node) ou outro package manager compatível
- Um backend HTTP servindo a API em `http://localhost:3000/api` (ver [Configuração do backend](#configuração-do-backend))

---

## Instalação

```bash
git clone <url-do-repositorio>
cd vue-tasks
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

---

## Configuração do backend

O cliente HTTP está apontado para `http://localhost:3000/api` em `src/services/api.ts`. A API consumida deve expor os endpoints abaixo:

### Autenticação

| Método | Endpoint            | Body                                  | Resposta                                       |
| ------ | ------------------- | ------------------------------------- | ---------------------------------------------- |
| POST   | `/auth/login`       | `{ username, password }`              | `{ token, userId, username }`                  |
| POST   | `/auth/register`    | `{ username, password }`              | `{ token, userId, username }`                  |

### Tarefas (rotas autenticadas — `Authorization: Bearer <token>`)

| Método | Endpoint       | Body                          | Resposta                |
| ------ | -------------- | ----------------------------- | ----------------------- |
| GET    | `/tasks`       | —                             | `Task[]`                |
| POST   | `/tasks`       | `{ title, completed }`        | `Task`                  |
| PUT    | `/tasks/:id`   | `{ title?, completed? }`      | `Task`                  |
| DELETE | `/tasks/:id`   | —                             | `204 No Content`        |

```ts
interface Task {
  id: number
  title: string
  completed: boolean
}
```

Qualquer resposta `401` faz com que o token e o usuário sejam removidos do `localStorage` automaticamente.

---

## Scripts disponíveis

| Script               | Descrição                                                              |
| -------------------- | ---------------------------------------------------------------------- |
| `npm run dev`        | Inicia o servidor de desenvolvimento com HMR                           |
| `npm run build`      | Roda `type-check` + build de produção                                  |
| `npm run preview`    | Pré-visualiza o build de produção                                      |
| `npm run type-check` | Verifica os tipos com `vue-tsc`                                        |
| `npm run lint`       | Executa Oxlint e ESLint (com `--fix`)                                  |
| `npm run format`     | Formata `src/` com Prettier                                            |
| `npm run test:unit`  | Executa os testes unitários com Vitest                                 |
| `npm run test:e2e`   | Build + servidor + testes E2E com Cypress (recomendado para CI)        |
| `npm run test:e2e:dev` | Servidor dev + Cypress aberto em modo interativo                     |

---

## Estrutura de pastas

```
src/
├── assets/                # base.css e main.css (Tailwind + tema)
├── components/
│   ├── ConfirmModal.vue   # modal genérico de confirmação
│   ├── MenuItem.vue       # link de navegação (router-link estilizado)
│   ├── NavBar.vue         # cabeçalho com menu mobile
│   └── task/
│       ├── TaskForm.vue   # formulário de criação
│       ├── TaskItem.vue   # item individual (toggle/edit/delete/drag)
│       └── TaskList.vue   # lista (pendentes ou concluídas)
├── composables/
│   └── useTheme.ts        # gerencia o tema dark/light
├── router/
│   └── index.ts           # rotas: /login, /register, /tasks
├── services/
│   ├── api.ts             # instância do Axios + interceptors + AuthError
│   ├── authService.ts     # chamadas a /auth/*
│   └── tasksService.ts    # chamadas a /tasks/*
├── stores/
│   ├── authStore.ts       # estado de autenticação
│   └── tasksStore.ts      # estado das tarefas, drag&drop, modal
├── utils/
│   └── storage.ts         # wrapper seguro para localStorage
├── views/
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   └── TasksView.vue
├── App.vue
└── main.ts
```

---

## Arquitetura

### Fluxo de autenticação

1. O usuário envia credenciais em `LoginView`/`RegisterView`.
2. `authStore.login()` chama `authService` → `POST /auth/login`.
3. Em sucesso, token e usuário são salvos em `localStorage` via `storage` e a rota é trocada para `/tasks`.
4. Em `main.ts`, `authStore.checkAuth()` restaura a sessão a cada carregamento da página.
5. O interceptor de `request` em `api.ts` injeta `Authorization: Bearer <token>` em todas as requisições.
6. O interceptor de `response` captura `401`, limpa o storage e propaga um `AuthError` tipado.

### Fluxo de tarefas

- `tasksStore` mantém `tasks`, `loading`, `error`, e estado auxiliar de UI (`editingTaskId`, `draggedTaskId`, `dragOverTarget`, `showDeleteModal`, `taskToDelete`).
- Computed `pendingTasks` / `completedTasks` particionam a lista.
- `handleDrop(taskId, targetDone)` é chamado pelo `TaskList` ao soltar um item em uma zona; se o status mudou, dispara `toggleTask`.
- O fluxo de exclusão segue: `openDeleteModal(id)` → `ConfirmModal` → `confirmDelete()` → `deleteTask(id)`. O `confirmDelete` tem guard contra cliques duplos (`loading.value`) e mantém o modal aberto em caso de erro para o usuário poder tentar novamente.

---

## Tema (Light / Dark)

O tema é controlado por uma classe `dark` no `<html>`, aplicada por um pequeno script inline em `index.html` **antes** do app montar — o que evita o "flash" de tema errado no carregamento.

- A preferência do usuário fica em `localStorage` com a chave `theme`.
- Sem preferência salva, respeita-se o `prefers-color-scheme` do sistema.
- A `<meta name="theme-color">` é declarada por `prefers-color-scheme` para que a barra do navegador acompanhe o tema.
- O Tailwind v4 é configurado com `@custom-variant dark (&:where(.dark, .dark *))` em `src/assets/main.css`, junto com a paleta `rocket-*` (roxa, verde, cinzas).

Para alternar manualmente, use o botão de sol/lua no `NavBar`.

---

## Responsividade

Layout **mobile-first** usando os breakpoints padrão do Tailwind:

- `< 640px` (mobile): menu hambúrguer, `TaskForm` empilhado, `ConfirmModal` exibido como bottom-sheet, botões com área de toque ≥ 40×40.
- `≥ 640px` (sm/desktop): navegação horizontal, `TaskForm` em linha, modal centralizado.

Estados auxiliares de drag & drop são acessíveis via teclado/leitor de tela e respeitam `prefers-reduced-motion`.

---

## Convenções de código

- Componentes em `.vue` com `<script lang="ts">` no estilo Options API + `setup()`.
- Imports absolutos via alias `@` apontando para `src/` (definido em `vite.config.ts` e `tsconfig.app.json`).
- Stores Pinia no estilo **setup store** (composables).
- Formatação automática com Prettier (configuração em `.prettierrc.json`).
- Lint com Oxlint (regras rápidas) + ESLint (regras Vue/TS) — execute `npm run lint` antes do commit.
- `vue-tsc` deve passar sem erros (`npm run type-check`).

---

## Testes

### Unitários

```bash
npm run test:unit
```

Os testes ficam em `src/**/__tests__/` e usam Vitest com ambiente `jsdom`.

### End-to-end

```bash
# modo interativo (abre o Cypress)
npm run test:e2e:dev

# modo headless (recomendado em CI; usa o build de produção)
npm run build
npm run test:e2e
```

Specs em `cypress/e2e/`.

---

## Roadmap

Ideias para próximas iterações:

- [ ] Filtro/busca por título da tarefa
- [ ] Ordenação manual com persistência da ordem
- [ ] Reativar o token ao detectar mudança de aba (`storage` event)
- [ ] Internacionalização (pt-BR / en)
- [ ] Cobertura de testes (unit + E2E) sobre o fluxo de tarefas

---

## Licença

Projeto de estudo, sem licença formal definida. Sinta-se à vontade para usá-lo como referência.
