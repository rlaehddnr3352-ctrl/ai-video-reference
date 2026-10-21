// batch 6 — game / interactive look
(() => {
const { E, ease, seg, env, lerp, clamp } = L;
const REC = "Expose window.render(t) that draws the frame at time t (seconds) deterministically, so it can be recorded frame by frame.";
const PX = "'DejaVu Sans Mono', monospace";

// ---------- g01 pixel wizard ----------
{
  const WIZ = ["....pppp....", "...pppppp...", "..pppyppppp.", ".pppppppppp.", "pppppppppppp", "...ssssss...", "...sbssbs...", "...ssssss...", "..wwwwwwww..", ".wwwwwwwwww.", ".ppwppppwpp.", ".pppppppppp.", ".pppppppppp.", "..pppppppp..", "..bb....bb.."];
  const PAL = { p: "#5b3cc4", y: "#ffd23f", s: "#f2c79b", b: "#2b2b2b", w: "#e8e8e8" };
  S.g01 = { dur: 11, meta: {
    cat: "interactive", title: "주문을 외우면 상품이 나타나는 픽셀아트 마법사", poster: .62,
    desc: "8비트 게임 같은 픽셀 마법사가 지팡이를 휘두르면 별가루가 모여 상품이 '짠' 하고 소환돼요. 게임 감성 이벤트·신상 공개에 좋아요.",
    prompt: `Create an 11-second vertical (1080x1920) pixel-art animation as one HTML file with Canvas 2D (imageSmoothingEnabled = false). ${REC}

Story: a pixel wizard summons [PRODUCT]. Spell text: "[SPELL — e.g. 신상 소환!]". Item name: "[ITEM NAME]". Price/label: "[LABEL]".

Draw everything as pixel sprites from small string arrays (one character per pixel, palette map), scaled up 12–16x. Night sky with twinkling pixel stars, a stone floor made of pixel tiles.
0–1.5s: the wizard bounces in place (2-frame idle animation, 0.25s per frame); a game-style dialog box at the bottom types the spell with a blinking ▼.
1.5–4s: the wizard raises the staff; a magic circle (rotating pixel ring with runes = small squares) appears on the floor; pixel sparkles spiral upward.
4–6s: flash (white frame for 2 frames), screen shake, and the item sprite appears floating above the circle with a pixel glow outline; "ITEM GET!" banner drops in like a retro game.
6–9s: an RPG-style stat box shows the item name and 3 stats with bars filling ("[STAT 1]", "[STAT 2]", "[STAT 3]").
9–11s: "[CTA]" in a blinking 'PRESS START' style; fade out.

Limited 16-color palette, crisp pixels, no anti-aliasing.`,
    how: "소환할 상품, 주문 문구, 능력치 3개(예: 보습력·향·가성비), 마지막 문구만 바꾸면 돼요. 상품 사진이 있으면 '이 상품을 32x32 픽셀아트로 그려 줘'라고 하세요."
  }, draw(t) {
    const g = L.g; g.imageSmoothingEnabled = false; const shake = env(t, 4, 4.4, .02, .35) * 14; g.save(); g.translate(Math.round(Math.sin(t * 80) * shake), Math.round(Math.cos(t * 70) * shake));
    L.fill("#140c2b"); const r = L.rng(2); for (let i = 0; i < 70; i++) { const x = Math.floor(r() * 90) * 12, y = Math.floor(r() * 90) * 12, on = Math.sin(t * 3 + i) > .2; if (on) L.box(x, y, 12, 12, 0, i % 5 ? "#c9c3ff" : "#ffd23f"); }
    for (let x = 0; x < W; x += 72) for (let y = 1320; y < H; y += 48) L.box(x + ((y / 48) % 2) * 36, y, 68, 44, 0, (x + y) % 3 ? "#3a3357" : "#463e66");
    const ring = ease(t, 1.5, 2.2); if (ring > 0) { g.save(); g.translate(W / 2 + 120, 1290); g.scale(1, .32); for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2 + t * 1.5; if (i / 36 < ring) L.box(Math.cos(a) * 300 - 12, Math.sin(a) * 300 - 12, 24, 24, 0, i % 3 ? "#7bdff2" : "#ffd23f"); } g.restore(); }
    if (t > 1.6 && t < 6) for (let i = 0; i < 24; i++) { const ph = (t * .8 + i / 24) % 1, a = i * 2.4 + ph * 6, rad = 260 * (1 - ph); L.box(W / 2 + 120 + Math.cos(a) * rad - 9, 1290 - ph * 600 - 9, 18, 18, 0, i % 2 ? "#fff" : "#7bdff2"); }
    const fr = Math.floor(t * 4) % 2, raise = t > 1.5; L.sprite(WIZ, PAL, 140, 860 + (fr && !raise ? 12 : 0), 30);
    const sx = 140 + 12 * 30, sy = raise ? 760 : 900; L.line(sx, sy, sx, sy + 420, "#8b5a2b", 18, "butt"); L.box(sx - 24, sy - 24, 48, 48, 0, "#ffd23f"); if (raise) L.glow(sx, sy, 90, "#ffd23f", .5 + .3 * Math.sin(t * 10));
    const it = ease(t, 4.1, 4.7, E.back); if (it > 0) { const bob = Math.sin(t * 3) * 14; g.save(); g.translate(W / 2 + 120, 860 + bob); g.scale(it, it); L.glow(0, 0, 240, "#7bdff2", .45);
      L.sprite(["....bbbb....", "...b.ww.b...", "..bbbbbbbb..", "..bmmmmmmb..", "..bmyyyymb..", "..bmyyyymb..", "..bmmmmmmb..", "..bmmmmmmb..", "..bbbbbbbb.."], { b: "#fff", w: "#bde0fe", m: "#ff7aa2", y: "#ffd23f" }, -192, -150, 32); g.restore(); }
    if (t > 4 && t < 4.08) L.fill("#ffffff");
    const gb = ease(t, 4.5, 5, E.back); if (gb > 0) L.at(W / 2, 300, gb, 0, 1, () => { L.box(-330, -80, 660, 140, 0, "#ffd23f"); L.box(-318, -68, 636, 116, 0, "#e63946"); L.txt("ITEM GET!", 0, 22, 70, "#fff", 900, "center", PX); });
    if (t < 6) { L.box(60, 1500, 960, 300, 0, "#ffffff"); L.box(72, 1512, 936, 276, 0, "#1a1240"); L.type("마법사: 신상 소환!", 110, 1600, 50, "#fff", t, .3, 12, 700, "left", KR, false); if (t > 1.2 && Math.floor(t * 3) % 2) L.txt("▼", 960, 1750, 40, "#fff", 700, "center"); }
    else { const sk = ease(t, 6, 6.4); g.save(); g.globalAlpha = sk; L.box(60, 1400, 960, 420, 0, "#ffffff"); L.box(72, 1412, 936, 396, 0, "#1a1240"); L.txt("촉촉 립밤 +1", 110, 1490, 54, "#ffd23f", 900);
      [["보습", .9], ["향기", .7], ["휴대성", 1]].forEach(([nm, v], i) => { const y = 1570 + i * 76; L.txt(nm, 110, y + 30, 38, "#fff", 700); L.box(340, y, 620, 40, 0, "#3a3357"); const k = ease(t, 6.3 + i * .4, 7 + i * .4); for (let b = 0; b < Math.floor(15 * v * k); b++) L.box(346 + b * 41, y + 6, 35, 28, 0, ["#7bdff2", "#ffd23f", "#ff7aa2"][i]); }); g.restore(); }
    g.restore();
    if (t > 9 && Math.floor(t * 3) % 2 === 0) L.txt("PRESS START", W / 2, 1880, 44, "#ffd23f", 900, "center", PX);
  } };
}

// ---------- g02 platformer run ----------
{
  const HERO = ["..rrrr..", ".rrrrrr.", ".sseses.", ".ssssss.", "..bbbb..", ".bbbbbb.", "s.bbbb.s", "..b..b..", ".kk..kk."], HP = { r: "#e63946", s: "#f2c79b", e: "#222", b: "#1d70b8", k: "#5a3a1a" };
  S.g02 = { dur: 12, meta: {
    cat: "interactive", title: "레트로 게임 캐릭터가 코인을 먹으며 달리는 광고", poster: .5,
    desc: "옛날 횡스크롤 게임처럼 캐릭터가 달리고 점프하며 코인(혜택)을 모으다가, 마지막 깃발에서 '스테이지 클리어'와 함께 제품이 나와요.",
    prompt: `Create a 12-second vertical (1080x1920) retro side-scrolling game ad as one HTML file with Canvas 2D (crisp pixels, imageSmoothingEnabled false). ${REC}

Hero: a small pixel character (draw from a string array, 2-frame run cycle). Collectibles = benefits: coins labeled "[BENEFIT 1]", "[BENEFIT 2]", "[BENEFIT 3]". Goal: a flag pole + a pixel version of [PRODUCT]. HUD: score, coin count, timer.

World: parallax layers — sky gradient, far pixel mountains (slow), clouds (medium), ground tiles with grass top (fast). The camera scrolls right at constant speed; the hero stays around 30% from the left.
0–8s: the hero runs; at 3 timed moments it jumps (parabolic arc) over a block/pipe and hits a coin: the coin spins (scaleX oscillates), pops "+[BENEFIT]" text that floats up, and the score increments with a little bump. A brick with "?" gets bumped and releases a power-up.
8–10s: the flag pole arrives; the hero slides down; "STAGE CLEAR" banner in a pixel font; fireworks made of pixel squares.
10–12s: product sprite and "[CTA]" appear in the HUD style; fade out.`,
    how: "코인에 쓸 혜택 3개(예: 무료배송·1+1·적립 5%), 마지막 제품과 문구만 바꾸면 돼요. 캐릭터를 우리 마스코트로 바꾸고 싶으면 '이 캐릭터를 16x16 픽셀로'라고 이미지와 함께 주세요."
  }, draw(t) {
    const g = L.g; g.imageSmoothingEnabled = false; const cam = Math.min(t, 9) * 420;
    L.vgrad("#7ec8ff", "#d3f0ff"); for (let i = -1; i < 6; i++) { const x = ((i * 400 - cam * .15) % 2400 + 2400) % 2400 - 300; g.beginPath(); g.moveTo(x, 1300); g.lineTo(x + 200, 900); g.lineTo(x + 400, 1300); g.fillStyle = "#8fb8de"; g.fill(); }
    for (let i = 0; i < 5; i++) { const x = ((i * 330 - cam * .4) % 1600 + 1600) % 1600 - 200; L.box(x, 300 + (i % 3) * 140, 180, 48, 0, "#fff"); L.box(x + 36, 264 + (i % 3) * 140, 108, 40, 0, "#fff"); }
    const gy = 1400; for (let x = -((cam) % 96); x < W; x += 96) { L.box(x, gy, 96, 30, 0, "#3fae49"); L.box(x, gy + 30, 96, 520, 0, "#b5651d"); L.box(x + 8, gy + 40, 36, 30, 0, "#8a4b15"); }
    const jumps = [1.4, 3.6, 5.8], coins = ["무료배송", "1+1", "적립 5%"];
    let hy = 0; jumps.forEach(j => { const u = (t - j) / .9; if (u > 0 && u < 1) hy = Math.sin(u * Math.PI) * 330; });
    const slide = ease(t, 9, 9.8, E.io);
    jumps.forEach((j, i) => { const wx = (j + .45) * 420 + 300 - cam; L.box(wx - 60, gy - 120, 120, 120, 0, i === 1 ? "#f4a261" : "#2a9d8f"); L.box(wx - 70, gy - 140, 140, 30, 0, i === 1 ? "#e76f51" : "#21867a");
      const got = t > j + .45; const cy = gy - 520; if (!got) { const sp = Math.abs(Math.cos(t * 6 + i)); L.at(wx, cy, 1, 0, 1, () => { g.scale(sp, 1); L.circ(0, 0, 44, "#ffd23f"); L.circ(0, 0, 30, null, "#e9a400", 8); }); }
      else { const k = seg(t, j + .45, j + 1.4); if (k < 1) L.at(wx, cy - k * 160, 1, 0, 1 - k, () => L.txt("+" + coins[i], 0, 0, 50, "#fff", 900, "center")); } });
    const flagX = 9 * 420 + 300 - cam + 380; L.line(flagX, gy, flagX, 500, "#ddd", 14, "butt"); L.box(flagX - 120, 520 + slide * 700, 120, 80, 0, "#e63946"); L.box(flagX - 40, gy - 60, 80, 60, 0, "#555");
    const hx = t < 9 ? 300 : lerp(300, flagX - 120, ease(t, 8.6, 9.1)); const hyy = t < 9 ? gy - 9 * 24 - hy : lerp(600, gy - 216, slide);
    const fr = Math.floor(t * 8) % 2; L.sprite(HERO, HP, hx - 96, hyy + (fr && hy === 0 && t < 9 ? -6 : 0), 24);
    const score = jumps.filter(j => t > j + .45).length; L.box(0, 0, W, 130, 0, "rgba(0,0,0,.35)"); L.txt("SCORE " + String(score * 1000).padStart(6, "0"), 40, 85, 36, "#fff", 900, "left", PX); L.txt("● x" + score, 640, 85, 36, "#ffd23f", 900, "left", PX); L.txt("TIME " + Math.max(0, 300 - Math.floor(t * 9)), 820, 85, 30, "#fff", 900, "left", PX);
    if (t > 9.2) { const b = ease(t, 9.2, 9.6, E.back); L.at(W / 2, 760, b, 0, 1, () => { L.box(-420, -90, 840, 160, 0, "#1a1240"); L.txt("STAGE CLEAR!", 0, 22, 66, "#ffd23f", 900, "center", PX); });
      const r = L.rng(Math.floor((t - 9.2) / .6)); for (let f = 0; f < 3; f++) { const k = ((t - 9.2) % .6) / .6, cx = 200 + r() * 680, cy = 300 + r() * 300; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; L.box(cx + Math.cos(a) * k * 160, cy + Math.sin(a) * k * 160, 16, 16, 0, ["#ffd23f", "#ff7aa2", "#7bdff2"][f]); } } }
    const ck = ease(t, 10, 10.5); if (ck > 0) L.at(W / 2, 1640, 1, 0, ck, () => { L.box(-440, -70, 880, 140, 0, "#e63946"); L.txt("지금 혜택 3개 모두 받기", 0, 18, 50, "#fff", 900, "center"); });
  } };
}

// ---------- g04 roulette ----------
{
  const SL = [["5%", "#ff6b6b"], ["무료배송", "#ffd166"], ["10%", "#06d6a0"], ["사은품", "#4cc9f0"], ["1+1", "#b388eb"], ["꽝 없음", "#f78c6b"], ["15%", "#83c5be"], ["적립금", "#ffafcc"]];
  S.g04 = { dur: 11, meta: {
    cat: "interactive", title: "돌림판을 돌려 혜택을 뽑는 이벤트 영상", poster: .7,
    desc: "알록달록한 돌림판이 빠르게 돌다가 천천히 멈추고, 바늘이 가리킨 칸이 커지며 당첨 혜택이 나와요. 라이브 방송·매장 이벤트 홍보에 좋아요.",
    prompt: `Create an 11-second vertical (1080x1920) prize-wheel event video as one HTML file with Canvas 2D. ${REC}

Event: "[EVENT TITLE]". Wheel slots (label, color) — 8 slots: [SLOT 1] … [SLOT 8]. Winning slot: [WINNER].

Wheel: big circle with 8 colored wedges, labels rotated along each wedge, a thick white rim with bulbs (small circles that light up in a chasing pattern), a center hub with the brand initial, and a pointer at the top.
0–1s: the wheel spins in from small with a bounce; title rises in.
1–7.5s: the wheel spins fast then decelerates with a cubic ease-out so it lands exactly on the winning slot (compute the final angle so the winner's center is under the pointer); the pointer flicks back each time a wedge boundary passes (spring wobble).
7.5–9s: the winning wedge glows and scales out a little; confetti bursts; banner "[WIN MESSAGE]" drops.
9–11s: "[HOW TO JOIN]" line; fade out.

Bright, festive, Noto Sans KR Black for labels.`,
    how: "칸 8개의 혜택과 색, 당첨 칸, 참여 방법 문구만 바꾸면 돼요. 칸 수가 6개나 10개여도 '칸을 6개로'라고 하면 각도를 알아서 계산해요."
  }, draw(t) {
    const g = L.g; L.vgrad("#2d1b69", "#5a189a"); const cx = W / 2, cy = 1000, R = 420, n = SL.length, win = 4;
    L.rise("라이브 돌림판 이벤트", W / 2, 260, 76, "#fff", t, .1, .05, .5);
    const final = Math.PI * 2 * 7 - (win + .5) / n * Math.PI * 2, ang = final * ease(t, 1, 7.5, x => 1 - Math.pow(1 - x, 4)) - Math.PI / 2 * 0;
    const sc = ease(t, 0, .8, E.back); g.save(); g.translate(cx, cy); g.scale(sc, sc);
    L.circ(0, 0, R + 50, "#ffd166"); L.circ(0, 0, R + 30, "#7b2cbf");
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, on = (Math.floor(t * 10) + i) % 3 === 0 || t > 7.5 && Math.floor(t * 6) % 2; L.circ(Math.cos(a) * (R + 40), Math.sin(a) * (R + 40), 11, on ? "#fff8d6" : "#b8860b"); }
    g.rotate(ang);
    SL.forEach(([lab, col], i) => { const a0 = -Math.PI / 2 + i / n * Math.PI * 2, a1 = a0 + Math.PI * 2 / n, hl = i === win ? ease(t, 7.5, 8, E.back) : 0; g.save(); const mid = (a0 + a1) / 2; g.translate(Math.cos(mid) * 24 * hl, Math.sin(mid) * 24 * hl);
      g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, a0, a1); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 6; g.stroke();
      g.save(); g.rotate(mid); L.fit(lab, R * .62, 16, 50, 230, "#2d1b69", 900, "center"); g.restore(); g.restore(); });
    g.restore();
    L.circ(cx, cy, 90, "#fff"); L.circ(cx, cy, 70, "#7b2cbf"); L.txt("하", cx, cy + 26, 70, "#fff", 900, "center");
    const passing = (ang / (Math.PI * 2 / n)) % 1, wob = t > 1 && t < 7.6 ? Math.max(0, 1 - passing * 4) * .5 : 0;
    g.save(); g.translate(cx, cy - R - 60); g.rotate(-wob); g.beginPath(); g.moveTo(-44, -40); g.lineTo(44, -40); g.lineTo(0, 70); g.closePath(); g.fillStyle = "#ff006e"; g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 6; g.stroke(); g.restore();
    L.confetti(t, 7.6, 120, 4, undefined, cx, cy - 200);
    const b = ease(t, 7.8, 8.3, E.back); if (b > 0) L.at(W / 2, 1620, b, 0, b, () => { L.box(-400, -90, 800, 170, 85, "#ffd166"); L.txt("1+1 당첨!", 0, 28, 90, "#2d1b69", 900, "center"); });
    L.at(W / 2, 1810, 1, 0, ease(t, 9, 9.5), () => L.txt("라이브 중 댓글 '참여' 남기면 자동 응모", 0, 0, 40, "#fff", 700, "center"));
  } };
}

// ---------- g05 card flip pick ----------
{
  const C = [["오늘의 추천", "보습 크림", "#ffadad"], ["오늘의 추천", "선크림", "#ffd6a5"], ["오늘의 추천", "립밤", "#caffbf"]];
  S.g05 = { dur: 11, meta: {
    cat: "interactive", title: "섞인 카드 중 하나를 뒤집는 '오늘의 추천'", poster: .78,
    desc: "카드 3장이 뒤집힌 채 빠르게 섞이고, 손가락이 한 장을 고르면 뒤집히며 오늘의 추천 상품이 나와요. 매일 바꿔 올리는 시리즈에 좋아요.",
    prompt: `Create an 11-second vertical (1080x1920) "pick a card" video as one HTML file with Canvas 2D. ${REC}

Series name: "[SERIES — e.g. 오늘의 추천]". Three hidden picks (name, color): [PICK 1], [PICK 2], [PICK 3]. The chosen card: [PICK 2]. Reason line: "[WHY TODAY]".

0–1.5s: three cards face-up show their items briefly, then flip face-down together (scaleX flip) to a patterned back (diagonal stripes + logo circle).
1.5–5.5s: shuffle — cards swap positions along arcs in pairs, 6 swaps getting faster; use bezier arc paths and slight rotation while moving; add motion trail ghosts.
5.5–6.5s: a pointing-hand icon (simple drawn shape) taps the middle card; the other two slide away and fade.
6.5–8s: the chosen card moves to center, scales up 1.4x and flips to reveal the item with a burst of sparkles.
8–11s: reason line + "[CTA]" appear; fade out.

Playful game-show colors, rounded cards with shadow, Noto Sans KR.`,
    how: "후보 3개와 오늘 뽑힐 것, 이유 한 줄만 바꾸면 매일 새 영상이 돼요. '오늘의 메뉴', '오늘의 운세템'처럼 시리즈 이름도 바꿔 보세요."
  }, draw(t) {
    const g = L.g; L.vgrad("#fff0f3", "#e8f1ff");
    L.at(W / 2, 230, 1, 0, ease(t, 0, .5), () => { L.txt("오늘의 추천 뽑기", 0, 0, 80, "#3d348b", 900, "center"); });
    const slots = [W / 2 - 320, W / 2, W / 2 + 320], swaps = [[0, 1], [1, 2], [0, 2], [0, 1], [1, 2], [0, 2]], st = [1.6, 2.3, 2.9, 3.4, 3.85, 4.25], sd = [.6, .55, .48, .42, .38, .34];
    let order = [0, 1, 2]; const pos = [0, 1, 2].map(i => [slots[i], 1000, 0]);
    swaps.forEach(([a, b], k) => { const u = ease(t, st[k], st[k] + sd[k], E.io); const ia = order.indexOf(a) >= 0 ? order[a] : a, ib = order[b];
      if (t >= st[k] + sd[k]) { [order[a], order[b]] = [order[b], order[a]]; } else if (u > 0) { const ca = order[a], cb = order[b]; pos[ca] = [lerp(slots[a], slots[b], u), 1000 - Math.sin(u * Math.PI) * 180, Math.sin(u * Math.PI) * .2]; pos[cb] = [lerp(slots[b], slots[a], u), 1000 + Math.sin(u * Math.PI) * 180, -Math.sin(u * Math.PI) * .2]; } });
    order.forEach((c, s) => { if (!swaps.some((_, k) => t > st[k] && t < st[k] + sd[k] && (order[swaps[k][0]] === c || order[swaps[k][1]] === c))) pos[c] = [slots[s], 1000, 0]; });
    const chosen = order[1], pick = ease(t, 6.5, 7.3, E.io), away = ease(t, 6, 6.6, E.io);
    [0, 1, 2].forEach(c => { let [x, y, r] = pos[c]; let s = 1, a = 1; if (c === chosen) { x = lerp(x, W / 2, pick); y = lerp(y, 1000, pick); s = 1 + .4 * pick; } else { y += away * 900; a = 1 - away; }
      const face = t < 1.2 ? 1 : (c === chosen && t > 7.1) ? 1 : 0; const flipK = t < 1.5 ? 1 - Math.abs(Math.cos(seg(t, 1.2, 1.5) * Math.PI / 2 * 2)) : c === chosen ? 1 - Math.abs(Math.cos(seg(t, 6.9, 7.3) * Math.PI)) : 0;
      const fx = t > 1.2 && t < 1.5 ? Math.abs(Math.cos(seg(t, 1.2, 1.5) * Math.PI)) : c === chosen && t > 6.9 && t < 7.3 ? Math.abs(Math.cos(seg(t, 6.9, 7.3) * Math.PI)) : 1;
      const showFace = t < 1.35 || (c === chosen && t > 7.1);
      g.save(); g.translate(x, y); g.rotate(r); g.scale(s * Math.max(.02, fx), s); g.globalAlpha = a; g.shadowColor = "rgba(61,52,139,.25)"; g.shadowBlur = 40; g.shadowOffsetY = 20;
      L.box(-140, -210, 280, 420, 28, showFace ? "#fff" : "#3d348b"); g.shadowColor = "transparent";
      if (showFace) { L.circ(0, -60, 90, C[c][2]); L.txt(C[c][1], 0, 110, 44, "#3d348b", 900, "center"); L.txt(C[c][0], 0, 160, 24, "#7a74c2", 700, "center"); }
      else { g.save(); L.rr(-120, -190, 240, 380, 18); g.clip(); for (let k = -10; k < 10; k++) L.line(-200 + k * 40, -220, 200 + k * 40, 220, "rgba(255,255,255,.12)", 14); g.restore(); L.circ(0, 0, 60, "#f7b801"); L.txt("?", 0, 26, 76, "#3d348b", 900, "center", INTER); }
      g.restore(); });
    const hk = env(t, 5.4, 6.6, .3, .3); if (hk > 0) { g.save(); g.globalAlpha = hk; g.translate(W / 2 + 40, 1280 - 40 * env(t, 5.8, 6.1, .1, .2)); L.box(-34, -10, 68, 150, 34, "#f2c79b", "#3d348b", 5); L.box(-28, -90, 40, 110, 20, "#f2c79b", "#3d348b", 5); g.restore(); }
    if (t > 7.1) { const r = L.rng(3), k = seg(t, 7.1, 8.2); for (let i = 0; i < 14; i++) { const a = r() * 7; if (k < 1) L.icon("star", W / 2 + Math.cos(a) * 340 * k, 1000 + Math.sin(a) * 340 * k, 40 * (1 - k), "#f7b801"); } }
    L.at(W / 2, 1520, 1, 0, ease(t, 8, 8.6), () => { L.txt("일교차 큰 날엔 선크림도 꼼꼼히", 0, 0, 50, "#3d348b", 900, "center"); L.box(-260, 50, 520, 100, 50, "#3d348b"); L.txt("오늘만 20% 할인", 0, 116, 44, "#fff", 900, "center"); });
  } };
}

// ---------- g06 quiz show ----------
{
  const Q = "우리 가게 인기 1위 메뉴는?", A = ["말차 라떼", "흑임자 라떼", "유자 에이드", "아인슈페너"], ans = 1;
  S.g06 = { dur: 12, meta: {
    cat: "interactive", title: "4지선다 퀴즈쇼로 참여를 부르는 영상", poster: .7,
    desc: "TV 퀴즈쇼처럼 문제가 뜨고 보기 4개가 나온 뒤 타이머가 줄어들어요. 정답이 공개되면 댓글 참여를 유도해요. 댓글 이벤트용이에요.",
    prompt: `Create a 12-second vertical (1080x1920) quiz-show video as one HTML file with Canvas 2D. ${REC}

Question: "[QUESTION]". Options A–D: [OPTION A], [OPTION B], [OPTION C], [OPTION D]. Correct: [B]. Follow-up: "[COMMENT PROMPT — e.g. 정답 맞힌 분 댓글로!]".

Stage look: dark blue studio with spotlight beams sweeping (semi-transparent triangles), a hexagon-shaped question panel with a glowing border.
0–1.5s: "QUIZ" logo spins in; spotlights sweep.
1.5–3s: question types into the panel.
3–4.5s: four option bars (A/B/C/D badges) slide in from alternating sides.
4.5–8.5s: a circular countdown timer from 5 to 0 shrinks around the number, ticking color from green to red; the bars pulse subtly; at 2 seconds left the screen gets a red vignette pulse.
8.5–10s: wrong options dim; the correct option flashes gold three times and a check mark draws in; "+100" pops.
10–12s: the follow-up line appears with a comment-bubble icon; fade out.

TV quiz show energy, Noto Sans KR Black.`,
    how: "문제, 보기 4개, 정답, 마지막 참여 문구만 바꾸면 돼요. 정답 공개를 다음 영상으로 미루고 싶으면 '정답 공개 없이 타이머에서 끝내 줘'라고 하세요."
  }, draw(t) {
    const g = L.g; L.vgrad("#03045e", "#0b0f3a");
    for (let i = 0; i < 3; i++) { const a = Math.sin(t * .8 + i * 2) * .5; g.save(); g.translate(200 + i * 340, -50); g.rotate(a); g.beginPath(); g.moveTo(-30, 0); g.lineTo(30, 0); g.lineTo(220, 1600); g.lineTo(-220, 1600); g.closePath(); g.fillStyle = "rgba(144,224,239,.07)"; g.fill(); g.restore(); }
    const lk = ease(t, 0, .9, E.back); L.at(W / 2, 220, lk, (1 - lk) * 3, 1, () => { L.box(-170, -70, 340, 120, 30, "#ffd60a"); L.txt("QUIZ", 0, 24, 90, "#03045e", 900, "center", INTER); });
    const pk = ease(t, 1.3, 1.8); g.save(); g.globalAlpha = pk; const py = 520; g.beginPath(); [[-460, 0], [-400, -130], [400, -130], [460, 0], [400, 130], [-400, 130]].forEach(([x, y], i) => i ? g.lineTo(W / 2 + x, py + y) : g.moveTo(W / 2 + x, py + y)); g.closePath(); g.fillStyle = "#0a1a6b"; g.fill(); g.strokeStyle = "#48cae4"; g.lineWidth = 6; g.stroke(); g.restore();
    if (t > 1.5) { const n = Math.floor(clamp((t - 1.5) * 16, 0, Q.length)); L.fit(Q.slice(0, n), W / 2, py + 20, 54, 820, "#fff", 900, "center"); }
    const reveal = t > 8.5;
    A.forEach((a, i) => { const k = ease(t, 3 + i * .3, 3.5 + i * .3, E.out), side = i % 2 ? 1 : -1, y = 780 + i * 170; const correct = i === ans;
      const flash = reveal && correct && Math.floor((t - 8.5) * 6) % 2 === 0 && t < 9.5; const dim = reveal && !correct ? .35 : 1;
      L.at(side * (1 - k) * W, 0, 1, 0, k * dim, () => { L.box(120, y, 840, 130, 65, flash || (reveal && correct && t > 9.5) ? "#ffd60a" : "#1b2a8f", "#48cae4", 4); L.circ(190, y + 65, 46, "#48cae4"); L.txt("ABCD"[i], 190, y + 82, 46, "#03045e", 900, "center", INTER); L.txt(a, 270, y + 82, 52, reveal && correct ? "#03045e" : "#fff", 900);
        if (reveal && correct) { const ck = seg(t, 9, 9.5); if (ck > 0) { g.save(); g.beginPath(); g.rect(800, y, 140 * ck, 130); g.clip(); L.icon("check", 880, y + 65, 90, "#03045e", 14); g.restore(); } } }); });
    if (t > 4.5 && t < 8.6) { const left = 5 - (t - 4.5) * 1.25, col = L.mix("#06d6a0", "#ef233c", 1 - left / 5); L.circ(W / 2, 1560, 110, "rgba(255,255,255,.08)"); g.beginPath(); g.arc(W / 2, 1560, 110, -Math.PI / 2, -Math.PI / 2 + left / 5 * Math.PI * 2); g.strokeStyle = col; g.lineWidth = 18; g.stroke(); L.txt(String(Math.ceil(left)), W / 2, 1595, 100, "#fff", 900, "center", INTER);
      if (left < 2) { g.save(); g.globalAlpha = .25 * Math.abs(Math.sin(t * 8)); L.vignette(1); g.restore(); } }
    const pp = seg(t, 9.4, 10.2); if (pp > 0 && pp < 1) L.txt("+100", 860, 920 - pp * 120, 60, "#ffd60a", 900, "center", INTER);
    L.at(W / 2, 1600, 1, 0, ease(t, 10, 10.5), () => { L.box(-430, -80, 860, 150, 75, "#ffd60a"); L.txt("맞히신 분, 댓글로 손 들어 주세요!", 0, 14, 44, "#03045e", 900, "center"); });
  } };
}

// ---------- g07 top-down delivery race ----------
S.g07 = { dur: 11, meta: {
  cat: "interactive", title: "위에서 내려다보는 배송 레이싱 게임 영상", poster: .55,
  desc: "위에서 본 도로를 우리 배송 트럭이 장애물을 피해 달리며 다른 차들을 앞지르고, 결승선에서 '1등 도착'이 떠요. 빠른 배송을 재미있게 보여 줘요.",
  prompt: `Create an 11-second vertical (1080x1920) top-down racing game video as one HTML file with Canvas 2D. ${REC}

Hero vehicle: a delivery truck in [BRAND COLOR] with "[BRAND]" on the roof. Rivals: three gray cars labeled "[RIVAL LABEL — e.g. 일반 배송]". Finish banner: "[FINISH TEXT]".

View: top-down road that scrolls downward (lane dashes, roadside grass and trees moving faster than the road for parallax), 3 lanes.
0–1s: a "3-2-1-GO" countdown with big numbers scaling in/out.
1–8s: the road scrolls with increasing speed; the truck changes lanes smoothly (ease-in-out lateral moves) to dodge cones and overtake the rival cars one by one — each overtake triggers a small "PASS!" popup and a position indicator updates (4th → 1st). Speed lines appear at the screen edges as speed increases. A mini progress bar at the top shows distance to the finish.
8–9.5s: the checkered finish line scrolls in; the truck crosses it; "1ST" medal pops.
9.5–11s: finish text and brand; fade out.

Clean arcade style with flat shapes, Inter + Noto Sans KR.`,
  how: "트럭 색과 브랜드 이름, 경쟁 차 문구, 결승 문구만 바꾸면 돼요. 트럭 대신 '오토바이'나 '드론'으로 바꿔 달라고 해도 돼요."
}, draw(t) {
  const g = L.g; const spd = 600 + 1200 * ease(t, 1, 7, E.io), dist = t < 1 ? 0 : (t - 1) * 600 + 1200 * Math.max(0, (t - 1) - 3) * .5;
  L.fill("#3a7d44"); const r = L.rng(4); for (let i = 0; i < 30; i++) { const x = r() < .5 ? 30 + r() * 120 : 930 + r() * 120, y = ((r() * H + dist * 1.1) % (H + 200)) - 100; L.circ(x, y, 40 + r() * 20, "#2d6a35"); }
  L.box(180, 0, 720, H, 0, "#3b3b46"); L.box(170, 0, 14, H, 0, "#fff"); L.box(896, 0, 14, H, 0, "#fff");
  for (let ln = 1; ln < 3; ln++) for (let y = -200 + (dist % 200); y < H; y += 200) L.box(180 + ln * 240 - 6, y, 12, 110, 6, "#f1f1f1");
  const lanes = [300, 540, 780]; const truckLane = t < 2.2 ? 1 : t < 3.6 ? lerp(1, 0, ease(t, 2.2, 2.7, E.io)) : t < 5.2 ? lerp(0, 2, ease(t, 3.6, 4.2, E.io)) : t < 6.8 ? lerp(2, 1, ease(t, 5.2, 5.7, E.io)) : 1;
  const tx = lerp(lanes[0], lanes[2], truckLane / 2), ty = 1450;
  [[1, 2.4], [0, 4.0], [2, 5.6]].forEach(([lane, tp], i) => { const y = ty - 900 + (t - tp) * 1100 + 900 * 0; const yy = ty + (t - tp) * 900; if (yy < -200 || yy > H + 200) return; const x = lanes[(lane + 1) % 3];
    L.box(x - 60, yy - 100, 120, 200, 26, "#9aa1ad"); L.box(x - 46, yy - 60, 92, 60, 12, "#5f6672"); L.txt("일반", x, yy + 70, 30, "#2b2b2b", 900, "center");
    const pk = env(t, tp, tp + .8, .1, .3); if (pk > 0) L.at(tx, ty - 300, 1, 0, pk, () => L.txt("PASS!", 0, 0, 64, "#ffd60a", 900, "center", INTER)); });
  [[2, 3], [0, 6.2]].forEach(([lane, tp]) => { const yy = ty + (t - tp) * 1000; if (yy > -100 && yy < H + 100) { const x = lanes[lane]; g.beginPath(); g.moveTo(x, yy - 50); g.lineTo(x + 34, yy + 40); g.lineTo(x - 34, yy + 40); g.closePath(); g.fillStyle = "#ff7b00"; g.fill(); L.box(x - 26, yy - 6, 52, 14, 4, "#fff"); } });
  const fin = ty + (t - 8.6) * 1200; if (fin > -300 && fin < H + 100) for (let c = 0; c < 18; c++) for (let rr = 0; rr < 2; rr++) L.box(180 + c * 40, fin - 200 + rr * 40, 40, 40, 0, (c + rr) % 2 ? "#111" : "#fff");
  g.save(); g.translate(tx, ty); g.rotate((truckLane % 1 > 0 ? .12 : 0) * Math.sign(Math.sin(t * 3))); L.box(-70, -130, 140, 260, 22, "#ef233c"); L.box(-58, -130, 116, 80, 16, "#ffd6d6"); L.box(-60, -30, 120, 150, 10, "#d90429"); L.txt("하루", 0, 60, 40, "#fff", 900, "center"); g.restore();
  if (spd > 1100) { const rs = L.rng(Math.floor(t * 20)); for (let i = 0; i < 10; i++) { const x = rs() < .5 ? rs() * 140 : W - rs() * 140, y = rs() * H; L.line(x, y, x, y + 160, "rgba(255,255,255,.35)", 4); } }
  const prog = clamp((t - 1) / 7.6); L.box(140, 120, 800, 24, 12, "rgba(0,0,0,.4)"); L.box(140, 120, 800 * prog, 24, 12, "#ffd60a"); L.circ(140 + 800 * prog, 132, 20, "#ef233c");
  const place = 4 - [2.6, 4.2, 5.8].filter(x => t > x).length; L.box(40, 190, 230, 120, 24, "rgba(0,0,0,.55)"); L.txt(place + ["", "ST", "ND", "RD", "TH"][place], 155, 275, 76, place === 1 ? "#ffd60a" : "#fff", 900, "center", INTER);
  if (t < 1.2) { const n = t < .3 ? "3" : t < .6 ? "2" : t < .9 ? "1" : "GO!"; const k = (t % .3) / .3; L.at(W / 2, 900, 1.6 - k * .6, 0, 1 - k * .5, () => L.txt(n, 0, 60, 220, "#ffd60a", 900, "center", INTER)); }
  const m = ease(t, 9.2, 9.7, E.back); if (m > 0) L.at(W / 2, 800, m, 0, m, () => { L.circ(0, 0, 160, "#ffd60a"); L.circ(0, 0, 130, null, "#e9a400", 10); L.txt("1ST", 0, 30, 100, "#7a4b00", 900, "center", INTER); });
  L.at(W / 2, 1110, 1, 0, ease(t, 9.6, 10), () => { L.box(-420, -80, 840, 150, 30, "rgba(0,0,0,.6)"); L.txt("하루배송, 가장 먼저 도착", 0, 18, 54, "#fff", 900, "center"); });
} };

// ---------- g08 falling blocks form logo ----------
{
  // 10 x 14 grid target pattern spelling a simple "H" mark
  const T = ["..........", ".##....##.", ".##....##.", ".##....##.", ".##....##.", ".########.", ".########.", ".##....##.", ".##....##.", ".##....##.", ".##....##.", "..........", "..........", ".........."];
  const cols = ["#00b4d8", "#ffb703", "#fb5607", "#8338ec", "#06d6a0", "#ff006e"];
  const cells = []; T.forEach((row, y) => [...row].forEach((c, x) => { if (c === "#") cells.push([x, y]); }));
  cells.sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  S.g08 = { dur: 11, meta: {
    cat: "interactive", title: "떨어지는 블록이 쌓여 로고가 되는 퍼즐 게임 영상", poster: .8,
    desc: "퍼즐 게임처럼 위에서 블록이 하나씩 떨어져 쌓이고, 다 쌓이면 줄이 반짝이며 브랜드 마크가 완성돼요. 게임 감성 로고 오프닝이에요.",
    prompt: `Create an 11-second vertical (1080x1920) falling-block puzzle logo reveal as one HTML file with Canvas 2D. ${REC}

Logo mark: a simple pixel shape of [LETTER/SYMBOL] defined on a 10x14 grid (string array, '#' = filled). Brand: [BRAND NAME], tagline "[TAGLINE]". Block colors: 5–6 bright colors.

Look: a classic puzzle-game well (dark playfield with a thin grid, bezel frame), a side panel with "SCORE", "LINES", and a "NEXT" preview box.
0–8s: blocks drop one at a time from the top into their target cells, filling from the bottom row upward. Each block falls with gravity (ease-in), lands with a 2-frame squash and a tiny dust puff; drops get faster over time (start 0.25s apart, end 0.05s). The score increases on every landing; the NEXT box shows the upcoming color.
8–9s: completed rows flash white in sequence (like line clears) but stay; then the whole shape glows and the playfield grid fades away, leaving the mark.
9–11s: brand name and tagline slide in under the mark in a pixel-ish font; fade out.

Bright retro-arcade palette on near-black, Inter/Press-Start-like monospace for HUD.`,
    how: "10x14 칸 그림(로고의 첫 글자나 심볼 모양)과 브랜드 이름, 슬로건만 바꾸면 돼요. 칸 그림은 '#'과 '.'으로 그려서 붙여 넣으면 그대로 쌓여요."
  }, draw(t) {
    const g = L.g; L.fill("#0b0b14"); const cs = 62, gx = 120, gy = 360, gw = 10 * cs, gh = 14 * cs;
    const fadeGrid = 1 - ease(t, 8.6, 9.2);
    g.save(); g.globalAlpha = fadeGrid; L.box(gx - 16, gy - 16, gw + 32, gh + 32, 12, null, "#3a3a5a", 6); L.box(gx, gy, gw, gh, 0, "#11111e");
    for (let x = 0; x <= 10; x++) L.line(gx + x * cs, gy, gx + x * cs, gy + gh, "rgba(255,255,255,.05)", 2, "butt"); for (let y = 0; y <= 14; y++) L.line(gx, gy + y * cs, gx + gw, gy + y * cs, "rgba(255,255,255,.05)", 2, "butt");
    L.txt("SCORE", 830, 420, 34, "#9a9ab5", 800, "left", INTER); L.txt("NEXT", 830, 640, 34, "#9a9ab5", 800, "left", INTER); L.box(830, 670, 140, 140, 16, "#11111e", "#3a3a5a", 4); L.txt("LINES", 830, 900, 34, "#9a9ab5", 800, "left", INTER); g.restore();
    const n = cells.length; let tt = 0; const times = cells.map((_, i) => { const gap = lerp(.22, .045, i / n); tt += gap; return .3 + tt; }); const scale = 7.6 / times[n - 1]; for (let i = 0; i < n; i++) times[i] *= scale;
    let landed = 0;
    cells.forEach(([x, y], i) => { const t0 = times[i], fall = .35, k = seg(t, t0, t0 + fall); if (k <= 0) return; const ty = gy + y * cs, yy = lerp(gy - cs, ty, E.in(k)); if (k >= 1) landed++;
      const sq = k >= 1 ? env(t, t0 + fall, t0 + fall + .12, .02, .1) : 0; const col = cols[(x * 3 + y * 7) % cols.length];
      const flash = t > 8 && t < 9 && Math.floor((t - 8) * 12 + y) % 4 === 0;
      g.save(); g.translate(gx + x * cs + cs / 2, yy + cs / 2); g.scale(1 + sq * .15, 1 - sq * .15); L.box(-cs / 2 + 2, -cs / 2 + 2, cs - 4, cs - 4, 8, flash ? "#ffffff" : col); L.box(-cs / 2 + 8, -cs / 2 + 8, cs - 26, 10, 5, "rgba(255,255,255,.4)"); g.restore();
      if (t > 8.6) L.glow(gx + x * cs + cs / 2, ty + cs / 2, 70, col, .12 * ease(t, 8.6, 9.2)); });
    g.save(); g.globalAlpha = fadeGrid; L.txt(String(landed * 40).padStart(5, "0"), 830, 480, 48, "#fff", 800, "left", INTER); const nxt = cells[Math.min(n - 1, landed + 1)]; L.box(870, 710, 60, 60, 8, cols[(nxt[0] * 3 + nxt[1] * 7) % cols.length]); L.txt(String(Math.floor(landed / 8)), 830, 960, 48, "#fff", 800, "left", INTER); g.restore();
    L.at(W / 2, 1450, 1, 0, ease(t, 9, 9.5), () => { L.txt("HARU GAMES", 0, 0, 100, "#fff", 800, "center", INTER); L.txt("하루 10분, 머리가 말랑해지는 퍼즐", 0, 80, 44, "#ffb703", 700, "center"); });
  } };
}
})();
