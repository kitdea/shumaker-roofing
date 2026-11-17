import requests
from bs4 import BeautifulSoup
url = "https://shumakerroofing.com/blog/roof-rejuvenation-cost-frederick-md"
r = requests.get(url, headers={"User-Agent":"Mozilla/5.0 (compatible; ShumakerAuditBot/1.0)"}, timeout=20)
soup = BeautifulSoup(r.text, "lxml")
h1s = soup.find_all("h1")
for h in h1s:
    print("---H1---")
    print(h)
    print("parent chain:", [p.name for p in h.parents][:6])
