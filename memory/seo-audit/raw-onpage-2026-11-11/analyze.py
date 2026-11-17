import json, re, time
from collections import defaultdict, Counter
from urllib.parse import urlparse
import requests

session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; ShumakerAuditBot/1.0)"})

with open("crawl_raw.json") as f:
    data = json.load(f)

pages = data["pages"]
sitemap_urls = set(data["sitemap_urls"])
crawled_urls = set(pages.keys())

# 1. Status code inventory
status_summary = Counter()
non200 = []
redirects = []
for url, p in pages.items():
    status_summary[p.get("status")] += 1
    if p.get("status") != 200:
        non200.append({"url": url, "status": p.get("status"), "error": p.get("error")})
    if p.get("redirect_hops", 0) > 0:
        redirects.append({"url": url, "final_url": p.get("final_url"), "hops": p["redirect_hops"], "chain": p["redirect_chain"]})

# 2. Orphan pages: in sitemap but no other page links to them
all_internal_links_seen = set()
linking_pages = defaultdict(set)  # target -> set of pages linking to it
for url, p in pages.items():
    for link in p.get("internal_links", []):
        all_internal_links_seen.add(link)
        linking_pages[link].add(url)

orphans = []
for u in sitemap_urls:
    linkers = linking_pages.get(u, set()) - {u}
    if not linkers:
        orphans.append(u)

# 3. Linked internally but missing from sitemap
linked_not_sitemap = []
for link in all_internal_links_seen:
    # normalize: ignore home page trailing variants, fragments already stripped
    if link not in sitemap_urls and link in crawled_urls:
        # only flag real crawlable pages, not e.g. home itself if sitemap omits root intentionally
        linked_not_sitemap.append(link)
linked_not_sitemap = sorted(set(linked_not_sitemap))

# 4. Duplicate titles
title_map = defaultdict(list)
desc_map = defaultdict(list)
for url, p in pages.items():
    if p.get("status") == 200:
        t = p.get("title")
        if t:
            title_map[t].append(url)
        d = p.get("meta_description")
        if d:
            desc_map[d].append(url)

dup_titles = {t: urls for t, urls in title_map.items() if len(urls) > 1}
dup_descs = {d: urls for d, urls in desc_map.items() if len(urls) > 1}

# 5. Missing/multiple H1
h1_issues = []
for url, p in pages.items():
    if p.get("status") != 200:
        continue
    cnt = p.get("h1_count", 0)
    if cnt != 1:
        h1_issues.append({"url": url, "h1_count": cnt, "h1_texts": p.get("h1_texts")})

# 6. Thin content (word_count threshold)
THIN_THRESHOLD = 300
thin_pages = []
for url, p in pages.items():
    if p.get("status") != 200:
        continue
    wc = p.get("word_count", 0)
    if wc < THIN_THRESHOLD:
        thin_pages.append({"url": url, "word_count": wc})
thin_pages.sort(key=lambda x: x["word_count"])

# 7. Missing / empty title or meta description
missing_title = [u for u, p in pages.items() if p.get("status") == 200 and not p.get("title")]
missing_desc = [u for u, p in pages.items() if p.get("status") == 200 and not p.get("meta_description")]
missing_canonical = [u for u, p in pages.items() if p.get("status") == 200 and not p.get("canonical")]
noindex_pages = [u for u, p in pages.items() if p.get("status") == 200 and p.get("noindex")]

# 8. title length issues (too long/short, Google ~ 50-60 chars display)
title_len_issues = []
for url, p in pages.items():
    if p.get("status") != 200:
        continue
    tl = p.get("title_len", 0)
    if tl and (tl < 20 or tl > 65):
        title_len_issues.append({"url": url, "title": p.get("title"), "len": tl})

desc_len_issues = []
for url, p in pages.items():
    if p.get("status") != 200:
        continue
    dl = p.get("meta_description_len", 0)
    if dl and (dl < 50 or dl > 165):
        desc_len_issues.append({"url": url, "len": dl})

# 9. Image alt coverage per page + collect all unique image URLs for broken-image check
all_image_urls = set()
alt_coverage_rows = []
for url, p in pages.items():
    if p.get("status") != 200:
        continue
    alt_coverage_rows.append({
        "url": url,
        "total_images": p.get("total_images"),
        "images_with_alt": p.get("images_with_alt"),
        "alt_coverage_pct": p.get("alt_coverage_pct"),
    })
    for img in p.get("image_srcs", []):
        all_image_urls.add(img)

print(f"Checking {len(all_image_urls)} unique image URLs for status...")
broken_images = []
image_status_cache = {}
for i, img_url in enumerate(sorted(all_image_urls)):
    try:
        r = session.head(img_url, timeout=15, allow_redirects=True)
        if r.status_code >= 400 or r.status_code == 405:
            r = session.get(img_url, timeout=15, allow_redirects=True, stream=True)
            r.close()
        image_status_cache[img_url] = r.status_code
        if r.status_code >= 400:
            broken_images.append({"image_url": img_url, "status": r.status_code})
    except requests.exceptions.RequestException as e:
        image_status_cache[img_url] = None
        broken_images.append({"image_url": img_url, "status": None, "error": str(e)})
    if i % 20 == 0:
        print(f"  ...{i}/{len(all_image_urls)}")
    time.sleep(0.05)

# map broken images back to which pages reference them
broken_image_pages = []
for bi in broken_images:
    referencing = [u for u, p in pages.items() if p.get("status") == 200 and bi["image_url"] in p.get("image_srcs", [])]
    broken_image_pages.append({**bi, "referenced_on": referencing})

# 10. internal outbound link counts per page (already in p['internal_link_count'])
link_counts = {u: p.get("internal_link_count") for u, p in pages.items() if p.get("status") == 200}

# 11. check all unique internal links discovered (cross-check none are broken, beyond crawled set)
# since crawler queued all discovered internal html links, any non-crawled link means it was filtered as asset ext or query param dup
uncrawled_internal_links = sorted(all_internal_links_seen - crawled_urls)

report = {
    "status_summary": dict(status_summary),
    "non200_pages": non200,
    "redirects": redirects,
    "orphan_pages_in_sitemap_not_linked": sorted(orphans),
    "linked_but_not_in_sitemap": linked_not_sitemap,
    "uncrawled_internal_links_discovered": uncrawled_internal_links,
    "duplicate_titles": dup_titles,
    "duplicate_meta_descriptions": dup_descs,
    "h1_issues": h1_issues,
    "thin_content_pages": thin_pages,
    "missing_title": missing_title,
    "missing_meta_description": missing_desc,
    "missing_canonical": missing_canonical,
    "noindex_pages": noindex_pages,
    "title_length_issues": title_len_issues,
    "desc_length_issues": desc_len_issues,
    "alt_coverage_by_page": alt_coverage_rows,
    "broken_images": broken_image_pages,
    "internal_link_counts": link_counts,
    "sitemap_count": len(sitemap_urls),
    "crawled_count": len(crawled_urls),
}

with open("analysis.json", "w") as f:
    json.dump(report, f, indent=2)

print("\n=== SUMMARY ===")
print("Status codes:", dict(status_summary))
print("Non-200 pages:", len(non200))
print("Redirects:", len(redirects))
print("Orphans (sitemap, not linked):", orphans)
print("Linked but not in sitemap:", linked_not_sitemap)
print("Uncrawled internal links discovered (filtered as assets or dup):", len(uncrawled_internal_links))
print("Duplicate titles groups:", len(dup_titles))
for t, urls in dup_titles.items():
    print("  TITLE:", t, "->", urls)
print("Duplicate meta desc groups:", len(dup_descs))
for d, urls in dup_descs.items():
    print("  DESC:", d[:80], "->", urls)
print("H1 issues:", len(h1_issues))
for h in h1_issues:
    print("  ", h)
print("Thin content pages (<300 words):", len(thin_pages))
for t in thin_pages:
    print("  ", t)
print("Missing title:", missing_title)
print("Missing meta desc:", missing_desc)
print("Missing canonical:", missing_canonical)
print("Noindex pages:", noindex_pages)
print("Broken images:", len(broken_images))
for bi in broken_image_pages:
    print("  ", bi)
