# Executed at the end of build_public.py (shares globals: json, os, re, html, OUT, ROOT, BASE, TODAY, head, GCSS, nav, ADJS).
# Builds /prompts/opus-video/ — a Korean gallery of prompts from yihui-dev/awesome-opus5-5-videos (MIT).
import shutil as _sh
_G = ROOT + "/opusgal"
_D = OUT + "/prompts/opus-video"
os.makedirs(_D, exist_ok=True)
_vids = json.load(open(_G + "/videos.json", encoding="utf-8"))
_lab = dict(l.rstrip("\n").split("\t", 1) for l in open(_G + "/labels.tsv", encoding="utf-8") if "\t" in l)
_order = [l.split("\t", 1)[0] for l in open(_G + "/labels.tsv", encoding="utf-8") if "\t" in l]
_CAT = {"motion": "모션그래픽", "explainer": "설명 영상", "3d": "3D 장면", "interactive": "게임·인터랙티브"}
_TECH = {"canvas": "Canvas", "svg": "SVG", "threejs": "Three.js", "shader": "셰이더", "gsap": "GSAP", "css": "CSS", "audio": "사운드", "playable": "플레이 가능",
         "particles": "파티클", "pixel": "픽셀아트", "webgl": "WebGL", "physics": "물리", "ai-image": "AI 이미지"}
_rows = []
for v in _vids:
    _rows.append({"s": v["slug"], "a": v["author"], "u": v["post_url"], "c": v["category"], "t": v.get("tech_tags", []), "p": v["prompt"],
                  "pp": bool(v.get("prompt_partial")), "r": v.get("skillry_url") if v.get("has_remake") else "", "k": _lab.get(v["slug"], ""), "d": v.get("added", "")})
_hl = {s: i for i, s in enumerate(_order)}
_rows.sort(key=lambda r: (0, _hl[r["s"]]) if r["s"] in _hl else (1, r["d"] and -int(r["d"].replace("-", "")) or 0))
json.dump(_rows, open(_D + "/data.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
_sh.copy(_G + "/LICENSE.txt", _D + "/LICENSE.txt")
_E = html.escape
from collections import Counter as _Ct
_cc = _Ct(r["c"] for r in _rows)

def _card(r, i):
    title = r["k"] or (r["p"][:70].replace("\n", " ") + ("…" if len(r["p"]) > 70 else ""))
    tech = "".join(f'<span class="tg">{_E(_TECH.get(t, t))}</span>' for t in r["t"])
    part = '<span class="tg warn">프롬프트 일부만 공개</span>' if r["pp"] else ""
    rem = f'<a class="lnk" href="{_E(r["r"])}" target="_blank" rel="noopener nofollow">다시 만든 영상 ↗</a>' if r["r"] else ""
    return f'''<li class="pc" data-c="{r["c"]}" id="p-{_E(r["s"])}">
  <div class="hd"><span class="no">{i+1:03d}</span><span class="cat">{_CAT.get(r["c"], r["c"])}</span>{tech}{part}</div>
  <h3>{_E(title)}</h3>
  <p class="by">원작자 <a href="https://x.com/{_E(r["a"])}" target="_blank" rel="noopener nofollow">@{_E(r["a"])}</a></p>
  <pre class="pp">{_E(r["p"])}</pre>
  <div class="act"><button class="cp" type="button">프롬프트 복사</button><button class="more" type="button">펼치기</button><button class="emb" type="button" data-u="{_E(r["u"])}">여기서 영상 보기</button><a class="lnk" href="{_E(r["u"])}" target="_blank" rel="noopener nofollow">원본 게시물 ↗</a>{rem}</div>
  <div class="ev"></div>
</li>'''

_static = "".join(_card(r, i) for i, r in enumerate(_rows[:100]))
_title = "Claude로 만든 영상 프롬프트 703개 — 모션그래픽·설명 영상·3D·게임"
_desc = "Claude Opus 5.5에게 코드로 영상을 만들게 해서 화제가 된 영상 703편의 실제 프롬프트 모음. 원본 영상 보기, 프롬프트 복사, 한국어 제목과 분류(모션그래픽·설명 영상·3D·게임)까지."
_ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": _title, "description": _desc, "url": f"{BASE}/prompts/opus-video/", "inLanguage": "ko",
        "isBasedOn": "https://github.com/yihui-dev/awesome-opus5-5-videos", "license": "https://opensource.org/licenses/MIT"},
       {"@context": "https://schema.org", "@type": "ItemList", "name": "추천 프롬프트 100", "itemListElement": [
           {"@type": "ListItem", "position": i + 1, "name": r["k"] or r["p"][:60], "url": f"{BASE}/prompts/opus-video/#p-{r['s']}"} for i, r in enumerate(_rows[:100])]}]
_ldh = "".join('<script type="application/ld+json">' + json.dumps(x, ensure_ascii=False).replace("</", "<\\/") + "</script>\n" for x in _ld)
_css = """<style>
main.wide{max-width:1040px}
.howto{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:18px 0 26px;padding:0;list-style:none}
.howto li{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.6;max-width:none}
.howto b{display:block;font-family:var(--f-display);font-weight:400;font-size:18px;margin-bottom:4px}
.flt{position:sticky;top:0;z-index:5;background:var(--bg);padding:10px 0;display:grid;gap:8px;border-bottom:1px solid var(--line)}
.flt input{font:inherit;font-size:15px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);width:100%}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chips button{font:inherit;font-size:13px;padding:5px 11px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer}
.chips button[aria-pressed=true]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.cnt{font-size:13px;color:var(--muted)}
ol.grid{list-style:none;padding:0;margin:16px 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}
.pc{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:6px;max-width:none;min-width:0}
.hd{display:flex;flex-wrap:wrap;gap:5px;align-items:center;font-size:12px}
.no{font-family:var(--f-mono);color:var(--muted)}
.cat{font-weight:600;color:var(--rec)}
.tg{font-family:var(--f-mono);font-size:11px;border:1px solid var(--line);border-radius:6px;padding:0 6px;color:var(--muted)}
.tg.warn{color:var(--rec);border-color:var(--rec)}
.pc h3{font-size:16px;line-height:1.45;margin:2px 0 0}
.by{margin:0;font-size:13px;color:var(--muted)}
.pp{font-family:var(--f-mono);font-size:12.5px;line-height:1.6;background:var(--bg);border-radius:8px;padding:10px 12px;margin:4px 0;white-space:pre-wrap;overflow-wrap:anywhere;max-height:9.6em;overflow:hidden;position:relative}
.pc.open .pp{max-height:none}
.act{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:auto}
.act button{font:inherit;font-size:13px;padding:6px 11px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer}
.act .cp{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.lnk{font-size:13px;color:var(--muted)}
.ev:empty{display:none}.ev{margin-top:6px}
.moreall{display:block;margin:10px auto 0;font:inherit;padding:10px 18px;border-radius:10px;border:1px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer}
.credit{font-size:13px;color:var(--muted);background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-top:30px}
</style>"""
_body = f"""
<main class="wide">
  <span class="eyebrow">PROMPTS · 업데이트 {TODAY}</span>
  <h1>Claude로 만든 영상 프롬프트 {len(_rows)}개</h1>
  <p class="lede">Claude Opus 5.5에게 영상을 <b>코드(HTML·Canvas·SVG·Three.js)로</b> 만들게 해서 화제가 된 영상들의 실제 프롬프트예요. 영상을 보고, 프롬프트를 복사해서, 내 제품 이름만 바꿔 바로 따라 해 보세요. 실사 영상 AI 없이 글자·숫자가 깨지지 않는 모션그래픽, 설명 영상, 3D 장면, 미니 게임까지 만들 수 있어요.</p>
  <ol class="howto">
    <li><b>1. 영상 고르기</b>'여기서 영상 보기'로 원작자가 올린 영상을 바로 확인해요.</li>
    <li><b>2. 프롬프트 복사</b>Claude(또는 Claude Code)에 붙여넣고 [your product] 같은 부분만 내 것으로 바꿔요.</li>
    <li><b>3. 영상으로 뽑기</b>나온 HTML을 브라우저에서 화면 녹화하거나, Playwright로 프레임을 찍어 ffmpeg로 mp4로 합쳐요.</li>
  </ol>
  <div class="flt">
    <input id="q" type="search" placeholder="검색: 제품 출시, recipe, 3D, 게임, 9:16 …" aria-label="프롬프트 검색">
    <div class="chips" id="cats"><button type="button" data-c="" aria-pressed="true">전체 {len(_rows)}</button>{''.join(f'<button type="button" data-c="{k}" aria-pressed="false">{v} {_cc.get(k,0)}</button>' for k,v in _CAT.items())}</div>
    <div class="chips"><button type="button" id="hlOnly" aria-pressed="true">추천 100만</button><span class="cnt" id="cnt">추천 100개 표시 중</span></div>
  </div>
  <ol class="grid" id="grid">{_static}</ol>
  <button class="moreall" id="loadAll" type="button">나머지 {len(_rows)-100}개도 보기</button>
  <div class="cta"><b>내 제품으로 바로 만들어 보기</b><span>카메라 무빙·조명·스타일 카드를 고르면 실사 영상 AI(클링·Veo·H3)용 프롬프트가 자동으로 완성돼요.</span><a class="btn" href="../../#dict">레퍼런스 사전 열기</a></div>
  <p class="credit">이 목록의 데이터는 깃허브 <a href="https://github.com/yihui-dev/awesome-opus5-5-videos" target="_blank" rel="noopener">yihui-dev/awesome-opus5-5-videos</a>(MIT 라이선스, Copyright (c) 2026 yihui-dev)를 바탕으로 한국어 제목과 분류를 붙여 정리했어요. 각 프롬프트와 영상의 권리는 원작자에게 있고, 카드마다 원본 게시물을 연결했어요. 영상은 원작자의 X 게시물을 그대로 불러와 보여 줘요. <a href="LICENSE.txt">라이선스 전문</a></p>
</main>"""
_js = """<script>
(function(){
  var CAT=%s, TECH=%s, rows=null, cat="", hl=true, q="";
  var grid=document.getElementById("grid"), cnt=document.getElementById("cnt");
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function card(r,i){var t=r.k||(r.p.slice(0,70).replace(/\\n/g," ")+(r.p.length>70?"…":""));
    return '<li class="pc" data-c="'+r.c+'" id="p-'+esc(r.s)+'"><div class="hd"><span class="no">'+String(i+1).padStart(3,"0")+'</span><span class="cat">'+(CAT[r.c]||r.c)+'</span>'+r.t.map(function(x){return '<span class="tg">'+esc(TECH[x]||x)+'</span>';}).join("")+(r.pp?'<span class="tg warn">프롬프트 일부만 공개</span>':'')+'</div><h3>'+esc(t)+'</h3><p class="by">원작자 <a href="https://x.com/'+esc(r.a)+'" target="_blank" rel="noopener nofollow">@'+esc(r.a)+'</a></p><pre class="pp">'+esc(r.p)+'</pre><div class="act"><button class="cp" type="button">프롬프트 복사</button><button class="more" type="button">펼치기</button><button class="emb" type="button" data-u="'+esc(r.u)+'">여기서 영상 보기</button><a class="lnk" href="'+esc(r.u)+'" target="_blank" rel="noopener nofollow">원본 게시물 ↗</a>'+(r.r?'<a class="lnk" href="'+esc(r.r)+'" target="_blank" rel="noopener nofollow">다시 만든 영상 ↗</a>':'')+'</div><div class="ev"></div></li>';}
  function render(){ if(!rows) return; var ql=q.toLowerCase(), out=[], n=0;
    rows.forEach(function(r,i){ if(hl && !r.k) return; if(cat && r.c!==cat) return; if(ql && (r.p+" "+r.k+" "+r.a+" "+r.t.join(" ")).toLowerCase().indexOf(ql)<0) return; n++; if(n<=400) out.push(card(r,i)); });
    grid.innerHTML=out.join(""); cnt.textContent=(hl?"추천 ":"")+n+"개"+(n>400?" 중 400개 표시 (검색으로 좁혀 보세요)":" 표시 중");
    document.getElementById("loadAll").hidden=!hl; }
  function load(cb){ if(rows) return cb(); fetch("data.json").then(function(r){return r.json();}).then(function(d){rows=d; cb();}); }
  document.getElementById("cats").addEventListener("click",function(e){var b=e.target.closest("button"); if(!b) return; cat=b.dataset.c; this.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));}); load(render);});
  document.getElementById("hlOnly").addEventListener("click",function(){hl=!hl; this.setAttribute("aria-pressed",String(hl)); load(render);});
  document.getElementById("loadAll").addEventListener("click",function(){hl=false; document.getElementById("hlOnly").setAttribute("aria-pressed","false"); load(render);});
  var tmr; document.getElementById("q").addEventListener("input",function(){var v=this.value; clearTimeout(tmr); tmr=setTimeout(function(){q=v.trim(); if(q) {hl=false; document.getElementById("hlOnly").setAttribute("aria-pressed","false");} load(render);},200);});
  var wjs=false;
  grid.addEventListener("click",function(e){ var li=e.target.closest(".pc"); if(!li) return;
    if(e.target.classList.contains("cp")){ var t=li.querySelector(".pp").textContent; (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){e.target.textContent="복사했어요";setTimeout(function(){e.target.textContent="프롬프트 복사";},1500);},function(){var s=document.createRange();s.selectNodeContents(li.querySelector(".pp"));var sel=getSelection();sel.removeAllRanges();sel.addRange(s);}); }
    if(e.target.classList.contains("more")){ li.classList.toggle("open"); e.target.textContent=li.classList.contains("open")?"접기":"펼치기"; }
    if(e.target.classList.contains("emb")){ var ev=li.querySelector(".ev"); if(ev.innerHTML){ev.innerHTML="";e.target.textContent="여기서 영상 보기";return;}
      ev.innerHTML='<blockquote class="twitter-tweet" data-dnt="true" data-conversation="none"><a href="'+e.target.dataset.u.replace("x.com","twitter.com")+'">원본 게시물</a></blockquote>'; e.target.textContent="영상 닫기";
      if(!wjs){wjs=true; var s=document.createElement("script"); s.src="https://platform.twitter.com/widgets.js"; s.async=true; document.body.appendChild(s);} else if(window.twttr&&twttr.widgets) twttr.widgets.load(ev); }
  });
  if(location.hash && location.hash.indexOf("#p-")===0 && !document.getElementById(location.hash.slice(1))){ hl=false; load(function(){render(); var el=document.getElementById(location.hash.slice(1)); if(el) el.scrollIntoView();}); }
})();
</script>""" % (json.dumps(_CAT, ensure_ascii=False), json.dumps(_TECH, ensure_ascii=False))
_page = head(_title + " | AI 영상 레퍼런스 보관함", _desc, "/prompts/opus-video/").replace("</head>", _ldh + "</head>", 1) + GCSS + _css + nav("../../") + _body + \
    '\n<footer><a href="../../guide/">가이드</a> · <a href="../../privacy.html">소개 · 개인정보처리방침</a></footer>\n' + _js + "\n</body>\n</html>\n"
open(_D + "/index.html", "w", encoding="utf-8").write(_page)
_sm = open(OUT + "/sitemap.xml", encoding="utf-8").read()
if "/prompts/opus-video/" not in _sm:
    _sm = _sm.replace("</urlset>", f"  <url><loc>{BASE}/prompts/opus-video/</loc><lastmod>{TODAY}</lastmod></url>\n</urlset>")
    open(OUT + "/sitemap.xml", "w", encoding="utf-8").write(_sm)
print("opus prompt gallery", len(_rows))
