# AGENTS.md

## Overview

- This is a Next.js 15 App Router site for DI MI PA BÔS, deployed to Cloudflare Workers via `@opennextjs/cloudflare`.
- **Issues live in Linear, not GitHub.** See `.agents/tracker.md` before filing anything or charting a wayfinder map. GitHub Issues stays enabled only to keep the closed `#1`–`#9` decision archive reachable — do not disable it.
- Prefer concise, focused changes that preserve the current Portuguese copy and existing visual patterns.
- Reuse established components and utilities before introducing new abstractions.

## Commands

- Install dependencies with `bun install`.
- Start local development with `bun run dev`.
- Run a Next.js production build with `bun run build` (this is `next build` only — it does NOT produce the Workers artifact).
- Run the full Workers build (Next.js + OpenNext adapter, outputs `.open-next/`) with `bun run build:cf`. Used by Cloudflare Workers Builds (GitHub integration) as the build command.
- Preview locally with the Cloudflare Workers runtime: `bun run preview`.
- Deploy locally to Cloudflare Workers: `bun run deploy`. In Cloudflare Workers Builds the deploy command is `npx wrangler deploy` (the `.open-next/` artifact is produced by `bun run build:cf`).
- Generate Cloudflare binding types: `bun run cf-typegen` (reads `wrangler.jsonc` — keep the real `database_id` in place).
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
- `wrangler.jsonc` contains the real D1 `database_id` for the `dimipabos` D1 database. Do not replace it with a placeholder.
- `R2_PUBLIC_URL` is declared in `wrangler.jsonc` `vars` and overridden locally via `.dev.vars`. Set the production value via the Workers dashboard or directly in `wrangler.jsonc`.
- `bun run build:cf` internally calls `bun run build`, so `build` must stay as `next build` (never set it to `opennextjs-cloudflare build` — that creates an infinite recursion).
- If you add a new remote image host, update `next.config.ts` `remotePatterns`.
- The README is still the default Next.js template and does not document project-specific setup. Infer behavior from the code and scripts instead.

## Validation Guidance

- After narrow UI changes, prefer `bun run lint` or `bun run build` if the touched area could affect routing or types. Use `bun run build:cf` only when validating the full Workers artifact.
- For DB changes, validate the schema and migration commands you changed, but avoid unrelated migration churn.
- Do not run broad formatting unless the task requires it, because formatter scripts may rewrite unrelated files.

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `/node_modules/next/dist/docs/`

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:strict rules -->

1. **Linter errors:** Do not ignore or bypass linter errors. Always fix them to maintain code quality and consistency.

2. **Type errors:** Do not ignore TypeScript type errors. Always resolve them to ensure type safety and prevent potential runtime issues.

3. **Typescript:** Do not use `any` or `unknown` types. Always strive for precise typing to maintain type safety and code clarity.

<!-- BEGIN:code-style-agent-rules -->

- **KISS (Keep It Simple, Stupid):** Prioritize simplicity over cleverness. Avoid over-engineering solutions. Write clean, straightforward code that is easy to read, understand, and maintain.
- **DRY (Don't Repeat Yourself):** Avoid duplicating logic. Consolidate repetitive code into reusable abstractions. But don't overdo it — sometimes a bit of duplication can be clearer than an overly abstracted solution. Use your judgment to strike the right balance.
- **YAGNI (You Aren't Gonna Need It):** Don't implement features or abstractions until they are actually needed. Avoid speculative generality. Focus on the current requirements and avoid adding unnecessary complexity for hypothetical future use cases.
- **Readability:** Write code that is easy to read and understand. Use meaningful variable and function names. Follow consistent formatting and style conventions. Prioritize clarity over brevity.
- **Maintainability:** Write code that is easy to maintain and extend. Use modular design principles. Keep functions and classes focused on a single responsibility. Avoid tightly coupling components.
- **No Multiple Components/hooks in One File:** Each file should contain only one component or hook. This promotes separation of concerns and makes it easier to find and manage.
- **Separate Types, Utils, Constants, and Helpers:** Keep types, utility functions, constants, and helper functions in separate (helpers.ts, types.ts, constants.ts, utils.ts) files. Meaning every helper function should be in a helpers.ts file, every type in a types.ts file, and so on. If a helper function is too large or complex, consider breaking it into smaller functions or moving it to its own file, in this case the helper file should become a folder with an index.ts that exports the helper functions and the individual helper files. Same goes for the other categories. This promotes better organization and maintainability of the codebase.

* **Separation of Concerns:** Keep different concerns separated. For example, keep UI components separate from business logic and data fetching. This promotes modularity and makes it easier to manage and test different parts of the codebase. Also very important, keep component body as minimal as possible, all the logic should be outside of the component body, in the helpers files, hooks, apis, utils, and so on. This promotes better readability and maintainability of the codebase.

- **Avoid hardcoded literal strings:** Prefer using constants for literal strings, and enums for sets of related constants, and derive the types from those constants and enums. This promotes consistency and makes it easier to manage and update values across the codebase. For example:

```ts
    const myEnum = {
        VALUE1: 'value1',
        VALUE2: 'value2'
    } as const
    const myUnion = (typeof myEnum)[keyof typeof myEnum]

    const myData = {
        [myEnum.VALUE1]: 'some data',
        [myEnum.VALUE2]: 'some other data'
    }

    type param = {
        value: myUnion
    }

    if(param.value === myEnum.VALUE1) {
        console.log(myData[myEnum.VALUE1])
    }
```

- **Commenting and JSDoc:** Match the codebase style for commenting and JSDoc. Keep it consistent. Consistency is key to maintaining readability and clarity in the codebase. Make sure you don't skip helper functions or utils, and keep it concise and to the point, no very long explanations. Note that if a function have more then one line of code, then every line should have a very short comment for that line, same goes for utils and helper, components and hooks. Always prefer comments on the conditional statements level if applicable, instead of the line level. Last but not least, don't ever add comments to JSX, only components body.
  Some examples:

```ts
function example(a: number) {
 // Make sure a is greater than 10
  if (a > 10) {
    // Doing something
    const b = a * 2

    // Doing something else
    console.log(b)

  // If not
  } else {
    // Do something else
    console.log('a is too small')

    // Do another thing
    const c = a / 2
  }


  // Return the result
  return {
    a,
    b,
    c
  }
}

or for one line conditionals:
function example(a: number) {
    // Make sure a is greater than 10
    if(a > 10) {
        console.log('a is greater than 10')
    }
}
```

For return values, only one comment for the entire return statement is needed, no need to comment every line of the return statement, for example:

```ts
function example(a: number) {
  // Return the result
  return {
    a,
    b,
    c,
  }
}
```

Some examples of the above rules in practice:

```ts
/**
 * The {@link add} function
 * @description Adds two numbers together
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of a and b
 */
function add(a: number, b: number): number {
  return a + b;
}

type AddParams = {
  a: number;
  b: number;
}

/**
 * The {@link add} function
 * @description Adds two numbers together
 * @param {AddParams} params - The parameters object
 * @param {number} params.a - The first number
 * @param {number} params.b - The second number
 * @returns {number} The sum of a and b
 */
function add(params: AddParams): number {
  return params.a + params.b;
}

type Props = {
  title: string;
}

/**
 * The {@link MyComponent} component
 * @description A simple component that renders a title
 * @param {Props} props - The component props
 * @param {string} props.title - The title to render
 * @returns {JSX.Element} The rendered component
 */
function MyComponent({title}: Props) {
  return <h1>{title}</h1>;
}

/**
 * The {@link useHook} hook
 * @description Manages some task
 * @returns {UseHookReturn} The hook api
 */
function useHook() {
    // The isLoading state
    const [isLoading, setIsLoading] = useState(null)

    // The startLoading helper function
    const startLoading = () => {
        setIsLoading(true)
    }

    // Return the hook api
  return {
    isLoading,
    startLoading
  }
}

/**
 * The {@link UseHookReturn} type
 * @description The return type of the {@link useHook} hook
 */
export type UseHookReturn = ReturnType<typeof useHook>

/**
 * The {@link myApi} api
 * @description Exposes the api for something
 * @return {MyApi} The api object
 */
export const myApi = {
    add,
    MyComponent,
    useHook
}

/**
 * The {@link MyApi} type
 * @description The type of the {@link myApi} api object
 */
export type MyApi = typeof myApi

```

<!-- END:code-style-agent-rules -->
