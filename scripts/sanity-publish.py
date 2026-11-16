#!/usr/bin/env python3
"""
Publish a /seo-writer draft to Sanity, then verify the live document.

Used by the /content-updater skill. Replaces the old PowerShell snippets, which
only ran on Windows and, on create, flattened the body to plain paragraphs
(dropping every link, list, H3, and FAQ item).

    python3 scripts/sanity-publish.py plan    memory/seo/drafts/<slug>.md
    python3 scripts/sanity-publish.py publish memory/seo/drafts/<slug>.md --confirm <docId|new>
    python3 scripts/sanity-publish.py verify  memory/seo/drafts/<slug>.md

plan     Read-only. Parses the draft, resolves the target document, converts the
         body to Portable Text, runs pre-flight checks, prints a preview and a
         field-by-field diff against the live document, and saves the exact
         mutation it would send. Exit 0 = ready, 1 = blocked, 2 = could not run,
         3 = document is in a draft state that needs a human decision.
publish  Re-runs plan, refuses unless it is clean and --confirm matches the
         target id (or "new" for a create), sends the mutation (update is
         guarded by the document's _rev so a concurrent Studio edit is never
         overwritten), then runs verify and appends a row to
         memory/seo/publish-verification-log.md. Needs SANITY_API_WRITE_TOKEN.
verify   Read-only. Re-reads the PUBLISHED document and runs checks V1-V12
         against it, echoing the observed value for each.

Draft format (written by /seo-writer Step 5):
  - YAML frontmatter: slug, contentType (blog|services|location), docId (uuid or
    "new"), targetKeyword, seoTitle, seoDescription, excerpt, featuredImage
    (asset ref or "unchanged"), publishedDate, author, categories, noindex,
    nofollow, canonicalUrl, and optionally body: unchanged (metadata-only patch).
  - "# H1" becomes the document title.
  - "## Frequently Asked Questions" becomes faqItems: each "### Question" is one
    item; its answer is the paragraph(s) up to the next heading. The FAQ section
    ends at the next "##" heading or at a line containing only "---"; anything
    after that goes back into the body (this is where the closing CTA goes).
    If the closer sits directly after the last FAQ answer with no "---", the last
    answer keeps only its first paragraph and the rest returns to the body; plan
    prints the split so it can be checked.
  - Everything else becomes body blocks: ##/###/#### headings, paragraphs,
    "- " / "1. " lists (indent 2 spaces per nesting level), "> " blockquotes,
    [text](url) links, **bold**, *italic*, and ![alt](image-...) inline images.
    Markdown tables are rejected rather than mangled.
"""

import argparse
import hashlib
import json
import os
import re
import secrets
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

try:
    import yaml
except ImportError:  # pragma: no cover
    print("[2] PyYAML is required: pip install pyyaml", file=sys.stderr)
    sys.exit(2)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API_VERSION = "2025-02-19"
SITE_URL = "https://shumakerroofing.com"
PLAN_DIR = os.path.join(ROOT, ".sanity-publish")
VERIFY_LOG = os.path.join(ROOT, "memory", "seo", "publish-verification-log.md")
QA_LOG = os.path.join(ROOT, "memory", "seo", "qa-log.md")

TYPES = {
    # contentType -> (sanity _type, body field, url prefix)
    "blog": ("blog", "content", "/blog/"),
    "services": ("services", "servicesContent", "/services/"),
    "location": ("location", "introContent", "/service-areas/"),
}
FAQ_HEADING = re.compile(r"^frequently asked questions$|^faqs?$", re.I)


class Fail(Exception):
    def __init__(self, code, msg):
        super().__init__(msg)
        self.code = code


# --------------------------------------------------------------------------- env / http

def load_env():
    path = os.path.join(ROOT, ".env.local")
    if not os.path.exists(path):
        raise Fail(2, ".env.local not found")
    env = {}
    for line in open(path):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    for k in ("NEXT_PUBLIC_SANITY_PROJECT_ID", "NEXT_PUBLIC_SANITY_DATASET"):
        if not env.get(k):
            raise Fail(2, f"{k} missing from .env.local")
    return env


class Sanity:
    def __init__(self, env, write=False):
        self.project = env["NEXT_PUBLIC_SANITY_PROJECT_ID"]
        self.dataset = env["NEXT_PUBLIC_SANITY_DATASET"]
        self.token = env.get("SANITY_API_WRITE_TOKEN") if write else (
            env.get("SANITY_API_READ_TOKEN") or env.get("SANITY_API_WRITE_TOKEN"))
        if not self.token:
            if write:
                raise Fail(2, "SANITY_API_WRITE_TOKEN missing from .env.local. Create an Editor "
                              "token at https://www.sanity.io/manage -> project -> API -> Tokens, "
                              "and add it as SANITY_API_WRITE_TOKEN=...")
            raise Fail(2, "no Sanity token in .env.local")
        self.base = f"https://{self.project}.api.sanity.io/v{API_VERSION}/data"

    def _req(self, url, body=None):
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(url, data=data, method="POST" if data else "GET")
        req.add_header("Authorization", f"Bearer {self.token}")
        if data:
            req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors="replace")[:800]
            raise Fail(2, f"Sanity HTTP {e.code}: {detail}")
        except urllib.error.URLError as e:
            raise Fail(2, f"cannot reach Sanity: {e.reason}")

    def query(self, groq, params=None, perspective="raw"):
        q = {"query": groq, "perspective": perspective}
        for k, v in (params or {}).items():
            q[f"${k}"] = json.dumps(v)
        return self._req(f"{self.base}/query/{self.dataset}?{urllib.parse.urlencode(q)}")["result"]

    def mutate(self, mutations, dry_run=False):
        url = f"{self.base}/mutate/{self.dataset}?returnIds=true&visibility=sync"
        if dry_run:
            url += "&dryRun=true"
        return self._req(url, {"mutations": mutations})


def key():
    return secrets.token_hex(6)


# --------------------------------------------------------------------------- draft parsing

def read_draft(path):
    if not os.path.exists(path):
        raise Fail(2, f"draft not found: {path}")
    text = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        raise Fail(1, "draft has no YAML frontmatter block. Re-run /seo-writer Step 5 so the "
                      "approved seoTitle/seoDescription/excerpt exist on disk.")
    try:
        fm = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as e:
        raise Fail(1, f"frontmatter is not valid YAML (quote every string value): {e}")
    body = re.sub(r"<!--.*?-->", "", m.group(2), flags=re.S)
    for k, v in list(fm.items()):
        if isinstance(v, datetime):
            fm[k] = v.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
        elif hasattr(v, "isoformat") and not isinstance(v, str):
            fm[k] = v.isoformat() + "T00:00:00.000Z"
        if isinstance(v, str) and re.fullmatch(r"\d+\s*chars?", v.strip()):
            raise Fail(1, f"frontmatter {k} is a character count ({v!r}), not the value. "
                          "Re-persist the draft with the real string.")
    return fm, body


INLINE = re.compile(
    r"!\[(?P<ialt>[^\]]*)\]\((?P<isrc>[^)\s]+)\)"   # image (only valid as its own line)
    r"|\[(?P<ltext>(?:[^\[\]]|\[[^\]]*\])+)\]\((?P<href>[^)\s]+)\)"
    r"|\*\*(?P<bold>.+?)\*\*"
    r"|(?<![\w*])\*(?P<ital>[^*\s][^*]*?)\*(?![\w*])"
    r"|(?<![\w_])_(?P<ital2>[^_\s][^_]*?)_(?![\w_])"
)


def inline_spans(text, mark_defs, marks=()):
    """Markdown inline -> list of spans, appending link markDefs as needed."""
    spans, pos = [], 0
    for m in INLINE.finditer(text):
        if m.start() > pos:
            spans.append(span(text[pos:m.start()], marks))
        if m.group("ltext") is not None:
            k = key()
            mark_defs.append({"_key": k, "_type": "link", "href": m.group("href")})
            spans += inline_spans(m.group("ltext"), mark_defs, (*marks, k))
        elif m.group("bold") is not None:
            spans += inline_spans(m.group("bold"), mark_defs, (*marks, "strong"))
        elif m.group("ital") is not None or m.group("ital2") is not None:
            spans += inline_spans(m.group("ital") or m.group("ital2"), mark_defs, (*marks, "em"))
        else:
            raise Fail(1, f"inline image inside a paragraph is not supported: {m.group(0)}")
        pos = m.end()
    if pos < len(text):
        spans.append(span(text[pos:], marks))
    # merge adjacent spans with identical marks
    out = []
    for s in spans:
        if out and out[-1]["marks"] == s["marks"]:
            out[-1]["text"] += s["text"]
        else:
            out.append(s)
    return out or [span("", ())]


def span(text, marks):
    return {"_type": "span", "_key": key(), "text": text, "marks": list(marks)}


def text_block(text, style="normal", list_item=None, level=None):
    mark_defs = []
    b = {"_type": "block", "_key": key(), "style": style, "markDefs": mark_defs,
         "children": inline_spans(text.strip(), mark_defs)}
    if list_item:
        b["listItem"], b["level"] = list_item, level
    return b


LIST_RE = re.compile(r"^(?P<indent>\s*)(?:(?P<bullet>[-*+])|(?P<num>\d+)[.)])\s+(?P<text>.*)$")


def md_to_blocks(md):
    """Markdown (no H1, no FAQ) -> Portable Text blocks."""
    blocks, para, item = [], [], None

    def flush():
        nonlocal para, item
        if para:
            blocks.append(text_block(" ".join(para)))
            para = []
        if item:
            blocks.append(text_block(" ".join(item["text"]), "normal", item["kind"], item["level"]))
            item = None

    for raw in md.split("\n"):
        line = raw.rstrip()
        s = line.strip()
        if not s:
            flush()
            continue
        if re.match(r"^\|.*\|$", s):
            raise Fail(1, f"markdown table found ({s[:60]}...). Tables are not converted; "
                          "add the table in Studio or rewrite it as prose/a list.")
        h = re.match(r"^(#{2,4})\s+(.*)$", s)
        if h:
            flush()
            blocks.append(text_block(h.group(2), f"h{len(h.group(1))}"))
            continue
        img = re.match(r"^!\[([^\]]*)\]\((image-[^)\s]+)\)$", s)
        if img:
            flush()
            blocks.append({"_type": "image", "_key": key(), "alt": img.group(1),
                           "asset": {"_type": "reference", "_ref": img.group(2)}})
            continue
        lm = LIST_RE.match(line)
        if lm:
            flush()
            item = {"kind": "bullet" if lm.group("bullet") else "number",
                    "level": len(lm.group("indent").expandtabs(2)) // 2 + 1,
                    "text": [lm.group("text")]}
            continue
        if s.startswith(">"):
            flush()
            blocks.append(text_block(s.lstrip("> "), "blockquote"))
            continue
        if item:                      # continuation line of a list item
            item["text"].append(s)
        else:
            para.append(s)
    flush()
    return blocks


def split_draft(body):
    """Return (h1, body_md, faq_items_raw, notes)."""
    lines = body.strip("\n").split("\n")
    h1, notes = None, []
    for i, l in enumerate(lines):
        if re.match(r"^#\s+", l):
            h1 = re.sub(r"^#\s+", "", l).strip()
            lines = lines[:i] + lines[i + 1:]
            break
    out, faqs, i = [], [], 0
    while i < len(lines):
        l = lines[i]
        hm = re.match(r"^##\s+(.*)$", l)
        if hm and FAQ_HEADING.match(hm.group(1).strip()):
            i += 1
            cur = None
            while i < len(lines):
                l = lines[i]
                if re.match(r"^##\s+", l) or l.strip() == "---":
                    if l.strip() == "---":
                        i += 1
                    break
                q = re.match(r"^###\s+(.*)$", l)
                if q:
                    cur = {"question": q.group(1).strip(), "md": []}
                    faqs.append(cur)
                elif cur is not None:
                    cur["md"].append(l)
                elif l.strip():
                    notes.append(f"text between the FAQ heading and the first question was dropped: {l.strip()[:60]!r}")
                i += 1
            # implicit closer: if the section ran to EOF, last answer keeps paragraph 1 only
            if faqs and i >= len(lines):
                paras = re.split(r"\n\s*\n", "\n".join(faqs[-1]["md"]).strip())
                if len(paras) > 1:
                    faqs[-1]["md"] = paras[0].split("\n")
                    rest = "\n\n".join(paras[1:])
                    out += ["", *rest.split("\n")]
                    notes.append("last FAQ answer had multiple paragraphs; kept the first as the "
                                 "answer and moved the rest to the end of the body as the closer. "
                                 "Use a '---' line after the FAQ to make this explicit.")
            continue
        out.append(l)
        i += 1
    return h1, "\n".join(out), faqs, notes


def build_faq_items(raw):
    items = []
    for f in raw:
        md = "\n".join(f["md"]).strip()
        blocks = md_to_blocks(md)
        plain = " ".join(block_text(b) for b in blocks).strip()
        items.append({"_type": "faqItem", "_key": key(), "question": f["question"],
                      "answerContent": blocks, "answer": plain})
    return items


def block_text(b):
    return "".join(c.get("text", "") for c in b.get("children", [])) if b.get("_type") == "block" else ""


def links_in(blocks):
    out = []
    for b in blocks or []:
        out += [d.get("href") for d in b.get("markDefs", []) or [] if d.get("_type") == "link"]
    return out


def body_fingerprint(blocks):
    """Hash of text + link targets, ignoring _keys, for draft-vs-live comparison."""
    parts = []
    for b in blocks or []:
        if b.get("_type") == "block":
            parts.append(f"{b.get('style')}|{b.get('listItem')}|{block_text(b)}")
        else:
            parts.append(b.get("_type", "?"))
    parts += sorted(links_in(blocks))
    return hashlib.sha256("\n".join(parts).encode()).hexdigest()[:12]


# --------------------------------------------------------------------------- planning

STATIC_ROUTES = None


def static_routes():
    global STATIC_ROUTES
    if STATIC_ROUTES is None:
        STATIC_ROUTES = {"/"}
        base = os.path.join(ROOT, "app", "(site)")
        for d, _, files in os.walk(base):
            if "page.tsx" in files and "[" not in d:
                rel = os.path.relpath(d, base).replace(os.sep, "/")
                STATIC_ROUTES.add("/" if rel == "." else "/" + rel)
        cfg = os.path.join(ROOT, "next.config.mjs")
        if os.path.exists(cfg):
            STATIC_ROUTES |= set(re.findall(r"source:\s*['\"]([^'\"]+)['\"]", open(cfg).read()))
    return STATIC_ROUTES


def plan(path, args):
    env = load_env()
    sanity = Sanity(env)
    fm, body = read_draft(path)
    blockers, warnings, info = [], [], []

    ctype = fm.get("contentType")
    if ctype not in TYPES:
        raise Fail(1, f"contentType must be one of {list(TYPES)} (got {ctype!r}). Static routes "
                      "such as the homepage are code edits, not Sanity publishes.")
    stype, body_field, prefix = TYPES[ctype]
    slug = (fm.get("slug") or "").strip()
    if not slug:
        raise Fail(1, "frontmatter slug is empty")
    if slug.startswith(("blog/", "services/", "service-areas/")):
        raise Fail(1, f"slug should be the bare slug, not a path: {slug!r}")

    # -- resolve ids
    ids = sanity.query(
        '{"pub": *[_type==$t && slug.current==$s && !(_id in path("drafts.**"))]{_id,_rev},'
        ' "drf": *[_type==$t && slug.current==$s && _id in path("drafts.**")]{_id,_rev}}',
        {"t": stype, "s": slug})
    if len(ids["pub"]) > 1:
        raise Fail(3, f"{len(ids['pub'])} published {stype} documents share slug {slug!r}: "
                      f"{[d['_id'] for d in ids['pub']]}. Resolve the duplicate first.")
    pub = ids["pub"][0] if ids["pub"] else None
    drf = ids["drf"][0] if ids["drf"] else None
    if pub and drf:
        raise Fail(3, f"live page {pub['_id']} also has unpublished Studio edits ({drf['_id']}). "
                      "Publishing would ignore or clobber someone's in-progress work. Review the "
                      "draft in Studio, then publish or discard it, and re-run.")
    if drf and not pub:
        d = sanity.query("*[_id==$id][0]{publishedDate, seo}", {"id": drf["_id"]})
        raise Fail(3, f"only a draft exists ({drf['_id']}), never published. This is a stalled "
                      f"publish, not a fresh write. Draft state: noindex={d.get('seo',{}).get('noindex') if d else None}, "
                      f"nofollow={d.get('seo',{}).get('nofollow') if d else None}, publishedDate="
                      f"{d.get('publishedDate') if d else None}. Decide in Studio whether to "
                      "publish or discard it, then re-run.")
    action = "update" if pub else "create"
    doc_id = pub["_id"] if pub else None
    want = str(fm.get("docId") or "").strip()
    if action == "update" and want and want != "new" and want != doc_id:
        blockers.append(f"frontmatter docId {want} does not match the live document for slug "
                        f"{slug!r} ({doc_id})")
    if action == "create" and want and want != "new":
        blockers.append(f"frontmatter docId is {want} but no published {stype} has slug "
                        f"{slug!r}. Was the slug changed? A slug change needs a redirect plan.")
    if action == "create" and ctype == "location":
        blockers.append("creating new location documents is not supported here; create it in Studio")

    live = None
    if doc_id:
        live = sanity.query(
            f'*[_id==$id][0]{{_rev, title, excerpt, publishedDate, categories, seo, author,'
            f' authorRef, featuredImage, "body": {body_field}, faqItems}}', {"id": doc_id})

    # -- body
    h1, body_md, faq_raw, notes = split_draft(body)
    warnings += notes
    body_unchanged = str(fm.get("body", "")).lower() == "unchanged"
    if re.search(r"\[VERIFY:", body + json.dumps(fm, default=str)):
        blockers.append("unresolved [VERIFY: ...] placeholder(s) in the draft")
    blocks = [] if body_unchanged else md_to_blocks(body_md)
    faq_items = [] if body_unchanged else build_faq_items(faq_raw)
    if not body_unchanged and not blocks:
        blockers.append("body converted to zero blocks")
    if ctype == "location" and faq_raw and not body_unchanged:
        info.append(f"{len(faq_raw)} FAQ items -> location.faqItems")

    # -- field set
    sets = {}
    title = h1 or fm.get("title")
    if ctype == "location":
        title = None  # location title is cityName; never touch it from a draft
    if title:
        sets["title"] = title
    for f in ("excerpt", "publishedDate"):
        if fm.get(f) not in (None, "", "unchanged") and ctype == "blog":
            sets[f] = fm[f]
    if ctype == "blog" and isinstance(fm.get("categories"), list):
        cats = [c for c in fm["categories"] if isinstance(c, str) and c.strip()]
        sets["categories"] = cats
    seo = {}
    for src, dst in (("seoTitle", "seoTitle"), ("seoDescription", "seoDescription")):
        if fm.get(src) not in (None, "", "unchanged"):
            seo[dst] = fm[src]
    for flag in ("noindex", "nofollow"):
        v = fm.get(flag)
        if v is None:
            v = False if action == "create" else None
        if v is not None:
            if not isinstance(v, bool):
                blockers.append(f"{flag} must be true/false, got {v!r}")
            seo[flag] = v
            if v is True and not args.allow_noindex:
                blockers.append(f"{flag} is true. That ships a page search engines ignore. Pass "
                                "--allow-noindex only if excluding this page was explicitly intended.")
    canon = fm.get("canonicalUrl")
    if canon not in (None, "", "unchanged"):
        expected = SITE_URL + prefix + slug
        if canon.rstrip("/") != expected:
            blockers.append(f"canonicalUrl {canon} does not match this page's path {expected}")
        seo["canonicalUrl"] = canon
    img = fm.get("featuredImage")
    if img not in (None, "", "unchanged"):
        if not re.match(r"^image-[a-f0-9]+-\d+x\d+-\w+$", str(img)):
            blockers.append(f"featuredImage {img!r} is not a Sanity asset ref (image-<hash>-WxH-ext)")
        else:
            exists = sanity.query('count(*[_id==$id])', {"id": img})
            if not exists:
                blockers.append(f"featuredImage asset {img} does not exist in this dataset")
            ref = {"_type": "image", "asset": {"_type": "reference", "_ref": img}}
            if ctype == "blog":
                sets["featuredImage"] = ref
            elif ctype == "services":
                sets["servicesImage"] = ref
            seo["featuredImage"] = ref
    elif action == "create":
        blockers.append("featuredImage is required on a create (it becomes og:image)")

    author = fm.get("author")
    if ctype == "blog" and author not in (None, "", "unchanged"):
        a = sanity.query('*[_type=="author" && name==$n && !(_id in path("drafts.**"))][0]._id',
                         {"n": author})
        if a:
            sets["authorRef"] = {"_type": "reference", "_ref": a}
        else:
            sets["author"] = author
            warnings.append(f"no author document named {author!r}; setting the legacy author string")

    if not body_unchanged:
        sets[body_field] = blocks
        if faq_items:
            sets["faqItems"] = faq_items
        elif live and live.get("faqItems"):
            warnings.append(f"draft has no FAQ section; leaving the live {len(live['faqItems'])} faqItems untouched")

    # -- pre-flight checks
    st = seo.get("seoTitle", ((live or {}).get("seo") or {}).get("seoTitle"))
    sd = seo.get("seoDescription", ((live or {}).get("seo") or {}).get("seoDescription"))
    if not st:
        blockers.append("seoTitle missing")
    elif not 50 <= len(st) <= 60:
        blockers.append(f"seoTitle is {len(st)} chars (needs 50-60): {st!r}")
    if not sd:
        blockers.append("seoDescription missing")
    elif not 120 <= len(sd) <= 160:
        blockers.append(f"seoDescription is {len(sd)} chars (needs 120-160)")
    kw = (fm.get("targetKeyword") or "").lower()
    if kw and sd and kw not in sd.lower():
        warnings.append(f"targetKeyword {kw!r} not found in seoDescription (QA check 15 / V5)")
    if action == "create":
        for f in ("excerpt", "publishedDate") if ctype == "blog" else ():
            if not sets.get(f):
                blockers.append(f"{f} is required on a create")
    if ctype == "blog" and sets.get("publishedDate"):
        try:
            datetime.fromisoformat(sets["publishedDate"].replace("Z", "+00:00"))
        except ValueError:
            blockers.append(f"publishedDate {sets['publishedDate']!r} is not an ISO datetime")

    # duplicates
    if st or sd:
        dupes = sanity.query(
            '*[_type in ["blog","services","location"] && !(_id in path("drafts.**")) && _id != $id'
            ' && (seo.seoTitle == $t || seo.seoDescription == $d)]{_type, "s": slug.current}',
            {"id": doc_id or "", "t": st or "\u0000", "d": sd or "\u0000"})
        for d in dupes:
            blockers.append(f"seoTitle/seoDescription duplicates live {d['_type']}/{d['s']}")

    # link resolution
    all_links = links_in(blocks) + [h for f in faq_items for h in links_in(f["answerContent"])]
    if all_links:
        slugs = sanity.query(
            '{"blog": *[_type=="blog" && !(_id in path("drafts.**"))].slug.current,'
            ' "services": *[_type=="services" && !(_id in path("drafts.**"))].slug.current,'
            ' "location": *[_type=="location" && isActive==true && !(_id in path("drafts.**"))].slug.current}')
        valid = set(static_routes())
        valid |= {"/blog/" + s for s in slugs["blog"] if s}
        valid |= {"/services/" + s for s in slugs["services"] if s}
        valid |= {"/service-areas/" + s for s in slugs["location"] if s}
        if action == "create":
            valid.add(prefix + slug)
        internal, external = 0, 0
        for href in all_links:
            p = urllib.parse.urlparse(href)
            if p.scheme in ("mailto", "tel"):
                continue
            if p.netloc and p.netloc.replace("www.", "") != "shumakerroofing.com":
                external += 1
                if p.scheme != "https":
                    warnings.append(f"external link is not https: {href}")
                continue
            internal += 1
            if p.netloc:
                warnings.append(f"absolute internal link (house style is relative): {href}")
            path_ = p.path.rstrip("/") or "/"
            if path_ not in valid:
                blockers.append(f"internal link does not resolve: {href}")
        info.append(f"links: {internal} internal, {external} external")
        if internal < 3 and ctype == "blog":
            warnings.append(f"only {internal} internal links (QA check 26 wants 3+)")
    dashes = len(re.findall("[–—]", body))
    if dashes:
        warnings.append(f"{dashes} em/en dash(es) in the body (QA check 38)")

    # QA gate
    qa = qa_status(slug)
    if qa is None:
        blockers.append(f"no qa-log.md entry for {slug!r}. Run /qa first.")
    elif not qa[1].upper().startswith("PASS"):
        blockers.append(f"latest qa-log.md entry for {slug!r} is {qa[1]} ({qa[0]}). Run /qa until it passes.")
    else:
        info.append(f"QA gate: {qa[1]} on {qa[0]}")
        if qa[1].strip().upper() != "PASS":
            warnings.append(f"QA result is {qa[1]!r}, not a plain PASS. Read that qa-log.md row and "
                            "confirm its conditions are met before publishing.")

    # -- mutation
    if action == "create":
        doc = {"_type": stype, "slug": {"_type": "slug", "current": slug}, **sets,
               "seo": {"_type": "seoMetadata", **seo}}
        mutation = {"create": doc}
    else:
        patch = {"id": doc_id, "ifRevisionID": live["_rev"],
                 "setIfMissing": {"seo": {"_type": "seoMetadata"}},
                 "set": {**sets, **{f"seo.{k}": v for k, v in seo.items()}}}
        mutation = {"patch": patch}

    # -- diff vs live
    diff = []
    if live:
        cur = {**{k: live.get(k) for k in ("title", "excerpt", "publishedDate", "categories")},
               **{f"seo.{k}": (live.get("seo") or {}).get(k) for k in
                  ("seoTitle", "seoDescription", "noindex", "nofollow", "canonicalUrl")}}
        new = {**{k: sets.get(k) for k in ("title", "excerpt", "publishedDate", "categories") if k in sets},
               **{f"seo.{k}": v for k, v in seo.items() if k != "featuredImage"}}
        for k, v in new.items():
            if cur.get(k) != v:
                diff.append((k, cur.get(k), v))
        if not body_unchanged:
            lb = live.get("body") or []
            if body_fingerprint(lb) == body_fingerprint(blocks):
                info.append(f"{body_field}: identical to live (text+links fingerprint {body_fingerprint(lb)})")
            else:
                diff.append((body_field, f"{len(lb)} blocks, {len(links_in(lb))} links, fp {body_fingerprint(lb)}",
                             f"{len(blocks)} blocks, {len(links_in(blocks))} links, fp {body_fingerprint(blocks)}"))
            lq = [f.get("question") for f in live.get("faqItems") or []]
            if faq_items and lq != [f["question"] for f in faq_items]:
                diff.append(("faqItems", f"{len(lq)} items: {lq}", f"{len(faq_items)} items: {[f['question'] for f in faq_items]}"))

    result = {
        "draft": os.path.relpath(path, ROOT), "slug": slug, "contentType": ctype, "type": stype,
        "action": action, "docId": doc_id, "rev": live["_rev"] if live else None,
        "bodyField": body_field, "bodyUnchanged": body_unchanged,
        "blocks": len(blocks), "faqItems": len(faq_items),
        "bodyFingerprint": body_fingerprint(blocks) if blocks else None,
        "blockers": blockers, "warnings": warnings, "info": info, "diff": diff,
        "mutation": mutation,
    }
    os.makedirs(PLAN_DIR, exist_ok=True)
    with open(os.path.join(PLAN_DIR, f"{slug}.plan.json"), "w") as fh:
        json.dump(result, fh, indent=2, default=str)
    return result, blocks, faq_items


def qa_status(slug):
    if not os.path.exists(QA_LOG):
        return None
    last = None
    for line in open(QA_LOG, encoding="utf-8"):
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 3 or not re.match(r"\d{4}-\d{2}-\d{2}", cells[0]):
            continue
        page = cells[1].lower()
        if page == slug or page.endswith("/" + slug):
            last = (cells[0], cells[2])
    return last


def outline(blocks, faq_items):
    out = []
    for b in blocks:
        if b["_type"] != "block":
            out.append(f"    [image alt={b.get('alt')!r}]")
            continue
        t = block_text(b)
        style = b["style"]
        if style.startswith("h"):
            out.append("  " * (int(style[1]) - 2) + f"{style.upper()}  {t}")
        elif style == "blockquote":
            out.append(f"    >  {t[:70]}")
        elif b.get("listItem"):
            out.append("    " + "  " * (b["level"] - 1) + ("- " if b["listItem"] == "bullet" else "1. ") + t[:70])
        else:
            n = len(links_in([b]))
            out.append(f"    p  {t[:70]}{'...' if len(t) > 70 else ''}" + (f"  [{n} link]" if n else ""))
    for f in faq_items:
        out.append(f"  FAQ  {f['question']}  ({len(f['answer'].split())} words, {len(links_in(f['answerContent']))} links)")
    return "\n".join(out)


def print_plan(r, blocks, faq_items):
    print(f"Draft:   {r['draft']}")
    print(f"Target:  {r['type']}/{r['slug']}  ->  {r['action'].upper()}"
          + (f" {r['docId']} (rev {r['rev']})" if r["docId"] else " (new document)"))
    if not r["bodyUnchanged"]:
        print(f"Body:    {r['blocks']} blocks -> {r['bodyField']}, {r['faqItems']} FAQ items\n")
        print(outline(blocks, faq_items))
    else:
        print("Body:    unchanged (metadata-only patch)")
    if r["diff"]:
        print("\nChanges vs live:")
        for k, a, b in r["diff"]:
            print(f"  {k}\n      live:  {a!r}\n      draft: {b!r}")
    for label, items in (("Info", r["info"]), ("Warnings", r["warnings"]), ("BLOCKERS", r["blockers"])):
        if items:
            print(f"\n{label}:")
            for i in items:
                print(f"  - {i}")
    print(f"\nMutation saved to {os.path.relpath(os.path.join(PLAN_DIR, r['slug'] + '.plan.json'), ROOT)}")
    if r["blockers"]:
        print(f"\nBLOCKED: {len(r['blockers'])} issue(s) must be fixed before publishing.")
    else:
        confirm = r["docId"] or "new"
        print(f"\nREADY. To publish: python3 scripts/sanity-publish.py publish {r['draft']} --confirm {confirm}")


# --------------------------------------------------------------------------- verify

def verify(path, plan_result=None, sent_fp=None):
    env = load_env()
    sanity = Sanity(env)
    fm, body = read_draft(path)
    ctype = fm.get("contentType")
    stype, body_field, prefix = TYPES[ctype]
    slug = fm["slug"]
    doc = sanity.query(
        f'*[_type==$t && slug.current==$s && !(_id in path("drafts.**"))][0]{{_id, title, excerpt,'
        f' publishedDate, seo, "body": {body_field}, faqItems}}', {"t": stype, "s": slug})
    checks = []

    def add(cid, ok, observed):
        checks.append((cid, "PASS" if ok is True else ("FAIL" if ok is False else ok), observed))

    if not doc:
        add("V0", False, f"no published {stype} with slug {slug!r}")
        return checks, None
    seo = doc.get("seo") or {}
    h1, body_md, faq_raw, _ = split_draft(body)
    body_unchanged = str(fm.get("body", "")).lower() == "unchanged"

    # V1 field fidelity against the frontmatter (the approved strings)
    pairs = [("seo.seoTitle", fm.get("seoTitle"), seo.get("seoTitle")),
             ("seo.seoDescription", fm.get("seoDescription"), seo.get("seoDescription"))]
    if ctype == "blog":
        pairs.append(("excerpt", fm.get("excerpt"), doc.get("excerpt")))
    if ctype != "location" and h1:
        pairs.append(("title", h1, doc.get("title")))
    mism = [f"{k}: live {b!r} != draft {a!r}" for k, a, b in pairs
            if a not in (None, "", "unchanged") and (b or "").strip() != str(a).strip()]
    skipped = [k for k, a, _ in pairs if a in (None, "", "unchanged")]
    add("V1 field fidelity", not mism,
        "; ".join(mism) or f"{len(pairs) - len(skipped)} fields match exactly"
        + (f" ({', '.join(skipped)} not in draft)" if skipped else ""))

    # V2 / V9 body fidelity
    live_body = doc.get("body") or []
    if body_unchanged:
        add("V2 body present", bool(live_body), f"{len(live_body)} blocks (body not changed by this draft)")
        add("V9 body fidelity", "N/A", "body: unchanged")
    else:
        exp = md_to_blocks(body_md)
        exp_faq = build_faq_items(faq_raw)
        add("V2 body present", len(live_body) == len(exp) and len(live_body) > 0,
            f"{len(live_body)} blocks live vs {len(exp)} from draft; "
            f"{len(doc.get('faqItems') or [])} faqItems live vs {len(exp_faq) or 'unchanged'} from draft")
        lf, ef = body_fingerprint(live_body), body_fingerprint(exp)
        add("V9 body fidelity", lf == ef,
            f"text+links fingerprint live {lf} vs draft {ef}; {len(links_in(live_body))} links live")
    st, sd = seo.get("seoTitle") or "", seo.get("seoDescription") or ""
    add("V3 seoTitle length", 50 <= len(st) <= 60, f"{len(st)} chars")
    add("V4 seoDescription length", 120 <= len(sd) <= 160, f"{len(sd)} chars")
    kw = (fm.get("targetKeyword") or "").lower()
    add("V5 keyword in description", (kw in sd.lower()) if kw else "N/A",
        f"{kw!r} {'found' if kw and kw in sd.lower() else 'not found'}" if kw else "no targetKeyword in frontmatter")
    ni, nf = seo.get("noindex"), seo.get("nofollow")
    add("V6 noindex/nofollow", ni is not True and nf is not True, f"noindex={ni}, nofollow={nf}")
    canon = seo.get("canonicalUrl")
    add("V7 canonical", (not canon) or canon.rstrip("/") == SITE_URL + prefix + slug,
        f"canonicalUrl={canon!r} (page code forces its own path regardless)")
    dupes = sanity.query(
        '*[_type in ["blog","services","location"] && !(_id in path("drafts.**")) && _id != $id'
        ' && (seo.seoTitle == $t || seo.seoDescription == $d)].slug.current',
        {"id": doc["_id"], "t": st or "\u0000", "d": sd or "\u0000"})
    add("V8 no live duplicate", not dupes, f"duplicates: {dupes}" if dupes else "none")
    if ctype == "blog":
        add("V10 publishedDate", bool(doc.get("publishedDate")), f"publishedDate={doc.get('publishedDate')}")
    else:
        add("V10 publishedDate", "N/A", f"{ctype} has no publishedDate")
    leftover = sanity.query("count(*[_id==$id])", {"id": "drafts." + doc["_id"]})
    add("V11 no leftover draft", leftover == 0, f"{leftover} draft copies")

    url = SITE_URL + prefix + slug
    code, robots = live_url(url)
    robots_ok = robots is None or ("noindex" not in robots and "nofollow" not in robots)
    add("V12 live URL", code == 200 and robots_ok,
        f"HTTP {code}, robots={robots!r} at {url} (pages revalidate hourly; new copy may lag)")
    return checks, doc["_id"]


def live_url(url):
    code, robots = None, None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "sanity-publish-verify"})
            with urllib.request.urlopen(req, timeout=30) as r:
                code = r.status
                html = r.read().decode(errors="replace")
                m = re.search(r'<meta[^>]+name=["\']robots["\'][^>]*content=["\']([^"\']+)', html, re.I)
                robots = m.group(1) if m else None
                return code, robots
        except urllib.error.HTTPError as e:
            code = e.code
        except urllib.error.URLError as e:
            code = f"unreachable ({e.reason})"
        if attempt < 2:
            time.sleep(10)
    return code, robots


def print_checks(checks):
    w = max(len(c[0]) for c in checks)
    for cid, verdict, obs in checks:
        print(f"  {cid:<{w}}  {verdict:<4}  {obs}")
    failed = [c[0].split()[0] for c in checks if c[1] == "FAIL"]
    print(f"\n{len([c for c in checks if c[1] == 'PASS'])}/{len([c for c in checks if c[1] != 'N/A'])} checks passed"
          + (f"; FAILED: {', '.join(failed)}" if failed else ""))
    return failed


def append_verify_log(slug, doc_id, failed, note):
    new = not os.path.exists(VERIFY_LOG)
    with open(VERIFY_LOG, "a", encoding="utf-8") as fh:
        if new:
            fh.write("# Publish Verification Log\n\n| Date | Page | Doc ID | Result | Root cause | Fixed by repatch |\n"
                     "|------|------|--------|--------|------------|------------------|\n")
        fh.write(f"| {datetime.now().date()} | {slug} | {doc_id} | {'pass' if not failed else ', '.join(failed)}"
                 f" | {note} | {'n/a' if not failed else 'no'} |\n")


# --------------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("command", choices=["plan", "publish", "verify"])
    ap.add_argument("draft")
    ap.add_argument("--confirm", help="publish only: the target doc id, or 'new' for a create")
    ap.add_argument("--allow-noindex", action="store_true", help="permit noindex/nofollow=true")
    ap.add_argument("--dry-run", action="store_true",
                    help="publish only: send with Sanity dryRun=true (validates token, revision, "
                         "and document) without committing anything")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    args = ap.parse_args()
    path = os.path.abspath(args.draft)

    try:
        if args.command == "verify":
            checks, doc_id = verify(path)
            if args.json:
                print(json.dumps({"docId": doc_id, "checks": checks}, indent=2))
            else:
                print(f"Verifying published document {doc_id}\n")
            failed = print_checks(checks) if not args.json else [c[0] for c in checks if c[1] == "FAIL"]
            return 1 if failed else 0

        r, blocks, faqs = plan(path, args)
        if args.json:
            print(json.dumps({k: v for k, v in r.items() if k != "mutation"}, indent=2, default=str))
        else:
            print_plan(r, blocks, faqs)
        if args.command == "plan":
            return 1 if r["blockers"] else 0

        # publish
        if r["blockers"]:
            print("\nNot publishing: plan has blockers.", file=sys.stderr)
            return 1
        expected = r["docId"] or "new"
        if args.confirm != expected:
            print(f"\nNot publishing: --confirm must be {expected!r} (got {args.confirm!r}).", file=sys.stderr)
            return 1
        writer = Sanity(load_env(), write=True)
        if args.dry_run:
            res = writer.mutate([r["mutation"]], dry_run=True)
            print(f"\nDRY RUN OK: Sanity accepted the {r['action']} (token has write access, "
                  f"revision guard matched). Nothing was committed. Response: "
                  f"{json.dumps(res.get('results'))[:300]}")
            return 0
        print(f"\nSending {r['action']} to Sanity...")
        res = writer.mutate([r["mutation"]])
        written = (res.get("results") or [{}])[0].get("id")
        print(f"Mutation OK: transaction {res.get('transactionId')}, document {written}")
        print("\nPost-publish verification (live published document):\n")
        checks, doc_id = verify(path)
        failed = print_checks(checks)
        append_verify_log(r["slug"], doc_id or written, failed,
                          "see verify output" if failed else f"{r['action']} via sanity-publish.py")
        print(f"\nLogged to {os.path.relpath(VERIFY_LOG, ROOT)}")
        if failed:
            print("\nPUBLISH VERIFICATION FAILED. The document is live with the defect above. "
                  "Fix the draft and re-run publish (a forward patch); do not unpublish.")
            return 1
        return 0
    except Fail as e:
        print(f"[{e.code}] {e}", file=sys.stderr)
        return e.code


if __name__ == "__main__":
    sys.exit(main())
