import json
from urllib.parse import urlparse

with open("crawl_raw.json") as f:
    data = json.load(f)
pages = data["pages"]

service_urls = sorted([u for u in pages if "/services/" in urlparse(u).path])
location_urls = sorted([u for u in pages if "/service-areas/" in urlparse(u).path])
blog_urls = sorted([u for u in pages if urlparse(u).path.startswith("/blog/") and "/author/" not in u])

def row(u):
    p = pages[u]
    return {
        "url": u,
        "title": p.get("title"),
        "meta_description": p.get("meta_description"),
        "h1": p.get("h1_texts"),
        "word_count": p.get("word_count"),
        "internal_link_count": p.get("internal_link_count"),
        "internal_links_sample": p.get("internal_links", [])[:40],
    }

print("=== SERVICE PAGES ===", len(service_urls))
for u in service_urls:
    r = row(u)
    print(json.dumps(r, indent=2))

print("\n=== LOCATION PAGES ===", len(location_urls))
for u in location_urls:
    r = row(u)
    print(json.dumps(r, indent=2))

print("\n=== Cross-link check: does each service page link to any /service-areas/ page? ===")
for u in service_urls:
    links = pages[u].get("internal_links", [])
    loc_links = [l for l in links if "/service-areas/" in l]
    print(u, "-> location links:", loc_links)

print("\n=== Cross-link check: does each location page link to any /services/ page? ===")
for u in location_urls:
    links = pages[u].get("internal_links", [])
    svc_links = [l for l in links if "/services/" in l]
    print(u, "-> service links:", svc_links)

print("\n=== Services index page links ===")
svc_index = pages.get("https://shumakerroofing.com/services", {})
print("links from /services:", [l for l in svc_index.get("internal_links", []) if "/services/" in l])

print("\n=== Service-areas index page links ===")
loc_index = pages.get("https://shumakerroofing.com/service-areas", {})
print("links from /service-areas:", [l for l in loc_index.get("internal_links", []) if "/service-areas/" in l])

print("\n=== Homepage links to services/locations ===")
home = pages.get("https://shumakerroofing.com/", {})
print([l for l in home.get("internal_links", []) if "/services/" in l or "/service-areas/" in l])

print("\n=== Blog pages count:", len(blog_urls))
for u in blog_urls:
    p = pages[u]
    print(u, "| title:", p.get("title"), "| wc:", p.get("word_count"))
