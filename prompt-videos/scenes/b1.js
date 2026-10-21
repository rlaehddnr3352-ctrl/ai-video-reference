// batch 1 — preview set
(() => {
const { E, ease, seg, env, lerp, clamp } = L;

// ---------- m01 logo shards reveal ----------
{
  const r = L.rng(11), tris = [];
  const R = [0, 80, 155, 225], N = 14, cx = W / 2, cy = 820;
  for (let ri = 0; ri < 3; ri++) for (let s = 0; s < N; s++) {
    const a0 = s / N * Math.PI * 2, a1 = (s + 1) / N * Math.PI * 2, P = (rad, a) => [Math.cos(a) * rad, Math.sin(a) * rad];
    const q = [P(R[ri], a0), P(R[ri], a1), P(R[ri + 1], a1), P(R[ri + 1], a0)];
    [[q[0], q[1], q[2]], [q[0], q[2], q[3]]].forEach(tri => {
      if (ri === 0 && tri === undefined) return;
      const mx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, my = (tri[0][1] + tri[1][1] + tri[2][1]) / 3, ang = Math.atan2(my, mx);
      tris.push({ tri, mx, my, ang, sx: (r() - .5) * 2600, sy: (r() - .5) * 3400, rot: (r() - .5) * 9, d: .15 + r() * 1.6 });
    });
  }
  S.m01 = { dur: 10, meta: {
    cat: "motion", title: "조각이 날아와 맞춰지는 로고 리빌", poster: .62,
    desc: "흩어진 삼각형 조각 80여 개가 날아와 로고 마크를 완성하고, 브랜드 이름과 한 줄 슬로건이 이어서 나와요.",
    prompt: `Create a 10-second vertical (1080x1920) logo reveal as one HTML file using Canvas 2D.
Expose window.render(t) that draws the frame at time t (seconds) deterministically, so I can record it frame by frame.

Brand: [BRAND NAME] / Korean name: [한글 이름] / slogan: [SLOGAN]
Colors: gradient from [COLOR 1] to [COLOR 2] on a near-black background.

Timeline
0–3.2s: about 80 triangular shards start scattered off-screen, spinning, and fly in one after another to snap into a circular logo mark (concentric rings cut into triangles). Use a back-out ease so each shard overshoots slightly.
3.2–4.2s: a diagonal light sweep passes over the finished mark; a thin ring pulses outward.
4.2–6s: the brand name rises in letter by letter under the mark, then the Korean name fades in.
6–8.5s: the slogan appears in a pill-shaped label; a soft glow breathes behind the mark.
8.5–10s: hold, then fade to black.

Style: premium and minimal, subtle film grain, vignette, bold sans-serif (Noto Sans KR Black). No stock images.`,
    how: "[BRAND NAME], [SLOGAN], 두 가지 색만 바꾸면 돼요. 로고 SVG가 있으면 같이 붙여 넣고 '이 모양 안을 삼각형 조각으로 채워서 모아줘'라고 하면 우리 로고로 맞춰져요."
  }, draw(t) {
    const g = L.g; L.fill("#08090d"); L.glow(cx, cy, 700, "#6c4dff", .25 + .1 * Math.sin(t * 2) * seg(t, 5, 6));
    tris.forEach(p => {
      const k = ease(t, p.d, p.d + 1.2, E.back), a = seg(t, p.d, p.d + .3);
      const x = lerp(p.sx, 0, k), y = lerp(p.sy, 0, k), rot = p.rot * (1 - k);
      g.save(); g.globalAlpha = a; g.translate(cx + x, cy + y); g.rotate(rot); g.translate(-p.mx * (1 - k) * 0, 0);
      g.beginPath(); p.tri.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py)); g.closePath();
      const hue = (p.ang + Math.PI) / (Math.PI * 2); g.fillStyle = L.mix("#7b61ff", "#2ee6c9", Math.abs(hue * 2 - 1) * .8 + Math.hypot(p.mx, p.my) / 900);
      g.fill(); g.strokeStyle = "rgba(8,9,13,.55)"; g.lineWidth = 2.5; g.stroke(); g.restore();
    });
    // center hole + letter
    const c = ease(t, 2.6, 3.3, E.back); if (c > 0) { L.circ(cx, cy, 78 * c, "#08090d"); L.txt("N", cx, cy + 46 * c, 130 * c, "#fff", 900, "center", INTER); }
    // light sweep
    const sw = seg(t, 3.2, 4.2); if (sw > 0 && sw < 1) { g.save(); g.beginPath(); g.arc(cx, cy, 226, 0, 7); g.clip(); const x = lerp(cx - 500, cx + 500, sw); const gr = g.createLinearGradient(x - 120, 0, x + 120, 0); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(.5, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.translate(x, cy); g.rotate(.4); g.fillRect(-120, -400, 240, 800); g.restore(); }
    const pr = seg(t, 3.3, 4.6); if (pr > 0 && pr < 1) L.circ(cx, cy, 230 + pr * 260, null, `rgba(160,140,255,${1 - pr})`, 4);
    L.rise("NOVA", cx, 1250, 150, "#fff", t, 4.2, .09, .55, 800, "center", INTER, 80);
    L.at(cx, 1340, 1, 0, ease(t, 5.2, 5.9), () => L.txt("노바 스튜디오", 0, 0, 52, "#b9b4d6", 700, "center"));
    const s = ease(t, 6, 6.7, E.back); if (s > 0) L.at(cx, 1480, s, 0, s, () => { const w = L.tw("작은 브랜드를 크게 보이게", 44, 700) + 90; L.box(-w / 2, -46, w, 92, 46, "rgba(123,97,255,.18)", "rgba(160,140,255,.7)", 2); L.txt("작은 브랜드를 크게 보이게", 0, 16, 44, "#e8e4ff", 700, "center"); });
    L.vignette(.6); L.grain(t, .05);
  } };
}

// ---------- m04 phone app demo ----------
{
  const items = [["유기농 바나나", "3,980원", "#ffd23f"], ["무항생제 달걀 10구", "6,480원", "#f4a261"], ["제주 당근 1kg", "2,990원", "#ff7f3f"], ["그릭요거트", "4,200원", "#e9ecef"]];
  function home(w, h, t, sel) {
    L.fill; const g = L.g; g.fillStyle = "#f6f7f9"; g.fillRect(0, 0, w, h);
    L.txt("오늘장보기", 40, 130, 46, "#1b1f27", 900); L.box(40, 160, w - 80, 70, 35, "#fff"); L.txt("무엇을 찾으세요?", 80, 206, 28, "#9aa1ad", 500);
    L.box(40, 260, w - 80, 220, 28, "#2ec27e"); L.txt("오늘 밤 12시 전 주문", 80, 330, 30, "#e5fff1", 700); L.txt("내일 아침 7시 도착", 80, 420, 50, "#fff", 900); L.icon("truck", w - 110, 330, 90, "rgba(255,255,255,.9)", 9);
    items.forEach((it, i) => { const x = 40 + (i % 2) * ((w - 100) / 2 + 20), y = 520 + Math.floor(i / 2) * 330, cw = (w - 100) / 2;
      const hl = sel === i ? 1 : 0; L.box(x, y, cw, 300, 26, "#fff", hl ? "#2ec27e" : null, 5);
      L.circ(x + cw / 2, y + 110, 70, it[2]); L.txt(it[0], x + 24, y + 225, 26, "#1b1f27", 700); L.txt(it[1], x + 24, y + 270, 28, "#1b1f27", 900); });
  }
  function detail(w, h, t, qty, pressed) {
    const g = L.g; g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.fillStyle = "#fff6d6"; g.fillRect(0, 0, w, 620);
    L.circ(w / 2, 340, 190, "#ffd23f"); L.txt("←", 40, 120, 48, "#1b1f27", 700);
    L.txt("유기농 바나나", 50, 720, 52, "#1b1f27", 900); L.txt("1송이 (5~7개) · 국내 후숙", 50, 780, 28, "#8a919e", 500); L.txt("3,980원", 50, 870, 56, "#1b1f27", 900);
    L.box(50, 930, 260, 84, 42, "#f1f3f5"); L.txt("−", 100, 988, 44, "#1b1f27", 700, "center"); L.txt(String(qty), 180, 988, 40, "#1b1f27", 900, "center"); L.txt("+", 260, 988, 44, "#1b1f27", 700, "center");
    const s = 1 - .05 * pressed; L.at(w / 2, h - 150, s, 0, 1, () => { L.box(-(w - 100) / 2, -55, w - 100, 110, 30, "#2ec27e"); L.txt(`장바구니 담기 · ${L.counter(3980 * qty)}원`, 0, 14, 36, "#fff", 900, "center"); });
  }
  function done(w, h, t, t0) {
    const g = L.g; g.fillStyle = "#2ec27e"; g.fillRect(0, 0, w, h);
    const k = ease(t, t0, t0 + .6, E.back); L.circ(w / 2, h * .4, 150 * k, "#fff"); g.save(); g.globalAlpha = seg(t, t0 + .3, t0 + .6); L.icon("check", w / 2, h * .4, 170, "#2ec27e", 16); g.restore();
    L.at(w / 2, h * .58, 1, 0, ease(t, t0 + .5, t0 + 1), () => { L.txt("주문 완료!", 0, 0, 62, "#fff", 900, "center"); L.txt("내일 아침 7시에 만나요", 0, 70, 32, "#e5fff1", 600, "center"); });
  }
  const cap = [[0, 3.2, "① 고르고"], [3.2, 6.6, "② 담고"], [6.6, 12, "③ 끝!"]];
  S.m04 = { dur: 12, meta: {
    cat: "motion", title: "휴대폰 속 앱 화면으로 보여 주는 3단계 사용법", poster: .4,
    desc: "휴대폰 목업 안에서 실제 앱처럼 화면이 넘어가며 '고르고 → 담고 → 주문 완료'를 보여 줘요. 손가락 탭 표시와 단계 자막이 함께 움직여요.",
    prompt: `Build a 12-second vertical (1080x1920) app demo video as one HTML file with Canvas 2D, with window.render(t) drawing frame t deterministically.

App: [APP NAME], a [WHAT THE APP DOES]. Brand color: [COLOR].
Show a realistic phone mockup in the center (rounded body, notch, soft shadow) on a light background with a big step caption above it.

Screens (draw the UI yourself with shapes and text — no screenshots):
0–3.2s  Home screen: app name, search bar, a promo banner ("[PROMO LINE]"), a 2x2 grid of product cards. A tap indicator (circle that shrinks + ripple) taps the first card, which gets a highlight border. Caption: "① 고르고".
3.2–6.6s  Slide-left transition to a detail screen: large product visual, name, price, a quantity stepper that goes 1 → 2 with taps, total price updates, then the bottom CTA button is pressed (scale 0.95). Caption: "② 담고".
6.6–9s  Cart icon badge pops with a bounce, then the screen wipes to a full-color success screen with a drawn check mark and "주문 완료!". Caption: "③ 끝!".
9–12s  Phone scales down slightly; headline "[HEADLINE]" and the app name appear below; fade out.

Motion: ease-out cubic on everything, back-ease on pops, 0.35s screen transitions. Clean Korean UI typography (Noto Sans KR).`,
    how: "[APP NAME], 화면에 나올 상품 4개, 버튼 문구만 바꾸면 우리 앱이나 스마트스토어 구매 과정 영상이 돼요. 실제 화면 캡처가 있으면 '각 화면을 이 이미지처럼 그려줘'라고 붙여 주세요."
  }, draw(t) {
    const g = L.g; L.vgrad("#eef7f1", "#dfeee6");
    const sc = 1 - .12 * ease(t, 9, 9.8, E.io), py = lerp(1010, 900, ease(t, 9, 9.8, E.io));
    L.at(W / 2, py, sc, 0, 1, () => L.phone(0, 0, 640, 1300, (w, h) => {
      const sl = ease(t, 3.2, 3.6, E.io);
      if (t < 3.7) { g.save(); g.translate(-sl * w, 0); home(w, h, t, t > 2.4 ? 0 : -1); g.restore(); }
      if (t >= 3.2 && t < 7.4) { g.save(); g.translate((1 - sl) * w, 0); const qty = t > 4.6 ? 2 : 1; detail(w, h, t, qty, env(t, 5.9, 6.2, .1, .15)); g.restore(); }
      if (t >= 7.1) { const k = ease(t, 7.1, 7.5, E.io); g.save(); g.beginPath(); g.arc(w / 2, h - 150, k * h * 1.3, 0, 7); g.clip(); done(w, h, t, 7.3); g.restore(); }
      // tap indicator
      [[2.2, 160, 660], [4.4, 260 - 18, 930 + 42], [5.8, w / 2, h - 150]].forEach(([tt, x, y]) => { const k = seg(t, tt, tt + .5); if (k > 0 && k < 1) { L.circ(x, y, 50 * (1 - k * .4), `rgba(30,30,30,${.35 * (1 - k)})`); L.circ(x, y, 50 + k * 70, null, `rgba(30,30,30,${.4 * (1 - k)})`, 4); } });
      // cart badge
      if (t > 6.2 && t < 7.4) { const b = ease(t, 6.2, 6.6, E.elastic); L.at(w - 70, 110, b, 0, 1, () => { L.icon("cart", 0, 0, 70, "#1b1f27", 7); L.circ(30, -26, 22, "#ff4d4f"); L.txt("2", 30, -16, 26, "#fff", 900, "center"); }); }
    }));
    // captions
    cap.forEach(([a, b, s], i) => { const k = env(t, a, b, .35, .3); if (k <= 0) return; L.at(W / 2, 230 + (1 - k) * 40, 1, 0, k, () => { L.txt(s, 0, 0, 96, "#123524", 900, "center"); }); });
    L.at(W / 2, 1700, 1, 0, ease(t, 9.4, 10), () => { L.txt("장보기, 3번 탭이면 끝", 0, 0, 70, "#123524", 900, "center"); L.txt("오늘장보기", 0, 80, 40, "#2ec27e", 900, "center"); });
  } };
}

// ---------- e03 donut composition ----------
{
  const parts = [["탄수화물", 41, "#ffb703"], ["단백질", 32, "#2ec27e"], ["지방", 19, "#ef476f"], ["식이섬유", 8, "#118ab2"]];
  S.e03 = { dur: 11, meta: {
    cat: "explainer", title: "도넛 차트로 보여 주는 성분·비율 설명", poster: .7,
    desc: "도넛 차트가 한 조각씩 그려지며 비율 숫자가 올라가고, 오른쪽 범례와 가운데 총합이 함께 채워져요. 성분, 예산, 시간 배분 설명에 그대로 쓸 수 있어요.",
    prompt: `Make an 11-second vertical (1080x1920) data explainer as one HTML file with Canvas 2D. window.render(t) must draw frame t deterministically.

Topic: "[TITLE — e.g. 우리 제품 한 봉지에 들어 있는 것]"
Data (label, percent, color): [LABEL A 41%], [LABEL B 32%], [LABEL C 19%], [LABEL D 8%]. Center total: [TOTAL + UNIT].

0–1.2s: title rises in at the top, small subtitle "[SUBTITLE]" fades in.
1.2–6s: a thick donut chart (radius ~300, width ~110) draws one segment at a time clockwise, each in 0.9s with ease-in-out, a 0.12s gap between segments. While each segment draws, its percentage label pops at the segment's mid-angle outside the ring, and a legend row below the chart slides in with a counting-up number.
6–8.5s: the center counter counts up to the total; the largest segment pulls outward 24px and gets a highlight caption "[KEY MESSAGE]".
8.5–11s: everything holds, a footer line "[SOURCE OR NOTE]" fades in, then fade out.

Look: warm off-white background, dark navy text, rounded caps on arcs, soft drop shadows, Noto Sans KR. Numbers in a monospaced or tabular style.`,
    how: "제목, 항목 이름 4개와 비율, 가운데 총합만 바꾸세요. 항목이 3개나 5개여도 '항목 수에 맞춰 조각을 나눠 줘'라고 하면 돼요. 비율은 합이 100이 되게 넣어 주세요."
  }, draw(t) {
    const g = L.g; L.fill("#fbf7f0"); const cx = W / 2, cy = 820, R = 300, lw = 110;
    L.rise("그린볼 샐러드 한 그릇", cx, 230, 74, "#1d2a44", t, .1, .035, .5);
    L.at(cx, 310, 1, 0, ease(t, .6, 1.2), () => L.txt("칼로리 구성 비율 (예시)", 0, 0, 38, "#7a8394", 600, "center"));
    L.circ(cx, cy, R, null, "#efe7da", lw);
    let acc = -Math.PI / 2;
    parts.forEach(([name, pct, col], i) => {
      const t0 = 1.2 + i * 1.02, k = ease(t, t0, t0 + .9, E.io), sweep = pct / 100 * Math.PI * 2;
      const pull = i === 0 ? 24 * ease(t, 6.2, 6.8, E.back) : 0, mid = acc + sweep / 2;
      if (k > 0) { g.save(); g.translate(Math.cos(mid) * pull, Math.sin(mid) * pull); g.beginPath(); g.arc(cx, cy, R, acc + .02, acc + .02 + Math.max(0, sweep - .04) * k); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = "butt"; g.stroke(); g.restore();
        const p = ease(t, t0 + .5, t0 + .9, E.back); L.at(cx + Math.cos(mid) * (R + 120 + pull), cy + Math.sin(mid) * (R + 120 + pull), p, 0, seg(t, t0 + .5, t0 + .8), () => L.txt(pct + "%", 0, 18, 52, col, 900, "center", INTER)); }
      const ly = 1300 + i * 105, lk = ease(t, t0 + .2, t0 + .7);
      L.at(0, 0, 1, 0, lk, () => { L.box(150 + (1 - lk) * 60, ly - 40, 780, 86, 22, "#fff"); L.circ(205 + (1 - lk) * 60, ly + 3, 18, col); L.txt(name, 245 + (1 - lk) * 60, ly + 16, 40, "#1d2a44", 700);
        L.txt(Math.round(pct * seg(t, t0, t0 + .9)) + "%", 890 + (1 - lk) * 60, ly + 16, 42, "#1d2a44", 900, "right", INTER); });
      acc += sweep;
    });
    const tot = Math.round(520 * ease(t, 5.6, 7.4, E.io));
    L.at(cx, cy, 1, 0, seg(t, 5.6, 6), () => { L.txt(L.counter(tot), 0, 20, 110, "#1d2a44", 900, "center", INTER); L.txt("kcal", 0, 84, 36, "#7a8394", 700, "center"); });
    const hk = ease(t, 6.6, 7.2, E.back); if (hk > 0) L.at(cx, 1185, hk, 0, hk, () => { const s = "에너지의 절반 가까이는 통곡물에서"; const w = L.tw(s, 38, 700) + 70; L.box(-w / 2, -44, w, 76, 38, "#1d2a44"); L.txt(s, 0, 7, 38, "#fff", 700, "center"); });
    L.at(cx, 1790, 1, 0, ease(t, 8.5, 9.2), () => L.txt("※ 예시 데이터 · 실제 제품 정보로 바꿔 쓰세요", 0, 0, 30, "#9aa1ad", 500, "center"));
  } };
}

// ---------- d01 3D product box turntable ----------
S.d01 = { dur: 10, three: true, meta: {
  cat: "3d", title: "3D 제품 박스가 회전하는 쇼케이스", poster: .55,
  desc: "브랜드 라벨을 입힌 3D 상자가 스튜디오 조명 아래에서 천천히 돌고, 카메라가 다가가며 제품 이름과 핵심 문구가 떠올라요.",
  prompt: `Create a 10-second vertical (1080x1920) 3D product showcase as one HTML file using Three.js (ES module from a CDN). Expose window.render(t) that sets the scene state for time t and renders one frame, so it can be captured frame by frame.

Product: a box package for "[PRODUCT NAME]" — draw each face's label on an offscreen 2D canvas and use it as a CanvasTexture (front: logo + product name + "[KEY CLAIM]", sides: color band + small text, top: logo).
Scene: dark studio, glossy floor that catches a soft reflection, key light from front-left, rim light from behind in [ACCENT COLOR], soft ambient fill, ACES tone mapping.

0–2s: camera starts wide and low; the box drops onto the turntable with a small bounce.
2–7s: the box turns a full 360° with ease-in-out while the camera slowly dollies in and rises a bit.
7–10s: the box settles front-facing; a 2D overlay shows "[PRODUCT NAME]" and "[ONE-LINE BENEFIT]" rising in; fade out.

Keep everything driven by t (no requestAnimationFrame clock) so the output is deterministic.`,
  how: "[PRODUCT NAME], 라벨 색, 앞면 문구만 바꾸면 돼요. 실제 패키지 사진이 있으면 '앞면 텍스처로 이 이미지를 써 줘'라고 하면 우리 상자가 그대로 돌아요. 병이나 캔이면 상자 대신 원기둥으로 바꿔 달라고 하세요."
}, async setup(THREE, renderer) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#0b0d12");
  const cam = new THREE.PerspectiveCamera(35, 1080 / 1920, .1, 100);
  function face(w, h, fn) { const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); fn(x, w, h); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return new THREE.MeshStandardMaterial({ map: tx, roughness: .45, metalness: .05 }); }
  const front = face(800, 1100, (x, w, h) => { x.fillStyle = "#f3ead8"; x.fillRect(0, 0, w, h); x.fillStyle = "#c8553d"; x.fillRect(0, 0, w, 170); x.fillStyle = "#fff"; x.font = "900 76px 'Noto Sans CJK KR'"; x.textAlign = "center"; x.fillText("DAILY GRAIN", w / 2, 115);
    x.fillStyle = "#2b2118"; x.font = "900 120px 'Noto Sans CJK KR'"; x.fillText("데일리", w / 2, 420); x.fillText("그레인", w / 2, 560); x.font = "700 46px 'Noto Sans CJK KR'"; x.fillStyle = "#6b5a46"; x.fillText("통곡물 그래놀라 500g", w / 2, 660);
    x.fillStyle = "#c8553d"; x.beginPath(); x.arc(w / 2, 860, 120, 0, 7); x.fill(); x.fillStyle = "#fff"; x.font = "900 54px 'Noto Sans CJK KR'"; x.fillText("당 0g", w / 2, 880); x.font = "700 30px 'Noto Sans CJK KR'"; x.fillText("첨가", w / 2, 830); });
  const side = face(300, 1100, (x, w, h) => { x.fillStyle = "#c8553d"; x.fillRect(0, 0, w, h); x.fillStyle = "#f3ead8"; x.font = "900 54px 'Noto Sans CJK KR'"; x.save(); x.translate(w / 2 + 18, h / 2); x.rotate(-Math.PI / 2); x.textAlign = "center"; x.fillText("DAILY GRAIN", 0, 0); x.restore(); });
  const top = face(800, 300, (x, w, h) => { x.fillStyle = "#e9dfc9"; x.fillRect(0, 0, w, h); x.fillStyle = "#c8553d"; x.font = "900 64px 'Noto Sans CJK KR'"; x.textAlign = "center"; x.fillText("DAILY GRAIN", w / 2, 175); });
  const geo = new THREE.BoxGeometry(1.6, 2.2, .6); const boxm = new THREE.Mesh(geo, [side, side, top, top, front, front]); boxm.castShadow = true; scene.add(boxm);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.55, .12, 64), new THREE.MeshStandardMaterial({ color: "#1a1d24", roughness: .25, metalness: .6 })); plate.receiveShadow = true; scene.add(plate);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: "#0e1016", roughness: .35, metalness: .3 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -.07; floor.receiveShadow = true; scene.add(floor);
  scene.add(new THREE.HemisphereLight("#cfd8ff", "#120d08", .55));
  const key = new THREE.DirectionalLight("#fff3e0", 2.6); key.position.set(-3, 5, 4); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6; scene.add(key);
  const rim = new THREE.PointLight("#ff8a5c", 30, 12); rim.position.set(2.5, 3, -2.5); scene.add(rim);
  const fillL = new THREE.PointLight("#7aa2ff", 8, 10); fillL.position.set(3, 1, 3); scene.add(fillL);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMappingExposure = 1.1;
  return t => {
    const drop = L.ease(t, .2, 1.4, L.E.back); boxm.position.y = 1.16 + (1 - drop) * 3.5 + .06;
    const spin = L.ease(t, 2, 7, L.E.io); boxm.rotation.y = -.5 + spin * Math.PI * 2 + L.ease(t, 7, 8, L.E.io) * .5;
    plate.rotation.y = boxm.rotation.y;
    const k = L.ease(t, 0, 8, L.E.io); cam.position.set(Math.sin(.25) * L.lerp(9.5, 6.3, k), L.lerp(1.2, 2.3, k), Math.cos(.25) * L.lerp(9.5, 6.3, k)); cam.lookAt(0, L.lerp(1.1, 1.5, k), 0);
    renderer.render(scene, cam);
  };
}, draw(t) {
  L.glow(W / 2, 1200, 600, "#ff8a5c", .08);
  L.rise("DAILY GRAIN", W / 2, 270, 96, "#fff", t, 7.1, .05, .5, 800, "center", INTER);
  L.at(W / 2, 360, 1, 0, L.ease(t, 7.6, 8.2), () => L.txt("첨가당 0g, 아침이 가벼워지는 그래놀라", 0, 0, 42, "#f3ead8", 700, "center"));
  L.at(W / 2, 1720, 1, 0, L.env(t, 2.2, 6.8), () => L.txt("통곡물 7가지 · 500g", 0, 0, 44, "rgba(255,255,255,.75)", 700, "center"));
  L.vignette(.5); L.grain(t, .04);
} };

// ---------- g03 slot machine ----------
{
  const SYM = [["1+1", "#ff4d6d"], ["무료배송", "#3ec1d3"], ["10%", "#ffd23f"], ["★", "#ffd23f"], ["20%", "#7b61ff"], ["사은품", "#2ec27e"]];
  const stops = [5.0, 5.7, 6.6], target = 0;
  S.g03 = { dur: 11, meta: {
    cat: "interactive", title: "슬롯머신으로 뽑는 오늘의 혜택", poster: .66,
    desc: "레버를 당기면 릴 3개가 돌다가 하나씩 멈추고, '1+1'이 세 줄로 맞으면서 불빛과 꽃가루가 터져요. 이벤트·할인 공지용 루프 영상이에요.",
    prompt: `Create an 11-second vertical (1080x1920) slot-machine promo animation as one HTML file with Canvas 2D. window.render(t) draws frame t deterministically.

Event: "[EVENT NAME]" for [BRAND]. Reel symbols (text labels drawn on tiles): [1+1], [무료배송], [10%], [★], [20%], [사은품]. Winning symbol: [WINNING BENEFIT].

Machine: a chunky rounded cabinet in [BRAND COLOR] with a marquee of bulbs around the top sign that chase in sequence, three reel windows with glass highlights, and a lever on the right with a red ball.
0–1.5s: the cabinet rises into frame with a bounce; marquee reads "[EVENT NAME]".
1.5–2.2s: the lever is pulled down and springs back.
2–6.8s: the three reels spin with motion blur (draw stretched, semi-transparent tiles), then stop one by one at 5.0s, 5.7s and 6.6s with a slight overshoot and settle; the last reel slows down suspensefully.
6.8–9s: all three show the winning symbol — the bulbs flash in unison, a winning line glows across the reels, confetti bursts, and a banner "[WIN MESSAGE]" drops in.
9–11s: CTA "[CTA — e.g. 오늘 자정까지]" pulses below, then fade out.

Style: playful casino-arcade, bold Korean type (Noto Sans KR Black), dark purple background with sparkles.`,
    how: "[EVENT NAME], 릴에 들어갈 혜택 6개, 당첨 혜택, 마감 문구만 바꾸면 우리 가게 이벤트 영상이 돼요. 레버 대신 '버튼을 누르는 손가락'으로 바꿔 달라고 해도 됩니다."
  }, draw(t) {
    const g = L.g; L.vgrad("#1a0b2e", "#3b0f5c"); const r = L.rng(5);
    for (let i = 0; i < 40; i++) { const x = r() * W, y = r() * H, tw = .5 + .5 * Math.sin(t * 3 + i); L.circ(x, y, 2 + r() * 3, `rgba(255,220,150,${.3 * tw})`); }
    const win = t > 6.8, up = ease(t, 0, 1.3, E.back), my = lerp(H + 200, 0, up);
    g.save(); g.translate(0, my);
    const x0 = 110, y0 = 380, mw = 860, mh = 1150;
    L.box(x0, y0, mw, mh, 70, "#e63946"); L.box(x0 + 26, y0 + 26, mw - 52, mh - 52, 54, "#c1121f");
    L.box(x0 + 80, y0 - 120, mw - 160, 240, 60, "#ffd23f"); L.box(x0 + 100, y0 - 100, mw - 200, 200, 48, "#3b0f5c");
    L.fit("오늘의 혜택 뽑기", W / 2, y0 + 30, 82, mw - 260, "#ffd23f", 900);
    for (let i = 0; i < 22; i++) { const a = i / 22, bx = x0 + 80 + a * (mw - 160), on = win ? Math.floor(t * 8) % 2 === 0 : (Math.floor(t * 10) % 22) === i || (Math.floor(t * 10) + 11) % 22 === i;
      L.circ(bx + 18, y0 - 120, 13, on ? "#fff8d6" : "#a07c10"); L.circ(bx + 18, y0 + 120, 13, on ? "#fff8d6" : "#a07c10"); if (on) { L.glow(bx + 18, y0 - 120, 40, "#fff3b0", .5); L.glow(bx + 18, y0 + 120, 40, "#fff3b0", .5); } }
    const rx = x0 + 90, ry = y0 + 260, rw = 220, rh = 420, gap = 30;
    L.box(rx - 30, ry - 30, rw * 3 + gap * 2 + 60, rh + 60, 34, "#2b0a3d");
    for (let k = 0; k < 3; k++) {
      const X = rx + k * (rw + gap); L.box(X, ry, rw, rh, 22, "#fffaf0");
      g.save(); L.rr(X, ry, rw, rh, 22); g.clip();
      const st = stops[k], spinEnd = st, tileH = 200;
      let pos; // in tiles
      if (t < 2) pos = 0; else if (t < spinEnd) { const v = 14; pos = (t - 2) * v; } else { const base = Math.ceil((spinEnd - 2) * 14 / SYM.length) * SYM.length + target; const ov = ease(t, spinEnd, spinEnd + .5, E.back); pos = lerp(base - .9, base, ov); }
      const blur = t > 2.2 && t < spinEnd;
      for (let j = -2; j <= 2; j++) { const idx = ((Math.floor(pos) + j) % SYM.length + SYM.length) % SYM.length, fy = ry + rh / 2 + (j - (pos % 1)) * tileH;
        const [s, c] = SYM[idx]; g.save(); g.globalAlpha = blur ? .45 : 1; if (blur) { g.translate(0, fy); g.scale(1, 1.5); g.translate(0, -fy); }
        L.box(X + 18, fy - 80, rw - 36, 160, 20, L.alpha(c, .18)); L.fit(s, X + rw / 2, fy + 22, s.length > 3 ? 46 : 74, rw - 50, c === "#ffd23f" ? "#d49b00" : c, 900); g.restore(); }
      const gr = g.createLinearGradient(0, ry, 0, ry + rh); gr.addColorStop(0, "rgba(0,0,0,.45)"); gr.addColorStop(.25, "rgba(0,0,0,0)"); gr.addColorStop(.75, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,.45)"); g.fillStyle = gr; g.fillRect(X, ry, rw, rh);
      g.restore(); L.box(X + 14, ry + 10, 30, rh - 20, 15, "rgba(255,255,255,.18)");
    }
    if (win) { const k = seg(t, 6.9, 7.3), p = .6 + .4 * Math.sin(t * 14); L.line(rx - 40, ry + rh / 2, lerp(rx - 40, rx + rw * 3 + gap * 2 + 40, k), ry + rh / 2, `rgba(255,214,10,${p})`, 10); }
    // lever
    const pull = env(t, 1.5, 2.25, .25, .45), ang = -.15 + pull * 1.2;
    g.save(); g.translate(x0 + mw + 10, y0 + 520); L.box(-10, -40, 50, 80, 16, "#9d0208"); g.rotate(ang); L.line(16, 0, 16, -300, "#d9d9d9", 22); L.circ(16, -320, 46, "#ff4d4f"); L.circ(2, -334, 14, "rgba(255,255,255,.6)"); g.restore();
    L.box(x0 + 120, y0 + 780, mw - 240, 120, 30, "#9d0208"); L.txt("PRESS  ▶  WIN", W / 2, y0 + 860, 48, "#ffd6a5", 900, "center", INTER);
    g.restore();
    if (win) { L.confetti(t, 6.9, 120, 9); const b = ease(t, 7.1, 7.7, E.back); L.at(W / 2, 1640, b, 0, b, () => { L.box(-400, -90, 800, 160, 80, "#ffd23f"); L.txt("1+1 당첨!", 0, 30, 96, "#3b0f5c", 900, "center"); }); }
    const c = ease(t, 8.8, 9.3); if (c > 0) L.at(W / 2, 1810, 1 + .04 * Math.sin(t * 8), 0, c, () => L.txt("오늘 자정까지 · 전 상품", 0, 0, 46, "#fff", 800, "center"));
  } };
}
})();
