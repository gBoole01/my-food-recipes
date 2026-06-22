# My Food Recipes — Fullstack

Application française de recommandation de recettes diététiques : un backend NestJS expose le profil/recettes/liste de courses, un frontend Next.js guide l'utilisateur de l'accueil à la liste de courses.

## Structure (pnpm workspace)

```
apps/
  api/                 NestJS + TypeORM, Postgres en dev / Supabase en production
  web/                 Next.js (App Router), Tailwind CSS
packages/
  contracts/           Schémas Zod partagés (recipes, shopping-list, profile) — source de vérité du contrat API actif
```

Voir `TODO.md` pour le backlog produit complet (Épics 1 à 3).

## Prérequis

- Node.js ≥ 20
- pnpm
- Docker (pour Postgres en local)

## Installation

```bash
pnpm install
```

## Configuration

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

`apps/api/.env` attend `DATABASE_URL` (Postgres local via `docker-compose up -d`, ou la chaîne de connexion Supabase en production) et les clés `GEMINI_API_KEY`/`GEMINI_MODEL`.

## Lancement en développement

```bash
docker-compose up -d        # Postgres local
pnpm dev:api                 # backend sur :3000
pnpm dev:web                  # frontend sur :3001 (next dev)
```

Le frontend démarre avec `NEXT_PUBLIC_USE_MOCKS=true` par défaut, ce qui permet de tester tout le parcours (accueil → chat → recettes → liste de courses) sans backend réel.

## Notes d'architecture

- Le flux de chat (collecte de profil conversationnelle) est conservé comme code de référence : il a été remplacé dans le backlog produit par un wizard d'onboarding structuré (voir `TODO.md`, Épic 2). Il n'est pas branché sur le contrat partagé.
- Les flux recettes et liste de courses sont la partie active : leurs requêtes/réponses suivent les schémas de `packages/contracts`.
