import json, csv

with open("crawl_raw.json") as f:
    data = json.load(f)
pages = data["pages"]

fields = ["url", "status", "final_url", "redirect_hops", "title", "title_len",
          "meta_description", "meta_description_len", "h1_count", "h1_texts",
          "word_count", "canonical", "noindex", "nofollow", "total_images",
          "images_with_alt", "alt_coverage_pct", "internal_link_count",
          "external_link_count", "jsonld_count"]

with open("url_inventory.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
    w.writeheader()
    for url in sorted(pages.keys()):
        row = dict(pages[url])
        row["url"] = url
        if isinstance(row.get("h1_texts"), list):
            row["h1_texts"] = " | ".join(row["h1_texts"])
        w.writerow(row)

print("wrote url_inventory.csv with", len(pages), "rows")
