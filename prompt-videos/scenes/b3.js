// batch 3 — motion graphics 2
(() => {
const { E, ease, seg, env, lerp, clamp } = L;
const REC = "Expose window.render(t) that draws the frame at time t (seconds) deterministically, so it can be recorded frame by frame.";

// ---------- m11 retro CRT launch ----------
S.m11 = { dur: 11, meta: {
  cat: "motion", title: "레트로 CRT 모니터 느낌의 출시 영상", poster: .7,
  desc: "오래된 브라운관 화면처럼 주사선과 색 번짐이 있는 화면에 부팅 글자가 찍히고, 지직거리는 글리치와 함께 제품 이름이 등장해요.",
  prompt: `Create an 11-second vertical (1080x1920) retro-futuristic launch video as one HTML file with Canvas 2D. ${REC}

Product: [PRODUCT NAME], version "[VERSION]", one-liner "[ONE-LINER]". Accent: phosphor green #39ff88 with magenta/cyan chromatic split.

Look: a curved CRT screen inside a dark bezel, horizontal scanlines, a rolling bright band moving down, slight barrel vignette, flicker (opacity jitter ±3%), RGB channel offset on big text (draw the text three times in red/green/blue with 'lighter' compositing and small x offsets).
0–1.2s: power-on — a thin white line expands vertically into the full screen.
1.2–4.5s: boot log types line by line in a monospace font ("> loading modules ... OK" style, 5–6 lines with your product's features), a block cursor blinks.
4.5–6s: glitch burst — random horizontal slices shift sideways, color blocks flash, the screen jumps twice.
6–9s: the product name appears huge with chromatic aberration that settles to zero; version tag and one-liner type under it.
9–11s: a small "[DATE / LINK]" line, then power-off (collapse to a horizontal line, then a dot).

No images; everything drawn.`,
  how: "제품 이름, 버전, 부팅 로그에 나올 기능 5줄만 바꾸면 돼요. 개발 도구·앱·게임 출시처럼 '테크' 느낌이 필요한 제품에 잘 맞아요."
}, draw(t) {
  const g = L.g; L.fill("#050806");
  const pw = ease(t, 0, 1.1, E.expo), off = ease(t, 10.1, 10.6, E.in), dot = seg(t, 10.6, 10.9);
  const sh = Math.max(4, H * pw * (1 - off)), sw = W * (1 - dot * .98);
  g.save(); L.rr(W / 2 - sw / 2 + 30, H / 2 - sh / 2 + 30, sw - 60, sh - 60, 60); g.clip();
  L.fill("#06140c"); L.glow(W / 2, H / 2, 1100, "#1aff88", .12);
  const jump = (t > 4.6 && t < 4.7) || (t > 5.3 && t < 5.4) ? 40 : 0; g.translate(0, jump);
  const log = ["> boot PIXEL.NOTE v2.0", "> 메모 동기화 ........ OK", "> 손글씨 인식 ........ OK", "> 오프라인 모드 ...... OK", "> 다크 테마 .......... OK", "> ready_"];
  if (t > 1.2 && t < 6.1) log.forEach((l, i) => { const t0 = 1.3 + i * .5; if (t > t0) L.type(l, 90, 380 + i * 80, 40, "#39ff88", t, t0, 40, 500, "left", MONO, i === log.length - 1 || t < t0 + .5); });
  if (t >= 6) { const ab = 30 * (1 - ease(t, 6, 7.4, E.out)) + (Math.floor(t * 12) % 9 === 0 ? 8 : 0);
    g.save(); g.globalCompositeOperation = "lighter"; [["#ff2bd6", -ab], ["#39ff88", 0], ["#2bd9ff", ab]].forEach(([c, dx]) => { L.txt("PIXEL", W / 2 + dx, 860, 230, c, 800, "center", INTER); L.txt("NOTE", W / 2 - dx, 1080, 230, c, 800, "center", INTER); }); g.restore();
    L.at(0, 0, 1, 0, ease(t, 7, 7.4), () => { L.box(W / 2 - 140, 1160, 280, 70, 12, null, "#39ff88", 3); L.txt("v2.0", W / 2, 1210, 40, "#39ff88", 700, "center", MONO); });
    if (t > 7.6) L.type("손글씨까지 검색되는 메모 앱", W / 2 - L.tw("손글씨까지 검색되는 메모 앱", 46, 700) / 2, 1340, 46, "#d9ffe9", t, 7.6, 14, 700);
    L.at(W / 2, 1520, 1, 0, ease(t, 9, 9.4), () => L.txt("11월 20일 앱스토어 공개", 0, 0, 38, "#39ff88", 500, "center", KR)); }
  // glitch slices
  if (t > 4.5 && t < 6.1) { const r = L.rng(Math.floor(t * 20)); for (let i = 0; i < 9; i++) { const y = r() * H, h = 20 + r() * 120; const dx = (r() - .5) * 200; g.drawImage(g.canvas, 0, y, W, h, dx, y, W, h); if (r() > .6) L.box(r() * W, y, 80 + r() * 300, h * .5, 0, ["#ff2bd6", "#2bd9ff", "#39ff88"][i % 3]); } }
  // scanlines + band
  g.fillStyle = "rgba(0,0,0,.28)"; for (let y = 0; y < H; y += 6) g.fillRect(0, y, W, 2);
  const by = ((t * 400) % (H + 400)) - 200; const gr = g.createLinearGradient(0, by - 120, 0, by + 120); gr.addColorStop(0, "rgba(120,255,180,0)"); gr.addColorStop(.5, "rgba(120,255,180,.07)"); gr.addColorStop(1, "rgba(120,255,180,0)"); g.fillStyle = gr; g.fillRect(0, by - 120, W, 240);
  g.globalAlpha = .03 * Math.abs(Math.sin(t * 60)); L.fill("#fff"); g.globalAlpha = 1;
  g.restore();
  if (dot > 0 && dot < 1) L.circ(W / 2, H / 2, 10 * (1 - dot), "#dfffe9");
  L.vignette(.75);
} };

// ---------- m12 browser url → page ----------
S.m12 = { dur: 11, meta: {
  cat: "motion", title: "주소를 치면 웹사이트가 조립되는 소개 영상", poster: .62,
  desc: "브라우저 주소창에 사이트 주소가 타이핑되고, 엔터를 치면 페이지가 블록 단위로 조립돼요. 마우스 커서가 버튼을 누르는 것까지 보여 줘요.",
  prompt: `Create an 11-second vertical (1080x1920) website intro video as one HTML file with Canvas 2D. ${REC}

Site: [DOMAIN]. Brand: [BRAND]. Hero headline: "[HERO HEADLINE]". Three feature cards: [FEATURE 1], [FEATURE 2], [FEATURE 3]. CTA button: "[CTA]". Brand color: [COLOR].

Draw a browser window (traffic-light dots, rounded address bar) centered on a soft gradient background.
0–2.5s: the window pops in; the address bar types the domain at ~16 chars/s with a blinking caret; an Enter key-cap graphic presses at the end.
2.5–3s: a thin loading bar runs across the top of the page.
3–6.5s: the page assembles block by block — nav bar, hero headline (rises in), hero image block (a colored shape composition), then three feature cards slide up with a 0.15s stagger, each with a drawn icon.
6.5–8.5s: an arrow cursor moves along a curved path to the CTA button, hovers (button darkens), clicks (ripple) — a toast "[TOAST MESSAGE]" slides in at the top.
8.5–11s: the browser shrinks a bit; the domain appears big under it; fade out.

Clean modern web aesthetic, Noto Sans KR, monospace for the URL.`,
  how: "주소, 헤드라인, 기능 3개, 버튼 문구, 대표 색만 바꾸면 우리 홈페이지·스마트스토어 소개 영상이 돼요. 실제 홈페이지 캡처가 있으면 '이 구성대로 블록을 쌓아 줘'라고 붙여 주세요."
}, draw(t) {
  const g = L.g; L.vgrad("#e0e7ff", "#fce7f3");
  const url = "www.yourbrand.kr", pop = ease(t, 0, .5, E.back), sh = 1 - .1 * ease(t, 8.5, 9.3, E.io);
  g.save(); g.translate(W / 2, 900); g.scale(pop * sh, pop * sh); g.translate(-W / 2, -900);
  L.browser(70, 260, 940, 1280, "", (w, h) => {
    g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
    const lb = seg(t, 2.5, 3); if (lb > 0 && lb < 1) L.box(0, 0, w * lb, 6, 0, "#6d28d9");
    const b = i => ease(t, 3 + i * .35, 3.5 + i * .35, E.out);
    L.at(0, (1 - b(0)) * -40, 1, 0, b(0), () => { L.txt("yourbrand", 40, 70, 34, "#1e1b4b", 900, "left", INTER); ["소개", "상품", "문의"].forEach((s, i) => L.txt(s, 620 + i * 100, 70, 28, "#555", 600)); });
    L.at(0, (1 - b(1)) * 60, 1, 0, b(1), () => { L.txt("작은 가게도", 40, 220, 76, "#1e1b4b", 900); L.txt("브랜드처럼", 40, 310, 76, "#6d28d9", 900); L.txt("사진 한 장으로 시작하는 상세페이지 제작", 40, 370, 30, "#666", 500); });
    L.at(0, (1 - b(2)) * 60, 1, 0, b(2), () => { L.box(40, 410, w - 80, 330, 30, "#ede9fe"); L.circ(260, 580, 110, "#a78bfa"); L.box(420, 480, 300, 200, 24, "#6d28d9"); L.box(560, 560, 260, 140, 24, "#f472b6"); });
    ["빠른 제작", "합리적 가격", "무제한 수정"].forEach((s, i) => { const k = ease(t, 4.4 + i * .15, 4.9 + i * .15, E.back); const x = 40 + i * 290; L.at(x + 130, 900 + (1 - k) * 80, 1, 0, seg(t, 4.4 + i * .15, 4.7 + i * .15), () => { L.box(-130, -110, 260, 230, 24, "#f5f3ff"); L.icon(["bolt", "heart", "star"][i], 0, -40, 70, "#6d28d9"); L.txt(s, 0, 70, 30, "#1e1b4b", 800, "center"); }); });
    const hov = t > 7.4 ? 1 : 0, cb = ease(t, 5.3, 5.8, E.back); L.at(w / 2, h - 110, cb * (1 - .04 * env(t, 7.6, 7.9, .05, .2)), 0, cb, () => { L.box(-220, -55, 440, 110, 55, hov ? "#4c1d95" : "#6d28d9"); L.txt("무료 상담 받기", 0, 14, 40, "#fff", 900, "center"); });
    const rp = seg(t, 7.65, 8.3); if (rp > 0 && rp < 1) L.circ(w / 2 + 40, h - 100, rp * 260, `rgba(255,255,255,${.4 * (1 - rp)})`);
    const ts = ease(t, 7.9, 8.3, E.back) * (1 - ease(t, 9.6, 10)); if (ts > 0) L.at(w / 2, 130, 1, 0, ts, () => { L.box(-300, -50 - (1 - ts) * 40, 600, 100, 24, "#1e1b4b"); L.txt("상담 신청이 접수됐어요 ✓", 0, 12 - (1 - ts) * 40, 34, "#fff", 700, "center"); });
  });
  // address typing on top
  const typed = t > .5; if (typed) { g.save(); L.rr(210, 276, 770, 38, 19); g.clip(); L.type(url, 232, 304, 24, "#333", t, .6, 16, 500, "left", MONO, t < 2.6); g.restore(); }
  // cursor
  const cp = ease(t, 6.5, 7.5, E.io); if (t > 6.4 && t < 9.5) { const cx = lerp(900, 560, cp) + Math.sin(cp * Math.PI) * 80, cy = lerp(1100, 1440, cp); g.save(); g.translate(cx, cy); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 60); g.lineTo(16, 46); g.lineTo(28, 72); g.lineTo(38, 66); g.lineTo(26, 42); g.lineTo(46, 42); g.closePath(); g.fillStyle = "#111"; g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 4; g.stroke(); g.restore(); }
  g.restore();
  const ek = env(t, 1.6, 2.6, .2, .3); if (ek > 0) L.at(W / 2, 1650, 1 - .06 * env(t, 2.1, 2.4, .05, .2), 0, ek, () => { L.box(-150, -60, 300, 120, 22, "#fff", "#c7c7d1", 4); L.txt("Enter ↵", 0, 16, 44, "#333", 700, "center", INTER); });
  L.at(W / 2, 1720, 1, 0, ease(t, 9, 9.6), () => L.txt("www.yourbrand.kr", 0, 0, 64, "#1e1b4b", 800, "center", MONO));
} };

// ---------- m13 split-flap board ----------
{
  const lines = ["오늘 오후2시", "라이브 방송", "전품목 반값"], CH = "가나다라마바사아자차카타파하0123456789".split("");
  S.m13 = { dur: 11, meta: {
    cat: "motion", title: "공항 전광판처럼 글자가 촤르르 넘어가는 공지", poster: .7,
    desc: "검은 전광판의 글자 칸이 촤르르 넘어가다가 한 칸씩 멈추며 공지 문구가 완성돼요. 라이브 방송, 오픈 시간, 이벤트 알림에 딱이에요.",
    prompt: `Create an 11-second vertical (1080x1920) split-flap display announcement as one HTML file with Canvas 2D. ${REC}

Message lines (max 7 characters each): "[LINE 1]", "[LINE 2]", "[LINE 3]". Footer: "[BRAND / CHANNEL]".

Draw a matte black board with rows of flap tiles (dark gray rounded tiles with a thin horizontal split line through the middle and a subtle top highlight).
0–1s: the board slides in from below; all tiles show blank.
1–7s: each row flips: every tile cycles through random characters (Korean syllables and digits) — show a flip by drawing the top half folding down (scale Y from 1 to 0 on the upper half, then the next character's lower half unfolding). Tiles settle on their final character left to right with ~0.08s stagger; rows start 1.2s apart. Add a tiny shake to each tile when it locks.
7–9s: the finished message holds; an amber "LIVE" lamp blinks at the top corner.
9–11s: footer text slides in; fade out.

Typeface: bold Korean sans in warm white on the tiles. Background: dark charcoal with a soft spotlight on the board.`,
    how: "세 줄 문구(줄마다 7글자 이하)와 맨 아래 채널 이름만 바꾸면 돼요. 라이브커머스 예고, 매장 오픈 시간, 이벤트 마감 공지에 잘 맞아요."
  }, draw(t) {
    const g = L.g; L.fill("#121212"); L.glow(W / 2, 900, 900, "#ffb703", .07);
    const up = ease(t, 0, .9, E.out); g.save(); g.translate(0, (1 - up) * 1400);
    L.box(60, 420, 960, 1000, 30, "#0a0a0a", "#2a2a2a", 3);
    const tw = 118, th = 170, gap = 10;
    lines.forEach((ln, row) => { const chars = [...ln.padEnd(7, " ")]; const n = 7, x0 = W / 2 - (n * tw + (n - 1) * gap) / 2, y = 520 + row * 280;
      chars.forEach((ch, i) => { const lock = 1.6 + row * 1.2 + i * .08 + .6; const x = x0 + i * (tw + gap); const locked = t >= lock;
        let c = " ", flip = 0; if (t > 1 + row * 1.2 && !locked) { const r = L.rng(Math.floor(t * 18) * 31 + i * 7 + row); c = CH[Math.floor(r() * CH.length)]; flip = (t * 18) % 1; } else if (locked) c = ch;
        const shake = locked ? Math.sin((t - lock) * 60) * 4 * (1 - seg(t, lock, lock + .2)) : 0;
        g.save(); g.translate(x + shake, y);
        L.box(0, 0, tw, th, 12, "#262626"); L.box(4, 4, tw - 8, th / 2 - 6, 10, "#2e2e2e");
        if (c !== " ") L.txt(c, tw / 2, th / 2 + 34, 96, "#f5ebe0", 900, "center");
        if (flip > 0 && flip < .5) { g.save(); g.translate(0, th / 2); g.scale(1, 1 - flip * 2); g.translate(0, -th / 2); g.beginPath(); g.rect(0, 0, tw, th / 2); g.clip(); L.box(0, 0, tw, th, 12, "#2b2b2b"); g.restore(); }
        L.line(0, th / 2, tw, th / 2, "#0a0a0a", 4, "butt"); g.restore(); }); });
    if (t > 7 && Math.floor(t * 2.5) % 2 === 0) { L.circ(150, 470, 18, "#ff3b30"); L.glow(150, 470, 60, "#ff3b30", .6); } L.txt("LIVE", 182, 484, 40, t > 7 ? "#ff3b30" : "#444", 800, "left", INTER);
    g.restore();
    L.at(W / 2, 1640, 1, 0, ease(t, 9, 9.5), () => { L.txt("하루공방 라이브", 0, 0, 64, "#f5ebe0", 900, "center"); L.txt("알림 설정하고 기다려 주세요", 0, 80, 38, "#a8a29e", 600, "center"); });
  } };
}

// ---------- m14 cafe menu ----------
{
  const menu = [["흑임자 라떼", "6,300", ["#3d3a36", "#d6cfc4", "#f3efe9"]], ["유자 에이드", "5,800", ["#ffd166", "#ffe8a3", "#fff8e1"]], ["말차 크림 콜드브루", "6,800", ["#2b1b12", "#7fb069", "#e6f2dd"]]];
  function cup(cx, by, layers, fill) {
    const g = L.g, w = 230, h = 380, x = cx - w / 2, y = by - h;
    g.save(); g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w - 30, by); g.lineTo(x + 30, by); g.closePath(); g.clip();
    let acc = by; const hs = [.45, .35, .2]; layers.forEach((c, i) => { const hh = h * hs[i] * fill; L.box(x - 10, acc - hh, w + 20, hh + 2, 0, c); acc -= hh; }); g.restore();
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w - 30, by); g.lineTo(x + 30, by); g.closePath(); g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 6; g.stroke();
    L.box(x - 14, y - 26, w + 28, 30, 10, "rgba(255,255,255,.85)"); L.line(cx + 40, y - 26, cx + 80, y - 140, "#e76f51", 14);
  }
  S.m14 = { dur: 11, meta: {
    cat: "motion", title: "음료가 차오르는 카페 신메뉴 소개", poster: .35,
    desc: "음료 잔이 층층이 차오르고 메뉴 카드가 옆으로 넘어가며 신메뉴 3개를 소개해요. 카페·디저트 가게 SNS와 매장 모니터용이에요.",
    prompt: `Create an 11-second vertical (1080x1920) new-menu promo for a cafe as one HTML file with Canvas 2D. ${REC}

Cafe: [CAFE NAME]. Three drinks (name, price, 3 layer colors bottom→top): [DRINK 1], [DRINK 2], [DRINK 3]. Badge: "[NEW / 시즌 한정]".

Layout: one drink per screen, carousel style.
For each drink (~3.2s): a clear glass (trapezoid outline, lid and straw) sits center; its liquid layers pour in bottom to top with a wobbling surface line (sine wave) and a few rising bubbles; the background color shifts to match the drink; the name rises in under the glass and the price slides in on a rounded tag; small ingredient dots float around.
Between drinks, the whole layout slides left like a card carousel (0.5s ease-in-out) with page dots at the bottom.
End (9.8–11s): the three glasses line up side by side, the cafe name and "[OPEN INFO]" appear; fade out.

Flat illustration style, pastel tones, Noto Sans KR.`,
    how: "카페 이름, 음료 3개의 이름·가격·층별 색만 바꾸면 돼요. 디저트라면 '잔 대신 접시 위 케이크가 층층이 쌓이게'처럼 바꿔 달라고 하세요."
  }, draw(t) {
    const g = L.g, per = 3.2, i = Math.min(2, Math.floor(t / per)), lt = t - i * per;
    const bgs = ["#efe9e1", "#fff3cf", "#e4f1dc"]; const sl = i < 2 ? ease(lt, 2.8, 3.3, E.io) : 0;
    L.fill(L.mix(bgs[i], bgs[Math.min(2, i + 1)], sl));
    const fin = ease(t, 9.8, 10.4, E.io);
    if (fin < 1) { g.save(); g.globalAlpha = 1 - fin;
      [i, i + 1].forEach((j, n) => { if (j > 2) return; const ox = (n - sl) * W, ft = n === 0 ? lt : 0; const [nm, pr, lay] = menu[j];
        g.save(); g.translate(ox, 0);
        L.at(W / 2 + 260, 360, 1, .15, 1, () => { L.box(-110, -40, 220, 80, 40, "#e63946"); L.txt("NEW", 0, 16, 40, "#fff", 900, "center", INTER); });
        cup(W / 2, 1220, lay, n === 0 ? ease(ft, .2, 1.6, E.io) : 0);
        const r = L.rng(j + 2); for (let b = 0; b < 10; b++) { const bx = W / 2 - 80 + r() * 160, by = 1200 - ((ft * 200 + r() * 300) % 330); if (n === 0 && ft > .6) L.circ(bx, by, 4 + r() * 6, "rgba(255,255,255,.6)"); }
        for (let d = 0; d < 6; d++) { const a = d / 6 * Math.PI * 2 + t * .4; L.circ(W / 2 + Math.cos(a) * 380, 1000 + Math.sin(a) * 300, 18, L.alpha(lay[1].length === 7 ? lay[1] : "#cccccc", .7)); }
        const nk = ease(ft, 1, 1.6, E.out); L.at(W / 2, 1420 + (1 - nk) * 40, 1, 0, n === 0 ? nk : 1, () => L.fit(nm, 0, 0, 84, 920, "#2b2d42", 900, "center"));
        const pk = ease(ft, 1.4, 1.9, E.back); L.at(W / 2, 1540, n === 0 ? pk : 1, 0, 1, () => { L.box(-150, -55, 300, 90, 45, "#2b2d42"); L.txt(pr + "원", 0, 8, 44, "#fff", 800, "center"); });
        g.restore(); });
      L.txt("이번 시즌 신메뉴", W / 2, 230, 56, "#2b2d42", 900, "center");
      [0, 1, 2].forEach(d => L.circ(W / 2 - 40 + d * 40, 1760, d === i ? 12 : 8, d === i ? "#2b2d42" : "rgba(43,45,66,.3)"));
      g.restore(); }
    if (fin > 0) { g.save(); g.globalAlpha = fin; menu.forEach(([nm, pr, lay], j) => { g.save(); g.translate((j - 1) * 330, 0); g.translate(W / 2, 1000); g.scale(.75, .75); g.translate(-W / 2, -1000); cup(W / 2, 1180, lay, 1); g.restore(); });
      L.txt("카페 하루", W / 2, 1380, 90, "#2b2d42", 900, "center"); L.txt("매일 10:00 – 21:00 · 성수동", W / 2, 1460, 40, "#6c757d", 600, "center"); g.restore(); }
  } };
}

// ---------- m15 poster pop-out ----------
S.m15 = { dur: 10, meta: {
  cat: "motion", title: "액자 속 제품이 밖으로 튀어나오는 포스터", poster: .55,
  desc: "벽에 걸린 포스터 속 풍경이 살아 움직이다가, 제품이 액자 테두리를 넘어 앞으로 튀어나와요. 입체감 있는 SNS 광고 첫 장면용이에요.",
  prompt: `Create a 10-second vertical (1080x1920) "out of the frame" poster animation as one HTML file with Canvas 2D. ${REC}

Product: [PRODUCT — draw as a simple shape, e.g. bottle/can/box] in [COLOR]. Poster scene: [SCENE — e.g. 맑은 하늘과 언덕]. Headline: "[HEADLINE]".

0–1.5s: a framed poster hangs on a plain wall (thick white mat, thin dark frame, soft cast shadow). Inside, a flat illustrated landscape with parallax layers (sky gradient, sun, two hill layers, drifting clouds).
1.5–4s: the camera slowly pushes in; the layers move at different speeds; the product sits small inside the scene.
4–5.5s: the product scales up and moves toward the viewer, breaking the frame — draw it AFTER the frame so it overlaps the border, add a stronger shadow on the wall and a few paper-shard pieces at the break point.
5.5–8s: the product floats gently in front (bob ±10px) while the headline rises in below the frame.
8–10s: brand line appears; fade out.

Flat vector illustration, warm palette, Noto Sans KR.`,
  how: "제품 모양과 색, 포스터 속 풍경, 헤드라인만 바꾸면 돼요. 실제 제품 누끼(PNG)가 있으면 '이 이미지를 튀어나오는 제품으로 써 줘'라고 하세요."
}, draw(t) {
  const g = L.g; L.vgrad("#f2e9df", "#e6d8c8");
  const push = 1 + .12 * ease(t, 1, 5, E.io), fx = 190, fy = 380, fw = 700, fh = 960;
  g.save(); g.translate(W / 2, 860); g.scale(push, push); g.translate(-W / 2, -860);
  g.save(); g.shadowColor = "rgba(60,40,20,.3)"; g.shadowBlur = 50; g.shadowOffsetY = 30; L.box(fx - 30, fy - 30, fw + 60, fh + 60, 6, "#2b2118"); g.restore(); L.box(fx - 18, fy - 18, fw + 36, fh + 36, 2, "#fffdf8");
  g.save(); g.beginPath(); g.rect(fx + 40, fy + 40, fw - 80, fh - 80); g.clip();
  const ix = fx + 40, iy = fy + 40, iw = fw - 80, ih = fh - 80; const gr = g.createLinearGradient(0, iy, 0, iy + ih); gr.addColorStop(0, "#7ec8e3"); gr.addColorStop(1, "#fde2c4"); g.fillStyle = gr; g.fillRect(ix, iy, iw, ih);
  L.circ(ix + iw * .7 - t * 6, iy + 260, 90, "#ffd166");
  for (let c = 0; c < 3; c++) { const x = ((ix + c * 260 + t * (30 + c * 15)) % (iw + 300)) + ix - 150; L.box(x, iy + 140 + c * 90, 180, 50, 25, "rgba(255,255,255,.9)"); }
  g.beginPath(); g.moveTo(ix, iy + ih * .62); for (let x = 0; x <= iw; x += 20) g.lineTo(ix + x, iy + ih * .62 - Math.sin(x / 120 + t * .3) * 40 - 20); g.lineTo(ix + iw, iy + ih); g.lineTo(ix, iy + ih); g.fillStyle = "#88b04b"; g.fill();
  g.beginPath(); g.moveTo(ix, iy + ih * .78); for (let x = 0; x <= iw; x += 20) g.lineTo(ix + x, iy + ih * .78 - Math.sin(x / 90 + 2 - t * .5) * 30); g.lineTo(ix + iw, iy + ih); g.lineTo(ix, iy + ih); g.fillStyle = "#4f7942"; g.fill();
  g.restore();
  const pop = ease(t, 4, 5.4, E.back), bob = Math.sin(t * 2.4) * 10 * seg(t, 5.4, 6);
  const px = W / 2, py = lerp(fy + fh - 120, 1460, pop) + bob, ps = lerp(.45, 1.25, pop);
  if (pop > .1) { g.save(); g.globalAlpha = .25 * pop; g.filter = "blur(20px)"; L.box(px - 140 * ps, fy + fh + 20, 280 * ps, 50, 25, "#3b2a1a"); g.restore(); }
  const r = L.rng(3); if (pop > 0 && pop < 1.2) for (let i = 0; i < 10; i++) { const k = seg(t, 4.3, 5.6); if (k <= 0 || k >= 1) break; g.save(); g.translate(px + (r() - .5) * 300 + (r() - .5) * 500 * k, fy + fh - 60 + (r() - .5) * 100 + 600 * k * k); g.rotate(r() * 6 + k * 4); g.globalAlpha = 1 - k; L.box(-20, -12, 40, 24, 2, r() > .5 ? "#fffdf8" : "#88b04b"); g.restore(); }
  g.save(); g.translate(px, py); g.scale(ps, ps); g.translate(-px, -py); L.bottle(px, py, 260, 520, "#e76f51", "#264653", "SUN", "#e76f51"); g.restore();
  g.restore();
  L.at(W / 2, 1640, 1, 0, ease(t, 5.6, 6.2), () => L.txt("햇살 담은 선크림", 0, 0, 80, "#2b2118", 900, "center"));
  L.at(W / 2, 1720, 1, 0, ease(t, 8, 8.5), () => L.txt("SUN DAY · 산뜻한 무기자차 SPF50+", 0, 0, 38, "#7a6650", 600, "center"));
} };

// ---------- m16 gradient blob mood loop ----------
{
  const words = ["천천히", "깊게", "오래"];
  S.m16 = { dur: 12, meta: {
    cat: "motion", title: "흐르는 그라디언트 위 감성 문구 루프", poster: .25,
    desc: "부드러운 색 덩어리가 천천히 섞이며 흐르는 배경 위로 짧은 감성 문구가 바뀌어요. 끝과 처음이 이어지는 루프라 매장 모니터나 배경 영상으로 좋아요.",
    prompt: `Create a 12-second seamless-loop vertical (1080x1920) mood video as one HTML file with Canvas 2D. ${REC} Frame 0 and frame 12s must look identical.

Brand: [BRAND]. Words that cycle: "[WORD 1]", "[WORD 2]", "[WORD 3]". Small caption: "[CAPTION]". Palette: [3–4 colors].

Background: 5 large soft color blobs (radial gradients with big radius) moving on closed Lissajous paths whose periods divide 12s exactly, blended with 'screen' or 'lighter'; then a heavy blur (ctx.filter = "blur(80px)") and fine film grain on top.
Center: an elegant serif headline. Each word lasts 4s: it fades in with letter-spacing contracting from wide to normal and a slight upward drift, holds, and fades out with a soft blur.
Bottom: the brand name in small caps-style tracking and the caption.

Calm, premium, slow. No hard cuts.`,
    how: "단어 3개, 브랜드 이름, 색 3~4가지만 바꾸면 돼요. 끝과 처음이 이어지는 루프라 매장 TV나 행사 배경 화면으로 반복 재생하기 좋아요."
  }, draw(t) {
    const g = L.g; L.fill("#1b1430"); const T = 12, w = 2 * Math.PI / T;
    const cols = ["#ff7eb3", "#7afcff", "#feff9c", "#b28dff", "#ff9f68"];
    g.save(); g.filter = "blur(70px)"; g.globalCompositeOperation = "lighter";
    cols.forEach((c, i) => { const x = W / 2 + Math.sin(w * t * (i % 2 + 1) + i * 1.3) * 380, y = H / 2 + Math.cos(w * t * ((i + 1) % 3 + 1) + i) * 650; L.glow(x, y, 620, c, .55); });
    g.restore();
    const i = Math.floor(t / 4) % 3, lt = t % 4, a = env(lt, .2, 3.8, .9, .9), sp = lerp(40, 6, ease(lt, .2, 1.6, E.out));
    g.save(); g.globalAlpha = a; L.font(170, 900, SERIF); g.fillStyle = "#fff"; g.textAlign = "center"; g.letterSpacing = sp + "px"; g.fillText(words[i], W / 2, H / 2 + 50 - ease(lt, 0, 2) * 30); g.restore();
    g.save(); g.letterSpacing = "18px"; L.txt("HARU TEA", W / 2, 1640, 40, "rgba(255,255,255,.85)", 700, "center", INTER); g.letterSpacing = "0px"; L.txt("하루 끝에 마시는 차", W / 2, 1710, 34, "rgba(255,255,255,.7)", 500, "center"); g.restore();
    L.grain(t, .07);
  }, fin: 0, fout: 0 };
}

// ---------- m17 split screen features ----------
{
  const F = [["10초 충전", "bolt", "#ffbe0b", "#1d3557"], ["생활 방수", "heart", "#4cc9f0", "#03045e"], ["재생 소재", "star", "#80ed99", "#1b4332"]];
  S.m17 = { dur: 10, meta: {
    cat: "motion", title: "화면을 3칸으로 나눠 기능 3개를 한 번에", poster: .55,
    desc: "화면이 가로로 세 칸으로 갈라지며 칸마다 기능 하나씩 아이콘 애니메이션과 함께 소개돼요. 마지막에 칸이 합쳐지며 제품 이름이 나와요.",
    prompt: `Create a 10-second vertical (1080x1920) three-panel feature video as one HTML file with Canvas 2D. ${REC}

Product: [PRODUCT NAME]. Features (title, icon idea, accent, panel color): [FEATURE 1], [FEATURE 2], [FEATURE 3].

0–1s: the screen splits into three horizontal bands — each band wipes in from alternating sides (left/right/left).
1–6.5s: each panel animates its own mini-illustration, staggered by 0.6s:
  panel 1 a battery that fills in quick steps with a lightning bolt pulsing,
  panel 2 water drops falling and bouncing off a shield shape,
  panel 3 a leaf/loop arrow rotating with small particles.
  Each panel's title slams in on the right with a big index number ("01", "02", "03") in outline style.
6.5–8s: the bands slide together and merge into one solid color; the product name scales in center.
8–10s: tagline "[TAGLINE]" fades in; fade out.

Bold, sporty, saturated colors; Noto Sans KR Black + Inter for numbers.`,
    how: "기능 3개의 이름과 색만 바꾸면 돼요. 칸마다 들어갈 그림(배터리·물방울·잎사귀)을 '우리 기능에 맞는 그림으로 바꿔 줘'라고 하면 알아서 그려 줘요."
  }, draw(t) {
    const g = L.g; L.fill("#0b0b0b"); const bh = H / 3, merge = ease(t, 6.5, 7.6, E.io);
    F.forEach(([title, ic, acc, bg], i) => {
      const k = ease(t, i * .15, .8 + i * .15, E.out), side = i % 2 ? 1 : -1, y = i * bh;
      g.save(); g.translate(side * (1 - k) * W, 0); g.beginPath(); g.rect(0, y + merge * (bh / 2 - i * bh + bh) * 0, W, bh + 1); g.clip();
      L.box(0, y, W, bh + 1, 0, L.mix(bg, "#14213d", merge));
      g.globalAlpha = 1 - merge; const t0 = 1 + i * .6, lt = t - t0, cx = 270, cy = y + bh / 2;
      if (i === 0) { L.box(cx - 90, cy - 150, 180, 300, 26, null, acc, 10); L.box(cx - 35, cy - 175, 70, 26, 8, acc); const lv = Math.min(4, Math.floor(clamp(lt * 3, 0, 4))); for (let s = 0; s < lv; s++) L.box(cx - 66, cy + 100 - s * 66, 132, 54, 10, acc); L.icon("bolt", cx, cy, 120 * (1 + .1 * Math.sin(t * 10)), "#fff"); }
      if (i === 1) { g.beginPath(); g.moveTo(cx, cy - 140); g.quadraticCurveTo(cx + 130, cy - 120, cx + 120, cy - 20); g.quadraticCurveTo(cx + 100, cy + 110, cx, cy + 160); g.quadraticCurveTo(cx - 100, cy + 110, cx - 120, cy - 20); g.quadraticCurveTo(cx - 130, cy - 120, cx, cy - 140); g.fillStyle = L.alpha(acc, .3); g.fill(); g.strokeStyle = acc; g.lineWidth = 10; g.stroke();
        for (let d = 0; d < 6; d++) { const ph = ((lt * 1.4 + d / 6) % 1 + 1) % 1; const dx = cx - 160 + d * 64, dy = lerp(y + 10, cy - 150 + Math.abs(dx - cx) * .4, Math.min(1, ph * 1.6)); const bounce = ph > .62 ? (ph - .62) : 0; L.circ(dx + bounce * (dx - cx) * 2, dy - Math.sin(bounce * 8) * 60, 14 * (1 - bounce), acc); } }
      if (i === 2) { g.save(); g.translate(cx, cy); g.rotate(lt * 1.5); for (let a = 0; a < 3; a++) { g.rotate(Math.PI * 2 / 3); g.beginPath(); g.arc(0, 0, 120, 0, 1.6); g.strokeStyle = acc; g.lineWidth = 18; g.lineCap = "round"; g.stroke(); L.icon("arrow", 120 * Math.cos(1.6), 120 * Math.sin(1.6), 50, acc, 9); } g.restore(); L.icon("heart", cx, cy, 60, "#fff"); }
      const tk = ease(t, t0, t0 + .35, E.back); L.at(560, cy, lerp(1.5, 1, tk), 0, seg(t, t0, t0 + .2), () => { L.font(130, 800, INTER); g.strokeStyle = acc; g.lineWidth = 4; g.textAlign = "left"; g.strokeText("0" + (i + 1), 0, -20); L.txt(title, 0, 90, 80, "#fff", 900); });
      g.restore();
    });
    if (merge > 0) { const s = ease(t, 7.2, 7.8, E.back); L.at(W / 2, H / 2, s, 0, s, () => { L.txt("RUNNER BAND", 0, 0, 120, "#fff", 800, "center", INTER); }); L.at(W / 2, H / 2 + 110, 1, 0, ease(t, 8, 8.5), () => L.txt("매일 차는 스마트밴드", 0, 0, 52, "#ffbe0b", 800, "center")); }
  } };
}

// ---------- m18 notification flood ----------
{
  const N = [["주문 알림", "새 주문이 들어왔어요 · 텀블러 2개"], ["SNS 알림", "회원님의 릴스에 좋아요 128개"], ["주문 알림", "새 주문이 들어왔어요 · 텀블러 1개"], ["채팅 문의", "문의: 각인 서비스 되나요?"], ["주문 알림", "새 주문이 들어왔어요 · 세트 3개"], ["리뷰 알림", "★★★★★ 새 리뷰가 등록됐어요"], ["주문 알림", "새 주문이 들어왔어요 · 텀블러 4개"]];
  S.m18 = { dur: 11, meta: {
    cat: "motion", title: "잠금화면에 주문 알림이 쏟아지는 영상", poster: .66,
    desc: "휴대폰 잠금화면에 주문·좋아요·문의 알림이 계속 쌓이고, 주문 수 카운터가 올라가요. '이거 하고 나서 생긴 일' 같은 후킹 영상에 좋아요.",
    prompt: `Create an 11-second vertical (1080x1920) "notification flood" video as one HTML file with Canvas 2D. ${REC}

Story hook: "[HOOK — e.g. 광고 켜고 30분 뒤]". Notifications (app name, message): [N1], [N2], … (7 items). Result line: "[RESULT]".

A phone lock screen fills most of the frame: blurred colorful wallpaper, big clock "[TIME]" and date.
0–1.5s: the hook text sits above the phone; the clock ticks a minute forward.
1.5–8s: notifications drop in from the top one after another, each 0.85s apart, accelerating slightly. Each card is a frosted rounded rectangle with an app icon square, app name, "지금", and message. New cards push older ones down with spring easing; the phone buzzes (2px shake) on each arrival. A counter badge "주문 N건" in the corner increments when an order notification lands.
8–9.5s: notifications compress into a stacked pile; the counter scales up big.
9.5–11s: result line and brand name; fade out.

iOS-like look, Noto Sans KR. All notification text is example content to be replaced.`,
    how: "알림 7개의 앱 이름과 문구를 우리 상황으로 바꾸고, 첫 문장(후킹)과 결과 문구를 넣으면 돼요. 숫자는 실제로 있었던 일로만 넣어 주세요."
  }, draw(t) {
    const g = L.g; L.fill("#111"); const buzz = N.reduce((a, _, i) => a + env(t, 1.5 + i * .85, 1.75 + i * .85, .02, .2), 0);
    L.at(W / 2, 200, 1, 0, ease(t, 0, .6), () => L.txt("광고 켜고 30분 뒤", 0, 0, 72, "#fff", 900, "center"));
    g.save(); g.translate(Math.sin(t * 120) * 2 * buzz, 0);
    L.phone(W / 2, 1060, 760, 1540, (w, h) => {
      const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#5f0f40"); gr.addColorStop(.5, "#9a031e"); gr.addColorStop(1, "#fb8b24"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      L.txt(t < 1 ? "9:41" : "9:42", w / 2, 300, 170, "rgba(255,255,255,.95)", 500, "center", INTER); L.txt("10월 21일 화요일", w / 2, 150, 34, "rgba(255,255,255,.85)", 600, "center");
      const pile = ease(t, 8, 8.8, E.io);
      N.forEach(([app, msg], i) => { const t0 = 1.5 + i * .85, k = ease(t, t0, t0 + .45, E.back); if (k <= 0) return;
        const later = N.filter((_, j) => j > i && t > 1.5 + j * .85).length; const yy = lerp(400 + later * 150, 400 + Math.min(later, 3) * 22, pile);
        const y = lerp(-200, yy, k), sc = lerp(1, 1 - Math.min(later, 3) * .04, pile);
        g.save(); g.translate(w / 2, y + 65); g.scale(sc, sc); g.globalAlpha = pile > 0 && later > 3 ? 1 - pile : 1;
        L.box(-w / 2 + 24, -65, w - 48, 130, 30, "rgba(255,255,255,.82)"); L.box(-w / 2 + 50, -40, 80, 80, 20, app === "주문 알림" ? "#2ec27e" : app === "SNS 알림" ? "#e1306c" : app === "리뷰 알림" ? "#ffb703" : "#fee500");
        L.txt(app, -w / 2 + 150, -14, 26, "#333", 800); L.txt("지금", w / 2 - 50, -14, 24, "#777", 500, "right"); L.fit(msg, -w / 2 + 150, 30, 30, w - 230, "#111", 600, "left");
        g.restore(); });
    });
    g.restore();
    const orders = [0, 2, 4, 6].filter(i => t > 1.75 + i * .85).length * 0 + [0, 2, 4, 6].reduce((a, i) => a + (t > 1.75 + i * .85 ? [2, 1, 3, 4][[0, 2, 4, 6].indexOf(i)] : 0), 0);
    const big = ease(t, 8.3, 9, E.back); L.at(lerp(860, W / 2, big), lerp(330, 1000, big), 1 + big * 1.2, 0, seg(t, 1.6, 2), () => { L.box(-130, -50, 260, 100, 50, "#2ec27e"); L.txt(`주문 ${orders}건`, 0, 16, 44, "#fff", 900, "center"); });
    L.at(W / 2, 1780, 1, 0, ease(t, 9.5, 10), () => L.txt("릴스 한 편이 만든 30분", 0, 0, 56, "#fff", 900, "center"));
  } };
}

// ---------- m19 checklist ----------
{
  const items = ["아침마다 머리가 붕 뜬다", "드라이 시간이 아깝다", "향 센 제품은 부담스럽다", "끈적임 없이 정리하고 싶다"];
  S.m19 = { dur: 11, meta: {
    cat: "motion", title: "'이런 분께 추천해요' 체크리스트 영상", poster: .7,
    desc: "고민 항목이 하나씩 나오며 체크 표시가 손으로 그리듯 그어지고, 다 체크되면 제품이 '정답'처럼 등장해요. 공감형 광고 도입부에 좋아요.",
    prompt: `Create an 11-second vertical (1080x1920) "checklist" ad as one HTML file with Canvas 2D. ${REC}

Title: "[이런 분께 추천해요]". Pain points (4): [PAIN 1], [PAIN 2], [PAIN 3], [PAIN 4]. Product: [PRODUCT NAME] with "[ONE-LINE SOLUTION]".

Paper-note look: off-white lined notepad background with a red margin line and a few tape strips.
0–1s: title written in a marker-like heavy font, with a hand-drawn underline that draws on.
1–7s: each pain point fades in on a line, then a checkbox gets a hand-drawn check mark (stroke drawn progressively with a slight wobble, marker color [ACCENT]) — 1.4s per item. Add a tiny pop to the checkbox when checked.
7–8.5s: all four lines get a highlighter swipe; then the note slides up.
8.5–11s: the product appears with a circled "정답!" annotation and an arrow drawn toward it; solution line below; fade out.

Hand-made, friendly feel. Noto Sans KR for text.`,
    how: "고민 4개, 제품 이름, 해결 문장만 바꾸면 돼요. 고객 리뷰나 문의에서 자주 나오는 말을 고민 항목으로 쓰면 공감이 훨씬 커요."
  }, draw(t) {
    const g = L.g; L.fill("#fbf8f1"); const up = ease(t, 7.8, 8.6, E.io) * 760;
    g.save(); g.translate(0, -up);
    for (let y = 300; y < H + 800; y += 110) L.line(0, y, W, y, "#d6e4f0", 3); L.line(130, 0, 130, H + 800, "#f4a3a3", 4);
    L.box(380, 60, 320, 70, 6, "rgba(255,214,102,.6)");
    L.txt("이런 분께 추천해요", 170, 260, 74, "#22223b", 900); const ul = ease(t, .4, 1.1, E.io); g.beginPath(); for (let x = 0; x <= 620 * ul; x += 10) g.lineTo(170 + x, 290 + Math.sin(x / 30) * 4); g.strokeStyle = "#ef476f"; g.lineWidth = 10; g.lineCap = "round"; g.stroke();
    items.forEach((s, i) => { const t0 = 1 + i * 1.4, y = 520 + i * 220, k = ease(t, t0, t0 + .4);
      L.at(0, 0, 1, 0, k, () => { const hl = ease(t, 7 + i * .12, 7.4 + i * .12, E.io); if (hl > 0) L.box(240, y - 60, (L.tw(s, 52, 700) + 40) * hl, 76, 6, "rgba(255,214,102,.55)");
        const p = 1 + .15 * env(t, t0 + .5, t0 + .8, .05, .25); L.at(185, y - 20, p, 0, 1, () => L.box(-35, -35, 70, 70, 10, "#fff", "#22223b", 5));
        L.txt(s, 260, y, 52, "#22223b", 700);
        const ck = seg(t, t0 + .5, t0 + .95); if (ck > 0) { const pts = [[160, y - 22], [180, y - 2], [225, y - 70]]; g.beginPath(); g.moveTo(...pts[0]); const a = Math.min(1, ck * 2), b = Math.max(0, ck * 2 - 1); g.lineTo(lerp(pts[0][0], pts[1][0], a), lerp(pts[0][1], pts[1][1], a)); if (b > 0) g.lineTo(lerp(pts[1][0], pts[2][0], b) + Math.sin(b * 9) * 2, lerp(pts[1][1], pts[2][1], b)); g.strokeStyle = "#ef476f"; g.lineWidth = 14; g.lineCap = "round"; g.lineJoin = "round"; g.stroke(); } }); });
    g.restore();
    const pk = ease(t, 8.5, 9.1, E.back); if (pk > 0) { L.at(W / 2, 1500, pk, 0, pk, () => L.bottle(0, 0, 220, 470, "#b8c0ff", "#22223b", "CALM", "#5a4fcf"));
      const c = seg(t, 9, 9.6); g.beginPath(); g.ellipse(W / 2 + 270, 1080, 150, 80, -.1, 0, c * Math.PI * 2); g.strokeStyle = "#ef476f"; g.lineWidth = 8; g.stroke(); if (c > .5) L.txt("정답!", W / 2 + 270, 1100, 60, "#ef476f", 900, "center");
      const a = seg(t, 9.3, 9.8); if (a > 0) L.line(W / 2 + 220, 1160, lerp(W / 2 + 220, W / 2 + 140, a), lerp(1160, 1240, a), "#ef476f", 8);
      L.at(W / 2, 1700, 1, 0, ease(t, 9.4, 9.9), () => { L.txt("카밍 헤어 밤", 0, 0, 70, "#22223b", 900, "center"); L.txt("바르고 5초, 하루 종일 차분하게", 0, 74, 40, "#4a4e69", 600, "center"); }); }
  } };
}

// ---------- m20 endcard ----------
S.m20 = { dur: 9, meta: {
  cat: "motion", title: "구독·좋아요·알림을 누르는 엔드카드", poster: .75,
  desc: "프로필 원이 나오고 마우스 커서가 구독 버튼, 좋아요, 알림 종을 차례로 눌러요. 유튜브·쇼츠 영상 마지막 5~9초에 붙이는 엔드카드예요.",
  prompt: `Create a 9-second vertical (1080x1920) channel end card as one HTML file with Canvas 2D. ${REC}

Channel: [CHANNEL NAME], handle "[@HANDLE]", profile color [COLOR], one-liner "[WHAT THE CHANNEL IS ABOUT]". Next video teaser text: "[NEXT VIDEO TITLE]".

0–1.2s: a profile circle (initial letter inside) scales in with a ring that draws around it; channel name and handle rise in under it.
1.2–5.5s: three buttons sit in a row: a red pill "구독", a thumbs/heart "좋아요", a bell "알림". An arrow cursor moves to each in turn along smooth curves and clicks: 구독 turns gray with text "구독중" and a small check; 좋아요 fills and bursts small hearts; 알림 bell rings (rotates ±20° a few times) and shows a tiny badge.
5.5–8s: a "다음 영상" card slides up with a thumbnail block and the next-video title; a progress ring fills around a play icon.
8–9s: fade out.

Clean dark background with subtle glow in the channel color, Noto Sans KR.`,
  how: "채널 이름, 핸들, 색, 다음 영상 제목만 바꾸면 돼요. 쇼츠 마지막에 붙이거나, 가로 영상이면 '16:9로 바꿔 줘'라고 하면 돼요."
}, draw(t) {
  const g = L.g; L.fill("#0f0f12"); L.glow(W / 2, 600, 700, "#ff2d55", .15);
  const p = ease(t, 0, .6, E.back); L.at(W / 2, 520, p, 0, 1, () => { L.circ(0, 0, 150, "#ff2d55"); L.txt("하", 0, 52, 150, "#fff", 900, "center"); });
  const ring = seg(t, .2, 1); g.beginPath(); g.arc(W / 2, 520, 172, -Math.PI / 2, -Math.PI / 2 + ring * Math.PI * 2); g.strokeStyle = "#ffd60a"; g.lineWidth = 8; g.stroke();
  L.rise("하루공방 TV", W / 2, 790, 72, "#fff", t, .5, .05, .5); L.at(W / 2, 860, 1, 0, ease(t, .8, 1.2), () => L.txt("@harugongbang · 작은 가게 성장 기록", 0, 0, 34, "#9a9aa3", 600, "center"));
  const bx = [W / 2 - 300, W / 2, W / 2 + 300], by = 1060, clicks = [2, 3.2, 4.4];
  const sub = t > clicks[0] + .1; L.at(bx[0], by, 1 - .06 * env(t, clicks[0], clicks[0] + .25, .05, .2), 0, ease(t, 1, 1.4), () => { L.box(-130, -55, 260, 110, 55, sub ? "#3a3a40" : "#ff0033"); L.txt(sub ? "구독중 ✓" : "구독", 0, 14, 42, "#fff", 900, "center"); });
  const lk = t > clicks[1] + .1; L.at(bx[1], by, 1 + .2 * env(t, clicks[1], clicks[1] + .3, .05, .25), 0, ease(t, 1.1, 1.5), () => { L.box(-110, -55, 220, 110, 55, "#26262b"); L.icon("heart", 0, 0, 70, lk ? "#ff2d55" : "#777"); });
  if (lk) { const r = L.rng(3), k = seg(t, clicks[1] + .1, clicks[1] + 1.1); if (k < 1) for (let i = 0; i < 8; i++) { const a = r() * Math.PI * 2; g.save(); g.globalAlpha = 1 - k; L.icon("heart", bx[1] + Math.cos(a) * 160 * k, by - 40 + Math.sin(a) * 160 * k - 60 * k, 34, "#ff2d55"); g.restore(); } }
  const bl = t > clicks[2] + .1; L.at(bx[2], by, 1, 0, ease(t, 1.2, 1.6), () => { L.box(-110, -55, 220, 110, 55, "#26262b"); g.save(); g.translate(0, -30); g.rotate(bl ? Math.sin((t - clicks[2]) * 25) * .35 * (1 - seg(t, clicks[2], clicks[2] + 1)) : 0); g.translate(0, 30); L.icon("bell", 0, 0, 64, bl ? "#ffd60a" : "#777"); g.restore(); if (bl) { L.circ(40, -34, 16, "#ff2d55"); } });
  // cursor
  const path = [[W / 2 + 100, 1500], [bx[0] + 30, by + 20], [bx[1] + 30, by + 20], [bx[2] + 30, by + 20], [W / 2 + 200, 1500]], times = [1.3, clicks[0], clicks[1], clicks[2], 5.4];
  if (t > 1.3 && t < 5.6) { let j = 0; while (j < times.length - 2 && t > times[j + 1]) j++; const k = ease(t, times[j] + (j ? .15 : 0), times[j + 1], E.io); const x = lerp(path[j][0], path[j + 1][0], k), y = lerp(path[j][1], path[j + 1][1], k) - Math.sin(k * Math.PI) * 60;
    g.save(); g.translate(x, y); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 60); g.lineTo(16, 46); g.lineTo(28, 72); g.lineTo(38, 66); g.lineTo(26, 42); g.lineTo(46, 42); g.closePath(); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#111"; g.lineWidth = 4; g.stroke(); g.restore(); }
  const ck = ease(t, 5.5, 6.1, E.out); if (ck > 0) L.at(W / 2, 1480 + (1 - ck) * 300, 1, 0, ck, () => { L.box(-420, -160, 840, 320, 30, "#1c1c21"); L.box(-390, -130, 300, 260, 18, "#ff2d55"); L.circ(-240, 0, 60, null, "rgba(255,255,255,.3)", 8); g.beginPath(); g.arc(-240, 0, 60, -Math.PI / 2, -Math.PI / 2 + seg(t, 6, 8) * Math.PI * 2); g.strokeStyle = "#fff"; g.lineWidth = 8; g.stroke(); g.beginPath(); g.moveTo(-255, -25); g.lineTo(-255, 25); g.lineTo(-215, 0); g.fillStyle = "#fff"; g.fill();
    L.txt("다음 영상", -60, -60, 30, "#9a9aa3", 700); L.txt("월 매출 2배 만든", -60, 0, 44, "#fff", 900); L.txt("상세페이지 3가지", -60, 60, 44, "#fff", 900); });
} };
})();
