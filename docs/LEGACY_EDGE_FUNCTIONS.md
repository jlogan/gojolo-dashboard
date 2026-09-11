# Legacy Supabase Edge Functions inventory

Source tree (reference-only):

```
/Users/jaylogan/Projects/gojolo-application/supabase/functions
```

These are **workflow specs** for Gojolo v1. Do **not** blind-copy them into
this repo. When a Gojolo v2 module needs equivalent behavior, recreate it as
Agent-Native **actions**, **server routes** (webhooks/OAuth/uploads only), or
**jobs** against Dozer-local Postgres.

Shared helpers under `_shared/` are inbox/email utilities — also reference-only.

## Classification

### Payments

| Function | Notes |
| --- | --- |
| `capture-paypal-payment` | PayPal capture after checkout |
| `confirm-stripe-payment` | Stripe payment confirmation |
| `create-paypal-checkout` | Create PayPal checkout session |
| `create-stripe-checkout` | Create Stripe checkout session |
| `stripe-webhook` | Stripe webhook receiver |
| `test-paypal-connection` | Connectivity / credential check |
| `process-recurring-invoices` | Recurring invoice billing job |
| `generate-vendor-bills` | Vendor bill generation |

**Recreate when:** invoices, bills, or checkout modules need live payments.

### Email / inbox

| Function | Notes |
| --- | --- |
| `imap-sync` | IMAP mailbox sync |
| `imap-idle` | IMAP IDLE listener |
| `imap-fetch-body` | Fetch message body |
| `imap-flag-sync` | Flag / read-state sync |
| `imap-save-draft` | Persist drafts via IMAP |
| `imap-test-and-save` | Test connection and save settings |
| `fetch-thread-bodies` | Batch thread body fetch |
| `backfill-empty-bodies` | Backfill missing bodies |
| `refresh-email` | Refresh mailbox state |
| `inbox-send-reply` | Send reply from inbox |
| `send-email` | Outbound email send |

**Recreate when:** Inbox / email module is in scope. Prefer provider connections
+ actions/jobs; keep multipart and webhook edges as routes only if required.

### Calendar

| Function | Notes |
| --- | --- |
| `calendar-sync` | External calendar sync |

**Recreate when:** Calendar module needs provider sync.

### Slack

| Function | Notes |
| --- | --- |
| `slack-channels` | List / resolve channels |
| `slack-users` | List / resolve users |
| `slack-events` | Slack Events API webhook |
| `slack-test-dm` | Test DM delivery |
| `slack-test-project-channel` | Test project channel post |

**Recreate when:** Slack notifications or project channel posting is required.
Prefer workspace provider connections over app-local token storage.

### Notifications

| Function | Notes |
| --- | --- |
| `notify-task-comment` | Task comment notification |
| `process-pending-notifications` | Drain pending notification queue |
| `process-user-notification` | Deliver one user notification |

**Recreate when:** in-app / push / email notification delivery is needed.

### Credentials / vault

| Function | Notes |
| --- | --- |
| `vault-credentials` | Credential vault read/write for integrations |
| `sync-profile-avatar` | Profile avatar sync |

**Recreate when:** integration credentials or avatar sync are needed. Prefer
Agent-Native secrets / vault / OAuth / connection catalog primitives — never
port service-role patterns into the browser.

### AI chat

| Function | Notes |
| --- | --- |
| `ai-chat` | Legacy AI chat endpoint |

**Recreate when:** product needs chat beyond Agent-Native’s built-in agent
chat. Default for v2 is the template `AgentChatSurface` / AgentSidebar — do
not reintroduce a parallel LLM route without a clear product reason.

### Recurring jobs / background

| Function | Notes |
| --- | --- |
| `process-recurring-invoices` | Also listed under payments — scheduled billing |
| `process-pending-notifications` | Also listed under notifications — queue worker |
| `imap-idle` / `imap-sync` | Also email — long-running / scheduled sync |
| `calendar-sync` | Also calendar — scheduled sync |
| `backfill-empty-bodies` | Also email — maintenance backfill |

**Recreate when:** the owning module needs schedules. Prefer Agent-Native
automations / recurring jobs over ad-hoc Edge cron copies.

## Shared (`_shared/`) — reference helpers

| Helper | Domain |
| --- | --- |
| `cors.ts` | CORS helpers |
| `companyUtils.ts` | Company domain helpers |
| `inboxGmail*.ts` / `inboxThread*.ts` / `inboxOutboundDedup.ts` / `inboxBodyUnavailable.ts` | Gmail/inbox pipeline utilities |

## Default stance for agents

1. Inventory here first.
2. Implement only what the current module prompt requires.
3. Use Dozer Postgres + Agent-Native actions/jobs/routes.
4. Leave a short TODO in the module PR/docs for deferred recreations — do not
   silently stub broken Edge Function ports.
