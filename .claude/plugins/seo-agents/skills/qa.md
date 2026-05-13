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
