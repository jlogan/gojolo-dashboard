# gojolo-dashboard

Prototype / learning frontend for Jolo v2, deployed to https://dashboard.gojolo.io.

Stack:

- Agent-Native standalone Chat template
- React Router / React / TypeScript
- Tailwind + shadcn/Radix-compatible component structure from the Agent-Native template
- Dozer-local Postgres dedicated to this app (Agent-Native `DATABASE_URL`)
- Optional future GoJoLo Supabase integration (not the app DB)
- Buddy + Dozer CloudPanel deployment

## Current scaffold status

The repo has been initialized from the official Agent-Native Chat template:

```bash
npx --yes @agent-native/core@latest create gojolo-dashboard --standalone --template chat
pnpm install
pnpm typecheck
pnpm build
```

Verified locally:

- `pnpm typecheck` passes
- `pnpm build` passes
- build output is `.output/server/index.mjs` + `.output/public`

Agent-Native is not a static-only Vite app. It builds a Node/Nitro server, so production runs via CloudPanel Node.js/systemd, not a plain `dist/` static deploy.

## Local setup

```bash
corepack enable
corepack prepare pnpm@12.4.1 --activate
cp .env.example .env
pnpm install
pnpm dev
```

Local Agent-Native uses PGlite by default, so `DATABASE_URL` is optional for `pnpm dev`. Open the local URL printed by Agent-Native, usually port `8080` or the next available port.

## Environment variables

Do not commit `.env` or `.env.local`. Start from the tracked `.env.example` only.

Required for production:

- `APP_URL=https://dashboard.gojolo.io`
- `BETTER_AUTH_SECRET` — generate with `openssl rand -hex 32`
- `DATABASE_URL` — Dozer-local Postgres connection string dedicated to gojolo-dashboard (Buddy/server secret only)
- optional: `AGENT_NATIVE_DB_SCHEMA` — defaults to `agent_native`; runtime writes a `search_path`-scoped `DATABASE_URL`

Optional future GoJoLo Supabase public browser config (integration only; not the Agent-Native app DB):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Guardrails:

- Never put the Supabase service-role key in frontend env or source.
- Do not change Supabase schema/RLS from this repo without explicit approval.
- Jolo v1 remains production/source-of-truth while this repo is a v2 learning/prototype surface.

## Deployment

Target: https://dashboard.gojolo.io

Server target created on Dozer:

- CloudPanel site: `dashboard.gojolo.io`
- Site user: `gojolodash`
- Deploy path: `/home/gojolodash/htdocs/dashboard.gojolo.io`
- App port: `3005`
- User service: `gojolo-dashboard-production.service`

Buddy deploys pushes to `main` using root `buddy.yml`:

1. Enable pnpm with Corepack.
2. Validate `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `APP_URL` (Dozer-local Postgres is not reachable from the Buddy BUILD container).
3. Run `pnpm install --frozen-lockfile`.
4. Run `pnpm typecheck` and `pnpm build`.
5. Transfer `.output/` to Dozer.
6. On the Dozer host via SSH: `psql` `CREATE SCHEMA IF NOT EXISTS` for `AGENT_NATIVE_DB_SCHEMA`, then write a runtime `.env` with a `search_path`-scoped `DATABASE_URL`.
7. Restart the CloudPanel user service and health-check the local port and public URL.

### Unresolved external setup

Not provisioned by this scaffold; must be supplied outside the repo before production is live:

- **Cloudflare token** — still required for DNS / Cloudflare setup for `dashboard.gojolo.io` (not stored in this repo)
- **`DATABASE_URL`** — still required as a Buddy/server secret; use the Dozer-local Postgres database dedicated to this app (`buddy.yml` fails closed without it)
- **`BETTER_AUTH_SECRET`** — generate and set as a Buddy project variable (`openssl rand -hex 32`)

Required Buddy project variables:

- `PROD_SSH_USER=gojolodash`
- `PROD_DEPLOY_PATH=/home/gojolodash/htdocs/dashboard.gojolo.io`
- `PROD_SITE_URL=https://dashboard.gojolo.io`
- `PROD_APP_PORT=3005`
- `PROD_SERVICE=gojolo-dashboard-production.service`
- `APP_URL=https://dashboard.gojolo.io`
- `DATABASE_URL=<Dozer-local Postgres connection string for gojolo-dashboard>`
- `BETTER_AUTH_SECRET=<generated secret>`
- optional: `AGENT_NATIVE_DB_SCHEMA` (default `agent_native`)
- optional/future: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

Workspace/global Buddy assets used by `buddy.yml`:

- `DOZER_HOST`
- `BROBOT_BA`

## Agent experiment workflow

See `BUILD_SPEC.md`. Keep work milestone-based and compare agents with repeatable prompt files/branches rather than one huge “rebuild Jolo” prompt.
