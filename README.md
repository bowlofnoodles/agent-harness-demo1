# Agent Harness Demo

A React frontend project built with harness engineering principles — designed so AI coding agents work effectively within well-defined constraints, feedback loops, and verification systems.

The app is a simple **Task Board** where you can add tasks, move them through statuses (To Do → In Progress → Done), and delete them.

## Tech Stack

- **Framework**: React 19 + TypeScript (strict mode)
- **Build**: Vite 8
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with typescript-eslint + react-hooks + react-refresh
- **Git Hooks**: Husky + lint-staged (pre-commit runs lint)

## Getting Started

```bash
npm install
npm run dev
```

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Type-check + production build
npm run typecheck    # TypeScript type checking only
npm run lint         # ESLint
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run verify       # Full pipeline: typecheck → lint → test
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui primitives (generated — do not hand-edit)
│   └── layout/       # Layout components (header, etc.)
├── pages/            # Page-level components (one per route/view)
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── lib/              # Utility functions
└── test/             # Test setup and shared test utilities
```

## Architecture Rules

1. **Component hierarchy**: `pages/` → `components/` → `components/ui/`. Never import upward.
2. **shadcn/ui components** (`src/components/ui/`): Add via `npx shadcn@latest add <component>`. Do not hand-edit these files.
3. **Path aliases**: Always use `@/` imports (e.g., `@/components/ui/button`), never relative paths crossing directories.
4. **Type safety**: TypeScript strict mode is on. No `any` types, no `@ts-ignore`.
5. **State management**: Use React's built-in state (`useState`, `useReducer`, `useContext`).
6. **Styling**: Use Tailwind utility classes only. No CSS modules or inline style objects.

## Docs

See [`docs/harness-engineering.md`](docs/harness-engineering.md) for the full harness engineering principles behind this project.
