"""주간 '터진 쇼츠 TOP 10' 정적 페이지 생성기.

radar/archive/YYYY-MM-DD.json(매일 아침 갱신 데이터)를 월~일 한 주 단위로 묶어
검색엔진이 읽을 수 있는 정적 HTML을 만듭니다.

  python3 radar/weekly.py            # 끝난 주 중 아직 페이지가 없는 주 + 목록 페이지 생성 (기존 파일은 안 건드림)
  python3 radar/weekly.py --full     # 위 + sitemap.xml에 주간 페이지 주소 추가 (배포할 때)
  python3 radar/weekly.py --force    # 이미 있는 주간 페이지도 다시 생성

사이트 루트(이 파일의 두 단계 위)에 radar/week/<월요일 날짜>.html, radar/week/index.html 을 씁니다.
"""
import json, glob, os, re, sys, html, datetime, statistics

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARCH = os.path.join(ROOT, "radar", "archive")
OUTD = os.path.join(ROOT, "radar", "week")
BASE = "https://ai-video-reference-kr.netlify.app"
KST = datetime.timezone(datetime.timedelta(hours=9))
TODAY = datetime.datetime.now(KST).date()
FULL, FORCE = "--full" in sys.argv, "--force" in sys.argv
E = lambda s: html.escape(str(s if s is not None else ""))

TPL = {"shorts": "T01", "ad15": "T02", "drama": "T03", "marketing": "T04", "testimonial": "T07", "case": "T08",
       "explainer": "T09", "youtube": "T10", "demo": "T11", "tutorial": "T12"}
LIGHT = {"1": "L01", "2": "L02", "4": "L03", "8": "L04"}
try:
    CARDS = {c["code"]: c["name"] for c in json.load(open(os.path.join(ROOT, "cards.json"), encoding="utf-8"))["cards"]}
except Exception:
    CARDS = {}


def man(n):
    if n is None: return "-"
    if n >= 1e8: return f"{n/1e8:.1f}".rstrip("0").rstrip(".") + "억"
    if n >= 1e5: return f"{round(n/1e4):,}만"
    if n >= 1e4: return f"{n/1e4:.1f}".rstrip("0").rstrip(".") + "만"
    return f"{n:,}"


def dur(s):
    return f"{s//3600}:{s%3600//60:02d}:{s%60:02d}" if s >= 3600 else f"{s//60}:{s%60:02d}"


def clean(t):
    t2 = re.sub(r"\s*#\S+", "", t).strip()
    return t2 or t


def mult(x):
    return x["views"] / x["subs"] if x.get("subs") else 0


def load_days():
    days = {}
    for f in glob.glob(os.path.join(ARCH, "20*.json")):
        d = datetime.date.fromisoformat(os.path.basename(f)[:10])
        try:
            days[d] = json.load(open(f, encoding="utf-8"))
        except Exception:
            pass
    return days


def pick(days, kind, n):
    best = {}
    for d, data in sorted(days.items()):
        for it in data.get(kind, {}).get("items", []):
            if not it.get("subs"): continue
            if it["id"] not in best or mult(it) >= mult(best[it["id"]]):
                best[it["id"]] = dict(it, seen=d)
    out, chans = [], set()
    for it in sorted(best.values(), key=lambda x: -mult(x)):
        if it["channel"] in chans: continue
        out.append(it); chans.add(it["channel"])
        if len(out) == n: break
    return out, best


def card_link(code, prefix="../../"):
    name = CARDS.get(code)
    label = f"{code} {name}" if name else code
    return f'<a href="{prefix}card/{code.lower()}.html">{E(label)}</a>'


def recipe(p):
    if not p: return ""
    codes = []
    if p.get("tpl") in TPL: codes.append(TPL[p["tpl"]])
    codes += [m.upper() for m in p.get("m", []) if re.fullmatch(r"m\d\d", m)]
    if p.get("style"): codes.append(p["style"].upper())
    if p.get("light") in LIGHT: codes.append(LIGHT[p["light"]])
    return " · ".join(card_link(c) for c in codes)


def thumb(x):
    if x["kind"] != "short": return f"https://i.ytimg.com/vi/{x['id']}/mqdefault.jpg"
    return f"https://i.ytimg.com/vi/{x['id']}/{'frame0' if x.get('thumb') == 'frame0' else 'oardefault'}.jpg"


def yt(x):
    return f"https://www.youtube.com/shorts/{x['id']}" if x["kind"] == "short" else f"https://www.youtube.com/watch?v={x['id']}"


CSS = """<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+KR:wght@400;500;600&display=swap">
<style>
:root{--bg:#F2F3F5;--surface:#FFFFFF;--ink:#15171C;--muted:#5C6270;--line:#DCDFE5;--rec:#D2382A;
--f-display:"Do Hyeon","IBM Plex Sans KR","Apple SD Gothic Neo",sans-serif;--f-body:"IBM Plex Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif;--f-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
@media (prefers-color-scheme:dark){:root{--bg:#111317;--surface:#1A1D23;--ink:#ECEEF2;--muted:#9BA1AE;--line:#2D313A;--rec:#FF6B5C;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--f-body);font-size:15px;line-height:1.7}
a{color:inherit}header.top{border-bottom:1px solid var(--line);background:var(--surface)}
header.top nav{max-width:860px;margin:0 auto;padding:12px 16px;display:flex;gap:14px;flex-wrap:wrap;font-size:14px}
header.top .brand{font-weight:600;margin-right:auto;text-decoration:none}
main{max-width:860px;margin:0 auto;padding:24px 16px 40px}
.eyebrow{font-family:var(--f-mono);font-size:12px;color:var(--rec)}
h1{font-family:var(--f-display);font-weight:400;font-size:clamp(28px,6vw,40px);line-height:1.2;margin:6px 0 10px}
h2{font-family:var(--f-display);font-weight:400;font-size:24px;margin:34px 0 10px}
.lede{color:var(--muted);margin:0 0 18px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:14px 0}
.stats div{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.stats b{display:block;font-size:20px}.stats span{font-size:12px;color:var(--muted)}
ol.rank{list-style:none;padding:0;margin:0;display:grid;gap:14px}
ol.rank>li{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px;display:grid;grid-template-columns:120px 1fr;gap:14px}
ol.rank.long>li{grid-template-columns:200px 1fr}
ol.rank img{width:100%;border-radius:10px;aspect-ratio:9/16;object-fit:cover;background:var(--line)}
ol.rank.long img{aspect-ratio:16/9}
.no{font-family:var(--f-mono);font-size:12px;color:var(--rec)}
h3{font-size:17px;margin:2px 0 4px;line-height:1.4}
.meta{font-size:13px;color:var(--muted);margin:0 0 8px}
.meta b{color:var(--ink)}
dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 10px;font-size:14px}
dt{color:var(--muted);white-space:nowrap}dd{margin:0}
.cta{margin:30px 0;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px;display:grid;gap:8px}
.btn{display:inline-block;font-weight:600;border:1px solid var(--ink);background:var(--ink);color:var(--bg);border-radius:8px;padding:9px 14px;text-decoration:none;justify-self:start}
ul.weeks{list-style:none;padding:0;display:grid;gap:10px}ul.weeks a{display:block;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px;text-decoration:none}
ul.weeks small{display:block;color:var(--muted)}
.note{font-size:12.5px;color:var(--muted)}
footer{max-width:860px;margin:0 auto;padding:0 16px 40px;font-size:13px;color:var(--muted)}
@media (max-width:560px){ol.rank>li,ol.rank.long>li{grid-template-columns:96px 1fr}}
:focus-visible{outline:2px solid var(--rec);outline-offset:2px}
</style>"""


def page(title, desc, path, body, ld):
    lds = "".join('<script type="application/ld+json">' + json.dumps(x, ensure_ascii=False).replace("</", "<\\/") + "</script>\n" for x in ld)
    return f"""<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="{BASE}{path}">
<meta name="naver-site-verification" content="e5333b5b9f211f59938cdfd08b3fdd56345a3b6b" />
<meta property="og:type" content="article">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:url" content="{BASE}{path}">
<meta property="og:image" content="{BASE}/og.png">
<meta name="twitter:card" content="summary_large_image">
{lds}{CSS}
</head>
<body>
<header class="top"><nav><a class="brand" href="../../">AI 영상 레퍼런스 보관함</a><a href="../../#dict">레퍼런스 사전</a><a href="../">터진 쇼츠</a><a href="./">주간 TOP 10</a><a href="../../guide/">가이드</a></nav></header>
<main>
{body}
</main>
<footer>영상과 썸네일의 저작권은 각 유튜브 채널에 있습니다. 숫자는 집계일 기준 유튜브 공개 수치입니다. · <a href="../../privacy.html">소개 · 개인정보처리방침</a></footer>
<script data-goatcounter="https://aivideoref.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
"""


def md(d):
    return f"{d.month}/{d.day}"


def build_week(mon, days):
    sun = mon + datetime.timedelta(days=6)
    wk = {d: v for d, v in days.items() if mon <= d <= sun}
    shorts, allshort = pick(wk, "short", 10)
    longs, _ = pick(wk, "long", 5)
    if len(shorts) < 5 or len(wk) < 3:
        return None
    rng = f"{mon.year}년 {mon.month}월 {mon.day}일~{sun.month}월 {sun.day}일"
    top = shorts[0]
    title = f"{md(mon)}~{md(sun)} 터진 쇼츠 TOP 10 — 작은 채널 구독자 대비 조회수 순위"
    desc = (f"{rng} 매일 모은 한국 쇼츠 {len(allshort)}편 중 구독자 대비 조회수가 가장 크게 나온 10편. "
            f"1위 “{clean(top['title'])[:30]}”(구독자 {top['subs']:,}명, 조회 {man(top['views'])} 회). 첫 3초·흐름·터진 이유·따라 만드는 AI 프롬프트까지.")
    ms = [mult(x) for x in allshort.values() if x.get("subs")]
    fmts = {}
    for x in allshort.values():
        k = (x.get("fmt") or "").split("·")[0].strip()
        if k: fmts[k] = fmts.get(k, 0) + 1
    topf = sorted(fmts.items(), key=lambda kv: -kv[1])[:3]

    def item(i, x, long=False):
        flow = " → ".join(x.get("flow") or [])
        rows = [("형식", E(x.get("fmt"))),
                ("도입 15초" if long else "첫 3초", E(x.get("hook"))),
                ("흐름", E(flow)),
                ("터진 이유", E(x.get("why"))),
                ("따라 만들기", recipe(x.get("preset"))),
                ("주의", E(x.get("caution")))]
        dl = "".join(f"<dt>{k}</dt><dd>{v}</dd>" for k, v in rows if v)
        up = x.get("date", "")
        up = f"{up[:4]}.{int(up[4:6])}.{int(up[6:8])} 업로드 · " if len(up) == 8 else ""
        return f"""<li id="{'l' if long else 's'}{i}">
  <a href="{yt(x)}" target="_blank" rel="noopener nofollow"><img src="{thumb(x)}" alt="{E(clean(x['title']))} 썸네일" loading="lazy" width="{320 if long else 180}" height="{180 if long else 320}"></a>
  <div><span class="no">{i}위 · 약 {round(mult(x)):,}배</span>
  <h3>{E(clean(x['title']))}</h3>
  <p class="meta">{E(x['channel'])} · 구독자 <b>{x['subs']:,}명</b> · 조회 <b>{man(x['views'])}회</b> · {dur(x['dur'])} · {up}<a href="{yt(x)}" target="_blank" rel="noopener nofollow">원본 보기</a></p>
  <dl>{dl}</dl></div>
</li>"""

    thr = "20만 회 이상" if min(wk) >= datetime.date(2026, 10, 19) else "20만 회 이상(10/18까지는 30만 회)"
    body = f"""<span class="eyebrow">WEEKLY · {rng}</span>
<h1>{md(mon)}~{md(sun)} 터진 쇼츠 TOP 10</h1>
<p class="lede">이번 주 매일 아침 모은 한국 쇼츠 가운데 <b>구독자 수에 비해 조회수가 가장 크게 나온</b> 영상 10편이에요. 구독자가 적은 채널이 크게 터졌다면 구독자 덕이 아니라 영상 자체가 사람을 붙잡았다는 뜻이라, 따라 만들 공식을 찾기 좋아요. 1위는 구독자 {top['subs']:,}명 채널의 “{E(clean(top['title']))}”로 조회 {man(top['views'])}회(약 {round(mult(top)):,}배)였어요.</p>
<div class="stats">
  <div><b>{len(allshort)}편</b><span>이번 주 분석한 숏폼</span></div>
  <div><b>{man(int(statistics.median([x['views'] for x in allshort.values()])))}회</b><span>조회수 중앙값</span></div>
  <div><b>{round(statistics.median(ms)):,}배</b><span>구독자 대비 배수 중앙값</span></div>
  <div><b>{len(wk)}일</b><span>집계한 날 ({', '.join(md(d) for d in sorted(wk))})</span></div>
</div>
{('<p>이번 주 가장 많이 보인 형식: ' + ', '.join(f'<b>{E(k)}</b> {v}편' for k, v in topf) + '.</p>') if topf else ''}
<h2>숏폼 TOP 10</h2>
<ol class="rank">{''.join(item(i + 1, x) for i, x in enumerate(shorts))}</ol>
{('<h2>롱폼 TOP ' + str(len(longs)) + '</h2><ol class="rank long">' + ''.join(item(i + 1, x, True) for i, x in enumerate(longs)) + '</ol>') if longs else ''}
<div class="cta"><b>오늘 터진 쇼츠는 매일 아침 갱신돼요</b><span>첫 3초, 장면 흐름, 터진 이유를 보고 같은 공식으로 AI 영상 프롬프트를 바로 만들 수 있어요.</span><a class="btn" href="../">오늘의 터진 쇼츠 보기</a></div>
<p class="note">선정 기준: 최근 60일 안에 올라온 한국어 쇼츠 중 조회 {thr}, 뉴스·방송사·광고·재업로드 의심 영상 제외. 같은 채널은 1편만. 배수 = 조회수 ÷ 구독자 수(집계일 기준). '따라 만들기'는 이 사이트 레퍼런스 카드 코드예요.</p>
<p><a href="./">← 다른 주 보기</a></p>"""
    url = f"{BASE}/radar/week/{mon.isoformat()}.html"
    ld = [{"@context": "https://schema.org", "@type": "Article", "headline": title, "description": desc, "inLanguage": "ko",
           "mainEntityOfPage": url, "datePublished": (sun + datetime.timedelta(days=1)).isoformat(), "dateModified": TODAY.isoformat(),
           "image": f"https://i.ytimg.com/vi/{top['id']}/oardefault.jpg",
           "author": {"@type": "Person", "name": "김동욱", "url": f"{BASE}/privacy.html"},
           "publisher": {"@type": "Organization", "name": "AI 영상 레퍼런스 보관함", "url": f"{BASE}/"}},
          {"@context": "https://schema.org", "@type": "ItemList", "name": f"{md(mon)}~{md(sun)} 터진 쇼츠 TOP 10",
           "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": clean(x["title"]), "url": yt(x)} for i, x in enumerate(shorts)]},
          {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "AI 영상 레퍼런스 보관함", "item": f"{BASE}/"},
              {"@type": "ListItem", "position": 2, "name": "터진 쇼츠", "item": f"{BASE}/radar/"},
              {"@type": "ListItem", "position": 3, "name": "주간 TOP 10", "item": f"{BASE}/radar/week/"},
              {"@type": "ListItem", "position": 4, "name": f"{md(mon)}~{md(sun)}", "item": url}]}]
    return page(title + " | AI 영상 레퍼런스 보관함", desc, f"/radar/week/{mon.isoformat()}.html", body, ld), title, top


def main():
    days = load_days()
    os.makedirs(OUTD, exist_ok=True)
    this_mon = TODAY - datetime.timedelta(days=TODAY.weekday())
    mons = sorted({d - datetime.timedelta(days=d.weekday()) for d in days})
    made = []
    for mon in mons:
        if mon >= this_mon: continue  # 끝난 주만
        p = os.path.join(OUTD, f"{mon.isoformat()}.html")
        if os.path.exists(p) and not FORCE: continue
        r = build_week(mon, days)
        if not r: print("skip", mon, "(데이터 부족)"); continue
        open(p, "w", encoding="utf-8").write(r[0]); made.append(mon); print("wrote", p)
    # 목록 페이지: 이미 있는 주간 페이지 전부(아카이브가 지워져도 페이지는 남음)
    rows = []
    for p in sorted(glob.glob(os.path.join(OUTD, "20*.html")), reverse=True):
        s = open(p, encoding="utf-8").read()
        h = re.search(r"<h1>(.*?)</h1>", s).group(1)
        d = re.search(r'<meta name="description" content="(.*?)">', s).group(1)
        rows.append(f'<li><a href="{os.path.basename(p)}"><b>{h}</b><small>{d}</small></a></li>')
    body = f"""<span class="eyebrow">WEEKLY</span>
<h1>주간 터진 쇼츠 TOP 10</h1>
<p class="lede">매주 월요일, 지난 한 주 동안 구독자 수에 비해 조회수가 가장 크게 나온 한국 쇼츠 10편을 정리해요. 영상마다 첫 3초, 흐름, 터진 이유, 따라 만드는 AI 프롬프트 카드가 붙어 있어요.</p>
<ul class="weeks">{''.join(rows) or '<li>첫 주간 정리를 준비하고 있어요.</li>'}</ul>
<div class="cta"><b>매일 아침 갱신</b><span>오늘 터진 쇼츠는 '오늘의 터진 쇼츠'에서 볼 수 있어요.</span><a class="btn" href="../">오늘의 터진 쇼츠 보기</a></div>"""
    ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": "주간 터진 쇼츠 TOP 10", "url": f"{BASE}/radar/week/", "inLanguage": "ko"}]
    open(os.path.join(OUTD, "index.html"), "w", encoding="utf-8").write(
        page("주간 터진 쇼츠 TOP 10 — 매주 구독자 대비 조회수 순위 | AI 영상 레퍼런스 보관함",
             "매주 월요일, 지난 한 주 구독자 수에 비해 조회수가 가장 크게 나온 한국 쇼츠 10편과 터진 이유, 따라 만드는 AI 프롬프트를 정리합니다.",
             "/radar/week/", body, ld))
    if FULL:
        sm_p = os.path.join(ROOT, "sitemap.xml")
        sm = open(sm_p, encoding="utf-8").read()
        add = ["/radar/week/"] + [f"/radar/week/{os.path.basename(p)}" for p in sorted(glob.glob(os.path.join(OUTD, "20*.html")))]
        new = "".join(f"  <url><loc>{BASE}{u}</loc><lastmod>{TODAY.isoformat()}</lastmod></url>\n" for u in add if f"<loc>{BASE}{u}</loc>" not in sm)
        if new:
            open(sm_p, "w", encoding="utf-8").write(sm.replace("</urlset>", new + "</urlset>"))
        print("sitemap +", new.count("<url>"))
    print("weeks made:", [m.isoformat() for m in made])


if __name__ == "__main__":
    main()
