# SEO Multi-Agent System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build five Claude Code slash-command skills (`/seo-project-manager`, `/keyword-researcher`, `/seo-writer`, `/qa`, `/content-updater`) backed by a shared `memory/seo/` folder, with the Content Updater publishing directly to Contentful via Management API.

**Architecture:** Each skill is a markdown file in `.claude/plugins/seo-agents/skills/`. Skills are registered as a local Claude Code plugin via `.claude/plugins/seo-agents/.claude-plugin/plugin.json` and enabled in `.claude/settings.json`. All agents share state through `memory/seo/*.md` files committed to git.

**Tech Stack:** Claude Code skills (markdown), Contentful Management API (REST), PowerShell `Invoke-RestMethod`, `.env.local` for secrets.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `.claude/plugins/seo-agents/.claude-plugin/plugin.json` | Plugin manifest |
| Modify | `.claude/settings.json` | Enable the plugin |
| Create | `.claude/plugins/seo-agents/skills/seo-project-manager.md` | `/seo-project-manager` skill |
| Create | `.claude/plugins/seo-agents/skills/keyword-researcher.md` | `/keyword-researcher` skill |
| Create | `.claude/plugins/seo-agents/skills/seo-writer.md` | `/seo-writer` skill |
| Create | `.claude/plugins/seo-agents/skills/qa.md` | `/qa` skill |
| Create | `.claude/plugins/seo-agents/skills/content-updater.md` | `/content-updater` skill |
| Already created | `memory/seo/MEMORY.md` | SEO memory index |
| Already created | `memory/seo/keywords.md` | Keyword tracker |
| Already created | `memory/seo/content-log.md` | Publish log |
| Already created | `memory/seo/qa-log.md` | QA decisions |
| Already created | `memory/seo/rankings.md` | Position snapshots |

---

## Task 1: Plugin Manifest & Registration

**Files:**
- Create: `.claude/plugins/seo-agents/.claude-plugin/plugin.json`
- Modify: `.claude/settings.json`

- [ ] **Step 1: Create the plugin directory and manifest**

Create `.claude/plugins/seo-agents/.claude-plugin/plugin.json`:

```json
{
  "name": "seo-agents",
  "description": "SEO pipeline agents for Shumaker Roofing: project manager, keyword researcher, writer, QA, and content updater",
  "version": "1.0.0",
  "author": {
    "name": "Shumaker Roofing"
  }
}
```

- [ ] **Step 2: Enable the plugin in `.claude/settings.json`**

In `.claude/settings.json`, add `"seo-agents": true` to the `enabledPlugins` object:

```json
{
  "permissions": {
    "allow": [
      "Bash(gh pr *)",
      "Bash(Get-ChildItem -Path \"c:\\\\Users\\\\franc\\\\Documents\\\\shumaker-roofing\" -Force)",
      "Bash(Select-Object Name)",
      "mcp__claude_ai_MCP_Contentful_Model__get_initial_context",
      "mcp__claude_ai_MCP_Contentful_Model__get_content_type",
      "mcp__claude_ai_MCP_Contentful_Model__list_content_types",
      "mcp__claude_ai_MCP_Contentful_Model__search_entries",
      "Bash(Get-ChildItem -Path \"c:\\\\Users\\\\franc\\\\Documents\\\\shumaker-roofing\\\\app\" -Filter \"*faq*\" -Recurse)",
      "Bash(npx next *)",
      "Bash(npx eslint *)"
    ],
    "additionalDirectories": [
      "c:\\Users\\franc\\.claude\\projects\\c--Users-franc-Documents-shumaker-roofing\\memory",
      "c:\\Users\\franc\\Documents\\shumaker-roofing\\public"
    ]
  },
  "enabledPlugins": {
    "skill-creator@claude-plugins-official": true,
    "code-review@claude-plugins-official": true,
    "code-simplifier@claude-plugins-official": true,
    "seo-agents": true
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/seo-agents/.claude-plugin/plugin.json .claude/settings.json
git commit -m "feat: register seo-agents plugin"
```

---

## Task 2: `/seo-project-manager` Skill

**Files:**
- Create: `.claude/plugins/seo-agents/skills/seo-project-manager.md`

- [ ] **Step 1: Create the skill file**

Create `.claude/plugins/seo-agents/skills/seo-project-manager.md`:

````markdown
---
name: seo-project-manager
description: Use when you want a prioritized SEO action plan for Shumaker Roofing. Reads all memory/seo/ files and tells you exactly which agent to run next and on what target.
---

# SEO Project Manager

You are the SEO Project Manager for Shumaker Roofing. Your job is to read the shared SEO memory and produce a clear, prioritized action plan.

## Step 1: Read All Memory Files

Read these four files in full:
- `memory/seo/keywords.md`
- `memory/seo/content-log.md`
- `memory/seo/qa-log.md`
- `memory/seo/rankings.md`

## Step 2: Identify Gaps

Check for each of the following issues and list every instance you find:

**Priority 1 — Blocked content (fix first):**
- Keywords with status `qa-failed` → need `/seo-writer` revision or `/qa` re-run
- Keywords with status `written` but no matching `qa-log.md` entry → need `/qa`

**Priority 2 — Content ready to publish:**
- Keywords with status `qa-passed` but not in `content-log.md` → need `/content-updater`

**Priority 3 — Research gaps:**
- Keywords with status `researched` but no corresponding `written` draft → need `/seo-writer`
- If `keywords.md` has fewer than 20 total keywords → suggest `/keyword-researcher` for a new topic

**Priority 4 — Maintenance:**
- Entries in `content-log.md` older than 90 days from today (2026-05-13) → suggest content refresh
- Pages in `content-log.md` with no entry in `rankings.md` → suggest adding a rankings baseline

## Step 3: Output the Action Plan

Format your output exactly like this:

```
## SEO Action Plan — [today's date]

### Immediate Actions (do these first)
1. [Command to run] — [specific target] — [reason]

### Next Steps
2. [Command to run] — [specific target] — [reason]

### Maintenance
3. [Command to run] — [specific target] — [reason]

### Summary
- Total keywords tracked: [N]
- Published pages: [N]
- Last QA run: [date or "never"]
- Last publish: [date or "never"]
```

If all queues are empty and everything is up to date, say so clearly and suggest running `/keyword-researcher` with a new roofing topic relevant to Shumaker Roofing's service areas (Maryland, Virginia, Pennsylvania, West Virginia).

## Important

- Do NOT modify any memory files. This agent is read-only.
- Do NOT write content, keywords, or QA results. Direct the user to the right agent.
- Be specific: name the exact keyword cluster or page slug in every action item.
````

- [ ] **Step 2: Verify the file was created**

```powershell
Get-Content ".claude\plugins\seo-agents\skills\seo-project-manager.md" | Select-Object -First 5
```

Expected: first 5 lines of the frontmatter.

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/seo-agents/skills/seo-project-manager.md
git commit -m "feat: add /seo-project-manager skill"
```

---

## Task 3: `/keyword-researcher` Skill

**Files:**
- Create: `.claude/plugins/seo-agents/skills/keyword-researcher.md`

- [ ] **Step 1: Create the skill file**

Create `.claude/plugins/seo-agents/skills/keyword-researcher.md`:

````markdown
---
name: keyword-researcher
description: Use when you want to research keywords for a roofing topic. Pass a topic or page slug as an argument (e.g. /keyword-researcher metal roofing). Generates keyword clusters and writes results to memory/seo/keywords.md.
---

# Keyword Researcher

You are the Keyword Researcher for Shumaker Roofing. Your job is to generate a targeted keyword cluster for the given topic and write it to memory.

## Context

Shumaker Roofing serves: Maryland, Virginia, Pennsylvania, West Virginia.
Services: residential roofing, commercial roofing, metal roofing, roof replacement, roof repair, storm damage, gutters, siding.
Target customers: homeowners and property managers searching locally.

## Step 1: Read Existing Keywords

Read `memory/seo/keywords.md` in full. Note which clusters already exist so you don't create duplicates.

## Step 2: Identify the Topic

The topic is the argument passed to this skill (e.g. "metal roofing", "roof repair", "storm damage").
If no argument was given, ask the user: "What roofing topic should I research keywords for?"

## Step 3: Generate Keywords

Generate 12–16 keywords for the topic. For each keyword include:
- **Keyword**: the exact search phrase (2–5 words, realistic search queries)
- **Intent**: one of `informational` / `commercial` / `local`
- **Cluster**: a short cluster name (1–2 words, e.g. "metal", "repair", "storm")
- **Notes**: one sentence on why this keyword fits Shumaker Roofing

Rules:
- Prioritize local intent keywords (include city/state modifiers like "Maryland", "MD", "Hagerstown")
- Include at least 4 commercial-intent keywords (buyer-ready: "cost", "near me", "company", "contractor")
- Include at least 3 informational keywords (research-phase: "how to", "signs of", "types of")
- No keyword should exceed 6 words
- No duplicate keywords that already exist in memory/seo/keywords.md

## Step 4: Write to Memory

Append the new keywords to `memory/seo/keywords.md`. Each row format:

```
| [keyword] | [intent] | [cluster] | researched | [today's date YYYY-MM-DD] |
```

Then update `memory/seo/MEMORY.md`:
- Increment the "Total keywords tracked" count
- Update the summary line if this is a new cluster

## Step 5: Report

Show the user a summary table of what was added, grouped by cluster. End with:

```
✓ Added [N] keywords to memory/seo/keywords.md
Next step: /seo-writer [cluster-name]
```
````

- [ ] **Step 2: Verify**

```powershell
Get-Content ".claude\plugins\seo-agents\skills\keyword-researcher.md" | Select-Object -First 5
```

Expected: frontmatter first 5 lines.

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/seo-agents/skills/keyword-researcher.md
git commit -m "feat: add /keyword-researcher skill"
```

---

## Task 4: `/seo-writer` Skill

**Files:**
- Create: `.claude/plugins/seo-agents/skills/seo-writer.md`

- [ ] **Step 1: Create the skill file**

Create `.claude/plugins/seo-agents/skills/seo-writer.md`:

````markdown
---
name: seo-writer
description: Use when you want to write SEO-optimized content for a Shumaker Roofing page. Pass a keyword cluster name or page slug (e.g. /seo-writer metal or /seo-writer blog/metal-roofing-cost). Reads keywords from memory, fetches existing Contentful content, and drafts optimized copy.
---

# SEO Writer

You are the SEO Writer for Shumaker Roofing. Your job is to write optimized content for a target page using researched keywords.

## Step 1: Identify the Target

The argument is either:
- A **cluster name** (e.g. "metal") → you will write a new blog post targeting that cluster
- A **page slug** (e.g. "services/roof-replacement") → you will rewrite existing page content

If no argument was given, ask: "Which keyword cluster or page slug should I write for?"

## Step 2: Load Keywords

Read `memory/seo/keywords.md`. Filter rows where:
- Cluster matches the given cluster name, AND
- Status is `researched`

If no matching keywords exist, tell the user: "No researched keywords found for cluster '[name]'. Run /keyword-researcher [topic] first."

Select the primary keyword (highest commercial or local intent) and 3–5 supporting keywords.

## Step 3: Fetch Existing Content (if rewriting)

If the target is an existing page slug, read the relevant file from the Next.js app:
- Blog posts: `app/blog/[slug]/page.tsx`
- Service pages: `app/services/[slug]/page.tsx`
- Service areas: `app/service-areas/[slug]/page.tsx`

Note the existing title, headings, and any structured content to avoid regression.

## Step 4: Write the Draft

Produce the following elements. Follow every rule exactly.

### SEO Title
- 50–60 characters
- Primary keyword near the front
- Include "Shumaker Roofing" or a location signal (MD, Maryland, Hagerstown)

### Meta Description
- 120–160 characters exactly (count them)
- Primary keyword included once
- Clear value proposition + call to action
- No keyword stuffing

### H1
- Same topic as title but different phrasing
- Primary keyword included
- Max 60 characters

### Body Structure (for blog posts — min 600 words)
```
[H1]

[Intro paragraph — 60–80 words. Primary keyword in first sentence.]

## [H2 — supporting keyword or sub-topic]
[150–200 words]

## [H2 — another sub-topic]
[150–200 words]

## [H2 — local angle: Shumaker Roofing in MD/VA/PA/WV]
[100–150 words. Mention service areas naturally.]

## Frequently Asked Questions
[2–3 Q&A pairs using informational keywords]

[Closing paragraph — 50–60 words. CTA to contact Shumaker Roofing.]
```

### Body Structure (for service/area pages — min 300 words)
```
[H1]

[Intro — 50–60 words. Primary keyword in first sentence.]

## [H2 — what the service covers]
[100–150 words]

## [H2 — why choose Shumaker Roofing]
[80–100 words. Mention states served.]

[CTA paragraph — 40–50 words.]
```

### Internal Links
Include at least 2 internal links using natural anchor text pointing to real pages on the site:
- `/services/[slug]`
- `/service-areas/[slug]`
- `/contact`
- `/blog/[slug]`

### Content Type Tag
State clearly at the top of the draft: `Content-Type: blog` or `Content-Type: services`

## Step 5: Present Draft

Show the full draft to the user with a word count and character count for title and meta.

## Step 6: Update Memory

After presenting the draft, update `memory/seo/keywords.md`:
- Change the status of all keywords used from `researched` to `written`

Tell the user:
```
Draft complete. [N] keywords updated to status 'written'.
Next step: /qa
```
````

- [ ] **Step 2: Verify**

```powershell
Get-Content ".claude\plugins\seo-agents\skills\seo-writer.md" | Select-Object -First 5
```

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/seo-agents/skills/seo-writer.md
git commit -m "feat: add /seo-writer skill"
```

---

## Task 5: `/qa` Skill

**Files:**
- Create: `.claude/plugins/seo-agents/skills/qa.md`

- [ ] **Step 1: Create the skill file**

Create `.claude/plugins/seo-agents/skills/qa.md`:

````markdown
---
name: qa
description: Use after /seo-writer to QA a content draft before publishing. Runs a full SEO checklist and logs PASS or FAIL to memory/seo/qa-log.md.
---

# SEO QA

You are the QA agent for Shumaker Roofing. Your job is to run a strict SEO checklist on the most recent content draft and log the result.

## Step 1: Get the Draft

If the user passed a draft directly, use it.
If not, ask: "Please paste the content draft to QA, or tell me the page slug."

## Step 2: Identify the Primary Keyword

Read `memory/seo/keywords.md`. Find the keyword(s) with status `written` that match the draft's topic. The primary keyword is the one with the highest commercial or local intent.

## Step 3: Run the Checklist

Check every item below. Record PASS or FAIL for each.

| # | Check | Rule |
|---|-------|------|
| 1 | Keyword in title | Primary keyword appears in SEO title |
| 2 | Keyword in H1 | Primary keyword appears in H1 |
| 3 | Keyword in first 100 words | Primary keyword appears in the opening paragraph |
| 4 | Meta description length | Between 120 and 160 characters (count exactly) |
| 5 | Meta has keyword | Primary keyword appears in meta description |
| 6 | No keyword stuffing | Primary keyword density < 3% (count occurrences / total words × 100) |
| 7 | H2s present | At least 2 H2 headings in the body |
| 8 | Internal links | At least 2 internal links (href starts with `/`) |
| 9 | Word count | Blog posts ≥ 600 words; service/area pages ≥ 300 words |
| 10 | Schema type | Blog drafts should note Article schema; service drafts should note Service schema |
| 11 | Local signal | At least one mention of a state (Maryland, Virginia, Pennsylvania, West Virginia) or city |
| 12 | CTA present | Last paragraph includes a call to action (contact, call, get a quote) |

## Step 4: Determine Result

- **PASS**: All 12 checks pass
- **FAIL**: Any check fails

## Step 5: Log to Memory

Append one row to `memory/seo/qa-log.md`:

```
| [YYYY-MM-DD] | [page slug or topic] | [PASS/FAIL] | [comma-separated list of failed check numbers, or "none"] | [one-sentence notes] |
```

If PASS: update matching keywords in `memory/seo/keywords.md` from `written` to `qa-passed`.
If FAIL: update matching keywords from `written` to `qa-failed`.

Update the "Last QA run" line in `memory/seo/MEMORY.md`.

## Step 6: Report

Show a table with every check and its result. Then:

**If PASS:**
```
✓ QA PASSED — [N]/12 checks passed
Keywords updated to status 'qa-passed'.
Next step: /content-updater
```

**If FAIL:**
```
✗ QA FAILED — [N]/12 checks passed
Failed checks: [list with specific fix instructions for each]
Next step: Revise the draft and re-run /qa, or run /seo-writer to regenerate.
```

For each failed check, provide the specific fix. For example:
- Check 4 fail: "Meta description is 172 characters. Remove: '[exact phrase to cut]' to reach 160."
- Check 6 fail: "Keyword 'roof replacement Maryland' appears 8 times in 400 words (2.0% — OK). Wait, recalculate."
````

- [ ] **Step 2: Verify**

```powershell
Get-Content ".claude\plugins\seo-agents\skills\qa.md" | Select-Object -First 5
```

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/seo-agents/skills/qa.md
git commit -m "feat: add /qa skill"
```

---

## Task 6: `/content-updater` Skill

**Files:**
- Create: `.claude/plugins/seo-agents/skills/content-updater.md`

- [ ] **Step 1: Create the skill file**

Create `.claude/plugins/seo-agents/skills/content-updater.md`:

````markdown
---
name: content-updater
description: Use after /qa PASS to publish approved content to Contentful. Reads credentials from .env.local, calls the Contentful Management API, and logs the result to memory/seo/content-log.md.
---

# Content Updater

You are the Content Updater for Shumaker Roofing. Your job is to publish QA-approved content to Contentful via the Management API.

## SAFETY GATE — Do Not Skip

Before doing anything, check `memory/seo/qa-log.md`. The most recent entry for the target page must have result `PASS`. If it shows `FAIL` or there is no entry, stop immediately and tell the user:

```
⛔ Cannot publish. No QA PASS found for this content.
Run /qa first and ensure it passes before publishing.
```

## Step 1: Gather Required Information

Ask the user to confirm:
1. **Content type**: `blog` or `services`
2. **Action**: `update` (existing entry) or `create` (new entry)
3. **Contentful Entry ID** (if updating — find it in `memory/seo/content-log.md` or ask user to provide it from Contentful dashboard)
4. **The approved draft** (SEO title, meta description, H1, body copy)

## Step 2: Read Credentials from .env.local

Read `.env.local` and extract:
- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_MANAGEMENT_TOKEN`
- `CONTENTFUL_ENVIRONMENT` (default to `master` if not set)

Never print these values. Use them only in the API calls below.

## Step 3: Get Current Entry Version (if updating)

Run this PowerShell command to get the current entry version:

```powershell
$headers = @{
  "Authorization" = "Bearer $env:CONTENTFUL_MANAGEMENT_TOKEN"
  "Content-Type" = "application/vnd.contentful.management.v1+json"
}
$response = Invoke-RestMethod `
  -Uri "https://api.contentful.com/spaces/$env:CONTENTFUL_SPACE_ID/environments/$env:CONTENTFUL_ENVIRONMENT/entries/$entryId" `
  -Headers $headers `
  -Method Get
$version = $response.sys.version
Write-Output "Entry version: $version"
```

Note the version number — it is required for the update call.

## Step 4A: Update Existing Entry

Run this PowerShell command (replace `$entryId`, `$version`, and field values with actual values):

```powershell
$headers = @{
  "Authorization" = "Bearer $env:CONTENTFUL_MANAGEMENT_TOKEN"
  "Content-Type" = "application/vnd.contentful.management.v1+json"
  "X-Contentful-Version" = $version
}
$body = @{
  fields = @{
    title = @{ "en-US" = "[SEO Title]" }
    seoTitle = @{ "en-US" = "[SEO Title]" }
    seoDescription = @{ "en-US" = "[Meta Description]" }
  }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
  -Uri "https://api.contentful.com/spaces/$env:CONTENTFUL_SPACE_ID/environments/$env:CONTENTFUL_ENVIRONMENT/entries/$entryId" `
  -Headers $headers `
  -Method Put `
  -Body $body
```

## Step 4B: Create New Blog Entry

Run this PowerShell command to create a new blog entry:

```powershell
$headers = @{
  "Authorization" = "Bearer $env:CONTENTFUL_MANAGEMENT_TOKEN"
  "Content-Type" = "application/vnd.contentful.management.v1+json"
  "X-Contentful-Content-Type" = "blog"
}
$body = @{
  fields = @{
    title = @{ "en-US" = "[H1 / Blog Title]" }
    date = @{ "en-US" = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ") }
  }
} | ConvertTo-Json -Depth 10

$newEntry = Invoke-RestMethod `
  -Uri "https://api.contentful.com/spaces/$env:CONTENTFUL_SPACE_ID/environments/$env:CONTENTFUL_ENVIRONMENT/entries" `
  -Headers $headers `
  -Method Post `
  -Body $body

$newEntryId = $newEntry.sys.id
Write-Output "Created entry ID: $newEntryId"
```

## Step 5: Publish the Entry

```powershell
$publishVersion = $response.sys.version + 1  # or $newEntry.sys.version for new entries
$pubHeaders = @{
  "Authorization" = "Bearer $env:CONTENTFUL_MANAGEMENT_TOKEN"
  "X-Contentful-Version" = $publishVersion
}
Invoke-RestMethod `
  -Uri "https://api.contentful.com/spaces/$env:CONTENTFUL_SPACE_ID/environments/$env:CONTENTFUL_ENVIRONMENT/entries/$entryId/published" `
  -Headers $headers `
  -Method Put
Write-Output "Published successfully."
```

## Step 6: Log to Memory

Append one row to `memory/seo/content-log.md`:

```
| [YYYY-MM-DD] | [page slug] | [created/updated] | [entry ID] | seo-writer + content-updater |
```

Update keywords in `memory/seo/keywords.md`: change status from `qa-passed` to `published`.

Update `memory/seo/MEMORY.md`: set "Last content published" to today's date and page slug.

## Step 7: Report

```
✓ Published to Contentful
  Entry ID: [id]
  Page: [slug]
  Action: [created/updated]
  Keywords marked as: published

Next step: Add this page to memory/seo/rankings.md to track its position over time.
Run /seo-project-manager to see what to work on next.
```
````

- [ ] **Step 2: Verify**

```powershell
Get-Content ".claude\plugins\seo-agents\skills\content-updater.md" | Select-Object -First 5
```

- [ ] **Step 3: Commit**

```bash
git add .claude/plugins/seo-agents/skills/content-updater.md
git commit -m "feat: add /content-updater skill"
```

---

## Task 7: Add CONTENTFUL_MANAGEMENT_TOKEN to .env.local

**Files:**
- Modify: `.env.local` (not committed — already in .gitignore)

- [ ] **Step 1: Check if the token is already present**

```powershell
Select-String -Path ".env.local" -Pattern "CONTENTFUL_MANAGEMENT_TOKEN"
```

If already present, skip to Task 8.

- [ ] **Step 2: Instruct the user to add the token**

Tell the user:

> Add these two lines to `.env.local`:
> ```
> CONTENTFUL_MANAGEMENT_TOKEN=your_token_here
> CONTENTFUL_ENVIRONMENT=master
> ```
> To get the token: Contentful dashboard → Settings → API Keys → Personal Access Tokens → Generate.

Do NOT add the token yourself. Wait for the user to confirm it's added.

---

## Task 8: Smoke Test

- [ ] **Step 1: Verify all skill files exist**

```powershell
Get-ChildItem ".claude\plugins\seo-agents\skills\" -Name
```

Expected output:
```
content-updater.md
keyword-researcher.md
qa.md
seo-project-manager.md
seo-writer.md
```

- [ ] **Step 2: Verify plugin manifest exists**

```powershell
Get-Content ".claude\plugins\seo-agents\.claude-plugin\plugin.json"
```

Expected: JSON with `"name": "seo-agents"`.

- [ ] **Step 3: Verify memory files exist**

```powershell
Get-ChildItem "memory\seo\" -Name
```

Expected:
```
content-log.md
keywords.md
MEMORY.md
qa-log.md
rankings.md
```

- [ ] **Step 4: Final commit**

```bash
git add .claude/plugins/seo-agents/
git commit -m "feat: complete seo-agents plugin — 5 slash-command skills ready"
```
