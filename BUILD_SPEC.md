# gojolo-dashboard — Build Spec (v0)

Learning / prototype app for Jolo v2 at https://dashboard.gojolo.io. Keep scope small: validate Agent-Native + shadcn-style UI primitives + Dozer-local Postgres as the app database before expanding product surface.

## Goal

Ship a minimal Agent-Native app that:

1. Starts from the official Agent-Native Chat template.
2. Uses the template’s Tailwind/shadcn/Radix-friendly component structure.
3. Uses a Dozer-local Postgres database dedicated to this app as the only Agent-Native `DATABASE_URL`.
4. Treats the agent surface as a first-class interface, with a lightweight evaluation loop for agent behavior.
5. Deploys to Dozer CloudPanel via Buddy on pushes to `main`.

## Non-goals (this prototype)

- Replacing app.gojolo.io / the existing `gojolo-application` product.
- Rebuilding every Jolo module in one pass.
- Optional Supabase (or other external DB) integration scaffolding in this repo.
- Service-role keys, secret material, or privileged APIs in browser code.
- Pixel-perfect Jolo UI parity in the first milestone.

## Stack

- App framework: Agent-Native standalone Chat template
- UI: Tailwind + Agent-Native template components built on shadcn/Radix-style primitives
- Language: TypeScript
- Runtime: Node/Nitro (`.output/server/index.mjs`)
- App database: Dozer-local Postgres dedicated to gojolo-dashboard (`DATABASE_URL` + optional `AGENT_NATIVE_DB_SCHEMA`) — the only database for this app
- Deploy: Buddy → Dozer CloudPanel → `dashboard.gojolo.io`

## Database guardrails

1. Agent-Native production `DATABASE_URL` is the Dozer-local Postgres database for this app only; keep the value in Buddy/server env, never in source.
2. Optional `AGENT_NATIVE_DB_SCHEMA` (default `agent_native`); deploy creates the schema on Dozer via `psql` and writes a `search_path`-scoped runtime URL. Do not run DB prepare from the Buddy BUILD container (Dozer-local Postgres is unreachable there).
3. No service-role keys, secrets, or privileged credentials in frontend source, `.env.example`, Buddy public vars, or agent prompts.

Note: Agent-Native also needs `BETTER_AUTH_SECRET` for production framework auth/conversations. That value must stay in Buddy/server env only.

## Agent evaluation approach

Use the repo to evaluate coding agents with repeatable prompts:

1. Keep milestone prompts in source control once we start agent comparisons.
2. Run Cursor/Codex on separate branches with the same prompt.
3. Score each run on spec adherence, compile/build, DB safety, diff quality, and time-to-green.
4. Do not merge agent work just because the agent reports success; verify locally with `pnpm typecheck` and `pnpm build`.
5. Prefer vertical slices over broad rewrites.

## Milestones

### M0 — Scaffold

Status: complete.

- Official Agent-Native Chat template generated.
- Optional Supabase client scaffolding removed; Dozer-local Postgres is the only app DB.
- `pnpm typecheck` passes.
- `pnpm build` passes and emits `.output/server/index.mjs` + `.output/public`.
- `buddy.yml` added for Dozer Node deploys.

### M1 — Production deployment plumbing

- CloudPanel site exists for `dashboard.gojolo.io`.
- Buddy project variables set.
- `main` push triggers Buddy.
- Public URL returns the Agent-Native app.

Unresolved external setup (not in this scaffold): Cloudflare token for `dashboard.gojolo.io` DNS/Cloudflare, and production `DATABASE_URL` (Dozer-local Postgres for this app) as a Buddy/server secret.

### M2 — Auth exploration

- Decide how Jolo v2 auth maps onto Agent-Native/Better Auth.
- Log in without privileged keys in the browser.
- Session/user state visible in the UI.
- Protected route or gated agent entry.

### M3 — First Jolo data slice

- First read-only module against app data in Dozer-local Postgres.
- Verify tenancy/access checks with a real user session.

### M4 — First action/chat workflow

- One safe read-only Jolo action callable from UI and agent chat.
- Golden prompts + manual scorecard.
