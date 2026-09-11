# gojolo-dashboard

Prototype / learning frontend for Jolo v2, deployed to https://dashboard.gojolo.io.

Stack:

- Agent-Native standalone Chat template
- React Router / React / TypeScript
- Tailwind + shadcn/Radix-compatible component structure from the Agent-Native template
- Existing GoJoLo Supabase project for future auth/data integration
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
cp .env.example .env.local
pnpm install
pnpm dev
```

Open the local URL printed by Agent-Native, usually port `8080` or the next available port.

## Environment variables

Do not commit `.env` or `.env.local`.

Required for production:

- `APP_URL=https://dashboard.gojolo.io`
- `BETTER_AUTH_SECRET` — generate with `openssl rand -hex 32`
- `DATABASE_URL` — persistent Postgres connection string; intended to use the existing GoJoLo Supabase project Postgres URL

Existing GoJoLo Supabase public browser config for future Jolo module work:

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
2. Require production env vars.
3. Run `pnpm install --frozen-lockfile`.
4. Run `pnpm typecheck` and `pnpm build`.
5. Transfer `.output/` to Dozer.
6. Write runtime `.env` from Buddy variables.
7. Restart the CloudPanel user service and health-check the local port and public URL.

Required Buddy project variables:

- `PROD_SSH_USER=gojolodash`
- `PROD_DEPLOY_PATH=/home/gojolodash/htdocs/dashboard.gojolo.io`
- `PROD_SITE_URL=https://dashboard.gojolo.io`
- `PROD_APP_PORT=3005`
- `PROD_SERVICE=gojolo-dashboard-production.service`
- `APP_URL=https://dashboard.gojolo.io`
- `DATABASE_URL=<existing GoJoLo Supabase Postgres connection string>`
- `BETTER_AUTH_SECRET=<generated secret>`
- optional/future: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

Workspace/global Buddy assets used by `buddy.yml`:

- `DOZER_HOST`
- `BROBOT_BA`

## Agent experiment workflow

See `BUILD_SPEC.md`. Keep work milestone-based and compare agents with repeatable prompt files/branches rather than one huge “rebuild Jolo” prompt.
