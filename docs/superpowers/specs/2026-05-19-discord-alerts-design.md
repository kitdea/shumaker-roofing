# Discord Alerts — Design Spec
**Date:** 2026-05-19
**Project:** Shumaker Roofing — Website Technical Agent
**Status:** Approved

---

## Overview

Add a Discord notification step (Step A.7) to the Findings Aggregator in the tech-audit skill. After every run — both nightly cron and on-demand `/tech-audit` — the agent POSTs a summary embed to a Discord webhook. Alerts fire on every run regardless of issue count.

---

## Environment Variable

`DISCORD_WEBHOOK_URL` in `.env.local`. The key already exists in the file; the user must supply the webhook URL value from their Discord server settings.

If the value is empty or missing:
- Log: `"DISCORD_WEBHOOK_URL not set — skipping Discord alert"`
- Skip Step A.7 entirely. Do not fail the audit run.

---

## Step A.7 — Send Discord Alert

Runs after Step A.6 (Final Report to User).

### 7.1: Read webhook URL

Read `DISCORD_WEBHOOK_URL` from `.env.local`. If empty, skip and log warning as described above.

### 7.2: Build embed payload

Construct a Discord embed JSON payload:

```json
{
  "embeds": [{
    "title": "Tech Audit — {YYYY-MM-DD HH:MM UTC}",
    "color": {COLOR},
    "fields": [
      { "name": "URLs Checked", "value": "{N}", "inline": true },
      { "name": "Open P1", "value": "{N}", "inline": true },
      { "name": "Open P2", "value": "{N}", "inline": true },
      { "name": "Health", "value": "{N issues} ({N new}, {N resolved})", "inline": false },
      { "name": "Technical SEO", "value": "{N issues} ({N new}, {N resolved})", "inline": false },
      { "name": "Performance", "value": "{N issues} ({N new}, {N resolved})", "inline": false }
    ],
    "description": "{P1_LIST}",
    "footer": { "text": "Shumaker Roofing · nightly audit" }
  }]
}
```

**Color logic:**
- Zero P1 issues → `3258260` (`0x31B257` green)
- One or more P1 issues → `15158332` (`0xE74C3C` red)

**P1 list (`description` field):**
- If no P1s: `"✅ All checks passed"`
- If P1s exist: one line per P1 finding, e.g.:
  ```
  ⚠ [H-003] /about — 404 Not Found
  ⚠ [S-002] /services/gutters — Missing meta description
  ```

### 7.3: POST to webhook

Use `WebFetch` to POST the payload to `DISCORD_WEBHOOK_URL`:

```
POST {DISCORD_WEBHOOK_URL}
Content-Type: application/json
Body: {embed payload from 7.2}
```

**Response handling:**

| Response | Action |
|---|---|
| HTTP 204 (success) | Log: `"Discord alert sent"` |
| HTTP 429 (rate limited) | Log: `"Discord alert skipped — rate limited"`. Do not retry. |
| Any other non-2xx | Log: `"Discord alert failed — HTTP {status}"`. Do not fail the audit run. |

---

## Failure Isolation

Discord errors must never interrupt or fail the audit run. Step A.7 is fire-and-forget. If it fails for any reason, the audit result is still written to memory files and reported to the user normally.

---

## Audit Log

No change to `audit-log.md` format for this feature. Discord delivery status is logged to the console only, not persisted.

---

## Out of Scope

- Slack or other notification channels
- Per-finding granular alerts
- Alert suppression / do-not-disturb windows
- Retry logic on webhook failure
