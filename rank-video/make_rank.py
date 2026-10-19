"""이번 주 터진 쇼츠 TOP 5 영상 만들기.
사용: python3 make_rank.py <archive 폴더> <시작 YYYY-MM-DD> <끝 YYYY-MM-DD> <출력 mp4> [bgm.wav]
- radar/archive/*.json 숏폼을 구독자 대비 배수로 정렬해 채널 중복 없이 5편 선택
- 썸네일(oardefault 1080x1920, 없으면 frame0)을 thumbs/에 받음
- data.js 작성 → ad.html을 Playwright로 900프레임 렌더 → ffmpeg (BGM 1곡, -14 LUFS)
"""
import json, glob, os, re, sys, subprocess, urllib.request
D = os.path.dirname(os.path.abspath(__file__))
arch, start, end, outp = sys.argv[1:5]
bgm = sys.argv[5] if len(sys.argv) > 5 else os.path.join(D, "..", "short", "bgm_fit.wav")

best = {}
for f in sorted(glob.glob(os.path.join(arch, "20*.json"))):
    day = os.path.basename(f)[:10]
    if not (start <= day <= end): continue
    for it in json.load(open(f, encoding="utf-8"))["short"]["items"]:
        if not it.get("subs"): continue
        m = it["views"] / it["subs"]
        if it["id"] not in best or m > best[it["id"]]["m"]:
            best[it["id"]] = dict(it, m=m)
picked, chans = [], set()
for it in sorted(best.values(), key=lambda x: -x["m"]):
    if it["channel"] in chans: continue
    picked.append(it); chans.add(it["channel"])
    if len(picked) == 5: break
if len(picked) < 5: sys.exit(f"후보가 {len(picked)}편뿐이에요")

os.makedirs(os.path.join(D, "thumbs"), exist_ok=True)
def thumb(vid):
    for k in ("oardefault", "frame0"):
        p = os.path.join(D, "thumbs", f"{vid}_{k}.jpg")
        try:
            data = urllib.request.urlopen(f"https://i.ytimg.com/vi/{vid}/{k}.jpg", timeout=20).read()
        except Exception:
            continue
        if len(data) < 5000: continue  # 120x90 기본 이미지
        open(p, "wb").write(data)
        return f"thumbs/{vid}_{k}.jpg"
    return ""

def clean_title(t):
    tags = [x for x in re.findall(r"#(\S+)", t) if x.lower() not in ("shorts", "short", "쇼츠")]
    t = re.sub(r"\s*#\S+", "", t).strip() or " ".join(tags[:3])
    return t[:34] + ("…" if len(t) > 34 else "")
def short_why(w):
    parts = [s.strip() for s in re.split(r"(?<=[.요])\s+", w) if s.strip()]
    keep = [s for s in parts if "구독자" not in s] or parts[:1]
    return keep[0].rstrip(".")

fmt_day = lambda s: f"{int(s[5:7])}/{int(s[8:10])}"
items = []
for i, it in enumerate(picked):
    items.append({"rank": i + 1, "fmt": it.get("fmt", ""), "title": clean_title(it["title"]), "channel": it["channel"],
                  "subs": it["subs"], "views": it["views"], "dur": it["dur"], "why": short_why(it.get("why", "")), "thumb": thumb(it["id"]), "id": it["id"]})
data = {"range": fmt_day(start) if start == end else f"{fmt_day(start)}–{fmt_day(end)}", "label": "오늘의" if start == end else "이번 주", "items": items}
open(os.path.join(D, "data.js"), "w", encoding="utf-8").write("window.DATA=" + json.dumps(data, ensure_ascii=False) + ";")
for x in items: print(x["rank"], round(x["views"] / x["subs"]), x["channel"], x["title"], "|", x["why"], "|", x["thumb"])

if "--data-only" in sys.argv: sys.exit(0)
subprocess.run(["python3", os.path.join(D, "frames.py"), "video"], check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", os.path.join(D, "frames", "f%04d.jpg"), "-i", bgm,
    "-filter_complex", "[1:a]atrim=0:30,asetpts=N/SR/TB,afade=t=in:d=0.4,afade=t=out:st=28.3:d=1.7,loudnorm=I=-14:TP=-1.5[a]",
    "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "160k", "-t", "30", "-movflags", "+faststart", outp], check=True)
print("saved", outp, os.path.getsize(outp))
