# AGENTS.md

## Overview

- This is a Next.js 15 App Router site for DI MI PA BÔS.
- Prefer concise, focused changes that preserve the current Portuguese copy and existing visual patterns.
- Reuse established components and utilities before introducing new abstractions.

## Commands

- Install dependencies with `bun install`.
- Start local development with `bun run dev`.
- Run a production build with `bun run build`.
- Run linting with `bun run lint`.
- Format the repo with `bun run format`.
- `bun run format:check` is read-only: it runs `oxfmt --check` and exits non-zero if any file would change.
- Database workflow: `bun run db:generate`, `bun run db:migrate`, `bun run db:push`, `bun run db:studio`.
- There is currently no test script or test suite in this repo. Validate with the smallest relevant command plus manual route checks when needed.

## Project Structure

- `app/`: App Router pages, layouts, and route handlers.
- `components/`: shared UI and feature components.
- `components/ui/`: reusable primitives built around the local button/form/input patterns.
- `components/cta/` and `components/heroSection/`: reusable homepage section building blocks.
- `lib/data.ts`: static project content used by the `projetos` pages.
- `lib/db/`: Drizzle schema, connection setup, and repository classes.
- `drizzle/`: generated SQL migrations.
- `assets/`: local static assets.

## Conventions

- TypeScript is strict; use the existing `@/*` path alias.
- Formatting uses tabs, single quotes, and no semicolons through oxfmt (`.oxfmtrc.json`). Linting uses oxlint (`.oxlintrc.json`).
- File naming is intentionally mixed in the current codebase. Match the local pattern instead of renaming files for consistency.
- Tailwind v4 and the shared UI primitives are the default styling path. Prefer existing tokens, variants, and helpers over ad hoc patterns.
- Use `cn` from `lib/utils.ts` and existing `Button` variants before introducing new utility wrappers.
- Keep user-facing text in Portuguese unless the surrounding file clearly uses another language.

## Editing Patterns

- Pages in `app/` are mostly composition-oriented server components. Prefer assembling existing sections over adding local state to route files.
- Forms are client components built with `react-hook-form`, `zod`, and the shared primitives in `components/ui/form.tsx`.
- When extending a form, wire the full submit flow deliberately. Some current forms are UI-only or have stub handlers.
- The dynamic project page under `app/projetos/[slug]/page.tsx` currently reads from `lib/data.ts`; do not assume project content is database-backed.
- For database work, update `lib/db/schema.ts`, generate the appropriate Drizzle migration, and keep query logic inside repository classes under `lib/db/repositories/`.
- Prefer repository methods over raw DB access from pages or components.

## Environment And Pitfalls

- `lib/db/index.ts` throws at import time if `DATABASE_URL` is missing. Do not import DB modules from client components.
- `drizzle.config.ts` also requires `DATABASE_URL` for migration commands.
- `app/api/images/route.ts` depends on Cloudflare R2 credentials: `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET_NAME`.
- If you add a new remote image host, update `next.config.ts`.
- The README is still the default Next.js template and does not document project-specific setup. Infer behavior from the code and scripts instead.

## Validation Guidance

- After narrow UI changes, prefer `bun run lint` or `bun run build` if the touched area could affect routing or types.
- For DB changes, validate the schema and migration commands you changed, but avoid unrelated migration churn.
- Do not run broad formatting unless the task requires it, because formatter scripts may rewrite unrelated files.
