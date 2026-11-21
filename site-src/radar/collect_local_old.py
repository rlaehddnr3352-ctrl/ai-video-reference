#!/usr/bin/env python3
"""터진 쇼츠 레이더 수집기 (표준 라이브러리만 사용)

YouTube Data API v3로 최근 터진 한국어 숏폼·롱폼 후보를 모아 candidates.json으로 저장한다.
사용: YT_API_KEY=... python3 collect.py [출력경로]
쿼터: 검색 1회 100 units. 기본 설정은 하루 약 4,000 units (무료 한도 10,000).
"""
import json, os, re, sys, datetime, urllib.parse, urllib.request, http.client, concurrent.futures as cf

KEY = os.environ.get("YT_API_KEY", "").strip()
OUT = sys.argv[1] if len(sys.argv) > 1 else "candidates.json"
API = "https://www.googleapis.com/youtube/v3/"
NOW = datetime.datetime.now(datetime.timezone.utc)

SHORT_Q = ["AI 애니", "AI 영상", "ai 쇼츠", "강아지", "고양이", "동물", "아기", "요리", "레시피", "꿀팁",
           "살림 꿀팁", "썰", "역사", "미스터리", "상식", "공포", "반전", "제품 리뷰", "직장인", "병맛"]
LONG_Q = ["역사 이야기", "경제 이야기", "미스터리", "AI 애니메이션", "강아지", "고양이", "부업", "다큐", "썰 모음", "과학"]

NEWS = re.compile(r"(뉴스|NEWS|News|KBS|MBC|SBS|JTBC|YTN|연합|채널A|채널에이|TV조선|MBN|EBS|tvN|엔터테인먼트|Entertainment|Official|공식)", re.I)
ADS = re.compile(r"(\bCF\b|광고|캠페인|Campaign|Commercial|예고편|티저|Teaser|트레일러|Trailer|M/V|MV\b)", re.I)
HANGUL = re.compile(r"[가-힣]")

def get(path, **params):
    params["key"] = KEY
    url = API + path + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.load(r)

def search(q, duration, days, n=25):
    after = (NOW - datetime.timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%SZ")
    try:
        d = get("search", part="id", type="video", q=q, videoDuration=duration, order="viewCount",
                regionCode="KR", relevanceLanguage="ko", publishedAfter=after, maxResults=n)
        return [i["id"]["videoId"] for i in d.get("items", [])]
    except Exception as e:
        print("search fail", q, e, file=sys.stderr); return []

def chunks(a, n=50):
    for i in range(0, len(a), n): yield a[i:i+n]

def iso_dur(s):
    m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", s or "")
    if not m: return 0
    d, h, mi, se = (int(x or 0) for x in m.groups())
    return d*86400 + h*3600 + mi*60 + se

def is_short(vid):
    try:
        c = http.client.HTTPSConnection("www.youtube.com", timeout=15)
        c.request("HEAD", "/shorts/" + vid, headers={"User-Agent": "Mozilla/5.0"})
        st = c.getresponse().status; c.close()
        return st == 200
    except Exception:
        return None

def main():
    if not KEY: sys.exit("YT_API_KEY 없음")
    pools = {"short": {}, "long": {}}
    for q in SHORT_Q:
        for v in search(q, "short", 60): pools["short"].setdefault(v, []).append(q)
    for q in LONG_Q:
        for dur in ("medium", "long"):
            for v in search(q, dur, 30, 15): pools["long"].setdefault(v, []).append(q)
    ids = list({*pools["short"], *pools["long"]})
    vids = {}
    for ch in chunks(ids):
        d = get("videos", part="snippet,statistics,contentDetails", id=",".join(ch))
        for it in d.get("items", []):
            sn, stt = it["snippet"], it.get("statistics", {})
            pub = datetime.datetime.fromisoformat(sn["publishedAt"].replace("Z", "+00:00"))
            vids[it["id"]] = {"id": it["id"], "title": sn["title"], "channel": sn["channelTitle"], "channelId": sn["channelId"],
                "desc": (sn.get("description") or "")[:300], "tags": (sn.get("tags") or [])[:10],
                "views": int(stt.get("viewCount", 0)), "likes": int(stt.get("likeCount", 0)) if "likeCount" in stt else None,
                "comments": int(stt.get("commentCount", 0)) if "commentCount" in stt else None,
                "dur": iso_dur(it["contentDetails"].get("duration")), "date": pub.strftime("%Y%m%d"), "age": (NOW - pub).days}
    chans = {}
    for ch in chunks(list({v["channelId"] for v in vids.values()})):
        d = get("channels", part="statistics", id=",".join(ch))
        for it in d.get("items", []):
            s = it.get("statistics", {})
            chans[it["id"]] = None if s.get("hiddenSubscriberCount") else int(s.get("subscriberCount", 0))
    out = {"generated": NOW.isoformat(), "short": [], "long": []}
    for kind in ("short", "long"):
        rows = []
        for vid, qs in pools[kind].items():
            v = vids.get(vid)
            if not v: continue
            v = dict(v, subs=chans.get(v["channelId"]), q=qs, kind=kind)
            text = v["title"] + " " + v["channel"]
            flags = []
            if not HANGUL.search(text): flags.append("한국어 아님")
            if NEWS.search(v["channel"]): flags.append("방송·뉴스 채널")
            if ADS.search(v["title"]): flags.append("광고·예고편")
            if not HANGUL.search(v["channel"]) and v["title"].strip().startswith("#"): flags.append("재업로드 의심(해시태그 제목)")
            if kind == "short":
                if v["dur"] > 180: continue
                if v["views"] < 300000: continue
            else:
                if v["dur"] <= 240 or v["views"] < 100000: continue
            v["flags"] = flags
            v["mult"] = round(v["views"] / v["subs"], 1) if v["subs"] else None
            rows.append(v)
        rows.sort(key=lambda r: -(r["mult"] or 0))
        rows = rows[:45 if kind == "short" else 30]
        if kind == "short":
            with cf.ThreadPoolExecutor(8) as ex:
                for r, s in zip(rows, ex.map(lambda r: is_short(r["id"]), rows)): r["isShorts"] = s
            rows = [r for r in rows if r["isShorts"] is not False]
        out[kind] = rows
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"saved {OUT}: short {len(out['short'])}, long {len(out['long'])}")

if __name__ == "__main__":
    main()
