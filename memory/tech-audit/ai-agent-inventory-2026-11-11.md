# Shumaker Roofing — AI/Agent Code & Integration Inventory

**Date:** 2026-11-11
**Auditor:** web-designer-dev (Hermes)
**Source:** local checkout `/home/kldl/Documents/shumaker-roofing`, HEAD `5ea006935125cf4d040671d51310c83be745c2cc`
(matches `origin/main` exactly — verified via `git log -1` + `git status`; two untracked files present,
`content-drafts/windows-service-page.md` and this audit's own sibling report, neither is tracked source).

**Method:** case-insensitive `grep -rniE` across all source/config/doc files (excluding `node_modules`,
`.git`, `.next`, `.obsidian`) for `agent|claude|anthropic|openai|gpt|langchain|autogpt|crewai|llm|chatbot|
assistant|bot`, plus direct reads of `package.json`, `package-lock.json`, `.env.local` (keys only), `README.md`,
`CLAUDE.md`, and every file under `.claude/`. No `.github/` directory exists in this repo (confirmed in the
2026-11-11 full audit, re-confirmed here).

---

## Bottom line

**This codebase does NOT ship any AI agent or chatbot to the public website.** There is no LLM SDK dependency,
no server-side code calling an LLM API, and no first-party chat/assistant UI. What *does* exist is a set of
**Claude Code agent/skill definitions living in `.claude/plugins/`** — these are prompt-based automation
workflows meant to be run by a human operator through Claude Code itself (SEO content pipeline + a nightly
technical-audit agent), not code embedded in or served by the Next.js app. They are classified separately
below because conflating them with "the website has a chatbot" would be wrong.

---

## Finding 1 — `.claude/plugins/seo-agents/` — a 7-skill Claude Code agent pipeline

**Classification: (a) actual AI/agent system — but NOT a website integration.** This is a set of markdown
**skill/prompt definitions** that Claude Code (the dev tool) loads and executes when a human operator runs
slash commands like `/seo-project-manager`, `/keyword-researcher`, `/seo-writer`, `/qa`, `/content-updater`,
`/competitor-researcher`, `/content-auditor`. They are not application code — nothing in `app/`, `components/`,
or `lib/` imports or references them, and they are never bundled, built, or served by `next build`/`next start`.

Files:
- `.claude/plugins/.claude-plugin/marketplace.json` — registers `seo-agents` and `website-technical-agent` as local plugins
- `.claude/plugins/seo-agents/.claude-plugin/plugin.json` — plugin manifest
- `.claude/plugins/seo-agents/skills/{seo-project-manager,keyword-researcher,seo-writer,qa,content-updater,competitor-researcher,content-auditor}/SKILL.md` — 7 agent prompt files
- `.claude/settings.json:25` — `"seo-agents@local": true` (plugin enabled for this repo's Claude Code sessions)
- `.claude/settings.json:7-10` — lists allowed MCP tool calls: `mcp__claude_ai_MCP_Contentful_Model__*` (a Contentful MCP server — stale, since the project migrated Contentful→Sanity in June 2026 per `CLAUDE.md`; `content-updater/SKILL.md` actually writes via the **Sanity** Management API using `SANITY_API_WRITE_TOKEN`, not Contentful)
- `.claude/plugins/seo-agents/skills/competitor-researcher/SKILL.md` and `keyword-researcher/SKILL.md` call `mcp__claude_ai_Semrush_MCP_server__*` tools (Semrush SEO data, via MCP, not an LLM API)

What these agents actually do (read from the skill files, not run): `seo-project-manager` reads `memory/seo/*.md` and dispatches work to the other agents (read-only, never auto-publishes); `keyword-researcher`/`competitor-researcher` pull Semrush data and use the operating LLM itself (Claude, via whichever Claude Code session invokes the skill) to generate keyword candidates; `seo-writer` drafts blog content to `memory/seo/drafts/`; `qa` scores drafts against a checklist; `content-updater` is "the one agent in this pipeline whose action is irreversible" — it publishes approved content directly to **Sanity** via the Management API.

**Important distinction:** there is no SDK call to `api.anthropic.com` anywhere in this code. The "LLM" in this pipeline *is* whichever Claude Code agent session a human runs the skill through — these files are instructions/prompts, not programs that invoke a model via HTTP. No API key for any LLM provider appears in `.env.local` (only Sanity, PageSpeed, Discord webhook, GitHub PAT — see Finding 4).

## Finding 2 — `.claude/plugins/website-technical-agent/` — a scheduled Claude Code tech-audit agent

**Classification: (a) actual AI/agent system — but NOT a website integration**, same reasoning as Finding 1.

- `.claude/plugins/website-technical-agent/.claude-plugin/plugin.json` — plugin manifest
- `.claude/plugins/website-technical-agent/skills/tech-audit/SKILL.md:8` — *"You are the Website Technical Agent for Shumaker Roofing. On each run you execute four modules sequentially: URL Inventory → Website Health → Technical SEO → GSC Readiness. Then you write all findings to `memory/tech-audit/` and send a Discord alert."*
- Per `docs/superpowers/specs/2026-05-19-website-technical-agent-design.md:10`, this is designed to run **nightly as a cron job** and on-demand via `/tech-audit`, posting a summary to a Discord webhook (`DISCORD_WEBHOOK_URL` in `.env.local` — present, confirms the integration is at least configured).
- `.claude/settings.json:26` — `"website-technical-agent@local": true`.

This is, functionally, the same Claude-Code-driven tech-audit process that produced the 2026-11-11 audit report sitting next to this file — it is tooling for whoever maintains the site, not code the public site runs.

## Finding 3 — `docs/superpowers/specs/` and `docs/superpowers/plans/` — design docs for the above agents

**Classification: (b) unrelated-ish / supporting docs** — these are planning/spec markdown files (not executable), documenting the design and rollout of the two agent systems above (Findings 1–2). They account for the large majority of raw keyword hits (the words "agent"/"LLM" appear dozens of times describing agent roles, architecture, and MCP tool names). No new integration beyond what's already covered in Findings 1–2. Files: `2026-05-19-website-technical-agent-design.md`, `2026-05-13-competitor-researcher-design.md`, `2026-05-13-seo-multi-agent-design.md`, `2026-05-19-module3-performance-cwv-design.md`, `2026-05-19-discord-alerts-design.md`, `2026-05-13-competitor-researcher.md`, `2026-05-13-seo-multi-agent.md`, `2026-05-19-discord-alerts.md` (and matching entries in `memory/seo/*.md` logs referencing the same agents' run history).

## Finding 4 — GoHighLevel (GHL) chat widget on every page — **AMBIGUOUS, cannot verify internally**

**Classification: (c)-leaning but genuinely ambiguous black-box embed.** `components/shared/footer.tsx:178-183`:

```tsx
<Script
  src="https://widgets.leadconnectorhq.com/loader.js"
  data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
  data-widget-id="69b4bc502e3176149257552e"
  strategy="lazyOnload"
/>
```

This loads GoHighLevel's hosted **chat widget** on every page (footer is global). GoHighLevel's chat-widget product can be configured by the account owner to run either a plain human-staffed live chat, a rules-based bot, or (on some GHL plans) an AI-powered "Conversation AI" responder — **which mode is active is set inside the GHL account dashboard, not in this repo, and is invisible from the client-side loader script.** I cannot inspect GHL's backend config from this codebase. **Flagging per the task's stop condition rather than guessing:** this is the one integration where "does it have an AI component" cannot be answered from code alone — it would need to be checked directly in the client's GoHighLevel account settings.

## Finding 5 — GoHighLevel form + booking-calendar widgets — **(c) no AI component visible, CRM/form only**

- `components/shared/ghl-form.tsx` — iframe embed of a GHL form (`api.leadconnectorhq.com/widget/form/...`) plus `link.msgsndr.com/js/form_embed.js`. Used on `/contact` (`app/(site)/contact/page.tsx:8,138`). Standard lead-capture form widget; no chat/assistant behavior, no AI-related script or parameter anywhere in the embed code.
- `components/shared/ghl-calendar.tsx` — same pattern, booking/calendar iframe (`api.leadconnectorhq.com/widget/booking/...`). Used on `/book-appointment` (`app/(site)/book-appointment/page.tsx:7,147`).
- Both are wrapped in `components/shared/lazy-mount.tsx` for deferred loading (performance reason, documented in the 2026-11-11 tech audit §1/§4 — the Turnstile anti-bot challenge inside these forms is the single biggest page-weight contributor on `/contact`, but that's Cloudflare Turnstile bot-*protection*, not an AI feature).
- **Verdict: these two are plain CRM form/calendar widgets. No AI/chatbot behavior detectable in the embed code or network calls.**

## Finding 6 — Roofle instant-quote widget — **(c) no AI component visible, estimator widget only**

- `app/(site)/layout.tsx:22-24` — Roofle floating quote button, global script: `https://app.roofle.com/roof-quote-pro-widget.js?id=edgE0YoULrACgxaIeovOR`
- `components/home/roofle-widget.tsx` — embedded (non-floating) version on the homepage: `https://app.roofle.com/roof-quote-pro-embedded-widget.js?id=...`
- Roofle is a satellite-imagery/measurement-based instant roof-quote generator (confirmed from the script name and the 2026-11-11 audit's network trace: `assets.app.roofle.com` + `app.roofle.com`, 654 KB / 6 requests). It's a calculator/estimator product, not a conversational agent — no chat UI, no free-text input fields visible in the embed parameters. **No evidence of an LLM/chatbot component.** (Same black-box caveat as Finding 4 applies in principle — it's a hosted third-party script I can't inspect server-side — but unlike the GHL chat widget, nothing in Roofle's product surface or naming suggests a conversational/AI mode exists to even ask about.)

## Finding 7 — `package.json` / `package-lock.json` — no AI/LLM SDK dependencies

- Full dependency list checked directly (`cat package.json`) and `package-lock.json` scanned for any package `"name"` field containing `ai`, `llm`, `bot`, `agent`, `openai`, `anthropic`, or `langchain` (anchored, case-insensitive): **zero matches.**
- Confirmed absent: `@anthropic-ai/*`, `openai`, `langchain`, `@langchain/*`, `autogpt`, `crewai`, or any similarly-named package.
- An early exploratory grep of `package.json` for `ai|openai|anthropic|...` also surfaced `tailwind-merge` and `tailwindcss` — on inspection these matched only because `grep -i` treats the two concatenated characters in "Tailwind-merge" as part of a larger alternation scan artifact, not because either package has any AI relevance. Re-checked against the task's exact keyword list directly: neither name contains `agent`, `claude`, `openai`, `gpt`, `llm`, `bot`, etc. **Classification: (c)/non-issue** — ordinary CSS build tooling, included here only to show the check was run and came up clean.
- `undici` (Node's HTTP client, a transitive dep) contains an advisory titled *"...dropped tls options in **Agent**"* (`memory/tech-audit/raw-2026-11-11/npm-audit.json:1534,1550`) — **(c) pure coincidence**, "Agent" here is Node's `http.Agent`/`https.Agent` connection-pooling class, unrelated to AI agents.
- Lighthouse's own JSON output (`raw/lighthouse-*.json`) contains category keys named `agent-accessibility` / `agent-discoverability` — **(c) pure coincidence**, these are Lighthouse's own built-in audit categories (about making a site discoverable/accessible *to* AI crawlers/agents visiting it, a 2026-era Lighthouse feature), not anything in this app's code. Also many benign `userAgent`/`User-Agent` HTTP-header string matches throughout the same JSON files — **(c)**, standard browser/network terminology.

## Finding 8 — No server-side API routes or scripts calling an LLM

- Confirmed in the 2026-11-11 full audit (§9, re-verified here): `find . -path ./node_modules -prune -o -path "*/app/api/*" -print` → **no results.** `app/api/` does not exist in this codebase at all.
- `proxy.ts` (Next.js Middleware) — read in full: handles only 308 redirects and 410 Gone responses for legacy URLs. No network calls, no AI references.
- `lib/sanity.ts`, `lib/seo.ts` — Sanity CMS fetch helpers and SEO metadata builders. No LLM calls.
- **No first-party code anywhere calls out to any LLM/AI API.** All dynamic behavior is either Server Components fetching from Sanity directly, or third-party widgets (GHL/Roofle) POSTing to their own hosted endpoints.

## Finding 9 — Marketing copy keyword matches — pure text, no code

- No instances found of marketing copy using "bot", "assistant", "AI", etc. as sales language (e.g. no "Roofing Bot" branding anywhere in `app/`/`components/` page copy). The only "assistant"/"bot"-adjacent *text* on the actual site is the word "chat" inside the GHL widget's own hosted UI (Finding 4), which isn't this repo's copy at all — it's rendered entirely by the third-party script.

---

## Summary table

| # | Item | Location | Classification |
|---|---|---|---|
| 1 | SEO agent pipeline (7 Claude Code skills) | `.claude/plugins/seo-agents/` | (a) real agent system, dev-tooling only — not shipped to the site |
| 2 | Tech-audit agent (nightly cron + on-demand) | `.claude/plugins/website-technical-agent/` | (a) real agent system, dev-tooling only — not shipped to the site |
| 3 | Agent design/spec docs | `docs/superpowers/{specs,plans}/` | (b) supporting docs for #1–#2, not new code |
| 4 | GoHighLevel chat widget | `components/shared/footer.tsx:178-183` (every page) | **ambiguous** — black-box; could be AI-powered depending on GHL account config, unverifiable from this repo |
| 5 | GoHighLevel form + booking widgets | `components/shared/ghl-form.tsx`, `ghl-calendar.tsx` | (c) plain CRM form/calendar embeds, no AI |
| 6 | Roofle instant-quote widget | `app/(site)/layout.tsx:22-24`, `components/home/roofle-widget.tsx` | (c) estimator/calculator widget, no AI |
| 7 | `package.json`/`package-lock.json` | repo root | clean — no AI/LLM SDK dependencies at all |
| 8 | `app/api/`, `proxy.ts`, `lib/*.ts` | — | clean — no server-side LLM calls, no API routes exist |
| 9 | "bot"/"assistant" in marketing copy | — | none found |

## Answer

**This codebase does not contain any AI agent or chatbot code that is part of the public website.** The Next.js
application itself (`app/`, `components/`, `lib/`) has zero LLM/AI SDK dependencies, zero server-side AI API
calls, and no first-party chat/assistant UI. The only two things this repo contains that are genuinely
"AI agents" are the **`.claude/plugins/seo-agents/` and `.claude/plugins/website-technical-agent/` Claude Code
skill pipelines** — these are operator-side automation tooling for SEO content and technical audits, run
through Claude Code by a human, never bundled or served by the website build. The one unresolved question is
the **GoHighLevel chat widget embedded in the global footer** — its loader script is a third-party black box,
and whether the account behind it has AI-powered chat enabled cannot be determined from this codebase; that
would need to be checked directly in the GoHighLevel dashboard.
