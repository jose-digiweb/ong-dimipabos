# AGENTS.md

## Overview

- This is a Next.js 15 App Router site for DI MI PA BÔS, deployed to Cloudflare Workers via `@opennextjs/cloudflare`.
- Prefer concise, focused changes that preserve the current Portuguese copy and existing visual patterns.
- Reuse established components and utilities before introducing new abstractions.

## Commands

- Install dependencies with `bun install`.
- Start local development with `bun run dev`.
- Run a production build with `bun run build`.
- Preview locally with Cloudflare Workers runtime: `bun run preview`.
- Deploy to Cloudflare Workers: `bun run deploy`.
- Generate Cloudflare binding types: `bun run cf-typegen` (requires real `database_id` in `wrangler.jsonc`).
- Run linting with `bun run lint`.
- Format the repo with `bun run format`.
- `bun run format:check` is read-only: it runs `oxfmt --check` and exits non-zero if any file would change.
- Database workflow:
  - `bun run db:generate` — generate Drizzle migration SQL from schema changes.
  - `bun run db:migrate:local -- --file=drizzle/<file>.sql` — apply migration to local D1.
  - `bun run db:migrate:remote -- --file=drizzle/<file>.sql` — apply migration to remote D1.
  - `bun run db:studio` — open Drizzle Studio (requires `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, `CLOUDFLARE_D1_TOKEN`).
- There is currently no test script or test suite in this repo. Validate with the smallest relevant command plus manual route checks when needed.

## Project Structure

- `app/`: App Router pages, layouts, and route handlers.
- `components/`: shared UI and feature components.
- `components/ui/`: reusable primitives built around the local button/form/input patterns.
- `components/cta/` and `components/heroSection/`: reusable homepage section building blocks.
- `lib/data.ts`: static project content used by the `projetos` pages.
- `lib/db/`: Drizzle schema, connection setup, and repository classes.
- `lib/r2-images.ts`: R2 image listing via native Cloudflare binding.
- `drizzle/`: generated SQL migrations (dialect: SQLite / D1).
- `assets/`: local static assets.
- `wrangler.jsonc`: Cloudflare Workers configuration (D1 binding `DB`, R2 binding `R2_BUCKET`, assets binding `ASSETS`).
- `open-next.config.ts`: OpenNext Cloudflare adapter config.
- `cloudflare-env.d.ts`: Cloudflare binding type declarations (regenerate with `bun run cf-typegen`).

## Conventions

- TypeScript is strict; use the existing `@/*` path alias.
- Formatting uses tabs, single quotes, and no semicolons through oxfmt (`.oxfmtrc.json`). Linting uses oxlint (`.oxlintrc.json`).
- File naming is intentionally mixed in the current codebase. Match the local pattern instead of renaming files for consistency.
- Tailwind v4 and the shared UI primitives are the default styling path. Prefer existing tokens, variants, and helpers over ad hoc patterns.
- Use `cn` from `lib/utils.ts` and existing `Button` variants before introducing new utility wrappers.
- Keep user-facing text in Portuguese unless the surrounding file clearly uses another language.

## Editing Patterns

- Pages in `app/` are mostly composition-oriented server components. Prefer assembling existing sections over adding local state to route files.
- Pages that use Cloudflare bindings (D1, R2) must export `export const dynamic = 'force-dynamic'` or be server-rendered routes.
- Forms are client components built with `react-hook-form`, `zod`, and the shared primitives in `components/ui/form.tsx`.
- When extending a form, wire the full submit flow deliberately. Some current forms are UI-only or have stub handlers.
- The dynamic project page under `app/projetos/[slug]/page.tsx` currently reads from `lib/data.ts`; do not assume project content is database-backed.
- For database work, update `lib/db/schema.ts`, generate the appropriate Drizzle migration, and keep query logic inside repository classes under `lib/db/repositories/`.
- Prefer repository methods over raw DB access from pages or components.
- Access the database via `getDb()` from `lib/db/index.ts` (uses React `cache()` for per-request deduplication). Never import the global `db` directly — it no longer exists.
- Access R2 images via `getR2Images()` from `lib/r2-images.ts` (uses native R2 binding).

## Environment And Pitfalls

- `lib/db/index.ts` uses `getCloudflareContext()` — do not import DB modules from client components.
- `drizzle.config.ts` requires `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, and `CLOUDFLARE_D1_TOKEN` for Drizzle Studio and remote migrations.
- `lib/r2-images.ts` uses the `R2_BUCKET` binding and `R2_PUBLIC_URL` env var for public image URLs. Set `R2_PUBLIC_URL` to your R2 public bucket URL (e.g. `https://pub-<hash>.r2.dev`) after enabling public access on the bucket in the Cloudflare dashboard.
- `wrangler.jsonc` has a `database_id` placeholder — run `bunx wrangler d1 create dimipabos` and replace it before deploying.
- If you add a new remote image host, update `next.config.ts` `remotePatterns`.
- The README is still the default Next.js template and does not document project-specific setup. Infer behavior from the code and scripts instead.

## Validation Guidance

- After narrow UI changes, prefer `bun run lint` or `bun run build` if the touched area could affect routing or types.
- For DB changes, validate the schema and migration commands you changed, but avoid unrelated migration churn.
- Do not run broad formatting unless the task requires it, because formatter scripts may rewrite unrelated files.
