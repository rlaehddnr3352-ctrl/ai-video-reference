"""python3 render.py <scenefile> id1 id2 ... [--check] : renders out/<id>.mp4 + poster, or check sheet of 6 stills"""
import sys, os, json, base64, subprocess, threading, time
from playwright.sync_api import sync_playwright
D = os.path.dirname(os.path.abspath(__file__)); FPS = 30
args = [a for a in sys.argv[1:] if not a.startswith("--")]; f, ids = args[0], args[1:]; check = "--check" in sys.argv
PORT = 8170 + (os.getpid() % 50)
srv = subprocess.Popen(["python3", "-m", "http.server", str(PORT)], cwd=D, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(.8)
def dec(u, path): open(path, "wb").write(base64.b64decode(u.split(",", 1)[1]))
try:
    with sync_playwright() as p:
        b = p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        for id in ids:
            pg = b.new_page(viewport={"width": 1080, "height": 1920}); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(f"http://localhost:{PORT}/player.html?f={f}&id={id}"); pg.wait_for_function("window.READY===true", timeout=60000)
            meta = pg.evaluate("window.META"); dur = meta["dur"]; fr = f"{D}/frames/{id}"; os.makedirs(fr, exist_ok=True)
            if check:
                ts = [dur * k for k in (.08, .25, .42, .58, .75, .92)]
                for i, t in enumerate(ts): dec(pg.evaluate(f"frame({t})"), f"{fr}/c{i}.jpg")
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error"] + sum([["-i", f"{fr}/c{i}.jpg"] for i in range(6)], []) + ["-filter_complex", "".join(f"[{i}:v]scale=360:640[s{i}];" for i in range(6)) + "".join(f"[s{i}]" for i in range(6)) + "xstack=inputs=6:layout=0_0|w0_0|w0+w1_0|0_h0|w0_h0|w0+w1_h0", f"{D}/check/{id}.jpg"], check=True)
            else:
                for i in range(int(round(dur * FPS))): dec(pg.evaluate(f"frame({i/FPS})"), f"{fr}/f{i:04d}.jpg")
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", f"{fr}/f%04d.jpg", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", f"{D}/out/{id}.mp4"], check=True)
                pt = meta.get("poster", .6); src = f"{fr}/f{int(dur*pt*FPS):04d}.jpg"
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-vf", "scale=540:960", "-q:v", "4", f"{D}/out/{id}.jpg"], check=True)
                json.dump(meta, open(f"{D}/out/{id}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
                subprocess.run(["rm", "-rf", fr])
            print(id, "ok" if not errs else errs[:2], flush=True); pg.close()
        b.close()
finally:
    srv.terminate()
