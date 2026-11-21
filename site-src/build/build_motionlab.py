# /prompts/code-motion/ — aimotion(kstost/cokacmotion, MIT) 기법 166편: 목록 + 기법별 상세 페이지. build_public.py 끝에서 exec.
import markdown as _mdlib
_AM = json.load(open(ROOT + "/aimotion/index.json", encoding="utf-8"))
exec(open(ROOT + "/aimotion/uses.py", encoding="utf-8").read())  # USE_LABEL, USE_GUIDE, U, PICKS
_AMV = "https://cdn.jsdelivr.net/gh/rlaehddnr3352-ctrl/ai-video-reference@168bb71c3128afc473109721704b5380b388c27f/v/am/"
_AMDEMO = "https://kstost.github.io/cokacmotion/"
_AMGH = "https://github.com/kstost/cokacmotion/blob/main/skills/aimotion/demos/"
_AM_G = {"99-knockout-zoom": "G01", "122-app-promo": "G02", "139-text-behind": "G03", "93-transition-kit": "G04", "153-particle-dissolve": "G05",
         "96-kinetic-camera": "G06", "67-gsap-splittext": "G07", "98-split-flap": "G08", "90-measure-hud": "G09", "68-gsap-morphsvg": "G10",
         "125-route-map": "G11", "23-vhs": "G12", "121-mesh-gradient": "G13", "17-hangul-particles": "G14", "32-dataviz-motion": "G15",
         "101-marker-annotate": "G16", "128-scale-zoom": "M53", "97-karaoke-captions": "C03", "137-pen-write-on": "C07", "127-before-after": "T17"}
_amg = [g["name"] for g in _AM["groups"]]
_amd = {g["name"]: g["description"] for g in _AM["groups"]}
_amslug = {g: "g%02d" % (i + 1) for i, g in enumerate(_amg)}
_amn = len(_AM["demos"])
_AMX = {x["id"]: x for x in _AM["demos"]}
_CJc = {c["code"]: c for c in json.load(open(OUT + "/cards.json", encoding="utf-8"))["cards"]}
_e = html.escape

def _am_weight(x):
    s = (x["tech"] + " " + " ".join(x["libraries"]) + " " + " ".join(x["cautions"])).lower()
    if "webgpu" in s: return ("heavy", "무거움 · WebGPU 필요")
    if any(k in s for k in ("webgl", "three", "babylon", "셰이더", "gpu", "레이마칭", "gpgpu", "pixi")): return ("heavy", "무거움 · 그래픽 카드 사용")
    if x["libraries"]: return ("mid", "보통 · 라이브러리 사용")
    return ("light", "가벼움 · 브라우저 기능만")
def _am_uses(x): return U[x["id"]][0].split()
def _am_line(x): return U[x["id"]][1]

def _am_prompt(x):
    return (f"aimotion 스킬(kstost/cokacmotion)의 {x['id']} 「{x['title']}」 기법만 참고해서 만들어 줘.\n"
            f"- 기법: {x['tech']}\n- 내 장면: [여기에 내 영상의 장면 · 문구 · 브랜드]\n"
            f"- 데모의 소재 · 장면 · 문구 · 색 · 구도는 쓰지 말고, NOTES.md와 소스를 읽어 원리만 가져와.\n"
            f"- 비율 [9:16], 길이 [6초], 30fps. 모든 움직임은 시각 t 하나로 계산해서 같은 t엔 같은 그림이 나오게 하고, 프레임마다 캡처해 MP4로 렌더링해 줘.\n"
            f"(스킬이 설치돼 있지 않으면 https://github.com/kstost/cokacmotion 저장소를 받아 skills/aimotion/SKILL.md부터 읽어 줘.)")

def _am_sections(i):
    p = ROOT + "/aimotion/notes/" + i + ".md"
    if not os.path.exists(p): return {}
    t = open(p, encoding="utf-8").read()
    t = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", t)
    parts = re.split(r"(?m)^## (.+)$", t); out = {}
    for k in range(1, len(parts), 2): out[parts[k].strip()] = parts[k + 1].strip()
    return out
def _md(s):
    h = _mdlib.markdown(s, extensions=["tables", "sane_lists"])
    h = re.sub(r"<h[1-6]>", "<h4>", h); h = re.sub(r"</h[1-6]>", "</h4>", h)
    return h.replace("<table>", '<div class="tw"><table>').replace("</table>", "</table></div>")

# ---------- shared css ----------
_amcss = """<style>
.cm-stats{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 4px}
.cm-stats span{font-size:13px;border:1px solid var(--line);border-radius:999px;padding:4px 12px;background:var(--surface)}
.cm-stats b{font-family:var(--f-mono);margin-right:4px}
.inst{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px;margin:16px 0 22px}
.inst h2{font-size:17px;margin:0 0 10px}
.code{position:relative;font-family:var(--f-mono);font-size:12.5px;line-height:1.7;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:10px 72px 10px 12px;margin:8px 0;white-space:pre-wrap;overflow-wrap:anywhere}
.code .cbtn{position:absolute;top:8px;right:8px}
.cbtn{font:inherit;font-size:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:8px;padding:3px 10px;cursor:pointer}
.picks{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(132px,1fr);gap:10px;overflow-x:auto;padding:4px 2px 10px;scroll-snap-type:x mandatory}
.picks a{scroll-snap-align:start;text-decoration:none;color:inherit;display:block}
.picks img{width:100%;aspect-ratio:9/16;object-fit:cover;border-radius:10px;border:1px solid var(--line);display:block;background:#111}
.picks b{display:block;font-size:13px;margin-top:6px;line-height:1.35}
.picks small{display:block;font-size:11.5px;color:var(--muted);line-height:1.4}
.flt2{position:sticky;top:0;z-index:5;background:var(--bg);padding:10px 0 8px;border-bottom:1px solid var(--line);margin-bottom:14px}
.flt2 input[type=search]{width:100%;font:inherit;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink)}
.flt2 .row{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;align-items:center}
.flt2 select{font:inherit;font-size:13px;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink)}
.chip{font:inherit;font-size:13px;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:5px 12px;cursor:pointer}
.chip[aria-pressed=true]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.cnt2{font-size:13px;color:var(--muted);margin-left:auto}
.cmgrid{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
.cmc{background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.cmc .ph{display:block;position:relative;aspect-ratio:4/5;background:#111}
.cmc .ph img{width:100%;height:100%;object-fit:cover;object-position:50% 38%;display:block}
.cmc .no{position:absolute;left:8px;top:8px;font-family:var(--f-mono);font-size:11px;background:rgba(0,0,0,.6);color:#fff;border-radius:6px;padding:2px 6px}
.cmc .bd{padding:12px 14px 14px;display:flex;flex-direction:column;gap:6px;flex:1}
.cmc h3{font-size:16px;margin:0;line-height:1.35}
.cmc h3 a{color:inherit;text-decoration:none}
.cmc .ln{margin:0;font-size:13.5px;line-height:1.55}
.cmc .tc{margin:0;font-size:12px;color:var(--muted);line-height:1.5}
.tags{display:flex;flex-wrap:wrap;gap:4px}
.tg2{font-size:11px;border-radius:6px;padding:1px 7px;background:var(--bg);border:1px solid var(--line);color:var(--muted)}
.tg2.u{color:var(--ink)}
.w-light{color:#2f8f5b}.w-mid{color:#b7791f}.w-heavy{color:var(--rec)}
.cmc .ft{display:flex;gap:6px;margin-top:auto;padding-top:6px}
.cmc .ft a,.cmc .ft button{flex:1;text-align:center;font:inherit;font-size:13px;border-radius:9px;padding:8px 6px;cursor:pointer;text-decoration:none}
.cmc .ft a{background:var(--ink);color:var(--bg);border:1px solid var(--ink)}
.cmc .ft button{background:var(--surface);color:var(--ink);border:1px solid var(--line)}
.note2{font-size:13px;color:var(--muted);background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-top:28px;line-height:1.7}
/* detail */
.crumb{font-size:13px;color:var(--muted);margin:0 0 10px}.crumb a{color:inherit}
.cmd{display:grid;grid-template-columns:minmax(260px,380px) 1fr;gap:28px;align-items:start}
.player{position:sticky;top:12px}
.stage{position:relative;aspect-ratio:9/16;background:#000;border-radius:14px;overflow:hidden;border:1px solid var(--line)}
.stage img,.stage iframe{position:absolute;inset:0;width:100%;height:100%;border:0;object-fit:cover}
.stage .go{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:inherit;font-size:15px;font-weight:600;background:rgba(0,0,0,.72);color:#fff;border:1px solid rgba(255,255,255,.4);border-radius:999px;padding:12px 20px;cursor:pointer}
.pl-act{display:flex;gap:8px;margin-top:8px;font-size:13px;flex-wrap:wrap}
.pl-act a,.pl-act button{font:inherit;font-size:13px;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:8px;padding:5px 10px;cursor:pointer;text-decoration:none}
.pl-note{font-size:12px;color:var(--muted);margin:6px 0 0;line-height:1.5}
.cmd h1{font-size:clamp(24px,4vw,34px);margin:4px 0 6px;line-height:1.25}
.cmd .tech{margin:0 0 10px;color:var(--muted);font-size:14.5px}
.oneline{background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--rec);border-radius:10px;padding:12px 14px;margin:14px 0;font-size:15px;line-height:1.6}
.oneline b{display:block;font-size:12px;color:var(--muted);font-weight:600;margin-bottom:2px}
.sec{margin:26px 0 0}
.sec>h2{font-size:20px;margin:0 0 10px;padding-top:6px;border-top:1px solid var(--line)}
.ug{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:0 0 10px}
.ug h3{font-size:15px;margin:0 0 4px}.ug p{margin:0 0 6px;font-size:14px;line-height:1.6}.ug ul{margin:0;padding-left:18px;font-size:13.5px;line-height:1.7}
.steps{list-style:none;counter-reset:s;padding:0;margin:0}
.steps>li{counter-increment:s;position:relative;padding:0 0 18px 40px}
.steps>li::before{content:counter(s);position:absolute;left:0;top:0;width:28px;height:28px;border-radius:50%;background:var(--ink);color:var(--bg);font-family:var(--f-mono);font-size:13px;display:grid;place-items:center}
.steps h3{font-size:15.5px;margin:3px 0 6px}.steps p{margin:0 0 6px;font-size:14px;line-height:1.6}
.pb{display:grid;gap:8px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px}
.pb label{display:grid;gap:3px;font-size:13px;font-weight:600}
.pb input,.pb select{font:inherit;font-weight:400;font-size:14px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);width:100%}
.pb .two{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.fix{display:flex;flex-wrap:wrap;gap:6px}
.fix button{font:inherit;font-size:13px;border:1px dashed var(--line);background:var(--surface);color:var(--ink);border-radius:999px;padding:5px 11px;cursor:pointer}
.notes{font-size:14px;line-height:1.7}
.notes h4{font-size:14.5px;margin:14px 0 4px}
.notes code{font-family:var(--f-mono);font-size:12px;background:var(--bg);border-radius:4px;padding:0 4px}
.notes ul{padding-left:18px}
.tw{overflow-x:auto;margin:8px 0}.tw table{border-collapse:collapse;font-size:13px;min-width:420px}
.tw th,.tw td{border:1px solid var(--line);padding:6px 8px;vertical-align:top;text-align:left}
.tw th{background:var(--surface)}
.sheet{width:100%;height:auto;border-radius:10px;border:1px solid var(--line);margin-top:8px}
details.dev{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:0 0 8px}
details.dev summary{cursor:pointer;font-weight:600;font-size:14.5px}
.rel{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}
.rel a{text-decoration:none;color:inherit;font-size:12.5px;line-height:1.35}
.rel img{width:100%;aspect-ratio:9/16;object-fit:cover;border-radius:8px;border:1px solid var(--line);display:block;margin-bottom:4px;background:#111}
.pn{display:flex;justify-content:space-between;gap:10px;margin-top:22px;font-size:14px}
.toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:var(--ink);color:var(--bg);font-size:13px;border-radius:999px;padding:8px 16px;opacity:0;transition:opacity .2s;pointer-events:none;z-index:20}
.toast.on{opacity:1}
@media (max-width:820px){.cmd{grid-template-columns:1fr}.player{position:static;max-width:340px;margin:0 auto}.pb .two{grid-template-columns:1fr}}
</style>"""
_amcopyjs = """<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script>
(function(){
  var toast=document.getElementById("toast"),tm;
  function say(m){toast.textContent=m;toast.classList.add("on");clearTimeout(tm);tm=setTimeout(function(){toast.classList.remove("on");},1600);}
  window.cmCopy=function(t){ if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){say("복사했어요");},function(){say("복사가 막혀 있어요. 직접 선택해 복사해 주세요");});} else say("복사가 막혀 있어요. 직접 선택해 복사해 주세요"); };
  document.addEventListener("click",function(e){ var b=e.target.closest("[data-copy]"); if(!b) return; var src=b.getAttribute("data-copy"); var el=src.charAt(0)==="#"?document.querySelector(src):null; cmCopy(el?(el.value||el.textContent):src); });
})();
</script>"""

def _am_tags(x, links=False):
    w = _am_weight(x)
    us = "".join(f'<span class="tg2 u">{_e(USE_LABEL[u])}</span>' for u in _am_uses(x))
    return f'<div class="tags">{us}<span class="tg2 w-{w[0]}">{_e(w[1].split(" · ")[0])}</span></div>'

# ---------- list page ----------
def _am_card(x):
    i = x["id"]; u = " ".join(_am_uses(x)); w = _am_weight(x)[0]
    return f'''<li class="cmc" data-u="{u}" data-g="{_amslug[x["group"]]}" data-w="{w}" data-q="{_e((x["title"]+" "+x["tech"]+" "+_am_line(x)+" "+" ".join(x["libraries"])+" "+x["group"]).lower())}">
  <a class="ph" href="{_e(i)}.html"><img loading="lazy" src="{_AMV}{_e(i)}.jpg" alt="{_e(x["title"])} 데모 장면" width="360" height="640"><span class="no">#{x["number"]:03d}</span></a>
  <div class="bd">{_am_tags(x)}
    <h3><a href="{_e(i)}.html">{_e(x["title"])}</a></h3>
    <p class="ln">{_e(_am_line(x))}</p>
    <p class="tc">{_e(x["tech"])}</p>
    <div class="ft"><a href="{_e(i)}.html">자세히 · 만드는 법</a><button type="button" data-copy="{_e(_am_prompt(x))}">프롬프트 복사</button></div>
  </div>
</li>'''
_ucnt = {k: sum(1 for x in _AM["demos"] if k in _am_uses(x)) for k in USE_LABEL}
_picks = "".join(f'<a href="{p}.html"><img loading="lazy" src="{_AMV}{p}.jpg" alt="" width="360" height="640"><b>{_e(_AMX[p]["title"])}</b><small>{_e(_am_line(_AMX[p]))}</small></a>' for p in PICKS)
_INSTALL = "claude plugin marketplace add kstost/cokacmotion\nclaude plugin install aimotion@aimotion"
_ambody = f"""
<main class="wide">
  <span class="eyebrow">CODE MOTION · 업데이트 {TODAY}</span>
  <h1>코드로 만드는 모션 기법 {_amn}편</h1>
  <p class="lede">잉크 번짐, 필름 질감, 말하는 자막, 로고 리빌, 3D 제품 턴테이블까지. 코딩 AI(Claude Code 등)가 <b>웹 기술로 그려 영상으로 뽑을 수 있는 표현</b>을 기법 하나당 데모 하나로 모은 오픈소스 <a href="https://github.com/kstost/cokacmotion" target="_blank" rel="noopener">aimotion</a>을, 광고 · 쇼츠에 쓰기 좋게 용도별로 다시 정리했어요. 기법마다 <b>데모 재생 · 활용 가이드 · 만드는 법 · 초 단위 장면 · 원리</b>를 담은 상세 페이지가 있어요.</p>
  <div class="cm-stats"><span><b>{_amn}</b>기법</span><span><b>{len(USE_LABEL)}</b>용도</span><span><b>{len(_amg)}</b>기술 분류</span><span><b>MIT</b>무료 오픈소스</span></div>
  <section class="inst" aria-labelledby="h-how">
    <h2 id="h-how">3단계로 쓰기</h2>
    <ol class="howto">
      <li><b>1. 스킬 설치 (처음 한 번)</b>터미널에서 아래 두 줄을 실행해요. Claude Code 안에서는 앞에 <code>/plugin</code>을 붙여 같은 명령을 써요.</li>
      <li><b>2. 기법 고르기</b>용도로 거르고, 상세 페이지에서 데모를 재생해 확인해요.</li>
      <li><b>3. 프롬프트로 만들기</b>상세 페이지의 프롬프트 만들기 칸에 내 장면을 적고 복사해 Claude Code에 붙여요.</li>
    </ol>
    <div class="code" id="inst">{_INSTALL}<button type="button" class="cbtn" data-copy="#inst-t">복사</button></div><textarea id="inst-t" hidden>{_INSTALL}</textarea>
    <p class="pl-note">원리부터 알고 싶다면 <a href="../../guide/code-motion-video.html">코드로 AI 모션 영상 만드는 원리와 방법</a>을 먼저 읽어 보세요.</p>
  </section>
  <h2 style="font-size:19px;margin:0 0 6px">광고 · 쇼츠에 바로 쓰기 좋은 {len(PICKS)}가지</h2>
  <div class="picks">{_picks}</div>
  <div class="flt2" role="search">
    <input id="q" type="search" placeholder="검색: 자막, 로고, 잉크, 지도, 3D, 필름 …" aria-label="기법 검색">
    <div class="row" id="uses"><button type="button" class="chip" data-u="" aria-pressed="true">전체 {_amn}</button>{''.join(f'<button type="button" class="chip" data-u="{k}" aria-pressed="false">{_e(v)} {_ucnt[k]}</button>' for k,v in USE_LABEL.items())}</div>
    <div class="row">
      <select id="grp" aria-label="기술 분류"><option value="">기술 분류 전체</option>{''.join(f'<option value="{_amslug[g]}">{_e(g)}</option>' for g in _amg)}</select>
      <select id="wt" aria-label="무게"><option value="">무게 전체</option><option value="light">가벼움 (브라우저 기능만)</option><option value="mid">보통 (라이브러리)</option><option value="heavy">무거움 (그래픽 카드)</option></select>
      <span class="cnt2" id="cnt"></span>
    </div>
  </div>
  <ol class="cmgrid" id="grid">{''.join(_am_card(x) for x in _AM["demos"])}</ol>
  <div class="cta"><b>실사 영상 AI용 프롬프트가 필요하다면</b><span>카메라 무빙 · 조명 · 연기 · 모션그래픽 카드를 고르면 클링 · Veo · 시댄스용 프롬프트가 자동으로 완성돼요.</span><a class="btn" href="../../#dict">레퍼런스 사전 열기</a></div>
  <p class="note2">데모 · 그림 · 구현 노트 출처: <a href="https://github.com/kstost/cokacmotion" target="_blank" rel="noopener">kstost/cokacmotion</a> (aimotion, MIT License, Copyright (c) 2026 kstost). 그림은 원본을 줄여 실었고, 데모 재생은 원작자 페이지를 불러와요. 용도 분류와 활용 가이드 · 만드는 법은 AI 영상 레퍼런스 보관함이 썼어요. 데모 속 장면 · 문구 · 색은 기법을 보여 주기 위한 예시라서, 영상에는 기법(원리)만 가져다 쓰세요.</p>
</main>"""
_amlistjs = """<script>
(function(){
  var g=document.getElementById("grid"),items=[].slice.call(g.children),cnt=document.getElementById("cnt"),u="",q="",grp=document.getElementById("grp"),wt=document.getElementById("wt");
  function apply(){var n=0,ql=q.toLowerCase();items.forEach(function(li){var ok=(!u||(" "+li.dataset.u+" ").indexOf(" "+u+" ")>=0)&&(!grp.value||li.dataset.g===grp.value)&&(!wt.value||li.dataset.w===wt.value)&&(!ql||li.dataset.q.indexOf(ql)>=0);li.hidden=!ok;if(ok)n++;});cnt.textContent=n+"개";}
  document.getElementById("uses").addEventListener("click",function(e){var b=e.target.closest(".chip");if(!b)return;u=b.dataset.u;this.querySelectorAll(".chip").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});apply();});
  grp.addEventListener("change",apply);wt.addEventListener("change",apply);
  var tmr;document.getElementById("q").addEventListener("input",function(){var v=this.value;clearTimeout(tmr);tmr=setTimeout(function(){q=v.trim();apply();},150);});
  var h=location.hash; var m=h.match(/u=([a-z0-9]+)/); if(m){var b=document.querySelector('#uses [data-u="'+m[1]+'"]'); if(b) b.click();}
  m=h.match(/g=(g\\d\\d)/); if(m){grp.value=m[1];}
  apply();
})();
</script>"""
_amD = OUT + "/prompts/code-motion"; os.makedirs(_amD, exist_ok=True)
_amld = '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@type": "ItemList", "name": f"코드로 만드는 모션 기법 {_amn}편",
    "numberOfItems": _amn, "itemListElement": [{"@type": "ListItem", "position": k + 1, "name": x["title"], "url": f"{BASE}/prompts/code-motion/{x['id']}.html"} for k, x in enumerate(_AM["demos"])]}, ensure_ascii=False) + "</script>"
_amdesc = f"잉크 번짐 · 필름 질감 · 말하는 자막 · 로고 리빌 · 3D 턴테이블까지, Claude Code로 코드 모션 영상을 만드는 기법 {_amn}편. 용도별로 찾고, 기법마다 데모 · 활용 가이드 · 만드는 법."
_foot = '\n<footer><a href="../../guide/">가이드</a> · <a href="../video/">영상 프롬프트</a> · <a href="./">코드 모션 기법</a> · <a href="../../privacy.html">소개 · 개인정보처리방침</a></footer>\n'
open(_amD + "/index.html", "w", encoding="utf-8").write(
    head(f"코드로 만드는 모션 기법 {_amn}편 (aimotion) | AI 영상 레퍼런스 보관함", _amdesc, "/prompts/code-motion/").replace("</head>", _amld + "</head>", 1)
    + GCSS + _amcss + nav("../../") + _ambody + _foot + _amcopyjs + _amlistjs + "\n</body>\n</html>\n")

# ---------- detail pages ----------
_FIX = ["전체 속도를 1.5배 느리게 해 줘", "효과 강도를 절반으로 줄여 줘", "글자를 화면 위쪽 1/3 위치로 옮겨 줘", "마지막 1초는 움직임을 멈추고 유지해 줘",
        "배경색을 브랜드 색으로 바꿔 줘", "화면 아래 15%는 자막 자리로 비워 줘", "처음 0.5초 안에 핵심이 보이게 시작을 당겨 줘", "같은 영상을 16:9 가로로도 만들어 줘"]
def _am_detail(k, x):
    i = x["id"]; sec = _am_sections(i); w = _am_weight(x); uses = _am_uses(x)
    g = _AM_G.get(i); gc = _CJc.get(g) if g else None
    libs = "".join(f'<span class="tg2">{_e(l)}</span>' for l in x["libraries"])
    guide = "".join(f'<div class="ug"><h3>{_e(USE_LABEL[u])}로 쓸 때</h3><p>{_e(USE_GUIDE[u][0])}</p><ul>{"".join(f"<li>{_e(t)}</li>" for t in USE_GUIDE[u][1])}</ul></div>' for u in uses)
    card_link = f'<div class="ug"><h3>사전 카드와 함께 쓰기</h3><p><a href="../../card/{g.lower()}.html">{g} {_e(gc["name"])}</a> 카드와 같은 기법이에요. 카드의 예시 영상과 주문서 기능을 같이 써 보세요.</p></div>' if gc else ""
    cauts = "".join(f"<li>{_e(c)}</li>" for c in x["cautions"])
    screen = sec.get("화면", ""); principle = sec.get("기법과 원리") or sec.get("기법과 원리 (refs)", "")
    limits = sec.get("한계와 다음 단계") or sec.get("한계와 조정 손잡이", ""); determ = sec.get("결정성 전략", "")
    sheet = f'<img class="sheet" loading="lazy" src="{_AMV}{i}-sheet.jpg" alt="{_e(x["title"])} 1초 간격 장면" width="822" height="579">' if x.get("sheet") else ""
    rel = [y for y in _AM["demos"] if y["group"] == x["group"] and y["id"] != i][:8]
    relh = "".join(f'<a href="{y["id"]}.html"><img loading="lazy" src="{_AMV}{y["id"]}.jpg" alt="" width="360" height="640">{_e(y["title"])}</a>' for y in rel)
    prv = _AM["demos"][k - 1] if k > 0 else None; nxt = _AM["demos"][k + 1] if k + 1 < _amn else None
    heavy_note = "그래픽 카드를 많이 쓰는 기법이라 미리보기가 버벅일 수 있어요. 해상도를 낮춰 확인하고, MP4 렌더링은 시간이 더 걸려요." if w[0] == "heavy" else "브라우저에서 가볍게 돌아가는 기법이라 미리보기와 렌더링이 빨라요."
    body = f"""
<main class="wide">
  <p class="crumb"><a href="./">코드 모션 기법</a> › <a href="./#g={_amslug[x["group"]]}">{_e(x["group"])}</a> › #{x["number"]:03d}</p>
  <div class="cmd">
    <aside class="player">
      <div class="stage" id="stage"><img src="{_AMV}{_e(i)}.jpg" alt="{_e(x["title"])} 데모의 절정 장면" width="360" height="640"><button type="button" class="go" id="go">▶ 여기서 데모 재생</button></div>
      <div class="pl-act"><a href="{_AMDEMO}{_e(i)}/" target="_blank" rel="noopener">새 창에서 크게 ↗</a><button type="button" id="rp" hidden>처음부터 다시</button><a href="{_AMGH}{_e(i)}/NOTES.md" target="_blank" rel="noopener">원문 노트 ↗</a></div>
      <p class="pl-note">데모는 영상 파일이 아니라 코드가 지금 그리는 화면이에요. {heavy_note} 재생 중 스페이스 · 클릭은 멈춤, ← →는 0.5초 이동이에요.</p>
    </aside>
    <article>
      <span class="eyebrow">#{x["number"]:03d} · {_e(x["group"])}</span>
      <h1>{_e(x["title"])}</h1>
      <p class="tech">{_e(x["tech"])}</p>
      <div class="tags">{"".join(f'<a class="tg2 u" href="./#u={u}">{_e(USE_LABEL[u])}</a>' for u in uses)}<span class="tg2 w-{w[0]}">{_e(w[1])}</span>{libs}</div>
      <div class="oneline"><b>광고 · 쇼츠에서는</b>{_e(_am_line(x))}</div>

      <section class="sec" id="guide"><h2>활용 가이드</h2>{guide}{card_link}
        {f'<div class="ug"><h3>영상에 옮길 때 주의</h3><ul>{cauts}</ul></div>' if cauts else ''}
      </section>

      <section class="sec" id="make"><h2>만드는 법</h2>
        <ol class="steps">
          <li><h3>준비하기</h3><p>Claude Code를 열고 빈 폴더에서 시작해요. aimotion 스킬을 처음 한 번 설치해요.</p>
            <div class="code" id="i1">{_INSTALL}<button type="button" class="cbtn" data-copy="#i1t">복사</button></div><textarea id="i1t" hidden>{_INSTALL}</textarea></li>
          <li><h3>프롬프트 만들기</h3><p>칸을 채우면 아래 프롬프트가 바로 바뀌어요. 데모의 장면이 아니라 <b>내 장면</b>을 적는 게 핵심이에요.</p>
            <div class="pb" id="pb">
              <label>내 장면 (무엇을 보여 줄지)<input id="f-scene" placeholder="예: 동네 빵집 신메뉴 '소금빵' 출시 소식"></label>
              <label>화면에 들어갈 문구<input id="f-text" placeholder="예: 오늘 아침 7시, 소금빵 첫 판"></label>
              <div class="two">
                <label>브랜드 색<input id="f-color" placeholder="예: #F2C14E, 크림색"></label>
                <label>비율<select id="f-ratio"><option>9:16 세로 (1080×1920)</option><option>16:9 가로 (1920×1080)</option><option>1:1 정사각 (1080×1080)</option><option>4:5 피드 (1080×1350)</option></select></label>
                <label>길이<select id="f-len"><option>5초</option><option selected>6초</option><option>8초</option><option>10초</option><option>15초</option></select></label>
              </div>
            </div>
            <div class="code" id="pout"></div>
            <div class="pl-act"><button type="button" data-copy="#pout">프롬프트 복사</button></div></li>
          <li><h3>미리보기 보고 고치기</h3><p>Claude Code가 만든 HTML을 브라우저로 열어 확인하고, 고칠 점을 말로 알려 줘요. 자주 쓰는 수정 문장을 눌러 복사하세요.</p>
            <div class="fix">{"".join(f'<button type="button" data-copy="{_e(f)}">{_e(f)}</button>' for f in _FIX)}</div></li>
          <li><h3>MP4로 뽑기</h3><p>실시간 화면 녹화보다 프레임 단위 렌더링이 끊김 없고 선명해요.</p>
            <div class="code" id="r1">이제 render(t)로 1/30초마다 프레임을 캡처해서 30fps MP4로 렌더링해 줘. 결과 파일 이름은 out.mp4로.<button type="button" class="cbtn" data-copy="#r1t">복사</button></div><textarea id="r1t" hidden>이제 render(t)로 1/30초마다 프레임을 캡처해서 30fps MP4로 렌더링해 줘. 결과 파일 이름은 out.mp4로.</textarea></li>
          <li><h3>내 영상에 합치기</h3><p>제목 · 자막 · 전환처럼 실사 위에 얹을 효과라면 배경을 투명하게 뽑아 편집 프로그램(캡컷 · 프리미어)의 위 트랙에 올려요. 이미 찍은 영상이 있으면 파일을 주고 "이 영상 위에 효과를 입혀 줘"라고 해도 돼요.</p>
            <div class="code" id="r2">배경을 투명하게 해서 알파 채널이 있는 영상(ProRes 4444 .mov 또는 WebM)으로도 뽑아 줘.<button type="button" class="cbtn" data-copy="#r2t">복사</button></div><textarea id="r2t" hidden>배경을 투명하게 해서 알파 채널이 있는 영상(ProRes 4444 .mov 또는 WebM)으로도 뽑아 줘.</textarea></li>
        </ol>
      </section>

      <section class="sec" id="timeline"><h2>초 단위로 보기</h2>
        <p class="pl-note">데모가 몇 초에 무엇을 보여 주는지예요. 장면을 따라 하려는 게 아니라, 기법이 어떤 순서와 리듬으로 쓰였는지 보는 용도예요.</p>
        {sheet}
        <div class="notes">{_md(screen) if screen else ''}</div>
      </section>

      <section class="sec" id="how"><h2>원리</h2>
        <p class="pl-note">개발자용 구현 설명이에요(원작자 노트, MIT). 몰라도 만들 수 있지만, Claude에게 "이 원리 중 ○○만 써 줘"처럼 지시할 때 도움이 돼요.</p>
        {f'<details class="dev" open><summary>기법과 원리</summary><div class="notes">{_md(principle)}</div></details>' if principle else ''}
        {f'<details class="dev"><summary>프레임마다 같은 그림이 나오게 하는 법 (결정성)</summary><div class="notes">{_md(determ)}</div></details>' if determ else ''}
        {f'<details class="dev"><summary>한계와 조절할 점</summary><div class="notes">{_md(limits)}</div></details>' if limits else ''}
      </section>

      <section class="sec"><h2>같은 분류의 다른 기법</h2><div class="rel">{relh}</div></section>
      <nav class="pn" aria-label="이전 · 다음 기법">{f'<a href="{prv["id"]}.html">← {_e(prv["title"])}</a>' if prv else '<span></span>'}{f'<a href="{nxt["id"]}.html">{_e(nxt["title"])} →</a>' if nxt else ''}</nav>
      <p class="note2">데모 · 그림 · 원리 · 초 단위 설명 출처: <a href="https://github.com/kstost/cokacmotion/tree/main/skills/aimotion/demos/{_e(i)}" target="_blank" rel="noopener">kstost/cokacmotion · {_e(i)}</a> (MIT License, Copyright (c) 2026 kstost). 활용 가이드와 만드는 법은 AI 영상 레퍼런스 보관함이 썼어요.</p>
    </article>
  </div>
</main>"""
    js = f"""<script>
(function(){{
  var DEMO={json.dumps(_AMDEMO + i + "/")}, ID={json.dumps(i)}, TITLE={json.dumps(x["title"])}, TECH={json.dumps(x["tech"])};
  var st=document.getElementById("stage"), go=document.getElementById("go"), rp=document.getElementById("rp");
  function load(){{ st.innerHTML='<iframe src="'+DEMO+'" title="'+TITLE+' 데모" allow="autoplay" loading="eager"></iframe>'; rp.hidden=false; }}
  go.addEventListener("click",load); rp.addEventListener("click",load);
  var f=function(id){{return document.getElementById(id);}};
  function build(){{
    var scene=f("f-scene").value.trim()||"[내 영상의 장면]", text=f("f-text").value.trim(), col=f("f-color").value.trim(), ratio=f("f-ratio").value, len=f("f-len").value;
    f("pout").textContent="aimotion 스킬(kstost/cokacmotion)의 "+ID+" 「"+TITLE+"」 기법만 참고해서 만들어 줘.\\n"+
      "- 기법: "+TECH+"\\n- 내 장면: "+scene+"\\n"+(text?"- 화면 문구: "+text+"\\n":"")+(col?"- 색: "+col+" 중심으로, 나머지 색은 여기에 맞춰\\n":"")+
      "- 비율 "+ratio+", 길이 "+len+", 30fps\\n"+
      "- 데모의 소재 · 장면 · 문구 · 색 · 구도는 쓰지 말고, NOTES.md와 소스를 읽어 원리만 가져와.\\n"+
      "- 모든 움직임은 시각 t 하나로 계산해서 같은 t엔 같은 그림이 나오게 해. 먼저 HTML로 미리보기를 만들고, 내가 확인하면 프레임마다 캡처해 MP4로 렌더링해 줘.\\n"+
      "(스킬이 설치돼 있지 않으면 https://github.com/kstost/cokacmotion 저장소를 받아 skills/aimotion/SKILL.md부터 읽어 줘.)";
  }}
  ["f-scene","f-text","f-color","f-ratio","f-len"].forEach(function(id){{f(id).addEventListener("input",build);f(id).addEventListener("change",build);}});
  build();
}})();
</script>"""
    ld = '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "코드 모션 기법", "item": f"{BASE}/prompts/code-motion/"},
        {"@type": "ListItem", "position": 2, "name": x["title"], "item": f"{BASE}/prompts/code-motion/{i}.html"}]}, ensure_ascii=False) + "</script>"
    desc = f"{x['title']} — {_am_line(x)}. {x['tech']}. 데모 재생, 활용 가이드, Claude Code로 만드는 법과 프롬프트."
    page = (head(f"{x['title']} · 코드 모션 기법 #{x['number']:03d} | AI 영상 레퍼런스 보관함", desc, f"/prompts/code-motion/{i}.html").replace("</head>", ld + "</head>", 1)
            + GCSS + _amcss + nav("../../") + body + _foot + _amcopyjs + js + "\n</body>\n</html>\n")
    open(f"{_amD}/{i}.html", "w", encoding="utf-8").write(page)
for _k, _x in enumerate(_AM["demos"]): _am_detail(_k, _x)

# ---------- sitemap · home · links ----------
_sm = open(OUT + "/sitemap.xml", encoding="utf-8").read()
if "/prompts/code-motion/" not in _sm:
    _sm = _sm.replace("</urlset>", f"  <url><loc>{BASE}/prompts/code-motion/</loc><lastmod>{TODAY}</lastmod></url>\n</urlset>")
if "/prompts/code-motion/01-svg-ink.html" not in _sm:
    _sm = _sm.replace("</urlset>", "".join(f"  <url><loc>{BASE}/prompts/code-motion/{x['id']}.html</loc><lastmod>{TODAY}</lastmod></url>\n" for x in _AM["demos"]) + "</urlset>")
open(OUT + "/sitemap.xml", "w", encoding="utf-8").write(_sm)
_hp = OUT + "/index.html"; _h = open(_hp, encoding="utf-8").read()
if "prompts/code-motion/" not in _h:
    _h = _h.replace(f'<a class="btn" href="prompts/video/">영상 프롬프트 {len(_items)}</a>', f'<a class="btn" href="prompts/video/">영상 프롬프트 {len(_items)}</a>\n      <a class="btn" href="prompts/code-motion/">코드 모션 기법 {_amn}</a>', 1)
    _h = _h.replace('<a href="prompts/video/">영상 프롬프트</a> · ', '<a href="prompts/video/">영상 프롬프트</a> · <a href="prompts/code-motion/">코드 모션 기법</a> · ', 1)
    open(_hp, "w", encoding="utf-8").write(_h)
_vp = OUT + "/prompts/video/index.html"; _v = open(_vp, encoding="utf-8").read()
if "code-motion/" not in _v:
    _v = _v.replace('<div class="cta"><b>실사 영상 AI용', f'<div class="cta"><b>더 다양한 표현 기법이 필요하다면</b><span>잉크 · 필름 · 3D · 자막 연출까지, 코드로 만드는 모션 기법 {_amn}편을 데모와 만드는 법으로 볼 수 있어요.</span><a class="btn" href="../code-motion/">코드 모션 기법 보기</a></div>\n  <div class="cta"><b>실사 영상 AI용', 1)
    open(_vp, "w", encoding="utf-8").write(_v)
_lp = OUT + "/llms.txt"
if os.path.exists(_lp):
    _l = open(_lp, encoding="utf-8").read()
    if "code-motion" not in _l:
        _l += (f"\n## 코드 모션 기법 {_amn}편\n- {BASE}/prompts/code-motion/ — aimotion(kstost/cokacmotion, MIT) 데모 목록. 용도 9개(제목·로고, 자막·카피, 장면 전환, 제품·앱 소개, 정보·데이터, 배경·분위기, 질감·필터, 캐릭터·연기, 3D·공간) · 기술 분류 12개 · 무게(가벼움/보통/무거움)로 찾기.\n"
               f"- 기법마다 상세 페이지 {BASE}/prompts/code-motion/<id>.html: 데모 재생, 광고·쇼츠 활용 한 줄, 용도별 활용 가이드, 만드는 법 5단계와 프롬프트 만들기, 초 단위 장면 설명, 구현 원리.\n"
               "- 설치: claude plugin marketplace add kstost/cokacmotion → claude plugin install aimotion@aimotion\n")
        open(_lp, "w", encoding="utf-8").write(_l)
print("code motion page", _amn, "+ detail pages")
