# Executed at the end of build_public.py (shares its globals: json, os, re, html, glob, OUT, ROOT, BASE, head, GCSS, nav, COUPANG, guides).
# Builds one static page per card under /card/, then rewrites sitemap.xml to include them.

rich = json.load(open("/tmp/claude-0/-home-claude/aa782c16-cbe2-576a-a960-07e1248b6af2/scratchpad/cards_rich.json", encoding="utf-8"))
src_full = open(ROOT + "/public-src.html", encoding="utf-8").read()
tokens = src_full[src_full.index(":root{"):src_full.index("*{box-sizing:border-box}")]
defs = re.search(r'<svg width="0" height="0".*?</svg>', src_full, re.S).group(0)

CATKO = {"tpl": "스크립트 구조", "motion": "카메라 무빙", "style": "룩 · 스타일", "shot": "샷 크기", "angle": "앵글", "light": "조명 대비"}
TIPS = {
    "motion": ["한 샷에는 카메라 무빙 하나만 넣으세요. 여러 개가 필요하면 샷을 나누는 게 안정적이에요.",
               "프롬프트 맨 앞에 무빙을 쓰고, '4초 동안 천천히'처럼 속도와 시간을 함께 적으세요.",
               "움직임의 기준이 되는 피사체(제품, 인물)를 꼭 적어야 화면이 엉뚱한 곳으로 흘러가지 않아요."],
    "style": ["룩 카드는 영상 전체에 한 번 정하고 모든 컷에 같은 문장을 붙이세요. 컷마다 색감이 바뀌는 걸 막아 줘요.",
              "'고급스럽게' 같은 말 대신 조명 비율, 렌즈, 색 팔레트처럼 측정할 수 있는 조건으로 쓰세요.",
              "제품의 실제 색과 너무 다른 팔레트는 피하세요. 패키지 색이 바뀌어 보일 수 있어요."],
    "shot": ["샷 크기는 컷마다 바꿔도 되지만, 같은 장면 안에서는 한 단계씩만 바꾸는 게 자연스러워요.",
             "세로 9:16 영상은 같은 샷 크기라도 좌우가 좁으니 한 단계 넓게 잡아 보세요.",
             "제품 라벨이 읽혀야 하는 컷은 클로즈업 이상으로 잡으세요."],
    "angle": ["앵글은 영상의 시선이에요. 이유 없이 바꾸지 말고 감정이 바뀌는 지점에서 바꾸세요.",
              "프롬프트에 앵글과 함께 카메라 높이(눈높이, 바닥 높이 등)를 적으면 더 정확해요.",
              "기울인 더치 앵글은 첫 1–2초 훅에만 짧게 쓰는 게 좋아요."],
    "light": ["조명 대비는 모든 컷에 같은 비율과 같은 빛 방향을 적어야 편집했을 때 이어져 보여요.",
              "'key light from the left'처럼 빛이 들어오는 방향도 함께 적으세요.",
              "제품 정보가 중요한 컷은 대비를 낮게, 분위기가 중요한 컷은 높게 잡으세요."],
    "tpl": ["구조의 단계 순서는 지키되, 길이는 영상 전체 길이에 맞춰 비율로 나누세요.",
            "첫 단계(훅)는 3초를 넘기지 않는 게 좋아요.",
            "단계마다 카메라 무빙 카드를 하나씩 배정하면 샷 리스트가 바로 나와요."],
}
FITKO = {"좋음": "세로 화면에서 잘 살아나는 무빙이에요. 쇼츠 · 릴스에 바로 쓰기 좋아요.",
         "보통": "세로 화면에서도 쓸 수 있지만 좌우 정보가 잘릴 수 있으니 피사체를 가운데에 두세요.",
         "주의": "세로 화면은 좌우 폭이 좁아서 이 무빙이 빠르고 답답해 보일 수 있어요. 가로 영상이나 넓은 샷에서 쓰는 걸 추천해요."}

CARD_CSS = """<style>
%TOKENS%
.cardhero{display:grid;grid-template-columns:minmax(0,320px) minmax(0,1fr);gap:24px;align-items:start;margin:8px 0 24px}
@media (max-width:680px){.cardhero{grid-template-columns:minmax(0,1fr)}}
.cardhero h1{margin-top:0}
.prev{background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;max-width:100%}
.prev>svg{width:100%;height:100%;display:block}
.prev.pad{padding:14px;flex-direction:column;align-items:stretch}
.prev .swatchrow{display:flex;gap:10px;align-items:center;width:100%;height:100%;padding:12px}
.prev .swatch{display:flex;flex:1;height:100%;border-radius:6px;overflow:hidden;border:1px solid var(--line)}
.prev .swatch span{flex:1}
.prev .sphere{width:30%;max-width:90px;height:auto}
.prev .tlwrap{position:relative;width:100%}
.prev .tl{display:flex;width:100%;border-radius:6px;overflow:hidden;border:1px solid var(--line)}
.prev .tl .b{--c:var(--motion);background:color-mix(in srgb,var(--c) 20%,var(--surface));border-top:3px solid var(--c);padding:5px 6px;min-width:0;font-size:11.5px;line-height:1.3}
.prev .tl .b b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.prev .tl .b span{display:block;font-family:var(--f-mono);font-size:10.5px;color:var(--muted)}
.k0{--c:var(--rec)!important}.k1{--c:var(--motion)!important}.k2{--c:var(--style)!important}.k3{--c:var(--c3)!important}.k4{--c:var(--c4)!important}.k5{--c:var(--muted)!important}
.prev .schema{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;width:100%}
.prev .schema span{border:1px solid var(--line);border-radius:6px;padding:6px;font-size:12px;text-align:center}
.prev .playhead{display:none}
.meta{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
.chip{font-size:12px;border:1px solid var(--line);border-radius:999px;padding:2px 9px;color:var(--muted);background:var(--surface)}
.code{font-family:var(--f-mono);font-size:12px;border:1px solid var(--line);border-radius:4px;padding:1px 6px;background:var(--surface)}
.box{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:10px 0}
.box p{margin:4px 0 0}
.box.warn{border-color:var(--rec)}.box.warn b{color:var(--rec)}
.pbox{margin:12px 0}
.pbox .row{display:flex;justify-content:space-between;align-items:center;gap:8px}
.copybtn{font:inherit;font-size:13px;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:8px;padding:4px 10px;cursor:pointer}
.actions{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}
.btn2{display:inline-block;border:1px solid var(--line);border-radius:8px;padding:8px 14px;font-size:14px;text-decoration:none;background:var(--surface)}
@media (prefers-reduced-motion:reduce){.prev *{animation:none!important}}
</style>"""

CPJS = """<script>
document.querySelectorAll("[data-copy]").forEach(function(b){b.addEventListener("click",function(){
  var el=document.getElementById(b.dataset.copy), subj="";
  try{subj=(JSON.parse(localStorage.getItem("settings")||"{}").subj||"").trim();}catch(e){}
  var txt=el.textContent.replace(/\\[product\\]/g, subj||"[product]");
  function sel(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);}
  if(navigator.clipboard){navigator.clipboard.writeText(txt).then(function(){b.textContent="복사했어요";setTimeout(function(){b.textContent="복사";},1500);},sel);}else{sel();}
});});
</script>"""

e = html.escape
os.makedirs(OUT + "/card", exist_ok=True)
for f in glob.glob(OUT + "/card/*.html"):
    os.remove(f)
bycid = {}
for c in rich:
    bycid.setdefault(c["cid"], []).append(c)

card_urls = []
for c in rich:
    code = c["code"]; slug = code.lower(); cid = c["cid"]; catko = CATKO.get(cid, cid)
    same = [o for o in bycid[cid] if o is not c]
    cross = [o for o in rich if o is not c and o["cid"] != cid and set(o["uses"]) & set(c["uses"])]
    rel = (same[:3] + cross[:3])[:6]
    title = f'{c["name"]}' + (f' ({c["name_en"]})' if c["name_en"] else "") + f' 프롬프트 · {catko} {code}'
    desc = (f'{c["name"]} — {c["description"]} ' + (f'이럴 때: {c["when_to_use"]}' if c["when_to_use"] else "")).strip()[:155]
    parts = []
    if c["when_to_use"]:
        parts.append(f'<div class="box"><b>이럴 때 쓰세요</b><p>{e(c["when_to_use"])}</p></div>')
    if c["fit916"]:
        parts.append(f'<div class="box"><b>세로 9:16 적합도 · {e(c["fit916"])}</b><p>{FITKO.get(c["fit916"], "")}</p></div>')
    if c["caution"]:
        parts.append(f'<div class="box warn"><b>주의</b><p>{e(c["caution"])}</p></div>')
    uses = "".join(f'<span class="chip">#{e(u)}</span>' for u in c["uses"])
    tips = "".join(f"<li>{e(x)}</li>" for x in TIPS.get(cid, []))
    relhtml = "".join(f'<li><a href="{o["code"].lower()}.html"><b><span class="code">{o["code"]}</span> {e(o["name"])}</b><small>{e(o["description"][:70])}</small></a></li>' for o in rel)
    sub = ""
    if c["name_en"] or c["dur"]:
        sub = '<p class="lede">' + " · ".join(e(x) for x in [c["name_en"], c["dur"]] if x) + "</p>"
    yt = f'<a class="btn2" href="{e(c["yt"])}" target="_blank" rel="noopener">비슷한 영상 보기 ↗</a>' if c["yt"] else ""
    jsonld = json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "레퍼런스 사전", "item": BASE + "/"},
        {"@type": "ListItem", "position": 2, "name": catko, "item": f"{BASE}/#cat-{cid}"},
        {"@type": "ListItem", "position": 3, "name": c["name"], "item": f"{BASE}/card/{slug}.html"}]}, ensure_ascii=False)
    body = f"""
<main>
  <span class="eyebrow"><a href="../#cat-{cid}">{catko}</a> · {code}</span>
  <div class="cardhero">
    <div class="prev{' pad' if c['prevPad'] else ''}" aria-hidden="true">{c['prev']}</div>
    <div>
      <h1>{e(c['name'])}</h1>
      {sub}
      <p>{e(c['description'])}</p>
      <div class="meta">{uses}</div>
    </div>
  </div>
  {''.join(parts)}
  <h2>AI에게 이렇게 말하세요</h2>
  <p>[product] 자리는 사전의 공통 설정에 적은 제품 이름으로 바뀌어 복사돼요.</p>
  <div class="pbox"><div class="row"><b>간단</b><button class="copybtn" type="button" data-copy="ps">복사</button></div><pre class="prompt" id="ps">{e(c['prompt_simple'])}</pre></div>
  <div class="pbox"><div class="row"><b>자세히</b><button class="copybtn" type="button" data-copy="pd">복사</button></div><pre class="prompt" id="pd">{e(c['prompt_detail'])}</pre></div>
  <div class="actions">
    <a class="btn" href="../#add-{slug}">주문서에 담기</a>
    {yt}
    <a class="btn2" href="../#cat-{cid}">{catko} 전체 보기</a>
  </div>
  <h2>잘 쓰는 요령</h2>
  <ul>{tips}</ul>
  {COUPANG}
  <h2>같이 보면 좋은 카드</h2>
  <ul class="related">{relhtml}</ul>
</main>
<footer><a href="../guide/">가이드</a> · <a href="../privacy.html">소개 · 개인정보처리방침</a></footer>
<script type="application/ld+json">{jsonld}</script>
{CPJS}
</body>
</html>
"""
    page = head(title + " | AI 영상 레퍼런스 보관함", desc, f"/card/{slug}.html") + GCSS + CARD_CSS.replace("%TOKENS%", tokens) + "\n" + defs + "\n" + nav("../") + body
    open(f"{OUT}/card/{slug}.html", "w", encoding="utf-8").write(page)
    card_urls.append(f"/card/{slug}.html")

urls2 = ["/", "/guide/"] + [f"/guide/{g['slug']}.html" for g in guides] + card_urls + ["/privacy.html"]
open(OUT + "/sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"  <url><loc>{BASE}{u}</loc><lastmod>2026-10-14</lastmod></url>\n" for u in urls2) + "</urlset>\n")
print("card pages", len(card_urls))
