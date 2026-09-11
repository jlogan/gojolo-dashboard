# Agent build guide — Gojolo v2 modules

How autonomous agents (Cursor / Builder.io Clips-style) should add product
modules to `gojolo-dashboard` with minimal back-and-forth.

## Before you write code

1. Read root `AGENTS.md` and `BUILD_SPEC.md`.
2. Read `docs/REFERENCE_MAP.md` if the module exists in the legacy app.
3. Read `docs/LEGACY_EDGE_FUNCTIONS.md` if the module depended on Supabase
   Edge Functions — treat those as workflow specs, not code to paste.
4. Look up Agent-Native APIs with package tools, not memory:

```bash
pnpm action framework-search --pattern "<symbol or path>"
pnpm action docs-search --query "<topic>"
pnpm action source-search --query "<pattern>"
```

5. For UI chrome / settings / sharing / agent surfaces, read the matching
   skills under `.agents/skills/` (`adding-a-feature`, `actions`,
   `agent-native-toolkit`, `storing-data`, `security`).

## Hard constraints

| Do | Don't |
| --- | --- |
| Use Agent-Native orgs (`RequireActiveOrg` / `TeamPage` / `create-organization`) | Build a parallel Jolo org system |
| Use template shadcn/Radix/Tailwind (`@/components/ui/*`) | Invent a second design system |
| Persist app data in Dozer Postgres (`DATABASE_URL`) | Reintroduce Supabase as the app DB |
| Read legacy UI/domain from `gojolo-application` as reference | Import, symlink, or runtime-couple to it |
| Recreate needed workflows as actions / routes / jobs | Blind-copy Edge Functions or secrets |
| Scope tenancy with Agent-Native org + access helpers | Trust client-supplied org ids without checks |

## Module workflow (branch + prompt)

1. Create a focused branch: `feat/<module-slug>` or `agent/<module-slug>`.
2. Paste `docs/MODULE_PROMPT_TEMPLATE.md` into the agent chat; fill the
   placeholders (module name, user stories, reference paths, out-of-scope).
3. Implement a **vertical slice**: schema (if needed) → actions → UI route(s)
   under the existing app shell → `AGENTS.md` / skill notes → navigation /
   `view-screen` awareness.
4. Keep the shell mounted once (`root.tsx` / `Layout`). Do not wrap each new
   route in its own full layout that remounts the agent sidebar.
5. Prefer one orthogonal `update-<resource>` action over many field-level
   actions. Hide UI-only helpers with `agentTool: false` when appropriate.
6. Stop when the slice compiles and matches the prompt — do not expand into
   neighboring modules.

## Where code lives

| Concern | Location |
| --- | --- |
| Actions | `actions/*.ts` via `defineAction` |
| Routes / screens | `app/routes/*` (fs routes) |
| Shared UI | `app/components/**` |
| Schema / SQL | `server/db/**` (PostgreSQL / Drizzle) |
| Brand / config | `server/plugins/config.ts`, `app/lib/app-config.ts` |
| Agent instructions | `AGENTS.md`, `.agents/skills/**` |

## Reference-only legacy access

- Path: `/Users/jaylogan/Projects/gojolo-application` (sibling checkout).
- Allowed: read UI flows, domain vocabulary, validation rules, Edge Function
  *behavior* descriptions.
- Forbidden: copy `.env`, service-role keys, webhook secrets, customer rows,
  or wire `supabase-js` as this app’s database client.

## Verification (required before claiming done)

```bash
pnpm typecheck
pnpm build
pnpm agent-native:doctor
```

Optional focused checks:

```bash
pnpm action view-screen
pnpm action hello --name=verify
pnpm action create-organization --name="Test Org"
```

(`create-organization` needs a signed-in / request user context.)

## Reporting back

When finished, report:

1. Branch name and files touched.
2. Actions / routes / tables added.
3. Verification command results.
4. Explicit follow-ups (Edge Function recreations deferred, open product
   questions). Do **not** invent successful writes or green builds.
