"""사이트 활용 예시 광고 영상 합성.
shots/S1..S4.mp4 (H3 720x1280) + explain.html(만든 방법·CTA) + BGM 1곡 → out/site_ex_cookie.mp4
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
D = os.path.dirname(os.path.abspath(__file__))
SP = "/tmp/claude-0/-home-claude/aa782c16-cbe2-576a-a960-07e1248b6af2/scratchpad"
BGM = "/home/claude/promo-tools/rank-video/bgm.m4a"
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"
FONTB = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
FPS = 30
CFG = json.load(open(f"{D}/compose.json", encoding="utf-8"))
os.makedirs(f"{D}/stills", exist_ok=True); os.makedirs(f"{D}/ov", exist_ok=True); os.makedirs(f"{D}/out", exist_ok=True)
run = lambda a: subprocess.run(a, check=True)
ff = ["ffmpeg", "-y", "-loglevel", "error"]

# 1) stills for the explain scene
for s in CFG["shots"]:
    run(ff + ["-ss", str(s["still_at"]), "-i", f"{D}/shots/{s['id']}.mp4", "-frames:v", "1", "-q:v", "3", f"{D}/stills/{s['id']}.jpg"])

# 2) overlays for the ad part (PNG, 1080x1920)
def font(sz, bold=False): return ImageFont.truetype(FONTB if bold else FONT, sz)
def ov(name, draw_fn):
    im = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0)); d = ImageDraw.Draw(im); draw_fn(d); im.save(f"{D}/ov/{name}.png")
def centered(d, y, text, f, fill):
    w = d.textlength(text, font=f); d.text(((1080 - w) / 2, y), text, font=f, fill=fill)
def hook(d):
    d.rounded_rectangle((60, 120, 1020, 400), 36, fill=(15, 17, 21, 225))
    centered(d, 160, CFG["hook"][0], font(72), (255, 255, 255))
    centered(d, 268, CFG["hook"][1], font(48), (255, 204, 51))
ov("hook", hook)
def tag(d):
    t = CFG["tag"]; f = font(30, True); w = d.textlength(t, font=f)
    d.rounded_rectangle((48, 96, 48 + w + 40, 156), 30, fill=(15, 17, 21, 190)); d.text((68, 104), t, font=f, fill=(255, 255, 255))
ov("tag", tag)
for i, s in enumerate(CFG["shots"]):
    def sub(d, text=s["sub"]):
        f = font(64); w = d.textlength(text, font=f)
        d.rounded_rectangle(((1080 - w) / 2 - 36, 1480, (1080 + w) / 2 + 36, 1600), 26, fill=(15, 17, 21, 170))
        centered(d, 1494, text, f, (255, 255, 255))
    ov(f"sub{i}", sub)

# 3) ad part: trim + scale each shot, overlay subtitle, concat
parts = []
for i, s in enumerate(CFG["shots"]):
    o = f"{D}/ov/part{i}.mp4"
    run(ff + ["-ss", str(s["in"]), "-t", str(s["dur"]), "-i", f"{D}/shots/{s['id']}.mp4", "-i", f"{D}/ov/sub{i}.png",
              "-filter_complex", f"[0:v]scale=1080:1920:flags=lanczos,fps={FPS},setsar=1[v];[v][1:v]overlay=0:0:enable='gte(t,0.15)'[o]",
              "-map", "[o]", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", o])
    parts.append(o)
with open(f"{D}/ov/list.txt", "w") as fl:
    fl.writelines(f"file '{p}'\n" for p in parts)
AD = sum(s["dur"] for s in CFG["shots"])
run(ff + ["-f", "concat", "-safe", "0", "-i", f"{D}/ov/list.txt", "-i", f"{D}/ov/hook.png", "-i", f"{D}/ov/tag.png",
          "-filter_complex", f"[0:v][1:v]overlay=0:0:enable='lt(t,{CFG['hook_sec']})'[a];[a][2:v]overlay=0:0:enable='gte(t,{CFG['hook_sec']})'[o]",
          "-map", "[o]", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", f"{D}/ov/ad.mp4"])

# 4) explain + CTA (canvas frames)
EX = CFG["explain_dur"]
json.dump({}, open(os.devnull, "w"))
open(f"{D}/data.js", "w", encoding="utf-8").write("window.DATA=" + json.dumps({
    "rows": [{"still": f"stills/{s['id']}.jpg", "code": s["code"], "name": s["name"], "when": s["when"], "prompt": s["prompt"]} for s in CFG["shots"]],
    "common": CFG["common"], "tool": CFG["tool"], "split": CFG["split"], "dur": EX}, ensure_ascii=False) + ";")
if "--stills" in sys.argv:
    mode = ["stills"] + [str(x) for x in CFG.get("check_at", [3, 8.5, 12])]
else:
    mode = ["video"]
run(["python3", f"{SP}/explain_frames.py", D, str(EX), str(FPS)] + mode)
if mode[0] == "stills":
    sys.exit(0)
run(ff + ["-framerate", str(FPS), "-i", f"{D}/frames/f%04d.jpg", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", f"{D}/ov/explain.mp4"])

# 5) join (short crossfade) + single BGM
TOT = AD + EX - 0.4
out = f"{D}/out/{CFG['name']}.mp4"
run(ff + ["-i", f"{D}/ov/ad.mp4", "-i", f"{D}/ov/explain.mp4", "-i", BGM,
          "-filter_complex", f"[0:v][1:v]xfade=transition=fade:duration=0.4:offset={AD-0.4:.2f}[v];"
                             f"[2:a]atrim=0:{TOT:.2f},asetpts=N/SR/TB,afade=t=in:d=0.4,afade=t=out:st={TOT-1.8:.2f}:d=1.8,loudnorm=I=-14:TP=-1.5[a]",
          "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-maxrate", "2500k", "-bufsize", "5000k",
          "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", out])
print("saved", out, os.path.getsize(out), "sec", round(TOT, 2))
