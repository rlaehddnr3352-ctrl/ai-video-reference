import sys, os, subprocess, time
from playwright.sync_api import sync_playwright
D=os.path.dirname(os.path.abspath(__file__))
mode=sys.argv[1] if len(sys.argv)>1 else "stills"
FPS=30; DUR=30
os.makedirs(D+"/out", exist_ok=True)
srv=subprocess.Popen(["python3","-m","http.server","8142"],cwd=D,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
try:
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(viewport={"width":1080,"height":1920})
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto("http://localhost:8142/ad.html"); pg.wait_for_function("window.READY===true", timeout=20000)
        if mode=="stills":
            for t in [float(x) for x in (sys.argv[2:] or ["1.2","5.5","10","14.5","19","23.5","28.5"])]:
                pg.evaluate(f"render({t})"); pg.screenshot(path=f"{D}/out/still_{t:05.2f}.jpg", type="jpeg", quality=88)
        else:
            os.makedirs(D+"/frames", exist_ok=True)
            el=pg.locator("canvas")
            for i in range(FPS*DUR):
                pg.evaluate(f"render({i/FPS})")
                pg.screenshot(path=f"{D}/frames/f{i:04d}.jpg", type="jpeg", quality=92)
        print("errors:", errs[:3])
        b.close()
finally:
    srv.terminate()
