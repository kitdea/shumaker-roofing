# Shumaker Roofing — Full Technical Audit (Fresh Clone)

**Date:** 2026-11-11
**Auditor:** web-designer-dev (Hermes)
**Source:** fresh `git clone https://github.com/kitdea/shumaker-roofing.git` into an isolated
scratch workspace — **not** the pre-existing local checkout at `/home/kldl/Documents/shumaker-roofing`.
**Raw tool output:** `memory/tech-audit/raw-2026-11-11/` (lighthouse JSON ×4, pa11y JSON ×4,
npm-audit.json, depcheck.json, eslint-print-config.json, build.log, lint.log, robots.txt,
sitemap.xml). Every finding below cites either a `file:line` or one of these files.

This report **supersedes** the previous version of this file (local-checkout static audit)
and both prior task passes (`t_add1d3bd`, `t_33db8e07`). Numbers here were re-verified from
a clean clone, not copied forward from either prior pass.

## Clone provenance — HEAD comparison

| | Fresh clone | Local checkout (`/home/kldl/Documents/shumaker-roofing`) |
|---|---|---|
| HEAD commit | `5ea006935125cf4d040671d51310c83be745c2cc` | `5ea006935125cf4d040671d51310c83be745c2cc` |
| Commit date | 2026-11-05 20:37:17 +0800 | same |
| `git status` | clean | clean on tracked files; two **untracked** files present: `content-drafts/windows-service-page.md` and `memory/tech-audit/codebase-audit-2026-11-11.md` (the report this one replaces) |

**Verdict: HEAD matches exactly — no drift on tracked source.** The local checkout's only
difference from origin is two untracked working files (a content draft and the previous
audit report itself), neither of which affects the codebase being audited. No diff to flag.

## Environment

- Node v26.13.0 (via nvm; system default `node` was v18.19.1, too old for Next 16.2 — used nvm per task instructions)
- npm 11.20.0
- `npm install`: 1331 packages, 15s, 37 vulnerabilities reported (see §6)
- `.env.local` populated from the local checkout's existing values (`NEXT_PUBLIC_SANITY_PROJECT_ID=rg9pahe7`, `NEXT_PUBLIC_SANITY_DATASET=production`, plus the read token) — the build fails immediately without it (`Missing environment variable: NEXT_PUBLIC_SANITY_DATASET`, `sanity/env.ts:16`), confirming this isn't optional for a working build.
- `npm run build` (next build, Turbopack): succeeds, 61 static/SSG pages generated in ~7s wall / see `raw/build.log`
- Server: `next start -p 4100` on Node 26.13.0, routes verified with curl (200s), killed cleanly via `process_manage kill` at the end — confirmed down with a follow-up curl (`000`/connection refused)

---

## 1. Performance — bundle, next/image, deps, lint

**Bundle / chunks** (`.next/static/chunks`, 317 MB total `.next`, dev artifacts included):
- Largest chunk is 4.2 MB (`26q53zo3i1gn8.js`). Traced via `grep -rl` against `.next/server/app/**/*_client-reference-manifest.js` → it belongs **only** to `app/studio/[[...tool]]/page_client-reference-manifest.js` — i.e. it's the embedded Sanity Studio bundle, loaded only on `/studio`, never shipped to public site routes. **Not a public-page bloat problem.** (Minor/informational.)
- Second largest, 1.3 MB, is also Studio-scoped (same manifest).
- Public-route first-party JS is modest — see §4 for the measured network breakdown: home page first-party transfer is 441 KB across 31 requests. The real page-weight problem is third-party (§4), not first-party bundle size.

**next/image discipline:**
- 24 files use `next/image`; only 3 raw `<img>` tags exist app-wide (`grep -rn "<img" app components`):
  - `components/shared/navbar.tsx:77` and `:85` — both have `{/* eslint-disable-next-line @next/next/no-img-element */}` directly above them, explicit `width`/`height`, and are small SVG logos (no benefit from next/image's raster optimization). Deliberate, documented opt-out. **Not a finding.**
  - `components/shared/footer.tsx:33` — same pattern (`src="/favicon.svg"`, `width={224} height={56}`) but **missing** the eslint-disable comment, so it fires as a real, unsuppressed lint warning (see lint.log). **Minor** — either add the same suppression comment used in navbar.tsx for consistency, or swap to `next/image`.

**depcheck** (`raw/depcheck.json`):
- Unused `dependencies`: `@sanity/icons` — not imported anywhere in app/components/lib/sanity schema files.
- Unused `devDependencies`: `@types/node`, `@types/react-dom`, `postcss` — these are standard false positives for depcheck (consumed implicitly by the TS/Next/Tailwind toolchain, not via direct `import`), not a real cleanup item.
- **Minor**: drop `@sanity/icons` from `package.json` if confirmed unused in the Studio config too (schema files only were checked here).

**ESLint** (`npm run lint`, `raw/lint.log`): 6 problems — 1 error, 5 warnings.
- **Moderate** — `components/shared/lazy-mount.tsx:33` — `react-hooks/set-state-in-effect` **error**: `setVisible(true)` called synchronously inside a `useEffect` body (IntersectionObserver fallback branch), which the React compiler/eslint flags as a cascading-render risk. This is a real `error`-severity lint finding, and — critically — **`npm run build` does not run ESLint at all** (confirmed: `raw/build.log` has no "Running ESLint" step, and no `eslint: { ignoreDuringBuilds }` override exists in `next.config.mjs` to explain it; Next 16/Turbopack build simply doesn't gate on lint by default here). Combined with no CI (§7), this error-level issue can ship to production silently — nothing currently stops it.
- `components/shared/footer.tsx:33` — `@next/next/no-img-element` warning (see above).
- 4× "Unused eslint-disable directive" warnings in `app/(site)/about/team-grid.tsx:21`, `lib/sanity.ts:301`, `lib/seo.ts:24`, `lib/seo.ts:164` — dead suppression comments for `@typescript-eslint/no-explicit-any` that no longer fire. **Minor housekeeping.**

**Static a11y lint coverage** (jsx-a11y) — see §3a: only 6 of 39 available rules are active.

---

## 2. SEO technicals

**Metadata API coverage:** 19/19 `app/(site)/**/page.tsx` routes have either `generateMetadata()` (5 dynamic/CMS-backed routes: home, `services/[slug]`, `blog/[slug]`, `blog/author/[slug]`, `service-areas/[slug]`) or a static `export const metadata: Metadata` object (14 static routes). **Full coverage, verified file-by-file** — no gaps.

**Canonical handling:** all 19 routes carry `alternates.canonical` (static pages hardcode `{ canonical: "/path" }`; dynamic pages resolve it in `lib/seo.ts:67-69` via `buildNextMetadata(..., canonicalPath)`, where the page-specific path always wins over any CMS-stored canonical). Verified by `grep -c "alternates"` returning 1 for all 14 static pages plus the 5 dynamic ones confirmed by reading `lib/seo.ts`. **No finding — this is solid.**

**JSON-LD:** `components/shared/json-ld.tsx` renders `<script type="application/ld+json">{JSON.stringify(schema)}</script>` — standard, safe pattern (no raw string concatenation). Verified valid parseable JSON by curling the live home page and inspecting the rendered `<script>` tag directly — well-formed `LocalBusiness`/`RoofingContractor` schema with address, areaServed, openingHours, sameAs. JSON-LD present across all 19 routes (`grep -rln "JsonLd"` matches every page file).

- **Critical/confirmed bug:** `app/(site)/page.tsx:46` — the homepage's Organization JSON-LD sets `"logo": "${SITE_URL}/logo.png"`, but **`public/logo.png` does not exist** (`public/` only has `favicon.svg`, `logo-dark.svg`, `logo.svg` — no `.png` at all). Confirmed live: `curl http://localhost:4100/logo.png` → **404**. This breaks the `logo` property of the Organization/LocalBusiness structured data (Google's structured-data validator requires the referenced image to resolve), costing rich-result eligibility. **Fix:** either add a real `logo.png` to `public/` or point the JSON-LD `logo` field at `logo.svg` / a Sanity-hosted raster (Google's logo guidance prefers non-SVG, so exporting a PNG from the existing SVG is the cleanest fix).

**robots.txt** (`raw/robots.txt`, fetched live):
```
User-Agent: *
Allow: /

Sitemap: https://shumakerroofing.com/sitemap.xml
```
- **Moderate:** blanket `Allow: /` with **no `Disallow: /studio`**. The embedded Sanity Studio at `/studio/[[...tool]]` sets `export { metadata, viewport } from 'next-sanity/studio'`, and `next-sanity`'s shipped default metadata does include `robots: "noindex"` (confirmed via `grep -rn "noindex" node_modules/next-sanity/dist/studio/*.js` → `robots: "noindex"` present) — so Studio pages won't get indexed even without a robots.txt rule. But there is **no crawl-level block**, so bots can still fetch/crawl `/studio/*` paths (wasted crawl budget, and the Studio admin UI shape is discoverable). Low exploit value since Studio still requires Sanity auth to actually do anything, but it's free to close: add `disallow: ["/studio"]` to `app/robots.ts`'s rules.

**sitemap.xml** (`raw/sitemap.xml`, fetched live): 53 `<url>` entries, built dynamically in `app/sitemap.ts` from 14 hardcoded static routes + Sanity-fetched `serviceEntries`/`blogEntries`/`authorEntries`/`locationUrls`.
- **No `/studio` URLs present** — confirmed via `grep -i studio raw/sitemap.xml` (no match). Correctly excluded.
- `/thank-you` is correctly **excluded** from the sitemap (it's not in the 14 hardcoded static entries) and its `page.tsx` sets `robots: { index: false, follow: true, nocache: true }` — consistent, correct treatment of a form-confirmation page.
- All static+dynamic route types enumerated in the `CLAUDE.md` route table are represented in the sitemap generator. No content route appears to be missing.

---

## 3. Accessibility

### 3a. Static lint (eslint-plugin-jsx-a11y)

`eslint.config.mjs` only extends `eslint-config-next/core-web-vitals`. Ran `npx eslint --print-config app/layout.tsx` (`raw/eslint-print-config.json`) and grepped for configured `jsx-a11y/*` rule keys:

```
jsx-a11y/alt-text
jsx-a11y/aria-props
jsx-a11y/aria-proptypes
jsx-a11y/aria-unsupported-elements
jsx-a11y/role-has-required-aria-props
jsx-a11y/role-supports-aria-props
```

That's **6 of the 39 rules** shipped in `eslint-plugin-jsx-a11y` (`ls node_modules/eslint-plugin-jsx-a11y/lib/rules | wc -l` → 39). The plugin itself resolves as a transitive dep of `eslint-config-next` (not a direct devDependency), and Next's `core-web-vitals` preset only turns on its minimal baseline — rules like `anchor-is-valid`, `click-events-have-key-events`, `heading-has-content`, `label-has-associated-control`, `no-autofocus`, `tabindex-no-positive`, `no-noninteractive-element-interactions` are **not enabled**.

- **Moderate** — static a11y coverage is ~15% of the available ruleset. Recommend adding `eslint-plugin-jsx-a11y`'s `recommended` config directly (or `plugin:jsx-a11y/strict`) on top of `core-web-vitals` rather than relying on Next's minimal defaults.

### 3b. Runtime scan — pa11y (axe-core + HTML_CodeSniffer) against the built+served app

Ran `npx pa11y <url> --reporter json` against all 4 required routes on the locally served build (port 4100, Node 26.13.0). Full JSON per route in `raw/pa11y-{home,service,blog,contact}.json`.

| Route | Issues | Runner |
|---|---|---|
| `/` | 3 | htmlcs |
| `/services/roof-repair` | 2 | htmlcs |
| `/blog/roof-rejuvenation-cost-frederick-md` | 2 | htmlcs |
| `/contact` | 2 | htmlcs |

All 9 reported issues are `WCAG2AA.Principle1.Guideline1_4.1_4_3` **contrast failures**, consistently reproducing on `<span class="text-primary ...">` text in a few recurring spots:

- **Moderate** — `<span class="text-primary font-bold tracking-wider uppercase text-sm">` section eyebrow labels ("Our Work", "Certifications & Partnerships") on home and contact: measured ratio **2.82:1** and **3.45:1** against a required **4.5:1** (normal text). Recommended fix color from pa11y: `#fffefd` / `#fffdfc` — i.e. the issue is a near-white-on-light-background combination, not a dark-mode-only bug.
- **Moderate** — footer brand wordmark `<span class="text-primary">Roofing</span>` (`html > body > footer > div > div:nth-child(1) > div:nth-child(1) > a > span > span`), present on **every page** tested (all 4): ratio **2.82:1** against a required **3:1** (large/bold text threshold), recommended fix: change background to `#192436`. This is the single highest-value fix — one component (`components/shared/footer.tsx`) touches all 4 routes' worth of findings at once.
- No ARIA-misuse, missing-label, or keyboard-trap issues surfaced by htmlcs on any of the 4 routes.

**Note:** pa11y's default runner here is `htmlcs` only; axe-core findings came through via the separate Lighthouse accessibility audit below, which uses axe internally.

### 3c. Runtime scan — Lighthouse accessibility category (axe-core-backed)

From `raw/lighthouse-{home,service,blog,contact}.json`, accessibility scores: **home 0.97, service 0.96, blog 0.95, contact 0.95** (out of 1.0).

- `color-contrast` audit fails on all 4 (score 0) — corroborates pa11y's htmlcs findings above; same root cause, two tools agreeing.
- **Moderate** — `heading-order` fails on **blog** and **contact** only (score 0). Specific element flagged on the blog post page: `<h4 class="font-bold text-foreground">Tyler Schisler</h4>` at DOM path `MAIN > DIV > DIV > DIV > DIV > DIV > H4` (author byline card) — jumps past an `h2`/`h3` level, breaking sequential heading order. No skip-link issues surfaced on any route.

---

## 4. Real measured performance (Lighthouse, headless Chrome, same 4 routes)

Chrome launched via `CHROME_PATH=/home/kldl/.cache/puppeteer/chrome/linux-157.0.8103.50/chrome-linux64/chrome npx lighthouse --chrome-flags="--headless --no-sandbox"`. Full traces in `raw/lighthouse-*.json`.

| Route | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT | TTI |
|---|---|---|---|---|---|---|---|---|
| `/` | 0.50 | 0.97 | 0.54 | 0.92 | **10.3 s** | 0 | 1,340 ms | 15.3 s |
| `/services/roof-repair` | 0.51 | 0.96 | 0.54 | 1.00 | **9.1 s** | 0 | 1,210 ms | 15.4 s |
| `/blog/roof-rejuvenation-cost-frederick-md` | 0.51 | 0.95 | 0.54 | 1.00 | **6.6 s** | 0 | 1,370 ms | 15.2 s |
| `/contact` | 0.51 | 0.95 | 0.54 | 1.00 | **15.8 s** | 0.078 | 960 ms | **26.1 s** |

- **Critical** — LCP is 6.6–15.8 s across every route tested (Core Web Vitals "Good" threshold is ≤2.5 s; these are 3–6× over "Poor"). TBT (960–1,370 ms) is also solidly in "Poor" territory (threshold: ≤200 ms good). SEO score of 0.92 on home vs 1.00 elsewhere is explained by nothing route-specific found in the audit list — not chased further given time budget.
- **Root cause, confirmed via `network-requests` audit breakdown (home page):** of 89 requests / ~2.0 MB transferred, **first-party is only 31 requests / 441 KB**; third-party is **58 requests / 1,558 KB (78% of page weight)**. Breakdown by domain:
  - `googletagmanager.com` — 529 KB / 3 req
  - `assets.app.roofle.com` + `app.roofle.com` (Roofle instant-estimate widget) — 654 KB / 6 req
  - `widgets.leadconnectorhq.com` + `stcdn.leadconnectorhq.com` + `services.leadconnectorhq.com` (GoHighLevel forms/calendar) — 190 KB / 17 req
  - `connect.facebook.net` (Meta Pixel) — 117 KB / 2 req
  - plus Microsoft Clarity, Bing, fonts.bunny.net
  - This is a marketing-stack problem, not a Next.js/first-party code problem — `mainthread-work-breakdown` shows 11.1 s of "Other" (mostly third-party script execution) out of a 19.2 s total main-thread budget on the contact page.
- **Critical, contact page specifically** — total page weight **11.8 MB / 322 requests** (vs ~2 MB/89 req on other routes). Dominated by **Cloudflare Turnstile** (anti-bot challenge embedded inside the GHL form widget): 5 separate ~1.4–1.5 MB XHR loads of `challenges.cloudflare.com/.../fo/...` plus 5 more ~210 KB Turnstile iframe documents — roughly **9 MB of the 11.8 MB is Turnstile alone**, reloading repeatedly rather than caching/reusing a single challenge. This single widget is the reason `/contact` has the worst LCP (15.8 s) and is the only route to trip `bf-cache` (back/forward cache blocked) and `total-byte-weight` (score 0.5, "Total size was 11,827 KiB"). Fix ownership is the GHL/Roofle vendor integration, not app code, but it's worth escalating to whoever owns that embed — this one widget is actively tanking the highest-intent page on the site.
- **errors-in-console** (score 0 on all 4 routes) — 10 console errors per page, consistent set:
  - 2× `404` resource load failures (unidentified in the audit payload beyond "Failed to load resource... 404")
  - 2× Google-ads tracking-pixel image loads flagged by Chrome's security panel (`google.com.ph/ads/ga-audiences`, `.../pagead/1p-user-list`) — benign ad-tech noise, not an app bug
  - **2× CSP violation** on `http://cdn.callrail.com/.../swap.js` — traced to `app/layout.tsx:90`: `src="//cdn.callrail.com/companies/225471548/622609537a81b32b2734/12/swap.js"` (protocol-relative URL). On `http://localhost` this resolves to `http://cdn.callrail.com`, which the CSP's `script-src` rejects (only `https://cdn.callrail.com` is allowlisted — see `next.config.mjs`). **On the real production site (served over HTTPS, with HSTS forcing HTTPS)**, the same protocol-relative URL resolves to `https://` and would **not** violate the CSP — so this is most likely a **test artifact of running on plain-HTTP localhost, not a live production bug**. Flagging as **Minor** with that caveat; worth a one-time production spot-check (view page source console) to be sure, but I did not have an HTTPS-served instance to verify directly.
  - 2× CSP violations on `nexus.ensighten.com` and `clickcease.com` scripts — **not found anywhere in the app source** (`grep -rn "ensighten\|clickcease"` → no matches), meaning these are injected via Google Tag Manager's container config (not app code) and are correctly being blocked because they're not in the CSP `script-src` allowlist. **Moderate** — flag to whoever manages the GTM container: either these tags are dead/misconfigured, or they're intentional and the CSP needs those two domains added.
  - 2× `_vercel/insights/script.js` and `_vercel/speed-insights/script.js` MIME-type errors ("Refused to execute script... MIME type 'text/plain'") — `@vercel/analytics`/`@vercel/speed-insights` only resolve correctly when served by Vercel's edge infrastructure; this is expected/harmless noise on a local `next start`, not a real bug (the local server serves a placeholder for those endpoints).
- **best-practices score 0.54 on all 4 routes** — driven by `is-on-https: 0` (Lighthouse correctly flags we're on plain HTTP localhost — not a real finding, production is HTTPS+HSTS per `next.config.mjs`), `third-party-cookies: 0` (9 cookies from the marketing stack — expected given the widget load above), and the two console-error audits above.

**Caveat on all of the above:** these are genuine, reproducible Lighthouse runs against the actual built app — not estimates — but they were run against `localhost` over plain HTTP with no CDN/edge caching, so absolute LCP/TTI numbers will differ somewhat from production. The *relative* finding (third-party scripts/widgets dominate page weight and block the main thread) will hold on production too, since that bottleneck is network+script-execution bound, not localhost-latency bound.

---

## 5. Broken links/images

Grepped every static `href="/..."` across `app/` and `components/` (`.tsx` only) and cross-checked against the built route manifest / sitemap — all resolve to real routes (home, about, services, service-areas + 4 named slugs, blog, contact, book-appointment, careers, faqs, projects, testimonials, roofs-for-heroes, privacy-policy, terms-and-conditions). No internal link pointed at a non-existent route.

Grepped every locally-referenced static image path (`/[name].{png,jpg,svg,ico,...}`) against `public/` (`favicon.svg`, `google8d7a9d080d00094f.html` verification file, `logo-dark.svg`, `logo.svg` — that's the full contents of `public/`):

| Reference | File:line | Live status |
|---|---|---|
| `/logo.svg` | `components/shared/navbar.tsx:78` | 200 ✓ |
| `/logo-dark.svg` | `components/shared/navbar.tsx:86` | 200 ✓ |
| `/favicon.svg` | `components/shared/footer.tsx:34`, `app/manifest.ts` | 200 ✓ |
| `/icon.svg` | `app/manifest.ts` | 200 ✓ |
| **`/logo.png`** | **`app/(site)/page.tsx:46`** | **404 ✗** |

- **Critical/confirmed** — `/logo.png` (homepage JSON-LD Organization logo, see §2) is a broken reference. This is the one real broken-asset finding from the scan.
- Spot-checked redirect/410 handling from `next.config.mjs`/`proxy.ts` on the live server: `/roof-repair` → 308 → `/services/roof-repair` (200) ✓; `/book` → 308 → `/book-appointment` ✓; `/the-ideal-roof-color-for-tropical-climates` and `/how-do-you-repair-a-concrete-roof` → 410 Gone ✓ (both intentional per code comments); an arbitrary unknown path → 404 ✓. Redirect/410 logic in `next.config.mjs` and `proxy.ts` works as designed.
- All CMS-hosted images (`cdn.sanity.io/...`) are remote and out of scope for a `public/`-asset check; `next.config.mjs` correctly allowlists `images.unsplash.com` and `cdn.sanity.io` as the only two `remotePatterns`.

---

## 6. Build & security

- **`npm run build`** — succeeds (after supplying `.env.local`; see Environment). 61 pages generated, no errors. Full log: `raw/build.log`.
- **`npm run lint`** — 1 error, 5 warnings (see §1).
- **`npm audit --json`** (`raw/npm-audit.json`): **37 vulnerabilities** — 2 critical, 12 high, 22 moderate, 1 low.
  - **Critical, directly exploitable, easy fix** — `next@16.3.4` (installed, confirmed via `node_modules/next/package.json`) carries [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j) "Remote Code Execution in `next/og` ImageResponse", affecting `>=16.2.0 <16.3.6`. `fixAvailable: true` — a patch bump to `next@>=16.3.6` (still inside the `package.json` range `^16.2.10`) resolves it; **`npm audit fix` without `--force` should work**, no major-version bump needed. Also bundled in the same `next` advisory chain: two **moderate** cache-poisoning/draft-mode-leak issues (`GHSA-3w37-wq28-93x7`, `GHSA-4jqv-mc3x-m676`) and a **low** dev-server MCP-endpoint info-disclosure bug, all fixed by the same bump.
  - **Critical** — `dompurify <=3.4.16` — DOM XSS via detached-subtree event handlers / SAFE_FOR_TEMPLATES bypass. Pulled in transitively through the Sanity Studio toolchain (`sanity-plugin-media` → ... → `dompurify`), not a dependency of the public site runtime. `fixAvailable: true` (non-major). Still worth fixing since Studio ships in the same build and is reachable at `/studio`.
  - **High (12 total)**, mostly Sanity CLI/Studio-side tooling (`@sanity/cli`, `@sanity/runtime-cli`, `adm-zip`, `js-yaml`, `sanity-plugin-media`→`zod`, `vite`) requiring a semver-major `next-sanity` bump (`fixAvailable: {"name":"next-sanity","version":"11.6.13","isSemVerMajor":true}`) — these need a deliberate, tested upgrade rather than `npm audit fix --force`. Also `brace-expansion`, `markdown-it`, `sharp`, `source-map-js`, `undici` have non-major fixes available directly.
  - **Recommendation:** run `npm audit fix` (no `--force`) first to land the critical `next` RCE fix and the other non-major-bump highs, then schedule the `next-sanity@11.6.13` major upgrade separately (it will need Studio smoke-testing — `sanity-plugin-media` jumps to 6.6.2, a major bump).
- **Secrets in git history:** `git log --all --full-history --oneline -- "*.env*" "*secret*" "*credential*"` → **no results**. No `.env` files or anything secret-shaped have ever been committed to this repo's history. **Clean.**
- **Secrets in tracked source:** grepped for AWS key patterns, Stripe live-key patterns, PEM private-key headers, and the write-token env var name across all tracked `.ts`/`.tsx`/`.json` — **no matches**. Clean.
- **next.config.mjs security headers** (verified live via `curl -I http://localhost:4100/`, not just reading the config):
  - ✓ `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - ✓ `X-Content-Type-Options: nosniff`
  - ✓ `X-Frame-Options: SAMEORIGIN`
  - ✓ `Referrer-Policy: strict-origin-when-cross-origin`
  - ✓ `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - ✓ `Content-Security-Policy` — present on `/` with a real allowlist (not `unsafe-eval`), **correctly absent on `/studio`** (verified via `curl -I http://localhost:4100/studio`, which still carries HSTS/X-Frame-Options but no CSP header — matches the documented intent in `next.config.mjs`'s `source: '/((?!studio).*)'` matcher).
  - **Minor** — CSP's `script-src` and `style-src` both include `'unsafe-inline'`. This is a real CSP weakening (defeats most of CSP's XSS-mitigation value for inline scripts) but is a common/pragmatic tradeoff given the number of third-party marketing tags (GTM, Clarity, Roofle, GHL, etc.) that inject inline script — tightening this to nonces/hashes would be a substantial follow-up project, not a quick fix.
  - **Minor** — `X-Powered-By: Next.js` header is present on every response (`curl -I` confirmed), leaking framework/version info to any scanner. Trivial fix: `poweredByHeader: false` in `next.config.mjs` (currently not set).
  - `X-XSS-Protection: 1; mode=block` is set — this header is deprecated/ignored by all modern browsers (superseded by CSP) but harmless to leave in for legacy UA coverage.

---

## 7. Test coverage / CI

- **No test suite.** `find . -iname "*.test.*" -o -iname "*.spec.*"` (excluding `node_modules`) → no results. No `jest.config.*`, `vitest.config.*`, or `playwright.config.*` anywhere in the repo.
- **No CI.** `find .github -type f` → the `.github` directory doesn't exist at all. No GitHub Actions, no other CI config (no `.circleci/`, `.gitlab-ci.yml`, `netlify.toml`, `vercel.json` build hooks checked and absent).
- **Critical gap, tied to §1:** with zero tests and zero CI, there is **no automated gate** between a commit and production. The `react-hooks/set-state-in-effect` lint **error** in `lazy-mount.tsx:33` is a concrete example of something that would be caught by a CI lint step and currently isn't — `npm run build` doesn't lint, there's no pre-commit hook (`grep -rn "husky\|lint-staged" package.json` → not configured), and there's no workflow to run `npm run lint`/`npm run build` on PRs. Deployment appears to rely entirely on Vercel's own build step (inferred from `@vercel/analytics`/`@vercel/speed-insights` deps) succeeding or failing — which only catches TypeScript/build errors, not lint errors, since `next build` doesn't run ESLint here.

---

## 8. tsconfig.json strictness review

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    ...
  }
}
```

- `strict: true` is set — this enables the full strict-mode bundle (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc.). **Baseline is solid.**
- **Minor — stricter opt-in flags are not enabled:** `noUncheckedIndexedAccess` (catches unsound array/object indexing — relevant given how much of this codebase reads CMS array data by index), `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, and `exactOptionalPropertyTypes` are all unset. None of these are defaults even under `strict: true`. Given how much Sanity-fetched data flows through loosely-typed `any` (see the "Unused eslint-disable" findings in §1, which exist specifically because `@typescript-eslint/no-explicit-any` suppressions were added and later became unnecessary — i.e. `any` usage is already a known pattern in `lib/sanity.ts`/`lib/seo.ts`), `noUncheckedIndexedAccess` in particular would likely surface real latent bugs if enabled.
- `skipLibCheck: true` is standard practice for Next projects (speeds up compilation, avoids `node_modules` type conflicts) — not a red flag.
- `target: "ES2017"` is conservative but reasonable for the stated browserslist (`chrome >= 109`, `safari >= 15`, etc. — all of which support far newer JS); no compatibility reason not to bump to a later target, but no actual bug results from leaving it at ES2017 either. Not flagging as a finding, just noting.

---

## 9. API routes

`find . -path ./node_modules -prune -o -path "*/app/api/*" -print` and `find app -type d -iname "api"` both returned **no results**. **`app/api/` does not exist in this codebase.** There are no Next.js Route Handlers at all.

All dynamic behavior is handled by:
- Server Components fetching directly from Sanity (`lib/sanity.ts`'s `fetchServiceBySlug` etc., wrapped in React `cache()`)
- `proxy.ts` (Next.js Middleware) for the 410/redirect logic
- Third-party form/booking widgets (GoHighLevel, Roofle) which POST directly to their own hosted endpoints, not to any app-owned API route

**No finding to make here** — there's no first-party API surface to audit for input validation/auth/rate-limiting, because there is no first-party API. If form submissions are the primary data-write path the client cares about, note that validation/anti-spam for those is entirely delegated to GoHighLevel/Roofle's own infrastructure (consistent with the Cloudflare Turnstile widget observed in §4) — there's nothing in this repo's control to audit there.

---

## Summary of findings by severity

**Critical**
1. `next@16.3.4` has a confirmed, directly-exploitable RCE (`next/og` ImageResponse, GHSA-vcvr-r3jv-pc5j) — non-major fix available, run `npm audit fix`. (§6)
2. Homepage JSON-LD references `/logo.png`, which doesn't exist in `public/` — confirmed 404, breaks Organization structured data. `app/(site)/page.tsx:46`. (§2, §5)
3. LCP is 6.6–15.8 s and TBT 960–1,370 ms measured via real Lighthouse runs on all 4 tested routes — 3–6× over "Good" thresholds, driven primarily by third-party scripts (78% of home page weight) and, on `/contact` specifically, ~9 MB of repeated Cloudflare Turnstile challenge loads. (§4)
4. No test suite and no CI (`.github` doesn't exist) — zero automated gate on commits; a real `error`-severity lint bug (`lazy-mount.tsx:33`) currently ships unchecked because `next build` doesn't lint and nothing else does either. (§7, §1)

**Moderate**
5. `dompurify <=3.4.16` critical DOM-XSS vuln ships via the Sanity Studio toolchain; 12 high-severity audit findings require a major `next-sanity` bump to clear. (§6)
6. Static a11y lint covers only 6/39 `jsx-a11y` rules via Next's `core-web-vitals` preset. (§3a)
7. Recurring color-contrast failures (2.82:1–3.45:1 vs required 3:1/4.5:1) on footer wordmark (all 4 routes) and section-eyebrow spans (home, contact) — confirmed by both pa11y/htmlcs and Lighthouse/axe independently. (§3b, §3c)
8. `heading-order` violation on blog post author byline (`<h4>` skipping levels) and contact page. (§3c)
9. `robots.txt` has no `Disallow: /studio` (Studio itself is `noindex` via next-sanity defaults, but crawl isn't blocked). (§2)
10. GTM-injected `ensighten.com`/`clickcease.com` scripts are blocked by CSP and don't appear anywhere in app source — likely dead or misconfigured marketing tags; needs owner follow-up. (§4)
11. `tsconfig.json` doesn't enable `noUncheckedIndexedAccess` despite heavy by-index access into loosely-typed CMS array data. (§8)

**Minor**
12. `footer.tsx:33` raw `<img>` missing the same eslint-disable comment used consistently in `navbar.tsx` for the equivalent logo pattern. (§1)
13. `@sanity/icons` unused dependency (depcheck). (§1)
14. 4× dead "unused eslint-disable directive" comments. (§1)
15. `X-Powered-By: Next.js` header leaks framework info — trivial `poweredByHeader: false` fix. (§6)
16. CSP's `script-src`/`style-src` include `'unsafe-inline'` — pragmatic given the marketing-tag count, but weakens XSS mitigation. (§6)
17. CallRail CSP violation observed locally is almost certainly an HTTP-vs-HTTPS localhost testing artifact (protocol-relative URL), not a production bug — flagged for a production spot-check, not treated as confirmed. (§4)

**No finding / clean**
- Fresh clone HEAD matches local checkout exactly — no drift.
- Metadata API, canonical tags, JSON-LD presence: 19/19 routes, full coverage.
- Sitemap correctly excludes `/studio` and `/thank-you`; includes all content route types.
- No committed secrets anywhere in git history.
- Redirects/410s in `next.config.mjs`/`proxy.ts` work as designed (spot-checked live).
- No `app/api/**` — nothing to audit for input validation/auth/rate-limiting.
- Security headers (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, CSP with correct `/studio` exclusion) are present and verified live via `curl -I`, not just read from config.
