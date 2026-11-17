import json
with open("crawl_raw.json") as f:
    data = json.load(f)
pages = data["pages"]
static_paths = ["/", "/about", "/services", "/blog", "/contact", "/book-appointment",
                 "/service-areas", "/careers", "/faqs", "/projects", "/testimonials",
                 "/roofs-for-heroes", "/privacy-policy", "/terms-and-conditions",
                 "/blog/author/tyler-schisler"]
for path in static_paths:
    url = "https://shumakerroofing.com" + path
    p = pages.get(url)
    if not p:
        print(path, "NOT FOUND")
        continue
    print(f"{path} | status={p['status']} | title={p.get('title')!r} | h1_count={p.get('h1_count')} | h1={p.get('h1_texts')} | wc={p.get('word_count')} | canonical={p.get('canonical')} | links={p.get('internal_link_count')} | imgs={p.get('total_images')}/{p.get('images_with_alt')}")
