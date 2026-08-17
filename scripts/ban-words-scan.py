#!/usr/bin/env python3
"""Scan published Sanity content against docs/content-style/banned-ai-words.md.

Mechanical detector for `/content-auditor` Step 4c. Reports HARD BAN words, banned
phrases, and run-together sentences ("glued text") in live published copy.

The word lists are PARSED FROM the ban doc at runtime, not hardcoded here, so editing
`docs/content-style/banned-ai-words.md` changes what this finds. Do not inline a copy
of the list — that is how a detector drifts out of sync with the rules writers are
held to.

Usage:
    python3 scripts/ban-words-scan.py            # blog + services + location
    python3 scripts/ban-words-scan.py blog       # one type
    python3 scripts/ban-words-scan.py --json     # machine-readable

Reads NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_READ_TOKEN
from .env.local. Read-only: it never writes to Sanity.

Exit codes: 0 = clean, 1 = violations found, 2 = could not run (config/network/schema).
"""
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BAN_DOC = os.path.join(ROOT, "docs", "content-style", "banned-ai-words.md")

# Carve-outs from the ban doc's "How to apply the bans" section: literal and technical
# use is exempt. Each entry is (banned word, regex meaning "this instance is literal").
# Keep this list SHORT and justified — it is the only place a violation can be silenced.
CARVE_OUTS = [
    # "seamless gutters" is the trade term for on-site-formed gutters with no seams.
    ("seamless", r"seamless\s+(gutter|aluminum|copper|steel|vinyl)"),
    # A liquid-applied coating cures without seams; that is a physical description.
    ("seamless", r"seamless,?\s+liquid-applied"),
    # "leading to" = "causing". The ban targets "leading" as an authority claim.
    ("leading", r"leading\s+to\b"),
    # "customers have trusted us" is the verb. The ban targets the adjective claim
    # ("a trusted contractor"), which asserts reputation rather than reporting it.
    ("trusted", r"(have|has|had|who)\s+trusted\b"),
    # "rich, dark tones" describes colour. The ban targets "rich" as an intensifier
    # ("rich heritage", "rich tapestry").
    ("rich", r"rich,?\s+(dark|deep|warm|earth)"),
]

# FAQ answers are rich text (`answerContent`) with a legacy plain-text `answer`
# fallback, so each item has to be projected individually — `faqItems[].answerContent`
# cannot be flattened into one pt::text() call.
FAQ_TEXT = ('array::join(coalesce(faqItems[].question, []), " ") + " " '
            '+ array::join(coalesce(faqItems[]{"t": coalesce(pt::text(answerContent), answer, "")}.t, []), " ")')

# Sanity _type -> a GROQ expression yielding that type's body copy as one string.
#
# These are expressions, not field names, because the three types do not store copy the
# same way, and several fields have both a rich-text and a legacy plain-text form. Reach
# for the wrong accessor — pt::text() on a plain string, or a plain field on a doc that
# has been migrated to rich text — and GROQ returns nothing, which reads as "clean copy"
# rather than "wrong accessor". That is the exact false-clean this scanner's guard exists
# to catch, so keep these expressions in sync with the schemas in sanity/schemaTypes/.
TYPES = {
    "blog": 'pt::text(content) + " " + ' + FAQ_TEXT,
    "services": "pt::text(servicesContent)",
    "location": ('coalesce(introText, "") + " " + coalesce(pt::text(introContent), "") + " " '
                 '+ coalesce(heroHeadline, "") + " " + ' + FAQ_TEXT),
}


def fail(message):
    """Exit 2 (could not run) — distinct from exit 1 (ran, found violations)."""
    print(message, file=sys.stderr)
    sys.exit(2)


def load_env():
    path = os.path.join(ROOT, ".env.local")
    if not os.path.exists(path):
        fail("[2] .env.local not found — cannot reach Sanity.")
    env = {}
    with open(path) as fh:
        for line in fh:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def parse_ban_doc():
    """Pull HARD BAN words and banned phrases out of the reference doc."""
    if not os.path.exists(BAN_DOC):
        fail(f"[2] ban doc not found at {BAN_DOC}")
    text = open(BAN_DOC).read()
    words, phrases = set(), set()

    hard = re.search(r"## HARD BAN, words.*?\n(.*?)(?=\n## )", text, re.S)
    if hard:
        for line in hard.group(1).splitlines():
            if ":" not in line:
                continue
            for token in line.split(":", 1)[1].split(","):
                # Drop parenthetical qualifiers: "navigate (figurative)" -> "navigate"
                token = re.sub(r"\s*\(.*?\)\s*", "", token).strip().strip(".").strip()
                if token and " " not in token and len(token) > 2:
                    words.add(token.lower())

    ph = re.search(r"## Banned phrases\n(.*?)(?=\n## )", text, re.S)
    if ph:
        for line in ph.group(1).splitlines():
            if ":" not in line:
                continue
            for token in line.split(":", 1)[1].split(","):
                token = re.sub(r"\s*\[.*?\]\s*", " ", token).strip().strip(".").strip()
                if len(token.split()) >= 3:
                    phrases.add(token.lower())

    if not words:
        fail("[2] parsed 0 HARD BAN words — the ban doc's headings likely changed. "
             "Fix the parser rather than trusting a clean result.")
    return sorted(words), sorted(phrases)


def query(env, groq):
    pid = env.get("NEXT_PUBLIC_SANITY_PROJECT_ID")
    dataset = env.get("NEXT_PUBLIC_SANITY_DATASET")
    token = env.get("SANITY_API_READ_TOKEN")
    if not (pid and dataset and token):
        fail("[2] missing Sanity project id, dataset, or read token in .env.local")
    url = (f"https://{pid}.api.sanity.io/v2024-01-01/data/query/{dataset}?"
           + urllib.parse.urlencode({"query": groq}))
    request = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        return json.load(urllib.request.urlopen(request, timeout=30))["result"]
    except urllib.error.HTTPError as exc:
        fail(f"[2] Sanity returned HTTP {exc.code}: {exc.read().decode()[:300]}")
    except Exception as exc:  # noqa: BLE001 — surface anything that stops the scan
        fail(f"[2] could not reach Sanity: {exc}")


def is_exempt(word, text, start):
    window = text[max(0, start - 30):start + 40]
    for banned, pattern in CARVE_OUTS:
        if banned == word.lower() and re.search(pattern, window, re.I):
            return True
    return False


def scan(docs, words, phrases):
    word_re = re.compile(
        r"\b(" + "|".join(re.escape(w) for w in words) + r")(s|es|ed|ing|er|ly|ity|ful)?\b",
        re.I,
    )
    # A sentence ends, then a capitalised word begins, with no space between them.
    glue_re = re.compile(r"(?<=[a-z]{2})[.!?][A-Z][a-z]")

    findings = []
    for doc in docs:
        text = doc.get("text") or ""
        hits = []

        for match in word_re.finditer(text):
            if is_exempt(match.group(1), text, match.start()):
                continue
            hits.append(("word", match.group(0), match.start()))

        lowered = text.lower()
        for phrase in phrases:
            index = lowered.find(phrase)
            if index != -1:
                hits.append(("phrase", phrase, index))

        for match in glue_re.finditer(text):
            hits.append(("glued", match.group(0), match.start()))

        if hits:
            findings.append({
                "type": doc["type"],
                "slug": doc["slug"],
                "hits": [
                    {
                        "kind": kind,
                        "term": term,
                        "context": text[max(0, i - 45):i + 45].replace("\n", " "),
                    }
                    for kind, term, i in hits
                ],
            })
    return findings


def main():
    as_json = "--json" in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    wanted = args or list(TYPES)
    unknown = [t for t in wanted if t not in TYPES]
    if unknown:
        fail(f"[2] unknown type(s) {unknown}; valid: {list(TYPES)}")

    env = load_env()
    words, phrases = parse_ban_doc()

    docs = []
    for doc_type in wanted:
        expr = TYPES[doc_type]
        groq = (f'*[_type=="{doc_type}" && !(_id in path("drafts.**"))]'
                f'{{"slug": slug.current, "text": {expr}}}')
        rows = query(env, groq)
        # Step 2c guard: an all-empty body means the accessor is wrong, not that the
        # copy is clean. Fail loudly rather than reporting a false all-clear.
        if rows and all(not (row.get("text") or "").strip() for row in rows):
            fail(f"[2] every '{doc_type}' doc returned empty text for expression "
                 f"{expr!r} — wrong accessor, not clean copy.")
        docs += [{**row, "type": doc_type} for row in rows]

    findings = scan(docs, words, phrases)

    if as_json:
        print(json.dumps({"scanned": len(docs), "findings": findings}, indent=2))
        return 1 if findings else 0

    print(f"Scanned {len(docs)} published docs against {len(words)} HARD BAN words "
          f"and {len(phrases)} banned phrases.\n")
    for finding in findings:
        counts = {}
        for hit in finding["hits"]:
            counts[hit["kind"]] = counts.get(hit["kind"], 0) + 1
        summary = ", ".join(f"{v} {k}" for k, v in sorted(counts.items()))
        print(f"=== {finding['type']}/{finding['slug']}  ({summary})")
        for hit in finding["hits"]:
            print(f"    [{hit['kind']:6}] {hit['term']!r}")
            print(f"             ...{hit['context']}...")
        print()

    total = sum(len(f["hits"]) for f in findings)
    print("CLEAN — 0 violations" if not total
          else f"{total} violations across {len(findings)} docs")
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main())
