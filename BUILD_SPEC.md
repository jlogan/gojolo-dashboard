# gojolo-dashboard — Build Spec (v0)

Learning / prototype app for Jolo v2 at https://dashboard.gojolo.io. Keep scope small: validate Agent-Native + shadcn-style UI primitives + the existing GoJoLo Supabase project before expanding product surface.

## Goal

Ship a minimal Agent-Native app that:

1. Starts from the official Agent-Native Chat template.
2. Uses the template’s Tailwind/shadcn/Radix-friendly component structure.
3. Integrates the existing GoJoLo Supabase project for future auth/data modules.
4. Treats the agent surface as a first-class interface, with a lightweight evaluation loop for agent behavior.
5. Deploys to Dozer CloudPanel via Buddy on pushes to `main`.

## Non-goals (this prototype)

- Replacing app.gojolo.io / the existing `gojolo-application` product.
- Rebuilding every Jolo module in one pass.
- Supabase schema migrations, RLS rewrites, or Edge Function changes without explicit approval.
- Service-role keys, secret material, or privileged APIs in browser code.
- Pixel-perfect Jolo UI parity in the first milestone.

## Stack

- App framework: Agent-Native standalone Chat template
- UI: Tailwind + Agent-Native template components built on shadcn/Radix-style primitives
- Language: TypeScript
- Runtime: Node/Nitro (`.output/server/index.mjs`)
- Data/auth target: existing GoJoLo Supabase project, introduced incrementally
- Deploy: Buddy → Dozer CloudPanel → `dashboard.gojolo.io`

## Supabase guardrails

1. No service-role key in frontend source, `.env.example`, Buddy public vars, or agent prompts.
2. No schema/RLS/migration changes from this repo without explicit approval.
3. Reuse the existing GoJoLo Supabase project for future auth/data milestones.
4. Add `https://dashboard.gojolo.io` and the local dev URL to Supabase Auth redirect allowlists when Supabase Auth work starts.
5. Assume RLS is the tenancy boundary; do not rely on client-only filtering for security.

Note: Agent-Native itself also needs a persistent Postgres `DATABASE_URL` and `BETTER_AUTH_SECRET` for production framework auth/conversations. The intended production `DATABASE_URL` is the existing GoJoLo Supabase Postgres connection string, but that value must stay in Buddy/server env only.

## Agent evaluation approach

Use the repo to evaluate coding agents with repeatable prompts:

1. Keep milestone prompts in source control once we start agent comparisons.
2. Run Cursor/Codex on separate branches with the same prompt.
3. Score each run on spec adherence, compile/build, Supabase/RLS safety, diff quality, and time-to-green.
4. Do not merge agent work just because the agent reports success; verify locally with `pnpm typecheck` and `pnpm build`.
5. Prefer vertical slices over broad rewrites.

## Milestones

### M0 — Scaffold

Status: complete.

- Official Agent-Native Chat template generated.
- `@supabase/supabase-js` added for future GoJoLo Supabase integration.
- `app/lib/supabase.ts` added with public anon-key-only client setup.
- `pnpm typecheck` passes.
- `pnpm build` passes and emits `.output/server/index.mjs` + `.output/public`.
- `buddy.yml` added for Dozer Node deploys.

### M1 — Production deployment plumbing

- CloudPanel site exists for `dashboard.gojolo.io`.
- Buddy project variables set.
- `main` push triggers Buddy.
- Public URL returns the Agent-Native app.

Unresolved external setup (not in this scaffold): Cloudflare token for `dashboard.gojolo.io` DNS/Cloudflare, and production `DATABASE_URL` (GoJoLo Supabase Postgres) as a Buddy/server secret.

### M2 — Auth exploration

- Decide whether Jolo v2 uses Supabase Auth directly, Agent-Native/Better Auth, or a bridge pattern.
- Log in without service-role keys.
- Session/user state visible in the UI.
- Protected route or gated agent entry.

### M3 — First Jolo data slice

- Read-only module against the existing Supabase project.
- No schema changes.
- Verify RLS behavior with a real user session.

### M4 — First action/chat workflow

- One safe read-only Jolo action callable from UI and agent chat.
- Golden prompts + manual scorecard.
