import json, re, sys, time
from urllib.parse import urljoin, urlparse
from collections import deque, defaultdict
import requests
from bs4 import BeautifulSoup

BASE = "https://shumakerroofing.com"
DOMAIN = "shumakerroofing.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ShumakerAuditBot/1.0; +https://shumakerroofing.com)"
}
TIMEOUT = 20
MAX_PAGES = 200  # practical cap; sitemap has 53 URLs so this gives plenty of headroom

session = requests.Session()
session.headers.update(HEADERS)

def normalize(url):
    url = url.split("#")[0]
    p = urlparse(url)
    # strip trailing slash except root
    path = p.path
    if path != "/" and path.endswith("/"):
        path = path[:-1]
    if not path:
        path = "/"
    return f"{p.scheme}://{p.netloc}{path}" + (f"?{p.query}" if p.query else "")

def is_internal(url):
    try:
        p = urlparse(url)
        return p.netloc == "" or p.netloc.endswith(DOMAIN)
    except Exception:
        return False

def fetch(url, max_redirects=10):
    """Fetch url, follow redirects manually to record the chain. Returns dict."""
    chain = []
    current = url
    redirect_count = 0
    final_resp = None
    try:
        resp = session.get(url, timeout=TIMEOUT, allow_redirects=True, headers=HEADERS)
        # requests already followed; use resp.history for chain
        for h in resp.history:
            chain.append({"url": h.url, "status": h.status_code})
        redirect_count = len(resp.history)
        final_resp = resp
        return {
            "requested_url": url,
            "final_url": resp.url,
            "status": resp.status_code,
            "redirect_chain": chain,
            "redirect_hops": redirect_count,
            "content_type": resp.headers.get("Content-Type", ""),
            "ok": True,
            "text": resp.text if "text/html" in resp.headers.get("Content-Type", "") else None,
            "error": None,
        }
    except requests.exceptions.RequestException as e:
        return {
            "requested_url": url,
            "final_url": None,
            "status": None,
            "redirect_chain": chain,
            "redirect_hops": redirect_count,
            "content_type": None,
            "ok": False,
            "text": None,
            "error": str(e),
        }

def fetch_head_or_get_status(url):
    """Lightweight status check for links/images (no need for full body)."""
    try:
        resp = session.head(url, timeout=TIMEOUT, allow_redirects=True, headers=HEADERS)
        if resp.status_code >= 400 or resp.status_code == 405:
            # some servers don't support HEAD properly; fallback to GET
            resp = session.get(url, timeout=TIMEOUT, allow_redirects=True, headers=HEADERS, stream=True)
            resp.close()
        chain_hops = len(resp.history)
        return resp.status_code, chain_hops, resp.url
    except requests.exceptions.RequestException as e:
        return None, 0, str(e)

def extract_page_data(url, html, final_url):
    soup = BeautifulSoup(html, "lxml")

    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else None

    meta_desc_tag = soup.find("meta", attrs={"name": re.compile("^description$", re.I)})
    meta_desc = meta_desc_tag.get("content", "").strip() if meta_desc_tag else None

    h1_tags = soup.find_all("h1")
    h1_texts = [h.get_text(strip=True) for h in h1_tags]

    canonical_tag = soup.find("link", attrs={"rel": re.compile("canonical", re.I)})
    canonical = canonical_tag.get("href") if canonical_tag else None

    robots_tag = soup.find("meta", attrs={"name": re.compile("^robots$", re.I)})
    robots_content = robots_tag.get("content", "").strip().lower() if robots_tag else ""
    noindex = "noindex" in robots_content
    nofollow = "nofollow" in robots_content

    # word count: visible text in body, strip script/style/nav/footer boilerplate roughly
    body = soup.find("body")
    word_count = 0
    if body:
        for tag in body.find_all(["script", "style", "noscript"]):
            tag.decompose()
        text = body.get_text(separator=" ", strip=True)
        words = re.findall(r"[A-Za-z0-9''-]+", text)
        word_count = len(words)

    # images + alt coverage
    imgs = soup.find_all("img")
    total_imgs = len(imgs)
    imgs_with_alt = sum(1 for i in imgs if i.get("alt") and i.get("alt").strip())
    img_srcs = []
    for i in imgs:
        src = i.get("src") or i.get("data-src") or ""
        if src:
            img_srcs.append(urljoin(final_url, src))

    # links
    anchors = soup.find_all("a", href=True)
    internal_links = set()
    external_links = set()
    for a in anchors:
        href = a["href"].strip()
        if not href or href.startswith("javascript:") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        absolute = urljoin(final_url, href)
        if is_internal(absolute):
            internal_links.add(normalize(absolute))
        else:
            external_links.add(absolute)

    # JSON-LD presence
    jsonld_scripts = soup.find_all("script", attrs={"type": "application/ld+json"})
    jsonld_count = len(jsonld_scripts)

    return {
        "title": title,
        "title_len": len(title) if title else 0,
        "meta_description": meta_desc,
        "meta_description_len": len(meta_desc) if meta_desc else 0,
        "h1_texts": h1_texts,
        "h1_count": len(h1_texts),
        "canonical": canonical,
        "noindex": noindex,
        "nofollow": nofollow,
        "word_count": word_count,
        "total_images": total_imgs,
        "images_with_alt": imgs_with_alt,
        "alt_coverage_pct": round(100 * imgs_with_alt / total_imgs, 1) if total_imgs else None,
        "image_srcs": img_srcs,
        "internal_links": sorted(internal_links),
        "internal_link_count": len(internal_links),
        "external_link_count": len(external_links),
        "jsonld_count": jsonld_count,
    }

def main():
    # 1. Fetch sitemap
    sitemap_url = f"{BASE}/sitemap.xml"
    sm_resp = session.get(sitemap_url, timeout=TIMEOUT)
    sitemap_urls = []
    if sm_resp.status_code == 200:
        soup = BeautifulSoup(sm_resp.text, "xml")
        for loc in soup.find_all("loc"):
            sitemap_urls.append(normalize(loc.get_text(strip=True)))
    sitemap_urls_set = set(sitemap_urls)
    print(f"Sitemap: {len(sitemap_urls)} URLs found")

    # 2. BFS crawl starting from homepage + sitemap seeds
    to_visit = deque()
    seen = set()
    start = normalize(BASE + "/")
    to_visit.append(start)
    seen.add(start)
    for u in sitemap_urls:
        if u not in seen:
            to_visit.append(u)
            seen.add(u)

    pages = {}
    link_graph = {}  # url -> list of internal links found on that page
    image_check_cache = {}
    link_status_cache = {}

    while to_visit and len(pages) < MAX_PAGES:
        url = to_visit.popleft()
        print(f"Fetching [{len(pages)+1}]: {url}")
        result = fetch(url)
        entry = {
            "url": url,
            "status": result["status"],
            "final_url": result["final_url"],
            "redirect_hops": result["redirect_hops"],
            "redirect_chain": result["redirect_chain"],
            "content_type": result["content_type"],
            "error": result["error"],
        }
        if result["ok"] and result["text"] and result["status"] == 200:
            page_data = extract_page_data(url, result["text"], result["final_url"])
            entry.update(page_data)
            link_graph[url] = page_data["internal_links"]
            # queue newly discovered internal links (only html pages, skip obvious non-page assets)
            for link in page_data["internal_links"]:
                parsed = urlparse(link)
                path = parsed.path.lower()
                if any(path.endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".svg", ".gif", ".pdf", ".xml", ".ico", ".webp", ".css", ".js", ".json", ".txt"]):
                    continue
                if link not in seen:
                    seen.add(link)
                    to_visit.append(link)
        else:
            link_graph[url] = []
        pages[url] = entry
        time.sleep(0.3)  # be polite

    return pages, sitemap_urls_set, link_graph

if __name__ == "__main__":
    pages, sitemap_urls_set, link_graph = main()

    out = {
        "crawled_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "sitemap_urls": sorted(sitemap_urls_set),
        "pages": pages,
    }
    with open("crawl_raw.json", "w") as f:
        json.dump(out, f, indent=2)
    print(f"\nDone. Crawled {len(pages)} pages. Saved to crawl_raw.json")
