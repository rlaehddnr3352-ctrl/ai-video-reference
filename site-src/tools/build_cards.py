"""카드 상세 페이지 /card/*.html 201장 + cards.json 을 다시 만든다.
사용: python3 build_cards.py <items.json(export_items.js 결과)> <사이트 폴더(main 체크아웃)> [--check]
--check: 파일을 쓰지 않고 지금 사이트 파일과 비교만 한다.
템플릿(머리말·CSS·꼬리말)과 카테고리별 '잘 쓰는 요령'은 사이트에 있는 카드 페이지에서 그대로 읽어 온다.
"""
import json, re, sys, os, html, glob
e = lambda s: html.escape(s, quote=True)
items_path, site = sys.argv[1], sys.argv[2]; CHECK = "--check" in sys.argv
BASE = "https://ai-video-reference-kr.netlify.app"
d = json.load(open(items_path, encoding="utf-8")); items = d["items"]; cats = d["cats"]
CATKO = {c["id"]: c["label"] for c in cats}; ORDER = {c["id"]: i for i, c in enumerate(cats)}
FITKO = {"좋음": "세로 화면에서 잘 살아나는 무빙이에요. 쇼츠 · 릴스에 바로 쓰기 좋아요.",
         "보통": "세로 화면에서도 쓸 수 있지만 좌우 정보가 잘릴 수 있으니 피사체를 가운데에 두세요.",
         "주의": "세로 화면은 좌우 폭이 좁아서 이 무빙이 빠르고 답답해 보일 수 있어요. 가로 영상이나 넓은 샷에서 쓰는 걸 추천해요."}
CD = os.path.join(site, "card")
# 템플릿: 아무 카드 페이지 하나에서 머리말/꼬리말, 카테고리별 요령·광고 블록을 읽는다
def read(p): return open(p, encoding="utf-8").read()
sample = read(sorted(glob.glob(CD + "/*.html"))[0])
HEAD = sample[:sample.index("<main>")]
TAIL = sample[sample.index("</main>"):]
TIPS, COUPANG = {}, None
for it in items:
    p = f"{CD}/{it['code'].lower()}.html"
    if it["cat"] in TIPS or not os.path.exists(p): continue
    s = read(p)
    TIPS[it["cat"]] = re.search(r"<h2>잘 쓰는 요령</h2>\n  (<ul>.*?</ul>)", s, re.S).group(1)
    COUPANG = COUPANG or re.search(r"\n  (<aside class=\"cpbox\".*?</aside>)", s, re.S).group(1)
TIPS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "card_tips.json")
if os.path.exists(TIPS_FILE):  # 새 카테고리 요령은 여기에 적어 둔다(사이트 페이지에 없을 때)
    for k, v in json.load(open(TIPS_FILE, encoding="utf-8")).items():
        TIPS.setdefault(k, "<ul>" + "".join(f"<li>{e(x)}</li>" for x in v) + "</ul>")

def head(title, desc, url):
    h = re.sub(r"<title>.*?</title>", f"<title>{e(title)}</title>", HEAD, count=1)
    h = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + e(desc), h, count=1)
    h = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + e(title), h, count=1)
    h = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + e(desc), h, count=1)
    return re.sub(r"/card/[a-z]\d+\.html", url, h)

# 가이드 역링크: 가이드 목록(guide/index.html) 순서대로, 본문에 card/<slug>.html 링크가 있는 가이드
GUIDES = []
for g in re.findall(r'href="([a-z0-9-]+)\.html"', read(os.path.join(site, "guide/index.html"))):
    if any(x["slug"] == g for x in GUIDES): continue
    gs = read(os.path.join(site, f"guide/{g}.html"))
    GUIDES.append({"slug": g, "h1": re.search(r"<h1>(.*?)</h1>", gs, re.S).group(1),
                   "desc": re.search(r'<meta name="description" content="([^"]*)"', gs).group(1),
                   "links": set(re.findall(r"card/([a-z]\d+)\.html", gs))})
idx = {id(o): i for i, o in enumerate(items)}
def related(c):
    same = [o for o in items if o["cat"] == c["cat"] and o is not c]
    cross = sorted([o for o in items if o is not c and o["cat"] != c["cat"] and set(o["uses"]) & set(c["uses"])], key=lambda o: (ORDER.get(o["cat"], 99), idx[id(o)]))
    return same[:4] + cross[:4]

pages, cards_json = {}, []
for c in items:
    vis = c["visual"].replace(' preload="none"', ' autoplay preload="auto"') if c["visual"].startswith('<video class="mgv"') else c["visual"]  # 상세 페이지에서는 바로 재생
    code = c["code"]; slug = code.lower(); cid = c["cat"]; catko = CATKO[cid]
    title = c["name"] + (f' ({c["en"]})' if c["en"] else "") + f" 프롬프트 · {catko} {code} | AI 영상 레퍼런스 보관함"
    desc = (f'{c["name"]} — {c["desc"]} ' + (f'이럴 때: {c["when"]}' if c["when"] else "")).strip()[:155]
    boxes = []
    if c["when"]: boxes.append(f'<div class="box"><b>이럴 때 쓰세요</b><p>{e(c["when"])}</p></div>')
    if c["fit"]: boxes.append(f'<div class="box"><b>세로 9:16 적합도 · {e(c["fit"])}</b><p>{FITKO.get(c["fit"], "")}</p></div>')
    if c["caution"]: boxes.append(f'<div class="box warn"><b>주의</b><p>{e(c["caution"])}</p></div>')
    chips = "".join(f'<span class="chip">#{e(u)}</span>' for u in c["uses"] + c["tags"])
    sub = " · ".join(e(x) for x in [c["en"], c["dur"]] if x)
    same = [o for o in items if o["cat"] == cid]; k = same.index(c)
    prv = f'<a href="{same[k-1]["code"].lower()}.html">← {same[k-1]["code"]} {e(same[k-1]["name"])}</a>' if k > 0 else "<span></span>"
    nxt = f'<a href="{same[k+1]["code"].lower()}.html">{same[k+1]["code"]} {e(same[k+1]["name"])} →</a>' if k + 1 < len(same) else ""
    yt = f'\n    <a class="btn2" href="https://www.youtube.com/results?search_query={__import__("urllib.parse").parse.quote(c["ytq"], safe="-_.!~*()")}" target="_blank" rel="noopener">비슷한 영상 보기 ↗</a>' if c["ytq"] else ""
    rel = "".join(f'<li><a href="{o["code"].lower()}.html"><b><span class="code">{o["code"]}</span> {e(o["name"])}</b><small>{e(o["desc"][:70])}</small></a></li>' for o in related(c))
    gs = [g for g in GUIDES if slug in g["links"]]
    gl = ('<h2>이 카드가 나오는 가이드</h2><ul class="related">' + "".join(f'<li><a href="../guide/{g["slug"]}.html"><b>{g["h1"]}</b><small>{e(html.unescape(g["desc"])[:80])}</small></a></li>' for g in gs) + "</ul>") if gs else ""
    body = f"""<main>
  <span class="eyebrow"><a href="../#cat-{cid}">{catko}</a> · {code}</span>
  <div class="cardhero">
    <div class="prev{' pad' if c['pad'] else ''}" aria-hidden="true">{vis}</div>
    <div>
      <h1>{e(c['name'])}</h1>
      {f'<p class="lede">{sub}</p>' if sub else ''}
      <p>{e(c['desc'])}</p>
      <div class="meta">{chips}</div>
    </div>
  </div>
  {''.join(boxes)}
  <h2>AI에게 이렇게 말하세요</h2>
  <p>[product] 자리는 사전의 공통 설정에 적은 제품 이름으로 바뀌어 복사돼요.</p>
  <div class="pbox"><div class="row"><b>간단</b><button class="copybtn" type="button" data-copy="ps">복사</button></div><pre class="prompt" id="ps">{e(c['simple'])}</pre></div>
  <div class="pbox"><div class="row"><b>자세히</b><button class="copybtn" type="button" data-copy="pd">복사</button></div><pre class="prompt" id="pd">{e(c['detail'])}</pre></div>
  <div class="actions">
    <a class="btn" href="../#add-{slug}">주문서에 담기</a>{yt}
    <a class="btn2" href="../#cat-{cid}">{catko} 전체 보기</a>
  </div>
  <h2>잘 쓰는 요령</h2>
  {TIPS.get(cid, '<ul></ul>')}
  {COUPANG}
  <h2>같이 보면 좋은 카드</h2>
  <ul class="related">{rel}</ul>
  {gl}
  <nav class="pn">{prv}{nxt}</nav>
"""
    ld = json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "레퍼런스 사전", "item": BASE + "/"},
        {"@type": "ListItem", "position": 2, "name": catko, "item": f"{BASE}/#cat-{cid}"},
        {"@type": "ListItem", "position": 3, "name": c["name"], "item": f"{BASE}/card/{slug}.html"}]}, ensure_ascii=False)
    tail = re.sub(r'<script type="application/ld\+json">.*?</script>', lambda m: f'<script type="application/ld+json">{ld}</script>', TAIL, count=1, flags=re.S)
    pages[slug] = head(title, desc, f"/card/{slug}.html") + body + tail
# cards.json: 홈 화면 순서(카테고리 순서 → 카드 순서)
CATEN = {"tpl": "script_structure", "line": "hook_script_line", "motion": "camera_move", "fx": "transition_effect", "style": "look_style", "shot": "shot_size",
         "angle": "camera_angle", "light": "lighting", "mg": "motion_graphics", "act": "acting_expression", "cap": "caption_style"}
cj_path = os.path.join(site, "cards.json")
cj = json.load(open(cj_path, encoding="utf-8"))
cl = []
for it in sorted(items, key=lambda o: (ORDER.get(o["cat"], 99), idx[id(o)])):
    x = {"code": it["code"], "category": CATEN.get(it["cat"], it["cat"]), "name": it["name"], "name_en": it["en"], "description": it["desc"], "when_to_use": it["when"]}
    if it["fit"]: x["fit_vertical_9x16"] = it["fit"]
    if it["caution"]: x["caution"] = it["caution"]
    x.update(prompt_simple=it["simple"], prompt_detail=it["detail"], url=f"{BASE}/card/{it['code'].lower()}.html")
    cl.append(x)
if cl != cj["cards"]: cj["updated"] = __import__("datetime").date.today().isoformat()
cj["cards"] = cl
cj_text = json.dumps(cj, ensure_ascii=False, indent=1)
print("pages", len(pages))
if CHECK:
    diff = [s for s, t in pages.items() if not os.path.exists(f"{CD}/{s}.html") or read(f"{CD}/{s}.html") != t]
    print("different", len(diff), diff[:20])
    print("cards.json same:", cj_text == read(cj_path))
    if diff:
        a, b = read(f"{CD}/{diff[0]}.html"), pages[diff[0]]; i = 0
        while i < min(len(a), len(b)) and a[i] == b[i]: i += 1
        print("LIVE:", repr(a[i-150:i+150])); print("NEW :", repr(b[i-150:i+150]))
else:
    for f in glob.glob(CD + "/*.html"):
        if os.path.basename(f)[:-5] not in pages: os.remove(f)
    for s, t in pages.items(): open(f"{CD}/{s}.html", "w", encoding="utf-8").write(t)
    open(cj_path, "w", encoding="utf-8").write(cj_text)
    # sitemap: 카드 주소 추가 · 없어진 카드 삭제(다른 주소는 그대로)
    sp = os.path.join(site, "sitemap.xml"); sm = read(sp)
    have = set(re.findall(r"/card/([a-z]\d+)\.html", sm))
    for gone in have - set(pages):
        sm = re.sub(rf"\s*<url><loc>[^<]*/card/{gone}\.html</loc>.*?</url>", "", sm, flags=re.S)
    new = [s_ for s_ in pages if s_ not in have]
    if new:
        today = __import__("datetime").date.today().isoformat()
        sm = sm.replace("</urlset>", "".join(f"  <url><loc>{BASE}/card/{s_}.html</loc><lastmod>{today}</lastmod></url>\n" for s_ in new) + "</urlset>")
    open(sp, "w", encoding="utf-8").write(sm)
    # llms.txt 카드 수
    lp = os.path.join(site, "llms.txt"); lt = read(lp)
    open(lp, "w", encoding="utf-8").write(re.sub(r"\(JSON, \d+장\)", f"(JSON, {len(pages)}장)", lt))
    print("written", len(pages), "pages; sitemap +", len(new), "-", len(have - set(pages)))
