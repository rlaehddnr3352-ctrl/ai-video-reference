"""data/site-data.json → index.html 안의 <script id="siteData">(카드 데이터)와 <script id="refsData">(무빙·스타일 카드)에 넣는다.
사용: python3 embed.py <사이트 폴더>
"""
import json, re, sys, os
site = sys.argv[1]
d = json.load(open(os.path.join(site, "data/site-data.json"), encoding="utf-8"))
p = os.path.join(site, "index.html"); h = open(p, encoding="utf-8").read()
refs = d.pop("REFS")
sd = json.dumps(d, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
rd = json.dumps(refs, ensure_ascii=False).replace("</", "<\\/")
h2 = re.sub(r'(<script id="siteData" type="application/json">).*?(</script>)', lambda m: m.group(1) + sd + m.group(2), h, count=1, flags=re.S)
h2 = re.sub(r'(<script id="refsData" type="application/json">).*?(</script>)', lambda m: m.group(1) + rd + m.group(2), h2, count=1, flags=re.S)
if h2 != h: open(p, "w", encoding="utf-8").write(h2)
print("index.html", "updated" if h2 != h else "unchanged")
