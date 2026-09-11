# Module prompt template (Cursor / Clips)

Copy this into a new agent chat on a dedicated branch. Fill every
`{{PLACEHOLDER}}`. Keep the slice small enough to typecheck and build in one
pass.

---

## Role

You are implementing one Gojolo v2 module slice in
`/Users/jaylogan/Projects/gojolo-dashboard`.

Read and follow:

- `AGENTS.md`
- `docs/AGENT_BUILD_GUIDE.md`
- `docs/REFERENCE_MAP.md`
- `docs/LEGACY_EDGE_FUNCTIONS.md` (if integrations/jobs are involved)
- `BUILD_SPEC.md`

## Module

- **Name:** {{MODULE_NAME}}
- **User stories:** {{USER_STORIES}}
- **In scope:** {{IN_SCOPE}}
- **Out of scope:** {{OUT_OF_SCOPE}}
- **Legacy reference paths (optional):** {{LEGACY_PATHS}}
- **Edge Functions to consider (optional):** {{EDGE_FUNCTIONS_OR_NONE}}

## Non-negotiables

1. Use Agent-Native organizations only — no custom Jolo org system.
2. UI via template shadcn/Radix/Tailwind (`@/components/ui/*`).
3. App DB is Dozer-local Postgres (`DATABASE_URL`) only — no Supabase app DB.
4. Legacy `gojolo-application` is reference-only; never copy secrets or couple
   runtime imports to it.
5. Recreate needed Edge Function behavior as actions / server jobs / routes —
   do not paste Supabase functions.
6. Follow the four-area checklist for real features: UI, action(s), agent
   instructions, application-state / `view-screen` awareness.
7. Do not commit or push unless explicitly asked.

## Implementation checklist

- [ ] Branch: `feat/{{MODULE_SLUG}}` (or work on the branch Jay already created)
- [ ] Schema / tables only if required; org-scope with Agent-Native access helpers
- [ ] `defineAction` operations (agent + UI parity)
- [ ] Route(s) under the existing shell (no per-route full layout remount)
- [ ] Update `AGENTS.md` action table / notes if new agent-facing actions ship
- [ ] Defer unrelated Edge Function recreations with explicit TODOs

## Verification

Run and report output:

```bash
pnpm typecheck
pnpm build
```

Prefer also:

```bash
pnpm agent-native:doctor
```

## Done criteria

- Slice matches {{MODULE_NAME}} in-scope stories
- Typecheck + build pass
- No secrets in source
- Short summary: files changed, actions/routes added, deferred follow-ups
