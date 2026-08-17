# Opportunity Hub AI

An official-source-first opportunity tracker for jobs, internships, government examinations, and future recruitment cycles.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/opportunity-hub/src/App.tsx` — web experience, curated opportunity source links, daily refresh state, shortlist, and application-source tracking.
- `artifacts/opportunity-hub/src/index.css` — visual theme and responsive layout.
- `artifacts/api-server/src` — Express API scaffold; the current web experience does not depend on it for its curated source directory.

## Architecture decisions

- Opportunity cards link to official government or company sources rather than claiming scraped listings are live.
- The Apply action records that the official source was opened; it never submits an application or claims an application status.
- Future years are planning signals only. A cycle becomes final only after the organisation publishes its official notice.

## Product

Users can browse official opportunity paths, filter by category and current status, inspect year-by-year cycle expectations, save a shortlist, open application sources, and review the local application trail.

## User preferences

Keep job information trustworthy and useful: avoid expired deadlines, show the source domain, clearly distinguish open/upcoming/not-announced, and include future-year context without inventing dates.

## Gotchas

- `PORT` is required by the Vite and API configs; run the web build with `PORT=5000` when invoking it outside a workflow.
- The current curated directory is static and local; daily refresh updates the check timestamp but does not pretend to scrape or auto-submit applications.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
