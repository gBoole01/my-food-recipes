# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

French-language dietary recipe recommendation app. Backend exposes profile/recipes/shopping-list endpoints; an agentic layer (LangChain + Gemini) queries a tagged internal recipe corpus to propose recipes and generate a consolidated shopping list scaled to headcount. Product backlog (Épics 1–3, in French) lives in `TODO.MD` — read it before picking up any `EP*` ticket.

## Workspace layout (pnpm)

- `apps/api` — NestJS + TypeORM, Postgres (local via `docker-compose`, Supabase in production)
- `apps/web` — Next.js (App Router), Tailwind CSS, React 19
- `packages/contracts` — shared Zod schemas (`@my-food-recipes/contracts`); this is the **source of truth** for the active API contract (recipes, shopping-list, profile). The `chat.dto.ts` / chat flow is legacy reference code from an earlier conversational-onboarding design, superseded by the wizard onboarding in Épic 2, and is not wired to the shared contract.

## Commands

Run from repo root unless noted.

```bash
pnpm install
docker-compose up -d          # Postgres on :5432 (food_recipes db, postgres/postgres)
pnpm dev:api                  # apps/api, NestJS watch mode, :3000
pnpm dev:web                  # apps/web, next dev, :3001
pnpm build                    # build all workspaces
pnpm lint                     # lint all workspaces
```

Backend (`apps/api`):
```bash
pnpm --filter api test                  # jest unit tests
pnpm --filter api test -- <pattern>     # single test file/suite
pnpm --filter api test:watch
pnpm --filter api test:e2e              # jest-e2e.json config
pnpm --filter api test:cov
pnpm --filter api seed:recipes          # ts-node scripts/seed-recipes.ts
```

Frontend (`apps/web`) defaults to `NEXT_PUBLIC_USE_MOCKS=true`, letting the full UI flow (accueil → chat → recettes → liste de courses) run without a live backend.

Env: copy `apps/api/.env.example` → `apps/api/.env` (`DATABASE_URL`, `GEMINI_API_KEY`, `GEMINI_MODEL`) and `apps/web/.env.example` → `apps/web/.env.local`.

## Architecture notes

- `apps/api/src/app.module.ts` wires `TypeOrmModule.forRootAsync` against `DATABASE_URL` with `synchronize: true` outside production and `autoLoadEntities: true` — new TypeORM entities just need `@Entity()` + module registration, no manual entity-array edits.
- `apps/api/src/agents/dietitian-agent/` is the only feature module so far: `conversation.service.ts` (chat/legacy), `recipe-recommendation.service.ts`, `recipe-repository.service.ts`, `shopping-list.service.ts`, fronted by `dietitian-agent.controller.ts`. New domain modules should follow this one-module-per-domain pattern (controllers route only, services hold logic) per Épic 1's planned `profile`, `meals`, etc. modules.
- `apps/api/seeds/CORGIS Food Dataset.csv` is the raw USDA/CORGIS nutrition source for Épic 1 ETL work (`EP1.1`); `apps/api/seeds/Fruits et légumes mensuels.pdf` backs the ADEME seasonality data (`EP1.3`). `apps/api/data/recipes.json` + `scripts/seed-recipes.ts` is the existing recipe-corpus seeding path.
- `packages/contracts/src/recipe.schema.ts` defines the current `RecipeSchema`/`NutritionSchema`/`IngredientSchema` — Épic 1 nutrition/ingredient work should extend or supersede these rather than duplicating shapes elsewhere.
- The shopping-list and recipe flows in `apps/web` consume `packages/contracts` types directly (`apps/web/src/api/*.ts`); the chat flow under `apps/web/src/app/chat` and `components/chat/` is the legacy reference UI mentioned above.
