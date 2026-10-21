# Executed near the end of build_public.py (shares globals: json, os, re, html, OUT, ROOT, BASE, TODAY, head, GCSS, nav).
# Builds /prompts/video/ — our own code-made video examples with the prompts we wrote for them.
import glob as _gl, shutil as _sh
_V = ROOT + "/myvid"
_D = OUT + "/prompts/video"
_sh.rmtree(OUT + "/prompts/opus-video", ignore_errors=True)
os.makedirs(_D, exist_ok=True)
_MB = open(_V + "/media_base.txt").read().strip().rstrip("/")   # e.g. https://cdn.jsdelivr.net/gh/<owner>/<repo>@<sha>/v
_ORDER = ["m04", "g03", "d01", "m01", "e03", "m05", "d04", "m02", "e05", "g04", "m18", "d08", "e01", "m13", "g02", "m07", "e06", "d02", "m03", "g06",
          "m11", "e02", "d07", "m08", "g01", "m15", "e07", "d03", "m09", "g05", "m12", "e08", "d05", "m14", "g07", "m19", "e09", "d09", "m10", "g08",
          "m16", "e10", "d06", "m17", "e04", "d10", "m06", "e11", "m20", "e12"]
_CAT = {"motion": "모션그래픽", "explainer": "설명 영상", "3d": "3D 장면", "interactive": "게임 느낌"}
_items = []
for i in _ORDER:
    f = f"{_V}/out/{i}.json"
    if not os.path.exists(f) or not os.path.exists(f"{_V}/final/{i}.mp4"): continue
    m = json.load(open(f, encoding="utf-8")); m["id"] = i; _items.append(m)
_E = html.escape
from collections import Counter as _Ct
_cc = _Ct(m["cat"] for m in _items)

def _card(m, n):
    return f'''<li class="vc" data-c="{m["cat"]}" id="v-{m["id"]}">
  <video class="vv" controls playsinline muted loop preload="none" poster="{_MB}/{m["id"]}.jpg" src="{_MB}/{m["id"]}.mp4" aria-label="{_E(m["title"])} 예시 영상"></video>
  <div class="vb">
    <div class="hd"><span class="no">{n:02d}</span><span class="cat">{_CAT[m["cat"]]}</span><span class="tg">{int(m["dur"])}초 · 9:16</span></div>
    <h3>{_E(m["title"])}</h3>
    <p class="ds">{_E(m["desc"])}</p>
    <p class="hw"><b>바꿔 쓰는 법</b>{_E(m["how"])}</p>
    <details><summary>프롬프트 보기</summary><pre class="pp">{_E(m["prompt"])}</pre></details>
    <div class="act"><button class="cp" type="button">프롬프트 복사</button></div>
  </div>
</li>'''

_title = f"코드로 만드는 광고 영상 프롬프트 {len(_items)}개 — 예시 영상과 바로 쓰는 프롬프트"
_desc = f"Claude에게 HTML·Canvas·Three.js 코드로 영상을 만들게 하는 프롬프트 {len(_items)}개. 모션그래픽, 설명 영상, 3D, 게임 느낌 광고까지 예시 영상을 보고 프롬프트를 복사해 내 제품 이름만 바꾸면 돼요."
_up = TODAY + "T09:00:00+09:00"
_ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": _title, "description": _desc, "url": f"{BASE}/prompts/video/", "inLanguage": "ko"},
       {"@context": "https://schema.org", "@type": "ItemList", "name": "코드로 만드는 영상 프롬프트", "itemListElement": [
           {"@type": "ListItem", "position": k + 1, "item": {"@type": "VideoObject", "name": m["title"], "description": m["desc"], "thumbnailUrl": f"{_MB}/{m['id']}.jpg",
            "contentUrl": f"{_MB}/{m['id']}.mp4", "uploadDate": _up, "duration": f"PT{int(m['dur'])}S", "url": f"{BASE}/prompts/video/#v-{m['id']}"}} for k, m in enumerate(_items)]}]
_ldh = "".join('<script type="application/ld+json">' + json.dumps(x, ensure_ascii=False).replace("</", "<\\/") + "</script>\n" for x in _ld)
_css = """<style>
.page h1,.vc h3{word-break:keep-all}
main.wide{max-width:1100px}
.howto{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:18px 0 26px;padding:0;list-style:none}
.howto li{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.6;max-width:none}
.howto b{display:block;font-family:var(--f-display);font-weight:400;font-size:18px;margin-bottom:4px}
.howto code{font-family:var(--f-mono);font-size:12.5px;background:var(--bg);padding:1px 5px;border-radius:5px}
.flt{position:sticky;top:0;z-index:5;background:var(--bg);padding:10px 0;display:grid;gap:8px;border-bottom:1px solid var(--line)}
.flt input{font:inherit;font-size:15px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);width:100%}
.chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.chips button{font:inherit;font-size:13px;padding:5px 11px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer}
.chips button[aria-pressed=true]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.cnt{font-size:13px;color:var(--muted)}
ol.grid{list-style:none;padding:0;margin:16px 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
.vc{background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;max-width:none;min-width:0}
.vc[hidden]{display:none}
.vv{display:block;width:100%;aspect-ratio:9/16;max-height:560px;object-fit:contain;background:#0b0b0f}
.vb{padding:12px 14px 14px;display:flex;flex-direction:column;gap:6px;flex:1}
.hd{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px}
.no{font-family:var(--f-mono);color:var(--muted)}
.cat{font-weight:600;color:var(--rec)}
.tg{font-family:var(--f-mono);font-size:11px;border:1px solid var(--line);border-radius:6px;padding:0 6px;color:var(--muted)}
.vc h3{font-size:17px;line-height:1.4;margin:2px 0 0}
.ds{margin:0;font-size:14px;line-height:1.6}
.hw{margin:0;font-size:13px;line-height:1.6;color:var(--muted);background:var(--bg);border-radius:8px;padding:8px 10px}
.hw b{display:block;color:var(--ink);font-size:12px;margin-bottom:2px}
details summary{cursor:pointer;font-size:13px;color:var(--muted);padding:4px 0}
.pp{font-family:var(--f-mono);font-size:12px;line-height:1.6;background:var(--bg);border-radius:8px;padding:10px 12px;margin:4px 0;white-space:pre-wrap;overflow-wrap:anywhere;max-height:360px;overflow:auto}
.act{margin-top:auto;padding-top:4px}
.act .cp{font:inherit;font-size:14px;padding:8px 14px;border-radius:9px;border:1px solid var(--ink);background:var(--ink);color:var(--bg);cursor:pointer;width:100%}
.note{font-size:13px;color:var(--muted);background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-top:30px;line-height:1.7}
</style>"""
_cards = "".join(_card(m, k + 1) for k, m in enumerate(_items))
_body = f"""
<main class="wide">
  <span class="eyebrow">PROMPTS · 업데이트 {TODAY}</span>
  <h1>코드로 만드는 광고 영상 프롬프트 {len(_items)}개</h1>
  <p class="lede">영상 AI 없이, Claude에게 <b>코드(HTML·Canvas·Three.js)</b>로 영상을 그리게 하는 프롬프트예요. 아래 예시 영상은 모두 이 프롬프트로 직접 만들었어요. 글자와 숫자가 깨지지 않아서 상품 소개, 할인 공지, 설명 영상, 로고 오프닝에 특히 잘 맞아요.</p>
  <ol class="howto">
    <li><b>1. 영상 고르기</b>예시를 재생해 보고 만들고 싶은 느낌을 골라요. 소리는 플레이어에서 켤 수 있어요.</li>
    <li><b>2. 프롬프트 복사</b>Claude에 붙여넣고 <code>[BRAND NAME]</code>처럼 대괄호 부분만 내 것으로 바꿔요.</li>
    <li><b>3. mp4로 뽑기</b>나온 HTML을 열어 화면 녹화하거나, Claude에게 "render(t)로 초당 30장 캡처해서 mp4로 합쳐 줘"라고 하면 돼요.</li>
  </ol>
  <div class="flt">
    <input id="q" type="search" placeholder="검색: 할인, 로고, 3D, 차트, 카페, 게임 …" aria-label="프롬프트 검색">
    <div class="chips" id="cats"><button type="button" data-c="" aria-pressed="true">전체 {len(_items)}</button>{''.join(f'<button type="button" data-c="{k}" aria-pressed="false">{v} {_cc.get(k,0)}</button>' for k,v in _CAT.items())}<span class="cnt" id="cnt"></span></div>
  </div>
  <ol class="grid" id="grid">{_cards}</ol>
  <div class="cta"><b>실사 영상 AI용 프롬프트가 필요하다면</b><span>카메라 무빙·조명·스타일 카드를 고르면 클링·Veo·H3용 프롬프트가 자동으로 완성돼요.</span><a class="btn" href="../../#dict">레퍼런스 사전 열기</a></div>
  <p class="note">예시 영상 속 브랜드와 상품, 숫자는 모두 지어낸 예시예요. 실제로 쓸 때는 우리 상품 정보와 실제 수치로 바꿔 주세요. 영상 속 배경음과 효과음은 예시용이에요. 효과음은 CC0 음원(Kenney, freesound 1bob)을 썼어요.</p>
</main>"""
_js = """<script>
(function(){
  var cat="", q="", grid=document.getElementById("grid"), cnt=document.getElementById("cnt"), cards=[].slice.call(grid.children);
  function apply(){ var ql=q.toLowerCase(), n=0; cards.forEach(function(li){ var ok=(!cat||li.dataset.c===cat)&&(!ql||li.textContent.toLowerCase().indexOf(ql)>=0); li.hidden=!ok; if(ok)n++; }); cnt.textContent=n+"개"; }
  document.getElementById("cats").addEventListener("click",function(e){var b=e.target.closest("button"); if(!b) return; cat=b.dataset.c; this.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));}); apply();});
  var tmr; document.getElementById("q").addEventListener("input",function(){var v=this.value; clearTimeout(tmr); tmr=setTimeout(function(){q=v.trim(); apply();},150);});
  grid.addEventListener("click",function(e){ if(!e.target.classList.contains("cp")) return; var li=e.target.closest(".vc"), pre=li.querySelector(".pp"), t=pre.textContent;
    (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){e.target.textContent="복사했어요 · Claude에 붙여넣기";setTimeout(function(){e.target.textContent="프롬프트 복사";},1800);},function(){li.querySelector("details").open=true;var s=document.createRange();s.selectNodeContents(pre);var sel=getSelection();sel.removeAllRanges();sel.addRange(s);}); });
  if("IntersectionObserver" in window){ var io=new IntersectionObserver(function(es){ es.forEach(function(en){ var v=en.target; if(en.isIntersecting&&en.intersectionRatio>.6){ if(v.paused&&!v.dataset.user){ var p=v.play(); if(p&&p.catch)p.catch(function(){}); } } else if(!v.paused&&v.muted){ v.pause(); } }); },{threshold:[0,.6,1]});
    grid.querySelectorAll("video").forEach(function(v){ io.observe(v); v.addEventListener("volumechange",function(){ if(!v.muted) v.dataset.user="1"; }); }); }
  apply();
})();
</script>"""
_page = head(_title + " | AI 영상 레퍼런스 보관함", _desc, "/prompts/video/").replace("</head>", _ldh + "</head>", 1) + GCSS + _css + nav("../../") + _body + \
    '\n<footer><a href="../../guide/">가이드</a> · <a href="../../privacy.html">소개 · 개인정보처리방침</a></footer>\n' + _js + "\n</body>\n</html>\n"
open(_D + "/index.html", "w", encoding="utf-8").write(_page)
_sm = open(OUT + "/sitemap.xml", encoding="utf-8").read()
_sm = re.sub(r"\s*<url><loc>[^<]*/prompts/opus-video/</loc>.*?</url>", "", _sm, flags=re.S)
if "/prompts/video/" not in _sm:
    _sm = _sm.replace("</urlset>", f"  <url><loc>{BASE}/prompts/video/</loc><lastmod>{TODAY}</lastmod></url>\n</urlset>")
open(OUT + "/sitemap.xml", "w", encoding="utf-8").write(_sm)
print("own video prompt page", len(_items))

_hp = OUT + "/index.html"; _h = open(_hp, encoding="utf-8").read()
if 'prompts/video/' not in _h:
    _h = _h.replace('<a class="btn" href="guide/">가이드 글</a>', f'<a class="btn" href="guide/">가이드 글</a>\n      <a class="btn" href="prompts/video/">영상 프롬프트 {len(_items)}</a>', 1)
    _h = _h.replace('<span><a href="guide/">가이드 글</a> · ', '<span><a href="guide/">가이드 글</a> · <a href="prompts/video/">영상 프롬프트</a> · ', 1)
    open(_hp, "w", encoding="utf-8").write(_h)
_rp = OUT + "/radar/index.html"; _r = open(_rp, encoding="utf-8").read()
if 'prompts/video/' not in _r:
    _r = _r.replace('<a href="../guide/">가이드</a></nav>', '<a href="../guide/">가이드</a><a href="../prompts/video/">영상 프롬프트</a></nav>', 1)
    open(_rp, "w", encoding="utf-8").write(_r)
