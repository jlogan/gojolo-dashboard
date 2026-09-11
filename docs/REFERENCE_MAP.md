# Reference map — legacy `gojolo-application`

Use this map when a Gojolo v2 module needs product/UI/domain context from the
original app. The legacy repo is **reference-only**.

## Location

```
/Users/jaylogan/Projects/gojolo-application
```

Sibling checkout on Jay’s machine. Do not add it as a workspace dependency,
git submodule, or runtime import target for `gojolo-dashboard`.

## How to treat it

| Allowed | Not allowed |
| --- | --- |
| Read pages/components for UX and domain language | Copy secrets, `.env`, service-role keys |
| Read types / form validation for field vocabulary | Wire `@supabase/supabase-js` as this app’s DB |
| Read Edge Function *names and behavior* as specs | Paste Edge Function source as production code |
| Note org/workspace UX patterns to remap onto Agent-Native orgs | Recreate the old custom org tables here |

## High-value entry points

| Area | Look here |
| --- | --- |
| Routing / shell | `src/App.tsx`, `src/components/AppShell.tsx` |
| Auth / session | `src/contexts/AuthContext.tsx`, `src/pages/Login.tsx` |
| Legacy org / workspace picker | `src/contexts/OrgContext.tsx`, `src/pages/WorkspacePicker.tsx`, `src/pages/OrganizationsList.tsx`, `src/pages/OrgSettings.tsx` |
| Dashboard home | `src/pages/Dashboard.tsx` |
| CRM — companies | `src/pages/companies/*` |
| CRM — contacts | `src/pages/contacts/*` |
| CRM — leads / resumes | `src/pages/leads/*`, `src/components/resume/*` |
| Projects / tasks | `src/pages/projects/*` |
| Timesheets | `src/pages/Timesheets.tsx`, `src/lib/timeLogBilling.ts` |
| Invoices | `src/pages/invoices/*`, `src/lib/invoice*.ts` |
| Bills / vendor billing | `src/pages/bills/*`, `src/pages/admin/VendorBillingSettings.tsx` |
| Expenses | `src/pages/expenses/*` |
| Inbox / email | `src/pages/Inbox.tsx`, `src/components/inbox/*`, `src/lib/inbox*.ts`, `src/lib/emailSanitizer.ts` |
| Calendar | `src/pages/calendar/*`, `src/lib/calendar*.ts`, `src/types/calendar.ts` |
| Notifications | `src/pages/Notifications.tsx`, `src/components/NotificationBell.tsx` |
| Admin | `src/pages/Admin.tsx`, `src/pages/admin/*` |
| Profile | `src/pages/Profile.tsx` |
| Chat (legacy) | `src/pages/ChatView.tsx` |
| Credentials UI | `src/components/CredentialsPanel.tsx` |
| Schema / migrations | `supabase/migrations/*` (domain shapes only) |
| Edge Functions | `supabase/functions/*` — see `docs/LEGACY_EDGE_FUNCTIONS.md` |

## Org remapping note

Legacy org/workspace models (`OrgContext`, custom org pages) inform **product
language** only. In Gojolo v2:

- Membership / active org → Agent-Native org primitives
- First-run gate → `RequireActiveOrg` + Settings `TeamPage`
- Agent create → `create-organization` action

Do not port the old org SQL or Supabase RLS policies as-is.

## Suggested read order for a module agent

1. Legacy list + detail pages for the module.
2. Any `src/lib/*` helpers that encode business rules.
3. Matching Edge Functions in `docs/LEGACY_EDGE_FUNCTIONS.md`.
4. Closest Agent-Native template pattern via `pnpm action source-search`.
5. Implement only the vertical slice requested in the module prompt.
