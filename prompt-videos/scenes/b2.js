// batch 2 — motion graphics
(() => {
const { E, ease, seg, env, lerp, clamp } = L;
const REC = "Expose window.render(t) that draws the frame at time t (seconds) deterministically, so it can be recorded frame by frame.";

// ---------- m02 kinetic typography manifesto ----------
{
  const beats = [["작게", "#ff5a36", "#111"], ["시작해도", "#111", "#ff5a36"], ["제대로", "#f4efe6", "#111"], ["만들면", "#111", "#f4efe6"], ["알아봐요", "#ff5a36", "#111"]];
  S.m02 = { dur: 10, meta: {
    cat: "motion", title: "한 단어씩 꽂히는 키네틱 타이포 브랜드 선언", poster: .82,
    desc: "화면을 꽉 채운 큰 글자가 박자에 맞춰 한 단어씩 꽂히고, 배경색이 매번 뒤집혀요. 마지막에 브랜드 이름이 정리되며 끝나요.",
    prompt: `Make a 10-second vertical (1080x1920) kinetic typography video as one HTML file with Canvas 2D. ${REC}

Message (one word per beat): [WORD 1] / [WORD 2] / [WORD 3] / [WORD 4] / [WORD 5]. Brand: [BRAND NAME], tagline: [TAGLINE].
Palette: [ACCENT COLOR], near-black #111, warm off-white.

0–6.5s: five beats of 1.3s. On each beat the background flips color (accent / black / off-white), and the word slams in at screen-filling size: starts at 160% scale with slight skew, snaps to 100% with a back-out ease in 0.25s, a thick underline wipes in under it, and small lines from the previous word fly off the top. Add a 2-frame white flash at each cut.
6.5–8.5s: the five words stack together as a tidy left-aligned poster on black, each line sliding in from the left with a 0.08s stagger.
8.5–10s: the brand name and tagline appear at the bottom; fade out.

Typography only — no images. Heavy Korean sans (Noto Sans KR Black), tight letter spacing.`,
    how: "다섯 단어(한 문장을 5개로 나눈 것)와 브랜드 이름, 색 하나만 바꾸세요. 박자를 노래에 맞추려면 'BPM 120에 맞춰 한 박에 한 단어'처럼 숫자를 같이 적어 주면 돼요."
  }, draw(t) {
    const g = L.g;
    if (t < 6.5) {
      const i = Math.min(4, Math.floor(t / 1.3)), lt = t - i * 1.3, [w, bg, fg] = beats[i];
      L.fill(bg); const k = ease(lt, 0, .25, E.back), s = lerp(1.6, 1, k), sk = lerp(.25, 0, k);
      g.save(); g.translate(W / 2, H / 2 + 60); g.transform(1, 0, -sk, 1, 0, 0); g.scale(s, s); L.fit(w, 0, 0, 300, 960, fg, 900, "center"); g.restore();
      const u = ease(lt, .2, .55, E.io), tw = Math.min(960, L.tw(w, 300)); L.box(W / 2 - tw / 2, H / 2 + 120, tw * u, 26, 13, fg);
      L.txt(String(i + 1).padStart(2, "0") + " / 05", 80, 160, 40, fg, 700, "left", MONO);
      if (lt < .07) { g.save(); g.globalAlpha = .7; L.fill("#fff"); g.restore(); }
      const r = L.rng(i + 3); for (let j = 0; j < 7; j++) { const y = H / 2 - 300 - lt * 1800 * (0.5 + r()), x = r() * W; L.box(x, y, 8, 120 + r() * 120, 4, L.alpha(fg === "#111" ? "#111111" : "#ffffff", .35 * (1 - seg(lt, 0, .6)))); }
    } else {
      L.fill("#111");
      beats.forEach(([w], i) => { const k = ease(t, 6.5 + i * .08, 7.1 + i * .08, E.out); L.at(lerp(-700, 0, k), 0, 1, 0, k, () => L.txt(w, 90, 420 + i * 220, 190, i % 2 ? "#f4efe6" : "#ff5a36", 900)); });
      L.at(0, 0, 1, 0, ease(t, 8.4, 9), () => { L.line(90, 1560, 990, 1560, "#f4efe6", 4); L.txt("하루공방", 90, 1680, 84, "#f4efe6", 900); L.txt("손으로 만드는 작은 가죽 브랜드", 90, 1750, 40, "#a39e95", 600); });
    }
    L.grain(t, .05);
  } };
}

// ---------- m03 stat counters ----------
{
  const stats = [["재구매율", 68, "%", 0, "#2ec27e", "heart"], ["누적 판매", 12400, "개", 0, "#3a86ff", "cart"], ["평균 별점", 4.9, " / 5", 1, "#ffbe0b", "star"]];
  S.m03 = { dur: 10, meta: {
    cat: "motion", title: "숫자 카운트업으로 보여 주는 브랜드 성과", poster: .75,
    desc: "카드 3장이 차례로 올라오며 큰 숫자가 0부터 빠르게 올라가고, 진행 막대와 아이콘이 함께 채워져요. 상세페이지 첫 화면이나 광고 마지막 장면용이에요.",
    prompt: `Create a 10-second vertical (1080x1920) "proof in numbers" motion graphic as one HTML file with Canvas 2D. ${REC}

Headline: "[HEADLINE]". Three stats (label, value, unit, color, icon): [재구매율 68%], [누적 판매 12,400개], [평균 별점 4.9/5]. Footer note: "[SOURCE / DATE]".

0–1.2s: headline rises in character by character at the top.
1.2–6.5s: three white cards (rounded 36px, soft shadow) slide up one after another (0.9s apart). In each card: a colored circular icon pops with a back ease, the big number counts up from 0 with ease-out-expo (keep thousands separators and decimals stable), and a thin progress bar fills to the matching ratio. When a count finishes, the number does a small 1.06x bump.
6.5–8.5s: the cards nudge together, a ribbon "[SHORT CLAIM]" stamps on the last card at a slight angle.
8.5–10s: footer note and brand name fade in; fade out.

Style: light gray-blue background with faint grid, navy text, tabular numbers (Inter or similar), Korean labels in Noto Sans KR.`,
    how: "숫자 3개와 단위, 출처 문구만 우리 실제 데이터로 바꿔 쓰세요. 숫자는 반드시 확인 가능한 실제 값으로 넣어야 광고 심의에서 문제가 없어요."
  }, draw(t) {
    const g = L.g; L.fill("#eef2f8"); g.strokeStyle = "rgba(30,50,90,.06)"; g.lineWidth = 2; for (let x = 0; x < W; x += 90) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y < H; y += 90) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    L.rise("숫자로 보는 하루공방", W / 2, 260, 78, "#14213d", t, .1, .04, .5);
    L.at(W / 2, 340, 1, 0, ease(t, .7, 1.2), () => L.txt("2025년 1월 ~ 12월 (예시)", 0, 0, 36, "#6b7a90", 600, "center"));
    const squeeze = ease(t, 6.5, 7.2, E.io) * 20;
    stats.forEach(([lab, v, unit, dec, col, ic], i) => {
      const t0 = 1.2 + i * .9, k = ease(t, t0, t0 + .6, E.out), y = 470 + i * (390 - squeeze) + (1 - k) * 200;
      L.at(0, 0, 1, 0, k, () => {
        g.save(); g.shadowColor = "rgba(20,33,61,.12)"; g.shadowBlur = 40; g.shadowOffsetY = 16; L.box(90, y, 900, 340, 36, "#fff"); g.restore();
        const p = ease(t, t0 + .2, t0 + .7, E.back); L.circ(210, y + 130, 70 * p, L.alpha(col, .15)); L.icon(ic, 210, y + 130, 70 * p, col, 9);
        L.txt(lab, 320, y + 105, 40, "#6b7a90", 700);
        const c = ease(t, t0 + .3, t0 + 2.1, E.expo), done = seg(t, t0 + 2.1, t0 + 2.4), bump = 1 + .06 * Math.sin(done * Math.PI);
        L.at(320, y + 205, bump, 0, 1, () => { const s = L.counter(v * c, dec); L.txt(s, 0, 0, 104, "#14213d", 900, "left", INTER); L.txt(unit, L.tw(s, 104, 900, INTER) + 10, 0, 46, "#14213d", 800); });
        const ratio = [.68, .82, .98][i]; L.box(130, y + 268, 820, 18, 9, "#edf0f5"); L.box(130, y + 268, 820 * ratio * c, 18, 9, col);
      });
    });
    const s = ease(t, 6.9, 7.4, E.back); if (s > 0) L.at(820, 1290, s, -.12, s, () => { L.box(-170, -50, 340, 100, 22, "#e63946"); L.txt("고객이 증명", 0, 16, 44, "#fff", 900, "center"); });
    L.at(W / 2, 1720, 1, 0, ease(t, 8.4, 9), () => { L.txt("하루공방", 0, 0, 64, "#14213d", 900, "center"); L.txt("※ 예시 수치 · 실제 데이터로 바꿔 쓰세요", 0, 70, 30, "#8a96a8", 500, "center"); });
  } };
}

// ---------- m05 sale countdown ----------
S.m05 = { dur: 10, meta: {
  cat: "motion", title: "가격이 뚝 떨어지는 마감 할인 카운트다운", poster: .62,
  desc: "디지털 타이머가 빠르게 줄어드는 동안 정가에 빨간 줄이 그어지고, 할인가가 쿵 하고 내려앉아요. '오늘만' 배지가 깜빡이는 타임세일 영상이에요.",
  prompt: `Create a 10-second vertical (1080x1920) flash-sale countdown ad as one HTML file with Canvas 2D. ${REC}

Product: [PRODUCT NAME]. Regular price: [39,000원]. Sale price: [19,900원]. Discount badge: [-49%]. Deadline text: "[오늘 밤 12시 마감]".
Palette: black, electric yellow #ffe14d, hot red.

0–1s: yellow diagonal stripes sweep across a black screen; "TIME SALE" slams in.
1–4s: a big seven-segment-style digital timer (draw segments as rounded bars) counts down quickly from 02:59:59 with the seconds blurring; a progress bar under it drains.
3–5.5s: the product card slides in; the regular price is shown, then a red strike line draws across it from left to right.
5.5–7s: the sale price drops from above and lands with a squash-and-stretch bounce and a screen shake of 8px; the discount badge stamps in at an angle with a starburst behind it.
7–10s: a "[오늘만]" pill blinks twice per second, the deadline text sits under the price; fade out.

Bold Korean type (Noto Sans KR Black), thick shapes, high contrast.`,
  how: "상품명, 정가·할인가·할인율, 마감 문구만 바꾸면 돼요. 타이머 시작 시간을 실제 남은 시간으로 바꾸고 싶으면 '03:00:00부터'처럼 적어 주세요."
}, draw(t) {
  const g = L.g; const shake = env(t, 5.9, 6.2, .02, .28) * 8; g.save(); g.translate(Math.sin(t * 90) * shake, Math.cos(t * 77) * shake);
  L.fill("#0c0c0c"); const sw = ease(t, 0, .7, E.io);
  g.save(); g.translate(W / 2, 260); g.rotate(-.2); for (let i = -12; i < 12; i++) { L.box(i * 120 - 1400 + sw * 1400, -110, 60, 220, 0, "#ffe14d"); } g.restore();
  const ts = ease(t, .4, .7, E.back); L.at(W / 2, 290, lerp(1.8, 1, ts), 0, seg(t, .4, .6), () => { L.box(-330, -110, 660, 190, 20, "#0c0c0c"); L.txt("TIME SALE", 0, 30, 120, "#ffe14d", 800, "center", INTER); });
  // seven segment timer
  const remain = Math.max(0, 10799 - Math.floor(ease(t, 1, 9.5, x => x) * 4200)), hh = Math.floor(remain / 3600), mm = Math.floor(remain / 60) % 60, ss = remain % 60;
  const str = [hh, mm, ss].map(n => String(n).padStart(2, "0")).join(":");
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  const tk = ease(t, .9, 1.4); g.save(); g.globalAlpha = tk; let x = 110; const y = 500, dw = 92, dh = 170, th = 18;
  for (const ch of str) { if (ch === ":") { L.circ(x + 16, y + 50, 10, "#ff3b3b"); L.circ(x + 16, y + 120, 10, "#ff3b3b"); x += 40; continue; }
    const on = SEG[ch]; const P = { a: [x + th, y, dw - 2 * th, th], b: [x + dw - th, y + th, th, dh / 2 - th * 1.5], c: [x + dw - th, y + dh / 2 + th / 2, th, dh / 2 - th * 1.5], d: [x + th, y + dh - th, dw - 2 * th, th], e: [x, y + dh / 2 + th / 2, th, dh / 2 - th * 1.5], f: [x, y + th, th, dh / 2 - th * 1.5], g: [x + th, y + dh / 2 - th / 2, dw - 2 * th, th] };
    for (const k in P) L.box(...P[k], th / 2, on.includes(k) ? "#ff3b3b" : "rgba(255,59,59,.1)"); x += dw + 18; }
  g.restore(); L.box(110, 720, 860, 16, 8, "rgba(255,255,255,.12)"); L.box(110, 720, 860 * remain / 10799 * tk, 16, 8, "#ffe14d");
  // product card
  const ck = ease(t, 3, 3.6, E.out); g.save(); g.translate(0, (1 - ck) * 1300); L.box(90, 820, 900, 900, 48, "#fff");
  L.bottle(300, 1450, 230, 470, "#ffe14d", "#222", "비타", "#111");
  L.txt("하루비타 멀티", 470, 980, 56, "#111", 900); L.txt("30일분 · 60정", 470, 1040, 36, "#777", 600);
  L.txt("39,000원", 470, 1170, 64, "#9a9a9a", 800, "left", INTER); const st = ease(t, 4.3, 4.9, E.io); L.line(462, 1150, 462 + 300 * st, 1150, "#ff3b3b", 10);
  const dp = ease(t, 5.5, 6.1, E.out), sq = env(t, 6.0, 6.35, .05, .3); L.at(470 + 170, lerp(900, 1330, dp), 1, 0, seg(t, 5.5, 5.7), () => { g.scale(1 + sq * .15, 1 - sq * .15); L.txt("19,900원", -170, 0, 100, "#ff3b3b", 900, "left", INTER); });
  g.restore();
  const bk = ease(t, 6.2, 6.6, E.back); if (bk > 0) L.at(850, 900, bk, .25, 1, () => { g.beginPath(); for (let i = 0; i < 28; i++) { const r = i % 2 ? 120 : 150, a = i / 28 * Math.PI * 2; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fillStyle = "#ff3b3b"; g.fill(); L.txt("-49%", 0, 22, 70, "#fff", 900, "center", INTER); });
  if (t > 7 && Math.floor(t * 4) % 2 === 0) { L.box(W / 2 - 170, 1530, 340, 110, 55, "#ffe14d"); L.txt("오늘만", W / 2, 1607, 64, "#111", 900, "center"); }
  L.at(W / 2, 1810, 1, 0, ease(t, 7.2, 7.7), () => L.txt("오늘 밤 12시 마감", 0, 0, 56, "#fff", 900, "center"));
  g.restore();
} };

// ---------- m06 teaser silhouette reveal ----------
S.m06 = { dur: 11, meta: {
  cat: "motion", title: "어둠 속 실루엣을 비추는 신제품 티저", poster: .78,
  desc: "깜깜한 무대에서 스포트라이트가 이리저리 움직이며 제품 윤곽만 살짝 보여 주다가, 마지막에 조명이 켜지며 정체가 공개돼요. 출시일 예고용이에요.",
  prompt: `Create an 11-second vertical (1080x1920) product teaser as one HTML file with Canvas 2D. ${REC}

Product: [PRODUCT NAME] (draw it as a simple stylized silhouette — e.g. a bottle, box or device — with [PRODUCT COLOR]). Launch date: [DATE]. Teaser line: "[TEASER LINE]".

0–1.5s: pitch black with dust particles drifting in a faint beam; a small line "[COMING SOON IN KOREAN]" fades in.
1.5–6s: one or two spotlights (radial gradients, additive) wander over the stage. Where the light passes, only the edge of the product shows (rim-light outline and a little glossy highlight); the rest stays black. The teaser line types in at the top.
6–7.5s: the lights converge on the center, flicker twice, then a full stage light snaps on: the product appears in full color with a reflection on a glossy floor and a soft bloom.
7.5–11s: the date appears in large thin numbers, then the product name below; slow push-in on everything; fade out.

Mood: cinematic, mysterious, film grain, vignette.`,
  how: "제품 모양(병·상자·기기 중 무엇인지)과 색, 출시일, 티저 문구만 바꾸면 돼요. 실제 제품 실루엣 PNG가 있으면 '이 이미지의 윤곽으로 그려 줘'라고 하세요."
}, draw(t) {
  const g = L.g; L.fill("#030304"); const push = 1 + .06 * ease(t, 7, 11, E.io);
  g.save(); g.translate(W / 2, H / 2); g.scale(push, push); g.translate(-W / 2, -H / 2);
  const on = ease(t, 6.7, 7.0) * (t > 6.2 && t < 6.7 ? (Math.floor(t * 18) % 2) : 1);
  const lights = [[lerp(200, 800, .5 + .5 * Math.sin(t * .9)), lerp(700, 1300, .5 + .5 * Math.sin(t * 1.3 + 1))], [lerp(900, 300, .5 + .5 * Math.sin(t * .7 + 2)), lerp(1300, 800, .5 + .5 * Math.cos(t * 1.1))]].map(([x, y]) => [lerp(x, W / 2, ease(t, 5.5, 6.4, E.io)), lerp(y, 1050, ease(t, 5.5, 6.4, E.io))]);
  // stage floor
  if (on > 0) { g.save(); g.globalAlpha = on; L.vgrad("#14161c", "#050506"); L.glow(W / 2, 1000, 900, "#7ee0ff", .18); g.restore(); }
  // product: draw full then mask with lights
  const draw = () => { L.bottle(W / 2, 1380, 300, 640, "#1d6b5f", "#d8c7a3", "SERUM", "#1d6b5f"); };
  const off = document.createElement("canvas"); off.width = W; off.height = H; L.use(off.getContext("2d")); draw(); L.use(g);
  if (on > 0) { g.save(); g.globalAlpha = on; g.drawImage(off, 0, 0); g.restore(); }
  if (on < 1 && t > 1.5) { const g2 = document.createElement("canvas"); g2.width = W; g2.height = H; const c2 = g2.getContext("2d"); c2.drawImage(off, 0, 0); c2.globalCompositeOperation = "destination-in";
    const lit = seg(t, 1.5, 2.2); c2.fillStyle = "rgba(0,0,0,0)"; const m = document.createElement("canvas"); m.width = W; m.height = H; const mc = m.getContext("2d");
    lights.forEach(([x, y]) => { const gr = mc.createRadialGradient(x, y, 0, x, y, 280); gr.addColorStop(0, `rgba(0,0,0,${.9 * lit})`); gr.addColorStop(1, "rgba(0,0,0,0)"); mc.fillStyle = gr; mc.fillRect(0, 0, W, H); });
    c2.drawImage(m, 0, 0); g.save(); g.globalAlpha = 1 - on; g.drawImage(g2, 0, 0); g.globalCompositeOperation = "lighter"; lights.forEach(([x, y]) => L.glow(x, y, 320, "#bfefff", .1 * lit)); g.restore(); }
  // reflection
  if (on > 0) { g.save(); g.globalAlpha = .18 * on; g.translate(0, 2760); g.scale(1, -1); g.drawImage(off, 0, 0); g.restore(); }
  // dust
  const r = L.rng(4); for (let i = 0; i < 60; i++) { const x = (r() * W + t * 20 * (r() - .5)) % W, y = (r() * H - t * 30 * r() + H) % H; L.circ(x, y, 1.5 + r() * 2, `rgba(220,240,255,${.25 * r()})`); }
  g.restore();
  L.at(W / 2, 300, 1, 0, env(t, .5, 6.4), () => L.txt("곧 공개됩니다", 0, 0, 44, "#9aa7b4", 600, "center"));
  if (t > 2.2 && t < 6.6) L.type("밤사이 피부가 달라지는 한 병", W / 2 - L.tw("밤사이 피부가 달라지는 한 병", 52, 700) / 2, 420, 52, "#e6f6ff", t, 2.2, 10, 700);
  L.rise("11.11", W / 2, 400, 200, "#e6f6ff", t, 7.4, .08, .5, 300, "center", INTER);
  L.at(W / 2, 520, 1, 0, ease(t, 8.2, 8.8), () => L.txt("결 나이트 세럼 출시", 0, 0, 56, "#7ee0ff", 800, "center"));
  L.vignette(.7); L.grain(t, .07);
} };

// ---------- m07 before / after wipe ----------
{
  function room(g, tidy) {
    L.fill(tidy ? "#f6f1e7" : "#d9d5cc"); L.box(0, 1400, W, 520, 0, tidy ? "#d8c3a5" : "#a9a196");
    // shelf unit
    L.box(180, 520, 720, 900, 18, tidy ? "#b08968" : "#8d8478");
    for (let i = 0; i < 3; i++) L.box(210, 560 + i * 290, 660, 250, 10, tidy ? "#f3e9dc" : "#bdb6aa");
    const r = L.rng(tidy ? 2 : 9);
    if (tidy) { const cols = ["#e76f51", "#2a9d8f", "#e9c46a"]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { L.box(235 + j * 215, 600 + i * 290, 185, 190, 14, cols[(i + j) % 3]); L.box(285 + j * 215, 640 + i * 290, 85, 26, 13, "rgba(255,255,255,.8)"); } }
    else { for (let i = 0; i < 26; i++) { g.save(); g.translate(240 + r() * 600, 600 + Math.floor(r() * 3) * 290 + r() * 140); g.rotate((r() - .5) * 1.2); L.box(-40, -30, 60 + r() * 80, 30 + r() * 60, 6, ["#7d7a73", "#9c958a", "#6c675f", "#a7a196"][i % 4]); g.restore(); }
      for (let i = 0; i < 14; i++) { g.save(); g.translate(100 + r() * 880, 1450 + r() * 300); g.rotate((r() - .5) * 2); L.box(-40, -20, 80 + r() * 60, 40, 8, ["#8a857c", "#6f6a62", "#a39d92"][i % 3]); g.restore(); } }
  }
  S.m07 = { dur: 11, meta: {
    cat: "motion", title: "가운데 손잡이를 밀어 보는 비포·애프터", poster: .45,
    desc: "화면 가운데 세로 손잡이가 좌우로 움직이며 정리 전과 정리 후를 번갈아 보여 줘요. 수납·청소·리모델링·보정 전후 비교에 바로 쓸 수 있어요.",
    prompt: `Create an 11-second vertical (1080x1920) before/after comparison as one HTML file with Canvas 2D. ${REC}

Subject: [WHAT CHANGES — e.g. 정리 전/후 선반]. Product: [PRODUCT NAME]. Before label "BEFORE", after label "AFTER".
Draw both scenes yourself as flat illustrations: BEFORE is gray, cluttered, items tilted at random angles; AFTER is warm, colorful, items lined up in matching boxes with labels.

0–1.5s: BEFORE fills the screen; a title "[TITLE]" drops in at the top.
1.5–7.5s: a vertical divider with a round handle (arrows inside) enters from the right and sweeps left to right and back twice with ease-in-out, revealing AFTER on its left side (clip-rect). The labels BEFORE/AFTER ride along at each side of the divider. Small sparkles pop on AFTER whenever the divider passes the middle.
7.5–9s: divider slides all the way so AFTER is full screen; a check badge pops.
9–11s: product name and a one-line benefit "[BENEFIT]" rise in at the bottom; fade out.

Flat vector look, soft shadows, Noto Sans KR.`,
    how: "무엇이 바뀌는지(전/후 장면 설명), 제품 이름, 혜택 한 줄을 바꾸면 돼요. 실제 전후 사진 2장이 있으면 '이 두 이미지를 BEFORE/AFTER로 써 줘'라고 하면 사진 비교 영상이 됩니다."
  }, draw(t) {
    const g = L.g; room(g, false);
    let p; if (t < 1.5) p = -.05; else if (t < 7.5) { const u = (t - 1.5) / 6; p = .5 - .42 * Math.cos(u * Math.PI * 4) * (1 - .3 * u); p = lerp(-.05, p, ease(t, 1.5, 2.2, E.io)); } else p = lerp(.5 - .42 * .7, 1.08, ease(t, 7.5, 8.6, E.io));
    // after on the left side of the divider (reveal)
    const dx = clamp(p, -.05, 1.08) * W; g.save(); g.beginPath(); g.rect(0, 0, dx, H); g.clip(); room(g, true); g.restore();
    L.line(dx, 0, dx, H, "#fff", 8); L.circ(dx, 1000, 64, "#fff"); L.txt("◀ ▶", dx, 1014, 34, "#333", 900, "center", INTER);
    L.box(dx + 30, 1110, 210, 70, 35, "rgba(0,0,0,.55)"); L.txt("BEFORE", dx + 135, 1158, 34, "#fff", 800, "center", INTER);
    L.box(dx - 240, 1110, 210, 70, 35, "#2a9d8f"); L.txt("AFTER", dx - 135, 1158, 34, "#fff", 800, "center", INTER);
    L.at(W / 2, 260, 1, 0, ease(t, .2, .8), () => { L.box(-420, -100, 840, 150, 40, "rgba(255,255,255,.92)"); L.txt("주말 10분 정리, 이렇게 달라져요", 0, 0, 50, "#264653", 900, "center"); });
    const ck = ease(t, 8.6, 9.1, E.back); if (ck > 0) { L.circ(W / 2, 1000, 110 * ck, "#2a9d8f"); L.icon("check", W / 2, 1000, 130 * ck, "#fff", 14); }
    L.at(W / 2, 1650, 1, 0, ease(t, 9, 9.6), () => { L.box(-440, -80, 880, 230, 40, "#264653"); L.txt("모듈 수납함 9칸 세트", 0, 0, 62, "#fff", 900, "center"); L.txt("넣기만 하면 정리 끝", 0, 80, 42, "#e9c46a", 700, "center"); });
  } };
}

// ---------- m08 review cards ----------
{
  const R = [["김**", "배송이 정말 빨랐어요. 포장도 꼼꼼해요", 5, "#ffadad"], ["이**", "두 번째 구매인데 여전히 만족해요", 5, "#a0c4ff"], ["박**", "선물했더니 반응이 좋았어요", 5, "#caffbf"], ["최**", "사진보다 실물이 더 예뻐요", 4, "#ffd6a5"]];
  S.m08 = { dur: 11, meta: {
    cat: "motion", title: "별점과 후기 카드가 쌓이는 구매 후기 영상", poster: .7,
    desc: "후기 카드가 한 장씩 날아와 쌓이고, 별이 하나씩 채워지며 마지막에 평균 별점이 크게 나와요. 실제 고객 후기를 넣어 쓰는 템플릿이에요.",
    prompt: `Create an 11-second vertical (1080x1920) customer-review highlight video as one HTML file with Canvas 2D. ${REC}

Brand: [BRAND]. Reviews (masked name, text, stars): [REVIEW 1], [REVIEW 2], [REVIEW 3], [REVIEW 4] — use real reviews only. Average: [4.9], review count: [N개].

0–1s: headline "[HEADLINE]" rises in; a small label "실제 구매 후기" under it.
1–7s: four review cards (white, rounded, avatar circle with the first letter, masked name, star row, text) fly in one by one from alternating sides with a slight rotation, land in a loose stack (each new card overlaps the previous by 40%), and their 5 stars fill one after another with a little pop.
7–9s: the stack slides up and shrinks; a big rating "[4.9]" counts up with a row of five large stars filling to the matching fraction.
9–11s: "[REVIEW COUNT]" and the brand name appear; fade out.

Pastel background, soft shadows, Noto Sans KR. Keep the stars as drawn shapes (no emoji).`,
    how: "후기 4개는 반드시 실제 고객 후기로 바꿔 넣으세요(이름은 김** 처럼 가려서). 평균 별점과 후기 수도 실제 값으로 넣어야 해요."
  }, draw(t) {
    const g = L.g; L.vgrad("#fff4f0", "#f0f4ff");
    L.rise("이번 달 받은 후기", W / 2, 220, 78, "#2b2d42", t, 0, .05, .5);
    L.at(W / 2, 290, 1, 0, ease(t, .5, 1), () => L.txt("후기 예시 · 실제 후기로 바꿔 쓰세요", 0, 0, 34, "#8d99ae", 600, "center"));
    const up = ease(t, 7, 7.8, E.io);
    g.save(); g.translate(W / 2, lerp(0, -180, up)); g.scale(lerp(1, .78, up), lerp(1, .78, up)); g.translate(-W / 2, 0);
    R.forEach(([nm, tx, st, col], i) => {
      const t0 = 1 + i * 1.4, k = ease(t, t0, t0 + .6, E.out), side = i % 2 ? 1 : -1, y = 420 + i * 270;
      if (k <= 0) return;
      g.save(); g.translate(W / 2 + side * (1 - k) * 900, y + 130); g.rotate(side * (1 - k) * .5 + (i % 2 ? .02 : -.025));
      g.shadowColor = "rgba(43,45,66,.15)"; g.shadowBlur = 40; g.shadowOffsetY = 18; L.box(-430, -130, 860, 260, 32, "#fff"); g.shadowColor = "transparent";
      L.circ(-330, -40, 52, col); L.txt(nm[0], -330, -24, 46, "#2b2d42", 900, "center"); L.txt(nm, -255, -50, 36, "#2b2d42", 800);
      for (let s = 0; s < 5; s++) { const sk = ease(t, t0 + .5 + s * .1, t0 + .7 + s * .1, E.back); L.icon("star", -240 + s * 52, -2, 44, "#e5e5e5"); if (s < st && sk > 0) L.icon("star", -240 + s * 52, -2, 44 * sk, "#ffb703"); }
      L.fit(tx, 0, 80, 40, 780, "#3d405b", 700, "center");
      g.restore();
    });
    g.restore();
    const rk = ease(t, 7.4, 9); if (rk > 0) L.at(W / 2, 1520, 1, 0, seg(t, 7.4, 7.8), () => {
      L.txt(L.counter(4.9 * rk, 1), 0, 0, 180, "#2b2d42", 900, "center", INTER);
      for (let s = 0; s < 5; s++) { const x = -260 + s * 130; L.icon("star", x, 110, 110, "#e5e5e5"); g.save(); g.beginPath(); g.rect(x - 60, 40, 120 * clamp(4.9 * rk - s), 140); g.clip(); L.icon("star", x, 110, 110, "#ffb703"); g.restore(); }
    });
    L.at(W / 2, 1800, 1, 0, ease(t, 9, 9.5), () => L.txt("후기 1,284개 · 하루공방", 0, 0, 44, "#2b2d42", 800, "center"));
  } };
}

// ---------- m09 plan comparison ----------
{
  const plans = [["베이직", "9,900", "#8ecae6"], ["스탠다드", "19,900", "#ffb703"], ["프리미엄", "29,900", "#fb8500"]];
  const rows = ["주 1회 배송", "무료 반품", "전용 상담", "추가 사은품"], has = [[1, 0, 0, 0], [1, 1, 1, 0], [1, 1, 1, 1]];
  S.m09 = { dur: 11, meta: {
    cat: "motion", title: "요금제·옵션 비교표가 펼쳐지는 영상", poster: .78,
    desc: "세 가지 옵션 카드가 올라오고 혜택 항목에 체크가 한 줄씩 찍혀요. 추천 옵션이 앞으로 튀어나오며 리본이 붙어요.",
    prompt: `Create an 11-second vertical (1080x1920) plan/option comparison animation as one HTML file with Canvas 2D. ${REC}

Options (name, price, color): [BASIC 9,900원], [STANDARD 19,900원], [PREMIUM 29,900원]. Recommended: [STANDARD].
Feature rows: [FEATURE 1], [FEATURE 2], [FEATURE 3], [FEATURE 4] with which option includes which.

0–1.2s: title "[TITLE]" rises in.
1.2–3s: three tall columns rise from the bottom with a 0.15s stagger; each header shows the name and price (price counts up).
3–7s: feature labels appear on the left column of a table; for each row, check marks (drawn strokes that draw on) or faint dashes appear in each column, row by row, 0.7s apart.
7–9s: the recommended column scales up 1.08x and lifts with a stronger shadow; a ribbon "추천" folds onto its top corner; the other columns dim slightly.
9–11s: CTA "[CTA]" button pulses under the table; fade out.

Clean SaaS pricing-page look, light background, Noto Sans KR, prices in Inter.`,
    how: "옵션 이름·가격과 비교 항목 4개, 각 옵션에 포함되는지(O/X)만 바꾸면 돼요. 상품 구성(1개/3개/6개 세트)을 비교해도 잘 어울려요."
  }, draw(t) {
    const g = L.g; L.fill("#f7f9fc");
    L.rise("나에게 맞는 구독 고르기", W / 2, 230, 70, "#023047", t, 0, .04, .5);
    const cw = 240, gap = 20, x0 = 1080 - 3 * cw - 2 * gap - 60, top = 420, h = 1080;
    rows.forEach((r, j) => { const k = ease(t, 3 + j * .7, 3.4 + j * .7); L.at(0, 0, 1, 0, k, () => L.fit(r, 175, top + 330 + j * 170, 34, 240, "#023047", 700, "center")); });
    plans.forEach(([nm, pr, col], i) => {
      const k = ease(t, 1.2 + i * .15, 2 + i * .15, E.out), rec = i === 1 ? ease(t, 7, 7.6, E.back) : 0, dim = i !== 1 ? .35 * ease(t, 7, 7.6) : 0;
      const x = x0 + i * (cw + gap);
      g.save(); g.translate(x + cw / 2, top + h / 2 + (1 - k) * 1300 - rec * 30); g.scale(1 + .08 * rec, 1 + .08 * rec); g.globalAlpha = 1 - dim;
      g.shadowColor = "rgba(2,48,71,.18)"; g.shadowBlur = 30 + 40 * rec; g.shadowOffsetY = 14; L.box(-cw / 2, -h / 2, cw, h, 30, "#fff"); g.shadowColor = "transparent";
      L.box(-cw / 2, -h / 2, cw, 220, 30, col); g.fillStyle = col; g.fillRect(-cw / 2, -h / 2 + 180, cw, 40);
      L.txt(nm, 0, -h / 2 + 80, 40, "#023047", 900, "center"); const pv = Math.round(parseInt(pr.replace(",", "")) * ease(t, 1.6 + i * .15, 2.6 + i * .15, E.expo) / 100) * 100;
      L.txt(L.counter(pv), 0, -h / 2 + 160, 50, "#023047", 800, "center", INTER); L.txt("원/월", 0, -h / 2 + 205, 26, "#023047", 600, "center");
      rows.forEach((r, j) => { const yy = -h / 2 + 320 + j * 170, ck = seg(t, 3.1 + j * .7, 3.5 + j * .7);
        if (has[i][j]) { if (ck > 0) { g.save(); g.beginPath(); g.rect(-60, yy - 60, 120 * ck, 120); g.clip(); L.circ(0, yy, 40, L.alpha(col, .25)); L.icon("check", 0, yy, 56, "#023047", 10); g.restore(); } }
        else if (ck > 0) L.line(-20, yy, -20 + 40 * ck, yy, "#c9d2dc", 8); });
      if (i === 1 && rec > 0) { g.save(); g.translate(cw / 2 - 10, -h / 2 + 10); g.rotate(.5); L.box(-90 * rec, -26, 180 * rec, 52, 8, "#e63946"); if (rec > .6) L.txt("추천", 0, 14, 34, "#fff", 900, "center"); g.restore(); }
      g.restore();
    });
    const b = ease(t, 9, 9.5, E.back); if (b > 0) L.at(W / 2, 1680, b * (1 + .03 * Math.sin(t * 8)), 0, b, () => { L.box(-380, -70, 760, 140, 70, "#023047"); L.txt("첫 달 50% 할인으로 시작", 0, 16, 48, "#fff", 900, "center"); });
  } };
}

// ---------- m10 one shape morphs into UI ----------
{
  const st = [ // [w,h,r,color,label]
    [220, 220, 110, "#7b61ff", "점 하나에서"], [300, 150, 75, "#2ec4b6", "스위치"], [560, 140, 40, "#ff6b6b", "버튼"], [700, 60, 30, "#ffbe0b", "슬라이더"], [640, 820, 48, "#ffffff", "카드"], [300, 300, 72, "#3a86ff", "앱 아이콘"]];
  S.m10 = { dur: 12, meta: {
    cat: "motion", title: "도형 하나가 UI 요소로 계속 변신하는 영상", poster: .5,
    desc: "동그라미 하나가 스위치, 버튼, 슬라이더, 카드, 앱 아이콘으로 매끄럽게 모양을 바꾸며 이어져요. 앱·서비스 브랜딩이나 디자이너 소개용이에요.",
    prompt: `Create a 12-second vertical (1080x1920) shape-morphing UI animation as one HTML file with Canvas 2D. ${REC}

One rounded rectangle is the hero. It morphs through these states, interpolating width, height, corner radius and color with ease-in-out (0.7s morph, ~1.2s hold each):
1) circle "[LABEL 1]" → 2) toggle switch (pill with a knob that slides on) → 3) primary button with text "[BUTTON TEXT]" that gets pressed (scale 0.96 + ripple) → 4) slider track with a handle that drags from 20% to 80% while a value counts → 5) a card (white, shadow) whose inner lines and image block draw in → 6) an app icon with a simple glyph, which finally reveals "[APP NAME]" under it.
A small caption under the shape names each state and swaps with a vertical slide.
Background: soft dark navy with a subtle dot grid that slowly drifts. Everything centered.

End (11–12s): fade to black. Use Noto Sans KR for captions.`,
    how: "변신 단계 이름과 색, 마지막 앱 이름만 바꾸면 돼요. 우리 앱에 있는 실제 UI 요소(예: 장바구니 버튼, 별점)를 단계로 넣어 달라고 하면 더 우리 것처럼 보여요."
  }, draw(t) {
    const g = L.g; L.fill("#0f1530"); for (let x = 0; x < W; x += 60) for (let y = 0; y < H; y += 60) L.circ(x + (t * 10) % 60, y, 2.5, "rgba(255,255,255,.08)");
    const per = 1.9, i = Math.min(st.length - 1, Math.floor(t / per)), lt = t - i * per, nx = Math.min(st.length - 1, i + 1);
    const k = i === st.length - 1 ? 0 : ease(lt, 1.2, 1.9, E.io), A = st[i], B = st[nx];
    const w = lerp(A[0], B[0], k), h = lerp(A[1], B[1], k), r = lerp(A[2], B[2], k), col = L.mix(A[3], B[3], k), cx = W / 2, cy = 900;
    g.save(); g.shadowColor = "rgba(0,0,0,.35)"; g.shadowBlur = 50; g.shadowOffsetY = 20; L.box(cx - w / 2, cy - h / 2, w, h, r, col); g.restore();
    const inner = 1 - Math.min(1, k * 3);
    g.save(); g.globalAlpha = inner * seg(lt, .15, .5);
    if (i === 1) { const on = ease(lt, .4, .8, E.back); L.circ(cx - 75 + 150 * on, cy, 60, "#fff"); }
    if (i === 2) { const pr = env(lt, .5, .9, .1, .2); g.save(); g.translate(cx, cy); g.scale(1 - .04 * pr, 1 - .04 * pr); L.txt("지금 시작하기", 0, 16, 46, "#fff", 900, "center"); g.restore(); const rp = seg(lt, .55, 1.1); if (rp > 0 && rp < 1) { g.save(); L.rr(cx - w / 2, cy - h / 2, w, h, r); g.clip(); L.circ(cx + 40, cy, rp * 400, `rgba(255,255,255,${.3 * (1 - rp)})`); g.restore(); } }
    if (i === 3) { const v = lerp(.2, .8, ease(lt, .2, 1.1, E.io)); L.box(cx - 350, cy - 30, 700 * v, 60, 30, "#fb8500"); L.circ(cx - 350 + 700 * v, cy, 54, "#fff"); L.txt(Math.round(v * 100) + "%", cx - 350 + 700 * v, cy - 90, 48, "#ffbe0b", 900, "center", INTER); }
    if (i === 4) { const d = ease(lt, .2, 1); L.box(cx - 280, cy - 370, 560 * d, 340, 28, "#e8ecf8"); L.box(cx - 280, cy + 20, 420 * d, 40, 20, "#1c2541"); L.box(cx - 280, cy + 90, 520 * d, 26, 13, "#c5cbe0"); L.box(cx - 280, cy + 140, 360 * d, 26, 13, "#c5cbe0"); L.box(cx - 280, cy + 230, 200 * d, 80, 40, "#7b61ff"); }
    if (i === 5) { L.icon("bolt", cx, cy, 150, "#fff"); }
    g.restore();
    const lk = ease(lt, 0, .4); L.at(cx, 1500 + (1 - lk) * 40, 1, 0, lk * (1 - seg(lt, 1.25, 1.5) * (i < 5 ? 1 : 0)), () => { L.txt(A[4], 0, 0, 60, "#fff", 800, "center"); L.txt(`0${i + 1}`, 0, -90, 32, "rgba(255,255,255,.4)", 700, "center", MONO); });
    if (i === 5) L.at(cx, 1180, 1, 0, ease(lt, .5, 1), () => L.txt("BOLT", 0, 0, 80, "#fff", 800, "center", INTER));
  } };
}
})();
