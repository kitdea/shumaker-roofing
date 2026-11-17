import json
with open("analysis.json") as f:
    a = json.load(f)
print("TITLE LEN ISSUES:")
for t in a["title_length_issues"]:
    print(" ", t)
print("\nDESC LEN ISSUES:")
for d in a["desc_length_issues"]:
    print(" ", d)
print("\nALT COVERAGE BY PAGE (only <100%):")
for row in a["alt_coverage_by_page"]:
    if row["alt_coverage_pct"] is not None and row["alt_coverage_pct"] < 100:
        print(" ", row)
print("\nTotal pages with 0 images:", sum(1 for r in a["alt_coverage_by_page"] if not r["total_images"]))
total_imgs = sum(r["total_images"] or 0 for r in a["alt_coverage_by_page"])
total_with_alt = sum(r["images_with_alt"] or 0 for r in a["alt_coverage_by_page"])
print("\nsite-wide total images:", total_imgs, "with alt:", total_with_alt, "pct:", round(100*total_with_alt/total_imgs,1) if total_imgs else None)
counts = list(a["internal_link_counts"].values())
print("\nInternal link counts: min", min(counts), "max", max(counts), "avg", round(sum(counts)/len(counts),1))
