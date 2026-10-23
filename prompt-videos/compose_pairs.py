"""Build ~27s promo shorts from pairs of code-made example videos.
python3 compose_pairs.py <outroot> [n1 n2 ...]   (pair numbers, 1-based; default all)
Each pair -> <outroot>/code_ex_NN/{video.mp4, cover.jpg, caption.txt, yt_title.txt, yt_desc.txt, src.json}
"""
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
BGM = "/home/claude/promo-tools/rank-video/bgm.m4a" if os.path.exists("/home/claude/promo-tools/rank-video/bgm.m4a") else "/home/claude/pt-wt/rank-video/bgm.m4a"
FB = "/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc"; FM = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
W, H, FPS = 720, 1280, 30
SITE = "ai-video-reference-kr.netlify.app"
PAIRS = [("할인 이벤트 광고", "m05", "g03"), ("앱·홈페이지 소개 영상", "m04", "m12"), ("3D 제품 광고", "d01", "d08"), ("로고 오프닝", "m01", "g08"),
         ("숫자로 설득하는 광고", "e03", "e09"), ("카페·음료 광고", "m14", "e07"), ("라이브·주문 알림 영상", "m13", "m18"), ("공감형 제품 광고", "m07", "m19"),
         ("브랜드 감성 영상", "m02", "m16"), ("사용법 설명 영상", "e01", "e05"), ("이벤트 참여 영상", "g04", "g05"), ("오픈·출시 티저", "d04", "m06"),
         ("후기·성과 영상", "m03", "m08"), ("상세페이지용 영상", "m09", "e11"), ("게임 감성 광고", "g01", "g02"), ("3D 무드 영상", "d02", "d06"),
         ("테크 출시 영상", "m11", "d07"), ("성장 그래프 영상", "e02", "d05"), ("개념 설명 영상", "e06", "e12"), ("브랜드 스토리 영상", "e04", "d10"),
         ("기능 소개 모션", "m10", "m17"), ("포스터·무드 광고", "m15", "d03"), ("퀴즈·레이싱 참여 영상", "g06", "g07"), ("문제 해결 설명 영상", "e08", "e10"),
         ("엔딩·메시지 영상", "m20", "d09")]
run = lambda a: subprocess.run(a, check=True)
ff = ["ffmpeg", "-y", "-loglevel", "error"]
def font(p, s): return ImageFont.truetype(p, s)
def ctext(d, y, s, f, fill, maxw=660):
    while d.textlength(s, font=f) > maxw and f.size > 18: f = font(f.path, f.size - 2)
    d.text(((W - d.textlength(s, font=f)) / 2, y), s, font=f, fill=fill); return f.size
def meta(i): return json.load(open(f"{D}/out/{i}.json", encoding="utf-8"))
def short_prompt(p):
    paras = [x.strip() for x in p.split("\n\n") if x.strip()]
    first = re.split(r"(?<=\.)\s", paras[0])[0]
    cfg = paras[1] if len(paras) > 1 else ""
    s = (first + "\n" + cfg).strip()
    return s if len(s) <= 520 else s[:517].rsplit(" ", 1)[0] + "…"

def build(n, outroot):
    theme, a, b = PAIRS[n - 1]; ma, mb = meta(a), meta(b)
    od = f"{outroot}/code_ex_{n:02d}"; tmp = f"{od}/_tmp"; os.makedirs(tmp, exist_ok=True)
    # hook card over blurred first video frame
    run(ff + ["-ss", str(ma["dur"] * .55), "-i", f"{D}/out/{a}.mp4", "-frames:v", "1", f"{tmp}/bg.png"])
    bg = Image.open(f"{tmp}/bg.png").convert("RGB").resize((W, H)).filter(ImageFilter.GaussianBlur(18))
    bg = Image.blend(bg, Image.new("RGB", (W, H), (12, 12, 18)), .62); d = ImageDraw.Draw(bg)
    d.rounded_rectangle((210, 380, 510, 430), 25, fill=(255, 214, 10)); ctext(d, 386, "영상 AI 없이", font(FB, 30), (20, 20, 20))
    ctext(d, 470, theme, font(FB, 62), (255, 255, 255)); ctext(d, 560, "2편 만들었어요", font(FB, 62), (255, 255, 255))
    ctext(d, 680, "Claude에게 프롬프트 한 장 →", font(FM, 32), (210, 214, 225)); ctext(d, 728, "코드로 그린 광고", font(FM, 32), (210, 214, 225))
    ctext(d, 860, "프롬프트는 설명란에 그대로 공개", font(FM, 28), (255, 214, 10)); bg.save(f"{tmp}/hook.png")
    # end card
    e = Image.new("RGB", (W, H), (12, 12, 18)); d = ImageDraw.Draw(e)
    ctext(d, 420, "프롬프트 전문은", font(FB, 56), (255, 255, 255)); ctext(d, 500, "설명란에 있어요", font(FB, 56), (255, 214, 10))
    ctext(d, 610, "[대괄호]만 내 브랜드로 바꿔서", font(FM, 32), (210, 214, 225)); ctext(d, 656, "Claude에 붙여넣으면 끝", font(FM, 32), (210, 214, 225))
    d.rounded_rectangle((70, 800, 650, 880), 40, fill=(210, 56, 42)); ctext(d, 816, SITE, font(FM, 30), (255, 255, 255), 560)
    ctext(d, 905, "AI 영상 레퍼런스 보관함 · 무료", font(FM, 26), (160, 165, 178)); e.save(f"{tmp}/end.png")
    # labels
    for k, (i, m) in enumerate([(a, ma), (b, mb)]):
        im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im); s = f"{'①②'[k]} {m['title']}"; f = font(FM, 24)
        while d.textlength(s, font=f) > 620: f = font(FM, f.size - 1)
        w = d.textlength(s, font=f); d.rounded_rectangle(((W - w) / 2 - 18, 18, (W + w) / 2 + 18, 62), 22, fill=(0, 0, 0, 165)); d.text(((W - w) / 2, 24), s, font=f, fill=(255, 255, 255)); im.save(f"{tmp}/lab{k}.png")
    HK, EN = 2.6, 3.4
    segs = []
    run(ff + ["-loop", "1", "-t", str(HK), "-i", f"{tmp}/hook.png", "-vf", f"fps={FPS},format=yuv420p,fade=t=out:st={HK-.25}:d=0.25", "-c:v", "libx264", "-crf", "20", f"{tmp}/s0.mp4"]); segs.append(f"{tmp}/s0.mp4")
    for k, (i, m) in enumerate([(a, ma), (b, mb)]):
        o = f"{tmp}/s{k+1}.mp4"; dur = float(m["dur"]) - .35
        run(ff + ["-t", str(dur), "-i", f"{D}/out/{i}.mp4", "-i", f"{tmp}/lab{k}.png", "-filter_complex", f"[0:v]fps={FPS},scale={W}:{H},setsar=1[v];[v][1:v]overlay=0:0,format=yuv420p,fade=t=in:d=0.2,fade=t=out:st={dur-.2}:d=0.2[o]", "-map", "[o]", "-an", "-c:v", "libx264", "-crf", "20", o]); segs.append(o)
    run(ff + ["-loop", "1", "-t", str(EN), "-i", f"{tmp}/end.png", "-vf", f"fps={FPS},format=yuv420p,fade=t=in:d=0.25", "-c:v", "libx264", "-crf", "20", f"{tmp}/s3.mp4"]); segs.append(f"{tmp}/s3.mp4")
    open(f"{tmp}/list.txt", "w").writelines(f"file '{s}'\n" for s in segs)
    TOT = HK + float(ma["dur"]) - .35 + float(mb["dur"]) - .35 + EN
    run(ff + ["-f", "concat", "-safe", "0", "-i", f"{tmp}/list.txt", "-stream_loop", "-1", "-i", BGM, "-filter_complex",
              f"[1:a]atrim=0:{TOT:.2f},asetpts=N/SR/TB,afade=t=in:d=0.3,afade=t=out:st={TOT-1.5:.2f}:d=1.5,loudnorm=I=-14:TP=-1.5[a]",
              "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", f"{od}/video.mp4"])
    run(ff + ["-ss", str(HK + float(ma["dur"]) * .6), "-i", f"{od}/video.mp4", "-frames:v", "1", "-q:v", "3", f"{od}/cover.jpg"])
    title = f"영상 AI 없이 만든 {theme} 2편 — 프롬프트 공개 #shorts"
    open(f"{od}/yt_title.txt", "w", encoding="utf-8").write(title[:100])
    tags = "#AI영상 #AI광고 #프롬프트 #클로드 #모션그래픽 #쇼츠"
    cap = (f"영상 AI 없이 만든 {theme} 2편 🎬\nClaude에게 프롬프트 한 장을 주고, 코드(HTML·Canvas)로 그리게 한 영상이에요. 글자·숫자가 안 깨지는 게 장점이에요.\n\n"
           f"① {ma['title']}\n{ma['desc']}\n\n② {mb['title']}\n{mb['desc']}\n\n"
           f"📋 프롬프트 핵심 (① / ②)\n{short_prompt(ma['prompt'])}\n\n{short_prompt(mb['prompt'])}\n\n"
           f"[대괄호]만 내 브랜드로 바꿔서 Claude에 붙여넣으면 돼요.\n🔗 {SITE} (무료 · 회원가입 없음)\n\n어떤 제품으로 만들어 보고 싶어요?\n\n{tags}")
    if len(cap) > 2150:  # drop prompt block if too long for IG
        cap = cap.split("📋")[0] + f"[대괄호]만 내 브랜드로 바꾸는 프롬프트 전문은 유튜브 설명란에 있어요.\n🔗 {SITE} (무료 · 회원가입 없음)\n\n어떤 제품으로 만들어 보고 싶어요?\n\n{tags}"
    open(f"{od}/caption.txt", "w", encoding="utf-8").write(cap)
    desc = (f"▶ 카드로 AI 영상 프롬프트 만드는 무료 사이트: https://{SITE}/\n\n영상 AI 없이, Claude에게 프롬프트를 주고 코드(HTML·Canvas·Three.js)로 그리게 만든 {theme} 2편이에요. 영상 속 브랜드·숫자는 모두 지어낸 예시예요.\n\n"
            f"① {ma['title']}\n바꿔 쓰는 법: {ma['how']}\n\n프롬프트 전문 ①\n{ma['prompt']}\n\n② {mb['title']}\n바꿔 쓰는 법: {mb['how']}\n\n프롬프트 전문 ②\n{mb['prompt']}\n\n"
            f"만든 영상을 mp4로 뽑을 땐 Claude에게 \"render(t)로 초당 30장 캡처해서 mp4로 합쳐 줘\"라고 하면 돼요.\n\n#AI영상 #AI광고 #프롬프트 #클로드 #모션그래픽")
    desc = desc.replace("<", "‹").replace(">", "›")  # YouTube rejects angle brackets
    if len(desc) > 4900: desc = desc[:4890] + "…"
    open(f"{od}/yt_desc.txt", "w", encoding="utf-8").write(desc)
    json.dump({"pair": n, "theme": theme, "ids": [a, b], "dur": round(TOT, 2)}, open(f"{od}/src.json", "w", encoding="utf-8"), ensure_ascii=False)
    subprocess.run(["rm", "-rf", tmp])
    print(n, theme, round(TOT, 1), os.path.getsize(f"{od}/video.mp4"), len(cap), len(desc))

if __name__ == "__main__":
    outroot = sys.argv[1]; ns = [int(x) for x in sys.argv[2:]] or range(1, len(PAIRS) + 1)
    for n in ns: build(n, outroot)
