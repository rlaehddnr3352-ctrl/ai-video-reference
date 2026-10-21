// Shared 2D motion toolkit. Every scene draws as a pure function of t (seconds) so frames render deterministically.
const W = 1080, H = 1920;
const KR = "'Noto Sans CJK KR', sans-serif", SERIF = "'Noto Serif CJK KR', serif", MONO = "'DejaVu Sans Mono', monospace", INTER = "Inter, 'Noto Sans CJK KR', sans-serif";
const S = {};                       // scene registry: S[id] = {dur, draw(g,t)} or {dur, three:true, init(THREE,renderer), draw(t)}
const L = (() => {
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const E = {
    out: x => 1 - Math.pow(1 - x, 3), in: x => x * x * x,
    io: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    back: x => { if (x <= 0) return 0; const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
    elastic: x => x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (2 * Math.PI / 3)) + 1,
    expo: x => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
  };
  const ease = (t, a, b, f = E.out) => f(seg(t, a, b));
  // in-hold-out envelope
  const env = (t, a, b, fi = .4, fo = .4) => Math.min(ease(t, a, a + fi), 1 - ease(t, b - fo, b, E.in));
  function rng(seed) { let s = seed >>> 0; return () => { s += 0x6D2B79F5; let r = Math.imul(s ^ s >>> 15, 1 | s); r ^= r + Math.imul(r ^ r >>> 7, 61 | r); return ((r ^ r >>> 14) >>> 0) / 4294967296; }; }
  function hex(c) { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mix(a, b, k) { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(",")})`; }
  function alpha(c, a) { const A = hex(c); return `rgba(${A.join(",")},${a})`; }

  let g;
  const use = ctx => (g = ctx);
  function fill(c) { g.fillStyle = c; g.fillRect(0, 0, W, H); }
  function vgrad(c1, c2, y0 = 0, y1 = H) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  function glow(x, y, r, c, a = .5) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, alpha(c, a)); gr.addColorStop(1, alpha(c, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  function vignette(a = .55) { const gr = g.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  let grainCv = null;
  function grain(t, a = .06) {
    if (!grainCv) { grainCv = document.createElement("canvas"); grainCv.width = 540; grainCv.height = 960; const c = grainCv.getContext("2d"), d = c.createImageData(540, 960), r = rng(7); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } c.putImageData(d, 0, 0); }
    const f = Math.floor(t * 24) % 8; g.save(); g.globalAlpha = a; g.globalCompositeOperation = "overlay"; g.drawImage(grainCv, -(f * 67) % 540, -(f * 131) % 960, W * 2, H * 2); g.restore();
  }
  function rr(x, y, w, h, r) { if (w < 0) { x += w; w = -w; } if (h < 0) { y += h; h = -h; } r = Math.max(0, Math.min(r, w / 2, h / 2)); g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function box(x, y, w, h, r, c, stroke, lw = 2) { rr(x, y, w, h, r); if (c) { g.fillStyle = c; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
  function circ(x, y, r, c, stroke, lw = 2) { g.beginPath(); g.arc(x, y, Math.max(0, r), 0, Math.PI * 2); if (c) { g.fillStyle = c; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
  function line(x1, y1, x2, y2, c, lw = 4, cap = "round") { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.strokeStyle = c; g.lineWidth = lw; g.lineCap = cap; g.stroke(); }
  function font(size, weight = 900, f = KR) { g.font = `${weight} ${size}px ${f}`; }
  function tw(s, size, weight = 900, f = KR) { font(size, weight, f); return g.measureText(s).width; }
  function txt(s, x, y, size, c, weight = 900, align = "left", f = KR, base = "alphabetic") { font(size, weight, f); g.fillStyle = c; g.textAlign = align; g.textBaseline = base; g.fillText(s, x, y); }
  // text that shrinks to fit maxw
  function fit(s, x, y, size, maxw, c, weight = 900, align = "center", f = KR) { let sz = size; while (sz > 12 && tw(s, sz, weight, f) > maxw) sz -= 2; txt(s, x, y, sz, c, weight, align, f); return sz; }
  // characters rise one by one
  function rise(s, x, y, size, c, t, t0, step = .04, dur = .45, weight = 900, align = "center", f = KR, dist = 60) {
    const chars = [...s]; font(size, weight, f); const total = g.measureText(s).width;
    let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
    g.textAlign = "left"; g.textBaseline = "alphabetic";
    chars.forEach((ch, i) => { const k = ease(t, t0 + i * step, t0 + i * step + dur, E.back); const a = seg(t, t0 + i * step, t0 + i * step + dur * .6);
      g.save(); g.globalAlpha *= a; g.fillStyle = c; g.fillText(ch, cx, y + (1 - k) * dist); g.restore(); cx += g.measureText(ch).width; });
  }
  // typewriter
  function type(s, x, y, size, c, t, t0, cps = 18, weight = 700, align = "left", f = KR, caret = true) {
    const n = Math.floor(clamp((t - t0) * cps, 0, s.length)); const shown = [...s].slice(0, n).join("");
    txt(shown, x, y, size, c, weight, align, f);
    if (caret && t >= t0 && Math.floor(t * 2.5) % 2 === 0) { const w = tw(shown, size, weight, f); const cx = align === "center" ? x + w / 2 : x + w; g.fillStyle = c; g.fillRect(cx + 6, y - size * .8, size * .08 + 2, size * .95); }
    return n >= s.length;
  }
  function wrap(s, x, y, maxw, size, lh, c, weight = 500, align = "left", f = KR, maxLines = 9) {
    font(size, weight, f); const words = s.split(" "); let ln = "", n = 0; const out = [];
    for (const w of words) { const test = ln ? ln + " " + w : w; if (g.measureText(test).width > maxw && ln) { out.push(ln); ln = w; } else ln = test; }
    if (ln) out.push(ln); out.slice(0, maxLines).forEach((l, i) => txt(l, x, y + i * lh, size, c, weight, align, f)); return out.length;
  }
  function counter(v, dec = 0) { return v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  // transforms
  function at(x, y, s, rot, a, fn) { g.save(); g.translate(x, y); if (rot) g.rotate(rot); if (s !== 1) g.scale(s, s); if (a !== 1) g.globalAlpha *= a; fn(); g.restore(); }
  // device frames — fn draws screen content in local coords (0,0)-(w,h)
  function phone(cx, cy, w, h, fn, body = "#0d0f14") {
    const x = cx - w / 2, y = cy - h / 2, r = w * .14;
    g.save(); g.shadowColor = "rgba(0,0,0,.45)"; g.shadowBlur = 60; g.shadowOffsetY = 30; box(x, y, w, h, r, body); g.restore();
    const p = w * .035; g.save(); rr(x + p, y + p, w - 2 * p, h - 2 * p, r - p); g.clip(); g.translate(x + p, y + p); fn(w - 2 * p, h - 2 * p); g.restore();
    box(cx - w * .14, y + p + 14, w * .28, 30, 15, body);
  }
  function browser(x, y, w, h, url, fn, theme = "#ffffff") {
    g.save(); g.shadowColor = "rgba(0,0,0,.35)"; g.shadowBlur = 50; g.shadowOffsetY = 24; box(x, y, w, h, 22, theme); g.restore();
    box(x, y, w, 70, 22, "#e9ebf0"); g.fillStyle = "#e9ebf0"; g.fillRect(x, y + 40, w, 30);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => circ(x + 34 + i * 30, y + 35, 9, c));
    box(x + 140, y + 16, w - 170, 38, 19, "#fff"); txt(url, x + 162, y + 44, 22, "#556", 500, "left", MONO);
    g.save(); rr(x, y + 70, w, h - 70, 0); g.clip(); g.translate(x, y + 70); fn(w, h - 70); g.restore();
  }
  // simple icon paths
  function icon(name, x, y, s, c, lw = 8) {
    g.save(); g.translate(x, y); g.scale(s / 100, s / 100); g.strokeStyle = c; g.fillStyle = c; g.lineWidth = lw * 100 / s; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath();
    if (name === "check") { g.moveTo(-32, 2); g.lineTo(-8, 26); g.lineTo(36, -24); g.stroke(); }
    else if (name === "star") { for (let i = 0; i < 10; i++) { const r = i % 2 ? 22 : 50, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); }
    else if (name === "heart") { g.moveTo(0, 40); g.bezierCurveTo(-70, -10, -30, -60, 0, -22); g.bezierCurveTo(30, -60, 70, -10, 0, 40); g.fill(); }
    else if (name === "bolt") { g.moveTo(10, -50); g.lineTo(-30, 8); g.lineTo(0, 8); g.lineTo(-10, 50); g.lineTo(30, -8); g.lineTo(0, -8); g.closePath(); g.fill(); }
    else if (name === "arrow") { g.moveTo(-40, 0); g.lineTo(36, 0); g.moveTo(10, -26); g.lineTo(38, 0); g.lineTo(10, 26); g.stroke(); }
    else if (name === "x") { g.moveTo(-28, -28); g.lineTo(28, 28); g.moveTo(28, -28); g.lineTo(-28, 28); g.stroke(); }
    else if (name === "plus") { g.moveTo(-30, 0); g.lineTo(30, 0); g.moveTo(0, -30); g.lineTo(0, 30); g.stroke(); }
    else if (name === "bell") { g.moveTo(-34, 24); g.quadraticCurveTo(-30, -40, 0, -42); g.quadraticCurveTo(30, -40, 34, 24); g.closePath(); g.fill(); g.beginPath(); g.arc(0, 32, 10, 0, Math.PI * 2); g.fill(); }
    else if (name === "cart") { g.moveTo(-46, -34); g.lineTo(-30, -34); g.lineTo(-18, 16); g.lineTo(32, 16); g.lineTo(42, -20); g.lineTo(-24, -20); g.stroke(); g.beginPath(); g.arc(-12, 34, 8, 0, 7); g.arc(26, 34, 8, 0, 7); g.fill(); }
    else if (name === "truck") { g.rect(-48, -24, 56, 40); g.moveTo(8, -10); g.lineTo(32, -10); g.lineTo(46, 6); g.lineTo(46, 16); g.lineTo(8, 16); g.stroke(); g.beginPath(); g.arc(-28, 24, 10, 0, 7); g.arc(28, 24, 10, 0, 7); g.fill(); }
    g.restore();
  }
  // generic product shapes with a label
  function bottle(cx, by, w, h, body, cap, label, labelColor = "#111") {
    const x = cx - w / 2, y = by - h; box(cx - w * .18, y - h * .16, w * .36, h * .18, 10, cap);
    box(x, y, w, h, w * .22, body); const gr = g.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, "rgba(255,255,255,.0)"); gr.addColorStop(.2, "rgba(255,255,255,.35)"); gr.addColorStop(.35, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(0,0,0,.18)"); rr(x, y, w, h, w * .22); g.fillStyle = gr; g.fill();
    if (label) { box(x + w * .1, y + h * .38, w * .8, h * .3, 8, "rgba(255,255,255,.9)"); fit(label, cx, y + h * .56, w * .17, w * .7, labelColor, 900); }
  }
  function pouch(cx, by, w, h, body, label, sub, ink = "#fff") {
    const x = cx - w / 2, y = by - h; g.beginPath(); g.moveTo(x + 10, y); g.lineTo(x + w - 10, y); g.lineTo(x + w, y + h * .1); g.quadraticCurveTo(x + w + 8, y + h * .6, x + w - 6, y + h); g.lineTo(x + 6, y + h); g.quadraticCurveTo(x - 8, y + h * .6, x, y + h * .1); g.closePath(); g.fillStyle = body; g.fill();
    g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(x + 4, y + h * .08, w - 8, 6);
    const gr = g.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, "rgba(0,0,0,.18)"); gr.addColorStop(.3, "rgba(255,255,255,.15)"); gr.addColorStop(.6, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(0,0,0,.22)"); g.fillStyle = gr; g.fill();
    fit(label, cx, y + h * .45, w * .2, w * .8, ink, 900); if (sub) fit(sub, cx, y + h * .58, w * .075, w * .75, ink, 600);
  }
  function confetti(t, t0, n = 90, seed = 3, cols = ["#ff4d6d", "#ffd23f", "#3ec1d3", "#7b61ff", "#2ec27e"], ox = W / 2, oy = H * .45) {
    if (t < t0) return; const r = rng(seed), dt = t - t0;
    for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, v = 600 + r() * 1300, vx = Math.cos(a) * v * .8, vy = Math.sin(a) * v - 900, s = 10 + r() * 16, spin = r() * 10;
      const x = ox + vx * dt, y = oy + vy * dt + 1400 * dt * dt; if (y > H + 50) continue;
      g.save(); g.translate(x, y); g.rotate(spin * dt + i); g.scale(1, Math.cos(dt * 8 + i)); g.globalAlpha *= clamp(2.4 - dt); g.fillStyle = cols[i % cols.length]; g.fillRect(-s / 2, -s / 4, s, s / 2); g.restore(); }
  }
  // pixel sprite: rows of chars mapped through palette
  function sprite(rows, pal, x, y, px) { rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== "." && pal[ch]) { g.fillStyle = pal[ch]; g.fillRect(Math.round(x + i * px), Math.round(y + j * px), Math.ceil(px), Math.ceil(px)); } })); }
  function fadeIO(t, dur, a = .35, b = .45) { const k = Math.max(1 - seg(t, 0, a), seg(t, dur - b, dur)); if (k > 0) { g.save(); g.globalAlpha = k; fill("#000"); g.restore(); } }
  return { clamp, lerp, seg, E, ease, env, rng, mix, alpha, use, fill, vgrad, glow, vignette, grain, rr, box, circ, line, font, tw, txt, fit, rise, type, wrap, counter, at, phone, browser, icon, bottle, pouch, confetti, sprite, fadeIO, get g() { return g; } };
})();
