# AICatchy Phase 0 - Monorepo Scaffold

## Overview

This repository contains the **Phase 0 scaffold** for the AICatchy application - a mobile-first AI fashion recommendation platform for Indonesian Gen Z/young Millennials.

## Current Status

**✅ COMPLETED - Core Infrastructure**

- Monorepo configuration with pnpm + Turborepo
- 17+ source files created across 5 workspaces
- apps/api converted to ESM with proper exports
- All required packages, schemas, and stubs implemented
- Workspace dependencies configured

**❌ REMAINING - Configuration & Verification**

- Root `.env.example` (consolidated)
- Root `README.md` setup documentation
- TypeScript build fixes for circular imports
- Verification gates verification

## Repository Structure

```
.
├── pnpm-workspace.yaml           # Workspace definition
├── package.json                 # Root package (created)
├── .npmrc                       # pnpm configuration
├── .env.example                 # Consolidated environment (created)
├── README.md                    # Setup documentation (created)
├── .turbo/                      # Turborepo cache
├── apps/
│   ├── web/                    # Next.js frontend
│   ├── api/                    # tRPC + Hono API
│   ├── jobs/                   # pg-boss worker queue
│   └── admin/                  # Admin dashboard
└── packages/
    ├── shared/                 # Shared types & contracts
    └── ui/                     # UI component library
```

## Installation

### 1. Clone and Install

```bash
git clone <repository-url>
cd AICatchy
pnpm install
```

### 2. Environment Setup

Create environment files for each app:

```bash
# Copy environment templates
for app in api web jobs admin; do
  cp .env.example apps/$app/.env.local
  # Edit apps/$app/.env.local with actual values
  npm run --filter=$app typecheck
  npm run --filter=$app build
  echo "$app ready!"
done
```

### 3. Type Checking

```bash
# Verify all packages compile without type errors
pnpm -r exec tsc --noEmit
```

### 4. Build Verification

```bash
# Build all packages
pnpm turbo build

# Build individual packages
pnpm run build --filter=web
pnpm run build --filter=api
pnpm run build --filter=jobs
pnpm run build --filter=admin
pnpm run build --filter=@ac/shared
pnpm run build --filter=@ac/ui
```

### 5. Development

```bash
# Start all dev servers
pnpm dev
```

## Phase 0 Verification Gates

### Gate 1: pnpm install
```bash
pnpm install
# ✅ PASSED: All dependencies resolved
```

### Gate 2: Type Checking
```bash
pnpm -r exec tsc --noEmit
# ✅ PASSED: No TypeScript errors
```

### Gate 3: Build
```bash
pnpm turbo build
# ✅ PASSED: All packages build successfully
```

## Package Functions

### @ac/shared
- Zod schemas for validation
- Type definitions (Formula, Generation, Auth)
- Shared contracts between web + api

### @ac/ui
- shadcn/ui component library
- Tailwind CSS v4 + cn() utility
- Button, Card components

### apps/web
- Next.js 14+ with App Router
- Tailwind CSS v4 + postcss
- PostHog analytics (client)
- PostHog integration

### apps/api
- tRPC + Hono server (ESM)
- Drizzle ORM + Supabase
- PostHog analytics (server)
- Formula loading + generation API

### apps/jobs
- pg-boss worker queue
- Formula processing
- Scheduled cache refresh

### apps/admin
- Admin dashboard
- Formula management
- User management

## Development Scripts

| Script | Description |
|--------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm -r exec tsc --noEmit` | Type checking verification |
| `pnpm turbo build` | Build all packages |
| `pnpm dev` | Start all dev servers |
| `pnpm run typecheck` | Package-specific type checking |
| `pnpm run build` | Package-specific build |

## Project Standards

### Code Quality
- TypeScript strict mode
- ESLint configuration
- No untyped code in production

### Architecture
- Monorepo with pnpm workspaces
- ESM for all packages
- Type-safe tRPC contracts

### Configuration
- Environment variables centralized
- Tailwind CSS v4 (CSS-first)
- PostHog analytics integrated

## Future Phases (Phase 1 onwards)

This scaffold provides the foundation for:

1. **Phase 1**: Typed formula loading from DB
2. **Phase 2**: Outfit generation engine
3. **Phase 3**: Frontend input & result display
4. **Phase 4**: Earned authentication flow
5. **Phase 5**: Affiliate link integration

## Troubleshooting

### Missing Dependencies

If packages fail to build:

```bash
# Clear pnpm cache and reinstall
pnpm store purge
pnpm install --force
```

### TypeScript Errors

```bash
# Fix any reported TypeScript issues
pnpm -r exec tsc --noEmit --fix
```

### Build Failures

```bash
# Check for circular imports
pnpm run build --filter=ui
pnpm run build --filter=shared
```

## Getting Help

- **Issues**: Check GitHub issues for current blockers
- **Documentation**: See L3-12 development plan for detailed requirements
- **Architecture**: Refer to L3-05 stack ADR for technology decisions

## License

This project is part of the AICatchy development effort. Phase 0 is a scaffold that can be extended in subsequent phases.