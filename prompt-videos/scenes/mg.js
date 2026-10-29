// mg — motion-graphics technique examples (one technique per clip, loop-friendly, 6s)
(() => {
const { E, ease, seg, env, lerp, clamp } = L;
const PAPER = "#f1ece2", INK = "#1f1f22", RED = "#e5383b", SOFT = "#d9d2c4";
const cx = W / 2, cy = H / 2;
const ct = (s, x, y, size, c, w = 900, f = KR) => L.txt(s, x, y, size, c, w, "center", f);
// small technique label so a downloaded clip still says what it shows
function tag(code, ko, en, dark) {
  const c = dark ? "rgba(255,255,255,.75)" : "rgba(31,31,34,.7)";
  L.txt(code, 70, H - 120, 34, dark ? "#fff" : RED, 700, "left", MONO);
  L.txt(ko + "  ·  " + en, 70 + L.tw(code + "  ", 34, 700, MONO), H - 120, 34, c, 700, "left");
}
const def = (id, dur, draw, meta) => { S[id] = { dur, fin: .12, fout: .12, draw, meta: Object.assign({ cat: "mg", poster: .45 }, meta) }; };

// ---------- G01 letter fly-through ----------
{
  const nx = document.createElement("canvas"); nx.width = W; nx.height = H; const ng = nx.getContext("2d");
  const mk = document.createElement("canvas"); mk.width = W; mk.height = H; const mg = mk.getContext("2d");
  function next(t) { // next scene drawn into nx
    const gg = L.g; L.use(ng); L.fill(RED);
    for (let i = 0; i < 9; i++) { const k = (t * .6 + i / 9) % 1; ng.globalAlpha = .12; L.circ(cx, cy, 120 + k * 900, null, "#fff", 6); }
    ng.globalAlpha = 1; ct("프롬프트", cx, cy - 20, 150, "#fff", 900); ct("한 줄", cx, cy + 150, 150, "#fff", 900);
    L.use(gg);
  }
  def("mg01", 6, t => {
    const z = ease(t, 1.0, 3.4, E.in), s = Math.exp(lerp(0, Math.log(60), z));
    const px = cx + 150, py = cy + 40; // inside the stem of "I"
    L.fill(PAPER); ct("이름만 알면", cx, 420, 64, INK, 700);
    next(t);
    mg.setTransform(1, 0, 0, 1, 0, 0); mg.clearRect(0, 0, W, H);
    mg.setTransform(s, 0, 0, s, px - px * s, py - py * s);
    mg.font = `900 820px ${INTER}`; mg.textAlign = "center"; mg.textBaseline = "middle"; mg.fillStyle = "#000"; mg.fillText("AI", cx, cy + 40);
    mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalCompositeOperation = "source-in"; mg.drawImage(nx, 0, 0); mg.globalCompositeOperation = "source-over";
    // outline of the letters before the dive
    L.g.drawImage(mk, 0, 0);
    L.g.save(); L.g.globalAlpha = 1 - seg(t, 1.0, 2.0); L.g.setTransform(s, 0, 0, s, px - px * s, py - py * s);
    L.g.font = `900 820px ${INTER}`; L.g.textAlign = "center"; L.g.textBaseline = "middle"; L.g.fillStyle = INK; L.g.fillText("AI", cx, cy + 40); L.g.restore();
    if (t > 3.4) L.g.drawImage(nx, 0, 0);
    tag("G01", "글자 관통 줌", "letter fly-through", t > 2.6);
  }, { title: "글자 관통 줌" });
}

// ---------- G02 screen dive ----------
{
  function inner(w, h, t) { // the scene that lives inside the phone (and fills the frame at the end)
    const g = L.g; g.fillStyle = PAPER; g.fillRect(0, 0, w, h);
    const k = w / W; L.box(80 * k, 140 * k, w - 160 * k, 90 * k, 20 * k, RED); L.txt("SCENE 07 · MOTION", w / 2, 200 * k, 40 * k, "#fff", 700, "center", MONO);
    ct("모션 그래픽", w / 2, h * .42, 130 * k, INK, 900);
    L.circ(w * .72, h * .3, 120 * k, RED);
    for (let i = 0; i < 16; i++) { const bh = (120 + 220 * Math.abs(Math.sin(t * 3 + i * .7))) * k; L.box(w * .14 + i * w * .046, h * .78 - bh, w * .03, bh, 6 * k, INK); }
  }
  def("mg02", 6, t => {
    L.fill(INK); L.glow(cx, cy, 900, RED, .25);
    ct("화면 속으로", cx, 330, 72, "#fff", 900);
    const z = ease(t, 1.2, 3.4, E.io), pw = lerp(560, W * 1.14, z), ph = pw * 2.05;
    const y = lerp(cy + 60, cy, z);
    L.at(cx, y, 1, lerp(-.06, 0, z), 1, () => L.phone(0, 0, pw, ph, (w, h) => inner(w, h, t)));
    if (t > 3.4) { L.g.save(); L.g.scale(1, 1); inner(W, H, t); L.g.restore(); }
    tag("G02", "화면 속 다이브", "screen dive", false);
  }, { title: "화면 속 다이브" });
}

// ---------- G03 text sandwich ----------
def("mg03", 6, t => {
  L.fill(PAPER);
  const word = "MOT", sz = 400, y = cy + 140;
  L.txt(word, cx, y, sz, INK, 900, "center", INTER);                       // back layer
  const by = lerp(H + 300, -300, (t % 6) / 6), bx = cx + Math.sin(t * 1.6) * 160;
  L.circ(bx, by, 230, RED);                                              // object travels between layers
  L.g.save(); L.g.beginPath(); L.g.rect(0, cy - 40, W, 180); L.g.clip(); // front slice of the same letters
  L.txt(word, cx, y, sz, INK, 900, "center", INTER); L.g.restore();
  L.g.lineWidth = 6; L.font(sz, 900, INTER); L.g.strokeStyle = RED; L.g.textAlign = "center"; L.g.strokeText(word, cx, y);
  ct("3위", cx, 420, 80, RED, 900); ct("텍스트 샌드위치", cx, 540, 88, INK, 900);
  tag("G03", "텍스트 샌드위치", "text sandwich", false);
}, { title: "텍스트 샌드위치" });

// ---------- G04 circle pop transition ----------
{
  const scenes = [[PAPER, INK, "장면 하나"], [RED, "#fff", "장면 둘"], [INK, "#fff", "장면 셋"]];
  function sceneDraw(i) { const [bg, fg, s] = scenes[i % 3]; L.fill(bg); ct(s, cx, cy + 50, 150, fg, 900); ct(`0${i % 3 + 1}`, cx, cy - 170, 60, fg === "#fff" ? "rgba(255,255,255,.6)" : RED, 700, "center", MONO); }
  def("mg04", 6, t => {
    const step = Math.floor(t / 2), lt = t - step * 2; sceneDraw(step);
    if (lt > 1.1) { // pop: three rings expand from the centre, the last one carries the next scene
      const cols = [RED, "#ffd23f", scenes[(step + 1) % 3][0]];
      cols.forEach((c, j) => { const k = ease(lt, 1.1 + j * .12, 1.75 + j * .12, E.out); if (k > 0) L.circ(cx, cy, k * 1250, c); });
      const k3 = ease(lt, 1.34, 1.99, E.out);
      if (k3 > 0) { L.g.save(); L.g.beginPath(); L.g.arc(cx, cy, k3 * 1250, 0, 7); L.g.clip(); sceneDraw(step + 1); L.g.restore(); }
    }
    tag("G04", "원 팝 전환", "circle pop transition", scenes[step % 3][0] !== PAPER);
  }, { title: "원 팝 전환" });
}

// ---------- G05 pixel dissolve ----------
{
  const r = L.rng(5), C = 54, cols = Math.ceil(W / C), rows = Math.ceil(H / C), d = [];
  for (let i = 0; i < cols * rows; i++) { const x = i % cols, y = Math.floor(i / cols); d.push(.15 + r() * .55 + Math.abs(y - rows / 2) / rows * .25 + Math.abs(x - cols / 2) / cols * .1); }
  const A = document.createElement("canvas"); A.width = W; A.height = H; const ag = A.getContext("2d");
  def("mg05", 6, t => {
    // scene B underneath
    L.fill(RED); ct("내일의 나", cx, cy + 50, 170, "#fff", 900);
    // scene A rendered once per frame, then drawn cell by cell
    const gg = L.g; L.use(ag); L.fill(PAPER); ct("오늘의 나", cx, cy + 50, 170, INK, 900); L.box(cx - 330, cy + 110, 660, 14, 7, RED); L.use(gg);
    const k = t < 3 ? seg(t, .8, 2.6) : 1 - seg(t, 3.6, 5.4); // dissolve out, then back in for the loop
    for (let i = 0; i < d.length; i++) {
      const v = clamp((k * 1.25 - d[i]) / .2); if (v >= 1) continue;
      const x = (i % cols) * C, y = Math.floor(i / cols) * C, s = C * (1 - v);
      L.g.drawImage(A, x, y, C, C, x + (C - s) / 2, y + (C - s) / 2, s, s);
    }
    tag("G05", "픽셀 디졸브", "pixel dissolve", k > .5);
  }, { title: "픽셀 디졸브" });
}

// ---------- G06 kinetic typography ----------
{
  const words = [["이름만", INK, 170, -.06], ["알면", RED, 230, .05], ["AI가", INK, 200, -.03], ["만들어요", RED, 150, 0]];
  def("mg06", 6, t => {
    L.fill(PAPER);
    words.forEach(([w, c, sz, rot], i) => {
      const t0 = .3 + i * .55, k = ease(t, t0, t0 + .35, E.back), out = 1 - ease(t, 4.8, 5.4, E.in);
      if (k <= 0) return;
      const y = cy - 420 + i * 270, shake = t > t0 + .3 && t < t0 + .45 ? Math.sin(t * 120) * 10 : 0;
      L.at(cx + shake, y - (1 - out) * 300, lerp(2.6, 1, k), rot * k, clamp(k * 2) * out, () => ct(w, 0, 0, sz, c, 900));
    });
    L.box(cx - 280, cy + 720, 560 * ease(t, 2.6, 3.2), 18, 9, INK);
    tag("G06", "키네틱 타이포그래피", "kinetic typography", false);
  }, { title: "키네틱 타이포그래피" });
}

// ---------- G07 mask reveal ----------
def("mg07", 6, t => {
  L.fill(INK);
  const lines = ["영상 AI는", "글자를 깨뜨리고", "코드는", "글자를 지켜요"];
  lines.forEach((s, i) => {
    const y = cy - 360 + i * 230, t0 = .4 + i * .45, k = ease(t, t0, t0 + .6, E.out), out = ease(t, 4.6 + i * .08, 5.2 + i * .08, E.in);
    L.g.save(); L.g.beginPath(); L.g.rect(0, y - 170, W, 200); L.g.clip();          // the mask: a slot each line rises through
    ct(s, cx, y + (1 - k) * 210 - out * 210, 130, i % 2 ? RED : "#fff", 900); L.g.restore();
    const bw = 760 * env(t, t0 - .15, t0 + .5, .25, .25);                             // wipe bar that uncovers the line
    if (bw > 1) L.box(cx - 380, y - 160, bw, 190, 8, i % 2 ? "#fff" : RED);
  });
  tag("G07", "마스크 리빌", "mask reveal", true);
}, { title: "마스크 리빌" });

// ---------- G08 split-flap ----------
{
  const A = "가나다라마바사아자차카타파하ABCDEFGHJKLMNOPRSTUVWXYZ0123456789".split("");
  const rowsTo = ["모션그래픽  ", "FLAP 08", "코드로 제작 "], R = L.rng(8);
  const delay = rowsTo.map(s => [...s.padEnd(7)].map(() => .4 + R() * 1.6));
  def("mg08", 6, t => {
    L.fill("#121214");
    const cw = 120, ch = 170;
    rowsTo.forEach((target, ri) => {
      const chars = [...target.padEnd(7)].slice(0, 7), y = cy - 320 + ri * 230, x0 = cx - chars.length * (cw + 10) / 2;
      chars.forEach((c, ci) => {
        const x = x0 + ci * (cw + 10), done = t > delay[ri][ci] + 1.4 && t < 5.3;
        const flip = Math.floor(t * 14 + ri * 3 + ci * 5);
        const ch2 = done ? c : (t >= 5.3 ? " " : A[(flip * 7 + ci * 3 + ri) % A.length]);
        L.box(x, y, cw, ch, 10, "#26262b"); L.box(x, y + ch / 2 - 2, cw, 4, 0, "#121214");
        if (ch2.trim()) L.fit(ch2, x + cw / 2, y + ch * .7, 100, cw - 12, done ? (ri === 1 ? RED : "#f5f1e8") : "#9a968e", 900);
        const ph = (t * 14 + ci) % 1; if (!done) { L.g.save(); L.g.globalAlpha = .35; L.box(x, y, cw, ch / 2 * (1 - ph), 10, "#000"); L.g.restore(); }
      });
    });
    tag("G08", "스플릿 플랩", "split-flap display", true);
  }, { title: "스플릿 플랩" });
}

// ---------- G09 odometer counter ----------
def("mg09", 6, t => {
  L.fill(PAPER);
  ct("누적 조회수", cx, cy - 330, 80, INK, 700);
  const target = "1,284,500", k = ease(t, .5, 3.6, E.out), back = ease(t, 5.0, 5.8, E.io);
  const digits = [...target], dw = 108, x0 = cx - digits.length * dw / 2;
  L.g.save(); L.g.beginPath(); L.g.rect(0, cy - 160, W, 260); L.g.clip();
  digits.forEach((c, i) => {
    const x = x0 + i * dw + dw / 2;
    if (c === ",") { L.txt(",", x, cy + 60, 200, INK, 900, "center", INTER); return; }
    const v = +c, spins = 2 + i, kk = E.out(clamp((k - i * .02) / (1 - 8 * .02))), pos = (v + spins * 10) * kk * (1 - back);  // digits roll like a wheel
    const base = Math.floor(pos + 1e-6), frac = Math.max(0, pos - base);
    for (let j = -1; j <= 1; j++) { const n = ((base + j) % 10 + 10) % 10; ct(String(n), x, cy + 60 + (j - frac) * 230, 200, i < 2 ? RED : INK, 900, "center", INTER); }
  });
  L.g.restore();
  L.box(cx - 300, cy + 200, 600, 12, 6, RED);
  tag("G09", "롤링 카운터", "odometer counter", false);
}, { title: "롤링 카운터" });

// ---------- G10 shape morph ----------
{
  const N = 120, poly = (n, a0) => a => { const st = 2 * Math.PI / n, k = Math.cos(Math.PI / n) / Math.cos((((a - a0) % st) + st) % st - Math.PI / n); return [Math.cos(a) * k, Math.sin(a) * k]; },
    shapes = [a => [Math.cos(a), Math.sin(a)], poly(4, -Math.PI / 4), (a => { const f = poly(3, -Math.PI / 2); return a2 => { const [x, y] = f(a2); return [x * 1.15, y * 1.15 + .18]; }; })(),
      a => { const k = .55 + .45 * Math.pow(Math.abs(Math.cos(a * 2.5)), 2); return [Math.cos(a) * k * 1.1, Math.sin(a) * k * 1.1]; }], cols = [RED, INK, RED, INK], names = ["원", "사각형", "삼각형", "별"];
  def("mg10", 6, t => {
    L.fill(PAPER);
    const p = (t / 1.5) % 4, i = Math.floor(p), k = E.io(clamp((p - i - .45) / .55)), j = (i + 1) % 4, R = 360;
    L.g.beginPath();
    for (let n = 0; n <= N; n++) { const a = n / N * Math.PI * 2 - Math.PI / 2, A = shapes[i](a), B = shapes[j](a); const x = cx + lerp(A[0], B[0], k) * R, y = cy - 60 + lerp(A[1], B[1], k) * R; n ? L.g.lineTo(x, y) : L.g.moveTo(x, y); }
    L.g.closePath(); L.g.fillStyle = k < .5 ? cols[i] : cols[j]; L.g.fill();
    L.at(cx, cy - 60, 1, t * .3, .25, () => { L.g.strokeStyle = INK; L.g.lineWidth = 3; L.g.setLineDash([12, 14]); L.g.beginPath(); L.g.arc(0, 0, 470, 0, 7); L.g.stroke(); L.g.setLineDash([]); });
    ct(names[k < .5 ? i : j], cx, cy + 520, 110, INK, 900);
    tag("G10", "셰이프 모핑", "shape morph", false);
  }, { title: "셰이프 모핑" });
}

// ---------- G11 line draw ----------
{
  const pts = []; for (let i = 0; i <= 200; i++) { const u = i / 200; pts.push([lerp(150, 930, u) + Math.sin(u * 9) * 60, cy + 260 - Math.pow(u, 1.6) * 640 + Math.sin(u * 14) * 40]); }
  def("mg11", 6, t => {
    L.fill(PAPER);
    for (let i = 0; i < 6; i++) L.line(120, cy + 300 - i * 140, 960, cy + 300 - i * 140, SOFT, 3);
    const k = ease(t, .4, 3.0, E.io), out = ease(t, 5.0, 5.6, E.in), n = Math.floor(k * 200), n0 = Math.floor(out * 200);
    L.g.beginPath(); for (let i = n0; i <= n; i++) i === n0 ? L.g.moveTo(...pts[i]) : L.g.lineTo(...pts[i]);
    L.g.strokeStyle = RED; L.g.lineWidth = 22; L.g.lineCap = "round"; L.g.lineJoin = "round"; L.g.stroke();
    if (n > 0) L.circ(pts[n][0], pts[n][1], 26, INK);
    const kk = ease(t, 3.0, 3.5, E.back); if (kk > 0 && out < 1) L.at(pts[200][0] - 120, pts[200][1] - 140, kk * (1 - out), 0, 1, () => { L.box(-170, -70, 340, 120, 60, INK); L.txt("+218%", 0, 22, 66, "#fff", 900, "center", INTER); });
    ct("선이 그려지며 나타나요", cx, 420, 76, INK, 900);
    tag("G11", "라인 드로잉", "line draw", false);
  }, { title: "라인 드로잉" });
}

// ---------- G12 glitch ----------
{
  const T = document.createElement("canvas"); T.width = W; T.height = 600; const tg = T.getContext("2d");
  const C2 = document.createElement("canvas"); C2.width = W; C2.height = 600; const c2 = C2.getContext("2d");
  def("mg12", 6, t => {
    L.fill("#0e0e10");
    const gg = L.g; L.use(tg); tg.clearRect(0, 0, W, 600); L.txt("GLITCH", cx, 330, 250, "#fff", 900, "center", INTER); ct("출시 D-1", cx, 520, 110, "#fff", 900); L.use(gg);
    const r = L.rng(Math.floor(t * 12)), burst = (t % 1.5) < .45 ? 1 : .15, y0 = cy - 330;
    [["#ff2a4d", -1], ["#2af0ff", 1]].forEach(([c, s]) => { // colour channels drift apart
      const o = s * (6 + burst * 26 * r()); c2.globalCompositeOperation = "source-over"; c2.clearRect(0, 0, W, 600); c2.drawImage(T, o, s * burst * 6);
      c2.globalCompositeOperation = "source-in"; c2.fillStyle = c; c2.fillRect(0, 0, W, 600);
      L.g.save(); L.g.globalCompositeOperation = "lighter"; L.g.drawImage(C2, 0, y0); L.g.restore();
    });
    L.g.drawImage(T, 0, y0);
    for (let i = 0; i < 7 * burst + 1; i++) { const sy = r() * 560, sh = 10 + r() * 50, dx = (r() - .5) * 160 * burst; L.g.drawImage(T, 0, sy, W, sh, dx, y0 + sy, W, sh); }
    L.g.globalAlpha = .12; L.g.fillStyle = "#000"; for (let y = 0; y < H; y += 6) L.g.fillRect(0, y, W, 2); L.g.globalAlpha = 1;
    tag("G12", "글리치", "glitch / RGB split", true);
  }, { title: "글리치" });
}

// ---------- G13 glassmorphism ----------
{
  const BG = document.createElement("canvas"); BG.width = W; BG.height = H; const bg = BG.getContext("2d");
  const blobs = [["#ff5e7e", 300, 520, 360], ["#5b7cff", 780, 820, 420], ["#ffb347", 420, 1260, 380], ["#38d9a9", 820, 1520, 300]];
  function card(x, y, w, h, a) {
    L.g.save(); L.g.globalAlpha = a; L.rr(x, y, w, h, 48); L.g.clip();
    L.g.filter = "blur(36px)"; L.g.drawImage(BG, 0, 0); L.g.filter = "none";
    L.g.fillStyle = "rgba(255,255,255,.16)"; L.g.fillRect(x, y, w, h);
    const gr = L.g.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, "rgba(255,255,255,.35)"); gr.addColorStop(.5, "rgba(255,255,255,0)"); L.g.fillStyle = gr; L.g.fillRect(x, y, w, h);
    L.g.restore(); L.g.save(); L.g.globalAlpha = a; L.box(x, y, w, h, 48, null, "rgba(255,255,255,.55)", 3); L.g.restore();
  }
  def("mg13", 6, t => {
    const gg = L.g; L.use(bg); bg.fillStyle = "#14121c"; bg.fillRect(0, 0, W, H);
    blobs.forEach(([c, x, y, r], i) => { const a = t * .9 + i * 1.7; L.glow(x + Math.sin(a) * 120, y + Math.cos(a * .8) * 140, r * 1.6, c, .95); });
    L.use(gg);
    L.g.drawImage(BG, 0, 0);
    const k1 = ease(t, .3, 1.1, E.back), k2 = ease(t, .9, 1.7, E.back), out = ease(t, 5.2, 5.8, E.in);
    const y1 = lerp(H, 560, k1) + out * 900, y2 = lerp(H, 1040, k2) + out * 900;
    card(120, y1, W - 240, 400, 1);
    L.g.save(); L.g.globalAlpha = 1 - out;
    L.txt("오늘의 루틴", 190, y1 + 120, 46, "rgba(255,255,255,.75)", 700, "left");
    L.txt("물 2L 마시기", 190, y1 + 220, 84, "#fff", 900, "left");
    L.box(190, y1 + 290, W - 380, 22, 11, "rgba(255,255,255,.25)"); L.box(190, y1 + 290, (W - 380) * ease(t, 1.4, 3.2), 22, 11, "#fff");
    L.g.restore();
    card(220, y2, W - 440, 260, 1);
    L.g.save(); L.g.globalAlpha = 1 - out;
    ct("68%", cx, y2 + 150, 110, "#fff", 900, INTER); ct("달성", cx, y2 + 215, 40, "rgba(255,255,255,.8)", 700);
    L.g.restore();
    const sw = ease(t, 2.4, 3.4, E.io); if (sw > 0 && sw < 1) { L.g.save(); L.rr(120, y1, W - 240, 400, 48); L.g.clip(); L.g.globalAlpha = .35; L.g.fillStyle = "#fff"; L.g.translate(lerp(-300, W + 300, sw), 0); L.g.rotate(.35); L.g.fillRect(-40, -400, 80, 2400); L.g.restore(); }
    ct("글래스모피즘", cx, 300, 64, "#fff", 900);
    tag("G13", "글래스모피즘", "glassmorphism", true);
  }, { title: "글래스모피즘" });
}

// ---------- G14 particle assemble ----------
{
  const N = 1400, R = L.rng(14), P = [];
  let ready = false;
  function build() {
    const c = document.createElement("canvas"); c.width = W; c.height = 700; const g = c.getContext("2d");
    g.fillStyle = "#000"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `900 300px ${KR}`; g.fillText("모여라", W / 2, 350);
    const d = g.getImageData(0, 0, W, 700).data, pts = [];
    for (let y = 0; y < 700; y += 9) for (let x = 0; x < W; x += 9) if (d[(y * W + x) * 4 + 3] > 128) pts.push([x, y + cy - 350]);
    for (let i = 0; i < N; i++) { const q = pts[Math.floor(R() * pts.length)]; P.push({ tx: q[0] + (R() - .5) * 4, ty: q[1] + (R() - .5) * 4, sx: R() * W, sy: R() * H, d: R() * .8, c: R() < .2 ? RED : R() < .5 ? "#ffd166" : "#fff", r: 3 + R() * 4, ox: (R() - .5) * 2, oy: (R() - .5) * 2 }); }
    ready = true;
  }
  def("mg14", 6, t => {
    if (!ready) build();
    L.fill("#101322");
    P.forEach(p => {
      const k = ease(t, .4 + p.d, 2.2 + p.d, E.io), o = ease(t, 4.6 + p.d * .4, 5.8, E.in);
      const fx = p.sx + Math.sin(t * 1.3 + p.d * 9) * 30, fy = p.sy + Math.cos(t * 1.1 + p.d * 7) * 30;
      const ex = p.tx + p.ox * 700 * o, ey = p.ty + p.oy * 700 * o;
      const x = lerp(fx, ex, k), y = lerp(fy, ey, k);
      L.g.globalAlpha = .9; L.circ(x, y, p.r * (k > .98 && o === 0 ? 1.15 : 1), p.c);
    });
    L.g.globalAlpha = 1;
    ct("흩어진 점이 글자로", cx, 1420, 56, "rgba(255,255,255,.75)", 700);
    tag("G14", "파티클 집합", "particle assemble", true);
  }, { title: "파티클 집합" });
}

// ---------- G15 bar chart race ----------
{
  const names = ["숏폼", "블로그", "라이브", "뉴스레터", "팟캐스트"], cols = [RED, "#3a86ff", "#ffbe0b", "#8338ec", "#06d6a0"];
  const years = [2022, 2023, 2024, 2025, 2026];
  const V = [[40, 62, 25, 18, 30], [58, 60, 34, 22, 31], [79, 57, 46, 27, 33], [104, 55, 61, 35, 34], [131, 52, 70, 48, 36]];
  const at = u => { const i = Math.min(3, Math.floor(u)), f = clamp(u - i); return V[i].map((v, j) => lerp(v, V[i + 1][j], E.io(f))); };
  const rankY = vals => { const o = vals.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]); const y = []; o.forEach(([, i], r) => y[i] = r); return y; };
  def("mg15", 6, t => {
    L.fill(PAPER);
    const u = clamp((t - .4) / 4.4) * 4, vals = at(u);
    const ys = names.map(() => 0); for (let s = 0; s < 10; s++) { const r = rankY(at(clamp((t - .4 - s * .03) / 4.4) * 4)); r.forEach((v, i) => ys[i] += v / 10); }
    ct("채널별 관심도", cx, 330, 72, INK, 900);
    L.txt(String(years[Math.min(4, Math.round(u))]), W - 90, 1500, 150, SOFT, 900, "right", INTER);
    const max = Math.max(...vals) * 1.08, x0 = 250, wMax = W - x0 - 110, grow = ease(t, .1, .7);
    names.forEach((n, i) => {
      const y = 520 + ys[i] * 170, w = wMax * vals[i] / max * grow;
      L.txt(n, x0 - 24, y + 72, 46, INK, 700, "right");
      L.box(x0, y + 20, w, 90, 14, cols[i]);
      L.txt(Math.round(vals[i]) + "", x0 + w + 16, y + 82, 44, INK, 900, "left", INTER);
    });
    L.line(x0, 520, x0, 1390, INK, 4);
    tag("G15", "차트 바 레이스", "bar chart race");
  }, { title: "차트 바 레이스" });
}

// ---------- G16 Vox-style paper explainer ----------
{
  const R = L.rng(16), specks = Array.from({ length: 260 }, () => [R() * W, R() * H, R() * 2.5 + .5, R() * .15]);
  def("mg16", 6, t => {
    const z = ease(t, 2.2, 3.6, E.io), zo = ease(t, 5.0, 5.8, E.io), s = lerp(1, 1.55, z * (1 - zo)), fx = 480, fy = 966;
    L.fill("#e9e2d0");
    specks.forEach(([x, y, r, a]) => { L.g.globalAlpha = a; L.circ(x, y, r, "#7a6a50"); }); L.g.globalAlpha = 1;
    L.g.save(); L.g.translate(fx, fy); L.g.scale(s, s); L.g.translate(-fx, -fy);
    // paper clipping
    L.g.save(); L.g.translate(cx, 980); L.g.rotate(-.03); L.g.shadowColor = "rgba(0,0,0,.25)"; L.g.shadowBlur = 30; L.g.shadowOffsetY = 12;
    L.box(-400, -460, 800, 920, 6, "#fbf8f0"); L.g.shadowColor = "transparent";
    L.txt("2026 시청 습관 보고서", -340, -360, 46, INK, 900, "left", SERIF);
    L.line(-340, -320, 340, -320, INK, 3);
    for (let i = 0; i < 9; i++) { const y = -250 + i * 62; if (i === 4) continue; L.box(-340, y, (i % 3 === 2 ? 470 : 680), 18, 9, "#d7d0c0"); }
    // highlighted sentence
    const hk = ease(t, .9, 1.9, E.io), y = -250 + 4 * 62 - 12;
    L.g.globalAlpha = .85; L.box(-350, y - 10, 700 * hk, 62, 8, "#ffe14d"); L.g.globalAlpha = 1;
    L.txt("하루 평균 시청 2시간 14분", -340, y + 38, 46, INK, 900, "left", SERIF);
    // hand-drawn circle around the number
    const ck = ease(t, 3.6, 4.4, E.io);
    if (ck > 0) { L.g.beginPath(); for (let a = 0; a <= ck * Math.PI * 2.15; a += .05) { const rx = 170 + Math.sin(a * 3) * 6, ry = 54 + Math.cos(a * 2) * 4; const X = 135 + Math.cos(a - 2) * rx, Y = y + 24 + Math.sin(a - 2) * ry; a === 0 ? L.g.moveTo(X, Y) : L.g.lineTo(X, Y); } L.g.strokeStyle = RED; L.g.lineWidth = 7; L.g.lineCap = "round"; L.g.stroke(); }
    // tape
    L.g.globalAlpha = .6; L.g.save(); L.g.translate(-300, -470); L.g.rotate(-.25); L.box(-70, -22, 140, 44, 3, "#f3e6b0"); L.g.restore(); L.g.save(); L.g.translate(310, -470); L.g.rotate(.2); L.box(-70, -22, 140, 44, 3, "#f3e6b0"); L.g.restore(); L.g.globalAlpha = 1;
    L.g.restore(); L.g.restore();
    // annotation (screen space)
    const ak = ease(t, 4.2, 4.8, E.back) * (1 - zo);
    if (ak > 0) { L.g.save(); L.g.globalAlpha = clamp(ak); L.box(cx - 250, 1500, 500, 110, 55, RED); ct("작년보다 +37분", cx, 1575, 54, "#fff", 900); L.g.restore(); }
    tag("G16", "Vox 스타일 종이 설명", "paper explainer");
  }, { title: "Vox 스타일 종이 설명" });
}
})();
