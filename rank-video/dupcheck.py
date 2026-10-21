"""오늘 TOP 5가 최근 7일 TOP 5와 겹치는지 확인.
사용: python3 dupcheck.py <archive 폴더> <YYYY-MM-DD>
출력 마지막 줄: OK / DUP <겹친 수> / SHORT <편수>   (DUP·SHORT면 TOP 5 대신 예시 영상을 씀)
"""
import json, os, sys, datetime
arch, day = sys.argv[1], sys.argv[2]
def top5(d):
    p = os.path.join(arch, f"{d}.json")
    if not os.path.exists(p): return []
    items = [x for x in json.load(open(p, encoding="utf-8"))["short"]["items"] if x.get("subs")]
    out, ch = [], set()
    for x in sorted(items, key=lambda x: -x["views"] / x["subs"]):
        if x["channel"] in ch: continue
        out.append(x["id"]); ch.add(x["channel"])
        if len(out) == 5: break
    return out
t = datetime.date.fromisoformat(day)
today = top5(day)
seen = set()
for k in range(1, 8):
    seen |= set(top5((t - datetime.timedelta(days=k)).isoformat()))
dup = [i for i in today if i in seen]
print("today", today, "dup", dup)
print("SHORT %d" % len(today) if len(today) < 5 else ("DUP %d" % len(dup) if len(dup) >= 2 else "OK"))
