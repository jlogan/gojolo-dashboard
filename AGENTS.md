# Gojolo Dashboard (v2) — Agent Guide

This repo is **Gojolo v2** (`dashboard.gojolo.io`): an Agent-Native Chat-template
app. Coding agents (Cursor, Builder.io Clips-style) should treat this file plus
`docs/` as the source of truth for how to build modules here.

## Product decisions (do not reopen)

- **Orgs/teams:** use Agent-Native’s native organization system
  (`RequireActiveOrg`, `TeamPage`, `createOrganization`, `OrgSwitcher`). Do
  **not** add custom Jolo org tables or copy the old app’s org model.
- **UI:** shadcn / Radix / Tailwind from the Agent-Native template for
  Jolo-owned screens. Prefer existing `@/components/ui/*` adapters.
- **Database:** Dozer-local Postgres via `DATABASE_URL` only. Do **not**
  reintroduce Supabase client/runtime vars as the app DB.
- **Legacy app:** `/Users/jaylogan/Projects/gojolo-application` is
  **reference-only**. Never couple this repo to it at runtime. Never copy
  secrets, `.env`, service-role keys, or customer data.
- **Legacy Edge Functions:** inventory in `docs/LEGACY_EDGE_FUNCTIONS.md`.
  Recreate as Agent-Native actions / server routes / jobs only when a module
  needs them — do not blind-copy Supabase functions.

## First-run org gate

After signup/login, users without an active org hit `RequireActiveOrg` on
authenticated routes (shell + sidebar stay usable). Settings remains reachable
so first-run org creation can also go through **Settings → Team** (`TeamPage`).
`/team` redirects to `/settings/organization`.

## Skills / framework lookup

Prefer version-matched package docs over memory:

```bash
pnpm action framework-search --pattern "defineAction"
pnpm action docs-search --query "organizations"
pnpm action source-search --query "RequireActiveOrg"
```

Before shared workspace UI, read `agent-native-toolkit`. Before adapting shared
UI, read `customizing-agent-native`. Before new features, follow
`adding-a-feature` (UI + action + instructions + application state).

## Core rules

- UI feedback: target 100 ms, never exceed 400 ms; acknowledge before network work.
- Data in SQL (Dozer Postgres), actions first, application state for
  navigation/selection, shared agent chat for AI work.
- Store large file/blob payloads in configured file/blob storage, not SQL.
- Never hardcode API keys, tokens, webhook URLs, signing secrets, Builder /
  internal data, customer data, or credential-looking literals.
- For external integrations, inspect the workspace/provider connection catalog
  first; reuse scoped credential resolvers.
- Keep actions deterministic. Research / generation / synthesis starts in the
  AgentSidebar; follow-ups stay in the same thread.
- Never fabricate. Verify writes by re-reading. Use `view-screen` when context
  is unclear.
- Keep `server/plugins/config.ts` brand-aligned (`app.name`, optional
  `app.logoUrl`).

## Key actions

| Action | Purpose |
| --- | --- |
| `view-screen` | Read current navigation / UI context (call first) |
| `navigate` | Move the UI to a view or path |
| `hello` | Smoke-test greeting |
| `create-organization` | Create an Agent-Native org for the signed-in user; returns `{ id, name }` |

## Application state

- `navigation` — current view and selected entity ids. Default chat view is
  `chat` at `/home`; `/` is the public SSR marketing page.
- `navigate` — agent-driven navigation command.
- `view-screen` — first tool when visible context matters.

## Building modules

Read `docs/AGENT_BUILD_GUIDE.md`, `docs/REFERENCE_MAP.md`,
`docs/MODULE_PROMPT_TEMPLATE.md`, and `BUILD_SPEC.md` before starting a module
slice. Use a dedicated branch and the prompt template.

## Verification

```bash
pnpm typecheck
pnpm build
pnpm agent-native:doctor
```

Fix doctor findings before considering work done. Do not commit or push unless
Jay explicitly asks.
