// batch 4 — explainers
(() => {
const { E, ease, seg, env, lerp, clamp } = L;
const REC = "Expose window.render(t) that draws the frame at time t (seconds) deterministically, so it can be recorded frame by frame.";
function dashLine(pts, k, col, lw = 8, dash = [18, 16], off = 0) { const g = L.g; let total = 0; for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let left = total * k; g.save(); g.setLineDash(dash); g.lineDashOffset = off; g.beginPath(); g.moveTo(...pts[0]);
  for (let i = 1; i < pts.length && left > 0; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), u = Math.min(1, left / d); g.lineTo(lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)); left -= d; }
  g.strokeStyle = col; g.lineWidth = lw; g.lineCap = "round"; g.stroke(); g.restore(); }
function pathPoint(pts, k) { let total = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; } let left = total * k;
  for (let i = 0; i < seg.length; i++) { if (left <= seg[i]) { const u = left / seg[i]; return [lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u), Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0])]; } left -= seg[i]; } const n = pts.length - 1; return [pts[n][0], pts[n][1], 0]; }

// ---------- e01 three-step how-to ----------
S.e01 = { dur: 12, meta: {
  cat: "explainer", title: "그림과 함께 보는 3단계 방법 설명", poster: .72,
  desc: "1·2·3 단계 카드가 점선으로 이어지며 차례로 나오고, 각 단계마다 그림이 움직이며 핵심 숫자를 보여 줘요. 사용법·레시피·절차 설명용이에요.",
  prompt: `Create a 12-second vertical (1080x1920) three-step explainer as one HTML file with Canvas 2D. ${REC}

Topic: "[TOPIC — e.g. 핸드드립 3단계]". Steps (title, key number, illustration idea):
1) [STEP 1] — e.g. "원두 20g 갈기", illustration: beans dropping into a grinder bowl.
2) [STEP 2] — e.g. "92℃ 물 300ml, 3번 나눠 붓기", illustration: a kettle spout pouring a wavy stream, water level rising in 3 jumps.
3) [STEP 3] — e.g. "2분 30초 기다리기", illustration: a circular timer ring filling with a counting clock.

Layout: three stacked cards with big step numbers in circles on the left; a dashed connector line draws downward from card to card.
0–1s: title rises in.
1–9.5s: each step gets ~2.8s: card slides in from the right, its number circle pops (back ease), the illustration animates, the key number is highlighted in [ACCENT COLOR] bold.
9.5–12s: a summary pill "[ONE-LINE SUMMARY]" pops below; fade out.

Warm, friendly flat style, cream background, brown accents, Noto Sans KR.`,
  how: "주제와 3단계 문장, 각 단계 그림 설명만 바꾸면 돼요. 숫자(그램·온도·시간)를 꼭 넣으면 보는 사람이 바로 따라 할 수 있어요."
}, draw(t) {
  const g = L.g; L.fill("#f7f0e6");
  L.rise("핸드드립, 딱 3단계", W / 2, 220, 80, "#3d2b1f", t, 0, .05, .5);
  const steps = [["원두 20g 갈기", "중간 굵기로"], ["92℃ 물 300ml", "3번 나눠 붓기"], ["2분 30초 기다리기", "다 내려오면 완성"]];
  dashLine([[150, 520], [150, 1500]], ease(t, 1.5, 8.6, x => x), "#c8a27a", 6, [16, 14]);
  steps.forEach(([a, b], i) => { const t0 = 1 + i * 2.8, k = ease(t, t0, t0 + .6), y = 400 + i * 420, lt = t - t0;
    L.at((1 - k) * 600, 0, 1, 0, k, () => {
      g.save(); g.shadowColor = "rgba(61,43,31,.12)"; g.shadowBlur = 30; g.shadowOffsetY = 12; L.box(240, y, 780, 360, 36, "#fff"); g.restore();
      L.txt(a, 300, y + 90, 50, "#3d2b1f", 900); L.txt(b, 300, y + 150, 36, "#8a6f5a", 600);
      const ix = 790, iy = y + 220;
      if (i === 0) { L.box(ix - 120, iy - 10, 240, 120, 30, "#e9dccb"); const r = L.rng(2); for (let n = 0; n < 12; n++) { const d = seg(lt, .3 + n * .1, .8 + n * .1); const bx = ix - 90 + r() * 180, by = lerp(iy - 200, iy + 30 + r() * 40, E.in(d)); if (d > 0) { g.save(); g.translate(bx, by); g.rotate(r() * 3); g.beginPath(); g.ellipse(0, 0, 18, 13, 0, 0, 7); g.fillStyle = "#6f4e37"; g.fill(); L.line(-10, 0, 10, 0, "#3d2b1f", 3); g.restore(); } }
        L.txt("20g", 420, iy + 90, 80, "#c2410c", 900, "center", INTER); }
      if (i === 1) { L.box(ix - 40, iy - 170, 150, 90, 30, "#8a6f5a"); L.line(ix - 40, iy - 140, ix - 110, iy - 190, "#8a6f5a", 18); g.beginPath(); for (let s = 0; s <= 20; s++) { const yy = iy - 190 + s * 12; g.lineTo(ix - 110 + Math.sin(s * .8 + t * 12) * 6, yy); } g.strokeStyle = env(lt, .3, 2.6, .2, .2) > .5 ? "#7dd3fc" : "rgba(0,0,0,0)"; g.lineWidth = 10; g.stroke();
        const lvl = Math.min(3, Math.floor(clamp((lt - .3) * 1.4, 0, 3.2))); L.box(ix - 190, iy + 20, 160, 120, 16, null, "#3d2b1f", 5); L.box(ix - 185, iy + 135 - lvl * 36, 150, lvl * 36, 10, "#7dd3fc");
        L.txt(["0", "100", "200", "300"][lvl] + "ml", 420, iy + 90, 70, "#0284c7", 900, "center", INTER); }
      if (i === 2) { const p = ease(lt, .2, 2.6, x => x); L.circ(ix, iy + 20, 110, null, "#efe4d6", 22); g.beginPath(); g.arc(ix, iy + 20, 110, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); g.strokeStyle = "#c2410c"; g.lineWidth = 22; g.lineCap = "round"; g.stroke();
        const sec = Math.round(150 * p); L.txt(`${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`, ix, iy + 42, 60, "#3d2b1f", 900, "center", INTER); L.txt("2:30", 420, iy + 90, 80, "#c2410c", 900, "center", INTER); }
    });
    const p = ease(t, t0 + .2, t0 + .7, E.back); L.at(150, y + 180, p, 0, 1, () => { L.circ(0, 0, 62, "#3d2b1f"); L.txt(String(i + 1), 0, 26, 74, "#fff", 900, "center", INTER); });
  });
  const s = ease(t, 9.6, 10.2, E.back); if (s > 0) L.at(W / 2, 1720, s, 0, s, () => { L.box(-420, -65, 840, 130, 65, "#3d2b1f"); L.txt("1 : 15 비율만 기억하세요", 0, 18, 50, "#fff", 900, "center"); });
} };

// ---------- e02 bar chart growth ----------
{
  const data = [120, 135, 128, 150, 210, 280, 340, 420], mon = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월"];
  S.e02 = { dur: 11, meta: {
    cat: "explainer", title: "막대그래프로 보여 주는 성장 전후", poster: .8,
    desc: "월별 막대가 하나씩 솟아오르고, 변화가 생긴 달에 '이때부터' 표시가 붙으며 추세선이 그어져요. 매출·방문자·팔로워 성장 보고에 좋아요.",
    prompt: `Create an 11-second vertical (1080x1920) growth chart explainer as one HTML file with Canvas 2D. ${REC}

Title: "[TITLE]". Monthly values (label, value): [3월 120], [4월 135], … [10월 420] (8 bars). Unit: "[UNIT — e.g. 만원]". Turning point: month [7월] with note "[WHAT CHANGED — e.g. 숏폼 시작]".

0–1s: title and a thin axis draw in (y-axis gridlines fade in with value labels).
1–6s: bars grow from the baseline one after another (0.45s apart) with ease-out-back; each bar's value label counts up above it. Bars before the turning point are muted gray-blue; from the turning point onward they are [ACCENT COLOR].
6–7.5s: a vertical dashed marker drops at the turning point with a callout bubble "[WHAT CHANGED]".
7.5–9s: a smooth trend line draws across the bar tops; a big "+[GROWTH]%" badge pops at the top-right comparing first and last month.
9–11s: hold; footnote "[SOURCE]"; fade out.

Clean report style, white background, navy text, Inter for numbers + Noto Sans KR.`,
    how: "월별 숫자 8개, 단위, 변화가 생긴 달과 이유만 바꾸면 돼요. 숫자는 실제 기록으로 넣어야 하고, 성장률은 첫 달과 마지막 달로 계산해서 넣어 주세요."
  }, draw(t) {
    const g = L.g; L.fill("#ffffff");
    L.rise("숏폼 시작 전과 후", 80, 230, 80, "#0b2545", t, 0, .05, .5, 900, "left");
    L.at(80, 300, 1, 0, ease(t, .5, 1), () => L.txt("월 매출 (단위: 만원 · 예시)", 0, 0, 36, "#7d8597", 600));
    const x0 = 140, y0 = 1500, ch = 950, bw = 78, gap = 34, max = 450;
    for (let v = 0; v <= 400; v += 100) { const y = y0 - v / max * ch; g.save(); g.globalAlpha = ease(t, .3, 1); L.line(x0, y, 1010, y, "#eef1f6", 3, "butt"); L.txt(String(v), x0 - 20, y + 12, 28, "#9aa3b5", 600, "right", INTER); g.restore(); }
    const bars = data.map((v, i) => { const t0 = 1 + i * .45, k = ease(t, t0, t0 + .7, E.back), x = x0 + 30 + i * (bw + gap), h = v / max * ch * k, after = i >= 4;
      L.box(x, y0 - h, bw, h, 14, after ? "#ff6b35" : "#a9b4c8"); g.fillStyle = after ? "#ff6b35" : "#a9b4c8"; g.fillRect(x, y0 - Math.min(h, 14), bw, Math.min(h, 14));
      if (k > .05) L.txt(String(Math.round(v * clamp(k))), x + bw / 2, y0 - h - 18, 32, after ? "#ff6b35" : "#5c677d", 800, "center", INTER);
      L.txt(mon[i], x + bw / 2, y0 + 50, 30, "#5c677d", 700, "center"); return [x + bw / 2, y0 - v / max * ch]; });
    const mk = ease(t, 6, 6.6, E.out), mx = bars[4][0] - (bw + gap) / 2; if (mk > 0) { g.save(); g.setLineDash([14, 12]); L.line(mx, 520, mx, lerp(520, y0, mk), "#0b2545", 4, "butt"); g.restore();
      const b = ease(t, 6.4, 6.9, E.back); L.at(mx, 470, b, 0, b, () => { L.box(-170, -60, 340, 100, 24, "#0b2545"); L.txt("숏폼 시작!", 0, 6, 42, "#fff", 900, "center"); }); }
    const lk = ease(t, 7.5, 8.8, E.io); if (lk > 0) { g.beginPath(); bars.forEach(([x, y], i) => { const u = i / (bars.length - 1); if (u <= lk) i ? g.lineTo(x, y - 40) : g.moveTo(x, y - 40); }); g.strokeStyle = "#0b2545"; g.lineWidth = 6; g.lineCap = "round"; g.lineJoin = "round"; g.stroke(); }
    const bk = ease(t, 8.6, 9.1, E.back); if (bk > 0) L.at(830, 680, bk, -.08, bk, () => { L.circ(0, 0, 130, "#ff6b35"); L.txt("+250%", 0, 10, 62, "#fff", 900, "center", INTER); L.txt("3월 대비", 0, 60, 28, "#fff", 700, "center"); });
    L.at(80, 1700, 1, 0, ease(t, 9.2, 9.8), () => L.txt("※ 예시 데이터 · 우리 실제 매출로 바꿔 쓰세요", 0, 0, 32, "#9aa3b5", 500));
  } };
}

// ---------- e04 timeline ----------
{
  const ms = [["2019", "집 앞 작은 공방에서 시작"], ["2021", "첫 온라인 스토어 오픈"], ["2023", "누적 고객 1만 명"], ["2025", "성수동 쇼룸 오픈"], ["2026", "해외 배송 시작"]];
  S.e04 = { dur: 12, meta: {
    cat: "explainer", title: "선이 그어지며 이어지는 브랜드 연혁 타임라인", poster: .8,
    desc: "세로선이 아래로 그어지면서 연도 점이 하나씩 켜지고, 옆에 그해의 사건이 카드로 붙어요. 회사 소개·브랜드 스토리·이력 정리에 좋아요.",
    prompt: `Create a 12-second vertical (1080x1920) brand-history timeline as one HTML file with Canvas 2D. ${REC}

Brand: [BRAND]. Milestones (year, event): [YEAR 1 — EVENT], [YEAR 2 — EVENT], [YEAR 3 — EVENT], [YEAR 4 — EVENT], [YEAR 5 — EVENT].

0–1s: title "[TITLE]" rises in at the top.
1–9.5s: a vertical line draws downward at x≈300 at a steady pace; when its tip reaches each milestone, a dot pops (back ease) with a ring pulse, the year counts/rolls in big on the left of the line, and an event card slides in from the right. The view slowly scrolls upward so the newest milestone stays around the middle; earlier ones dim to 50%.
9.5–12s: the last milestone glows; a closing line "[CLOSING LINE]" fades in; fade out.

Elegant editorial look: deep green background, cream text, gold accent for dots, serif for years (Noto Serif KR), sans for body.`,
    how: "연도와 사건 5개, 마지막 한 줄만 바꾸면 돼요. 개인 이력이나 프로젝트 진행 과정도 같은 방식으로 넣을 수 있어요."
  }, draw(t) {
    const g = L.g; L.fill("#123524"); L.glow(W / 2, 400, 800, "#d4a373", .1);
    const lineK = ease(t, 1, 9.5, x => x), total = ms.length * 330 + 100, tip = 560 + lineK * (total - 300);
    const scroll = Math.max(0, tip - 1150); g.save(); g.translate(0, -scroll);
    L.line(300, 520, 300, tip, "#d4a373", 6);
    ms.forEach(([y, ev], i) => { const yy = 620 + i * 330, reached = tip >= yy, tr = 1 + (yy - 560) / (total - 300) * 8.5; if (!reached) return;
      const k = ease(t, tr, tr + .5, E.back), dim = i < ms.length - 1 ? .5 * seg(tip, yy + 300, yy + 500) : 0;
      g.save(); g.globalAlpha = 1 - dim; L.circ(300, yy, 22 * k, "#d4a373"); const pr = seg(t, tr, tr + .8); if (pr < 1) L.circ(300, yy, 22 + pr * 60, null, `rgba(212,163,115,${1 - pr})`, 4);
      L.at(240, yy + 22, 1, 0, seg(t, tr, tr + .4), () => L.txt(y, 0, 0, 72, "#f1e9da", 900, "right", SERIF));
      const ck = ease(t, tr + .15, tr + .7); L.at((1 - ck) * 300, 0, 1, 0, ck, () => { L.box(360, yy - 70, 640, 140, 24, "rgba(241,233,218,.08)", "rgba(212,163,115,.4)", 2); L.fit(ev, 390, yy + 16, 42, 580, "#f1e9da", 700, "left"); });
      g.restore(); });
    g.restore();
    L.at(0, 0, 1, 0, 1 - ease(t, 3, 3.6), () => L.rise("하루공방이 걸어온 길", W / 2, 260, 78, "#f1e9da", t, 0, .05, .5, 900, "center", SERIF));
    L.at(W / 2, 1720, 1, 0, ease(t, 9.6, 10.2), () => L.txt("그리고, 다음 이야기는 당신과", 0, 0, 52, "#d4a373", 700, "center", SERIF));
  } };
}

// ---------- e05 delivery route ----------
S.e05 = { dur: 11, meta: {
  cat: "explainer", title: "지도 위 점선을 따라가는 배송 과정 설명", poster: .6,
  desc: "단순화한 지도 위로 점선 경로가 그어지고 트럭이 따라 달려요. 경유지마다 시간이 찍히며 '밤에 주문하면 아침 도착' 같은 과정을 한눈에 보여 줘요.",
  prompt: `Create an 11-second vertical (1080x1920) delivery-route explainer as one HTML file with Canvas 2D. ${REC}

Story: "[HEADLINE — e.g. 밤 11시 주문, 아침 7시 도착]". Stops (name, time): [창고 23:00 출발], [허브 02:30 분류], [동네 06:10 출발], [우리 집 07:00 도착].

Map: a simplified, stylized land shape (soft blob, NOT a real map) on a pale blue sea, with a few faint roads and tiny tree dots.
0–1.2s: map fades/zooms in slightly; headline drops in at the top.
1.2–8s: a dashed route draws from stop to stop along a curvy path; a small truck icon follows the drawing tip, rotating to the path direction. At each stop a pin drops with a bounce and a time label card appears next to it. A digital clock in the corner advances from the first to the last time as the truck moves.
8–9.5s: the destination pin turns into a house icon with a check; a "도착!" bubble pops.
9.5–11s: footer "[BRAND / SERVICE NAME]"; fade out.

Flat, friendly map illustration, Noto Sans KR, Inter for times.`,
  how: "경유지 4곳의 이름과 시간, 첫 문장만 바꾸면 돼요. 실제 지명을 쓰고 싶으면 '지도는 간단한 모양으로, 이름만 표시'라고 해야 지도 오류가 안 생겨요."
}, draw(t) {
  const g = L.g; L.fill("#d7ecf7"); const z = 1 + .04 * ease(t, 0, 2);
  g.save(); g.translate(W / 2, 1000); g.scale(z, z); g.translate(-W / 2, -1000);
  g.beginPath(); const r = L.rng(8); for (let a = 0; a <= 64; a++) { const an = a / 64 * Math.PI * 2, rad = 520 + Math.sin(an * 3) * 60 + Math.cos(an * 5) * 40; g.lineTo(W / 2 + Math.cos(an) * rad * .95, 1000 + Math.sin(an) * rad * 1.35); } g.closePath(); g.fillStyle = "#f4f1e8"; g.fill(); g.strokeStyle = "#c9dbe6"; g.lineWidth = 6; g.stroke();
  for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(200 + r() * 200, 400 + r() * 1200); g.bezierCurveTo(r() * W, r() * H, r() * W, r() * H, 600 + r() * 300, 400 + r() * 1200); g.strokeStyle = "rgba(200,190,170,.5)"; g.lineWidth = 8; g.stroke(); }
  for (let i = 0; i < 40; i++) { const x = 220 + r() * 640, y = 420 + r() * 1150; L.circ(x, y, 8, "rgba(120,170,110,.45)"); }
  const stops = [[300, 560, "창고", "23:00 출발"], [760, 820, "분류 허브", "02:30 분류"], [330, 1180, "동네 거점", "06:10 출발"], [720, 1470, "우리 집", "07:00 도착"]];
  const pts = [[300, 560], [520, 600], [760, 820], [640, 1000], [330, 1180], [420, 1380], [720, 1470]], stopK = [0, .36, .69, 1];
  const k = ease(t, 1.2, 8, E.io); dashLine(pts, k, "#ef476f", 10, [22, 16]);
  stops.forEach(([x, y, nm, tm], i) => { if (k < stopK[i] - .001) return; const t0 = 1.2 + stopK[i] * 6.8; const p = ease(t, t0, t0 + .5, E.back);
    const home = i === 3 && t > 8; L.at(x, y, p, 0, 1, () => { if (home) { L.circ(0, -50, 60, "#06d6a0"); L.icon("check", 0, -50, 70, "#fff", 12); } else { g.beginPath(); g.arc(0, -60, 34, Math.PI, 0); g.lineTo(0, 0); g.closePath(); g.fillStyle = "#ef476f"; g.fill(); L.circ(0, -60, 13, "#fff"); } });
    const ck = ease(t, t0 + .2, t0 + .6); const side = x < W / 2 ? 1 : -1; L.at(x + side * 60, y - 60, 1, 0, ck, () => { const w = 260; L.box(side > 0 ? 0 : -w, -50, w, 100, 20, "#fff"); L.txt(nm, side > 0 ? 20 : -w + 20, -10, 30, "#073b4c", 800); L.txt(tm, side > 0 ? 20 : -w + 20, 32, 30, "#ef476f", 800, "left", INTER); }); });
  if (t > 1.2 && t < 8.3) { const [x, y, a] = pathPoint(pts, k); g.save(); g.translate(x, y); g.rotate(a); L.box(-44, -30, 88, 60, 12, "#073b4c"); L.box(20, -24, 26, 48, 6, "#118ab2"); g.restore(); }
  g.restore();
  L.at(W / 2, 200, 1, 0, ease(t, 0, .7), () => { L.txt("밤 11시 주문,", 0, 0, 74, "#073b4c", 900, "center"); L.txt("아침 7시 도착", 0, 90, 74, "#ef476f", 900, "center"); });
  const mins = [1380, 1590, 1810, 1860]; const cm = Math.round(k < .36 ? lerp(mins[0], mins[1], k / .36) : k < .69 ? lerp(mins[1], mins[2], (k - .36) / .33) : lerp(mins[2], mins[3], (k - .69) / .31)) % 1440;
  L.box(780, 380, 240, 90, 20, "#073b4c"); L.txt(`${String(Math.floor(cm / 60)).padStart(2, "0")}:${String(cm % 60).padStart(2, "0")}`, 900, 444, 52, "#fff", 800, "center", INTER);
  const ar = ease(t, 8.2, 8.7, E.back); if (ar > 0) L.at(720, 1300, ar, 0, ar, () => { L.box(-110, -50, 220, 90, 45, "#06d6a0"); L.txt("도착!", 0, 12, 44, "#fff", 900, "center"); });
  L.at(W / 2, 1800, 1, 0, ease(t, 9.4, 9.9), () => L.txt("하루배송 · 밤 12시 전 주문 시", 0, 0, 40, "#073b4c", 700, "center"));
} };

// ---------- e06 whiteboard sketch ----------
S.e06 = { dur: 12, meta: {
  cat: "explainer", title: "화이트보드에 손으로 그리듯 설명하는 공식", poster: .85,
  desc: "하얀 보드 위에 글자와 상자, 화살표가 손으로 그리듯 하나씩 그려지며 공식을 설명해요. 개념·계산법·원리 설명에 잘 맞아요.",
  prompt: `Create a 12-second vertical (1080x1920) whiteboard-sketch explainer as one HTML file with Canvas 2D. ${REC}

Concept: [CONCEPT — e.g. 광고 수익률 ROAS]. Formula: "[FORMULA — e.g. 매출 ÷ 광고비 × 100]". Worked example: [EXAMPLE — e.g. 광고비 10만 원, 매출 40만 원 → 400%].

Look: off-white board with faint texture, marker strokes in black, blue and red; strokes drawn progressively (animate each path with lineDash/lineDashOffset or by drawing a growing subset of points) with slight hand wobble. Text appears as if written: reveal each line left to right with a clipping rect, slightly uneven baseline.
0–1.5s: the concept name is written at the top and circled.
1.5–5s: two boxes are drawn ("[INPUT A]" and "[INPUT B]") with arrows pointing to a result box; the formula is written between them.
5–9s: the example numbers are written into the boxes; the result box fills with a quick hatch shading; the result number is underlined twice in red.
9–12s: a sticky note "[TIP]" slaps onto the corner with a slight rotation; fade out.

No hand graphic needed. Noto Sans KR in a heavy weight for 'marker' text.`,
  how: "개념 이름, 공식, 예시 숫자, 마지막 팁 한 줄만 바꾸면 돼요. 단계가 많은 개념이면 '상자를 4개로 늘려 줘'처럼 적어 주세요."
}, draw(t) {
  const g = L.g; L.fill("#fbfbf8"); const r0 = L.rng(1); for (let i = 0; i < 60; i++) L.circ(r0() * W, r0() * H, 40 + r0() * 80, "rgba(0,0,0,.012)");
  const write = (s, x, y, size, col, t0, dur, align = "left") => { const k = seg(t, t0, t0 + dur); if (k <= 0) return; const w = L.tw(s, size, 900); const x0 = align === "center" ? x - w / 2 : x; g.save(); g.beginPath(); g.rect(x0 - 10, y - size * 1.1, (w + 20) * k, size * 1.5); g.clip(); L.txt(s, x0, y, size, col, 900, "left"); g.restore(); };
  const stroke = (pts, t0, dur, col, lw = 8) => { const k = seg(t, t0, t0 + dur); if (k <= 0) return; dashLine(pts, k, col, lw, [], 0); };
  const rect = (x, y, w, h, t0, dur, col) => { const r = L.rng(x + y); const j = () => (r() - .5) * 8; stroke([[x, y + j()], [x + w, y + j()], [x + w + j(), y + h], [x + j(), y + h], [x, y]], t0, dur, col, 7); };
  write("광고 수익률 (ROAS)", W / 2, 260, 72, "#111", 0, 1, "center");
  g.save(); const ck = seg(t, .9, 1.6); if (ck > 0) { g.beginPath(); g.ellipse(W / 2, 236, 400, 90, -.03, -1.5, -1.5 + ck * 6.5); g.strokeStyle = "#1d4ed8"; g.lineWidth = 7; g.stroke(); } g.restore();
  rect(90, 520, 400, 260, 1.6, .8, "#111"); rect(590, 520, 400, 260, 2.1, .8, "#111"); write("매출", 290, 600, 54, "#111", 2.4, .4, "center"); write("광고비", 790, 600, 54, "#111", 2.8, .4, "center");
  write("÷", W / 2, 680, 90, "#dc2626", 3.1, .3, "center");
  stroke([[290, 800], [440, 1000]], 3.4, .4, "#1d4ed8"); stroke([[790, 800], [640, 1000]], 3.6, .4, "#1d4ed8"); stroke([[425, 960], [440, 1000], [400, 1000]], 3.8, .2, "#1d4ed8"); stroke([[655, 960], [640, 1000], [680, 1000]], 3.9, .2, "#1d4ed8");
  rect(290, 1030, 500, 280, 4.1, .8, "#111"); write("× 100 = ROAS", W / 2, 1100, 46, "#111", 4.6, .5, "center");
  write("40만 원", 290, 720, 56, "#1d4ed8", 5.2, .6, "center"); write("10만 원", 790, 720, 56, "#1d4ed8", 5.8, .6, "center");
  const hk = seg(t, 6.6, 7.4); if (hk > 0) { g.save(); g.beginPath(); g.rect(300, 1130, 480 * hk, 170); g.clip(); for (let x = 260; x < 820; x += 22) L.line(x, 1300, x + 60, 1130, "rgba(220,38,38,.25)", 5); g.restore(); }
  write("400%", W / 2, 1260, 110, "#dc2626", 7.2, .6, "center");
  stroke([[390, 1290], [690, 1286]], 7.8, .3, "#dc2626", 7); stroke([[395, 1310], [685, 1306]], 8.0, .3, "#dc2626", 7);
  write("→ 1원 쓰면 4원이 돌아왔다", W / 2, 1450, 50, "#111", 8.2, .8, "center");
  const n = ease(t, 9.2, 9.6, E.back); if (n > 0) L.at(760, 1690, 1 + (1 - n) * .3, .06, n, () => { g.save(); g.shadowColor = "rgba(0,0,0,.2)"; g.shadowBlur = 20; g.shadowOffsetY = 10; L.box(-230, -130, 460, 260, 4, "#fde047"); g.restore(); L.txt("TIP", -190, -70, 36, "#854d0e", 900, "left", INTER); L.txt("최소 300%는", -190, 0, 44, "#111", 900); L.txt("넘어야 남아요", -190, 60, 44, "#111", 900); });
} };

// ---------- e07 layered drink recipe ----------
S.e07 = { dur: 12, meta: {
  cat: "explainer", title: "잔이 층층이 차오르는 음료 레시피", poster: .72,
  desc: "빈 잔에 재료가 한 층씩 부어지며 차오르고, 층마다 재료 이름과 양이 선으로 연결돼 붙어요. 음료·칵테일·스무디 레시피 설명용이에요.",
  prompt: `Create a 12-second vertical (1080x1920) layered drink recipe animation as one HTML file with Canvas 2D. ${REC}

Drink: [DRINK NAME]. Layers bottom → top (ingredient, amount, color): [딸기청 40ml #e63946], [우유 200ml #fdf6ec], [에스프레소 1샷 #6f4518]. Garnish: [GARNISH].

A tall clear glass (slightly tapered, glossy highlight stripe) stands center on a pastel background.
0–1s: drink name rises in at the top; the empty glass fades in.
1–8s: each layer is poured in turn (~2.2s): a stream falls from above into the glass (wavy line), the layer rises with a gently sloshing top surface (sine wave that calms down), and slightly mixes into the layer below at the boundary (soft gradient). As each layer finishes, a leader line draws out to the side and a label card shows the ingredient and amount.
8–9.5s: ice cubes drop in and bob; the garnish pops on the rim.
9.5–12s: a small "총 [TOTAL]ml · [TIME]분" tag appears; fade out.

Bright, clean recipe-card style, Noto Sans KR + Inter for numbers.`,
  how: "음료 이름과 층마다 재료·양·색만 바꾸면 돼요. 칵테일이면 술 이름과 양을 넣으면 되고, 층이 4개면 '4층으로'라고 적어 주세요."
}, draw(t) {
  const g = L.g; L.vgrad("#ffe5ec", "#fff5f7");
  L.rise("딸기 라떼 만들기", W / 2, 220, 80, "#5c2a2a", t, 0, .05, .5);
  const gx = W / 2, gb = 1500, gt = 700, wb = 300, wt = 380;
  const layers = [["딸기청", "40ml", "#e63946", .2], ["우유", "200ml", "#fdf6ec", .55], ["에스프레소", "1샷", "#6f4518", .17]];
  g.save(); g.globalAlpha = ease(t, .4, 1); g.beginPath(); g.moveTo(gx - wt / 2, gt); g.lineTo(gx + wt / 2, gt); g.lineTo(gx + wb / 2, gb); g.lineTo(gx - wb / 2, gb); g.closePath(); g.save(); g.clip();
  let level = gb; const H0 = gb - gt;
  layers.forEach(([nm, am, col, frac], i) => { const t0 = 1 + i * 2.3, k = ease(t, t0 + .3, t0 + 2, E.io), h = H0 * frac * k; if (k <= 0) return;
    const top = level - h, wob = Math.sin(t * 9) * 10 * (1 - seg(t, t0 + 1.6, t0 + 2.6)); g.beginPath(); g.moveTo(gx - 300, level + 4); for (let x = -300; x <= 300; x += 20) g.lineTo(gx + x, top + Math.sin(x / 40 + t * 6) * wob); g.lineTo(gx + 300, level + 4); g.closePath();
    const gr = g.createLinearGradient(0, top, 0, level + 10); gr.addColorStop(0, col); gr.addColorStop(1, i ? L.mix(col, layers[i - 1][2], .35) : col); g.fillStyle = gr; g.fill(); level = top; });
  const ice = ease(t, 8, 8.6, E.back); if (ice > 0) for (let i = 0; i < 3; i++) { g.save(); g.translate(gx - 90 + i * 90, lerp(gt - 200, gt + 50 + i * 30, ice) + Math.sin(t * 3 + i) * 6); g.rotate(.3 * i - .3); L.box(-45, -45, 90, 90, 16, "rgba(255,255,255,.55)", "rgba(255,255,255,.9)", 3); g.restore(); }
  g.restore(); g.strokeStyle = "rgba(255,255,255,.95)"; g.lineWidth = 8; g.stroke(); L.box(gx - wt / 2 + 30, gt + 40, 22, 600, 11, "rgba(255,255,255,.45)"); g.restore();
  // streams
  layers.forEach(([nm, am, col], i) => { const t0 = 1 + i * 2.3, s = env(t, t0, t0 + 2, .2, .3); if (s <= 0) return; g.beginPath(); for (let y = 450; y < gb - 100; y += 14) g.lineTo(gx + 40 + Math.sin(y / 30 + t * 14) * 5, y); g.strokeStyle = col === "#fdf6ec" ? "#efe4d4" : col; g.lineWidth = 16 * s; g.lineCap = "round"; g.stroke(); });
  let acc = gb; layers.forEach(([nm, am, col, frac], i) => { const t0 = 1 + i * 2.3, mid = acc - H0 * frac / 2; acc -= H0 * frac; const lk = ease(t, t0 + 1.6, t0 + 2.2); if (lk <= 0) return; const side = i % 2 ? -1 : 1, x1 = gx + side * 200, x2 = gx + side * lerp(200, 255, lk);
    L.line(x1, mid, x2, mid, "#5c2a2a", 4); L.circ(x1, mid, 8, "#5c2a2a"); L.at(x2 + side * 10, mid, 1, 0, lk, () => { const w = 225; L.box(side > 0 ? 0 : -w, -60, w, 120, 24, "#fff"); L.txt(nm, side > 0 ? 24 : -w + 24, -10, 36, "#5c2a2a", 900); L.txt(am, side > 0 ? 24 : -w + 24, 40, 36, col === "#fdf6ec" ? "#b08968" : col, 800, "left", INTER); }); });
  const gk = ease(t, 8.6, 9.1, E.back); if (gk > 0) L.at(gx + 150, gt - 10, gk, 0, 1, () => { g.beginPath(); g.moveTo(0, -70); g.bezierCurveTo(70, -70, 70, 30, 0, 60); g.bezierCurveTo(-70, 30, -70, -70, 0, -70); g.fillStyle = "#e63946"; g.fill(); L.box(-30, -100, 60, 30, 10, "#2a9d8f"); });
  const tk = ease(t, 9.5, 10, E.back); if (tk > 0) L.at(W / 2, 1700, tk, 0, tk, () => { L.box(-280, -55, 560, 110, 55, "#5c2a2a"); L.txt("총 270ml · 3분", 0, 16, 46, "#fff", 900, "center"); });
} };

// ---------- e08 problem → solution ----------
S.e08 = { dur: 12, meta: {
  cat: "explainer", title: "문제 장면에서 해결 장면으로 넘어가는 설명", poster: .75,
  desc: "앞부분은 회색 톤으로 손님이 헤매는 '문제' 장면, 화면이 뒤집히며 밝은 톤의 '해결' 장면으로 바뀌어요. 서비스·도구가 무엇을 해결하는지 보여 주기 좋아요.",
  prompt: `Create a 12-second vertical (1080x1920) problem → solution explainer as one HTML file with Canvas 2D. ${REC}

Problem: "[PROBLEM — e.g. 손님이 메뉴를 몰라 계속 물어본다]". Solution: "[SOLUTION — e.g. 테이블 QR 메뉴판]". Product: [PRODUCT NAME]. Result stat: "[RESULT — 예시 수치]".

Part 1 (0–5s, desaturated gray-blue palette, slight shake): a counter scene drawn flat: a staff figure (simple circle head + rounded body) and 3 customer figures with "?" speech bubbles popping repeatedly; a stress meter bar fills to red; caption "PROBLEM" label + problem sentence.
Transition (5–5.8s): the whole frame flips like a card around the vertical axis (scaleX 1 → 0 → 1) and the palette switches to warm saturated colors.
Part 2 (5.8–10s): same scene, but each table has a small QR stand; customers' bubbles change to hearts/checks; the staff figure relaxes; the stress meter drains to green; caption "SOLUTION" + solution sentence.
10–12s: product name and result stat pop; fade out.

Simple geometric characters (no faces beyond dots), Noto Sans KR.`,
  how: "문제 문장, 해결 문장, 제품 이름, 결과 문구만 바꾸면 돼요. 등장인물·소품(계산대, QR)을 우리 업종에 맞게 '병원 접수대로'처럼 바꿔 달라고 하면 돼요."
}, draw(t) {
  const g = L.g; const flip = t < 5.4 ? 1 - ease(t, 5, 5.4, E.in) : ease(t, 5.4, 5.8, E.out), sol = t >= 5.4;
  const P = sol ? { bg: "#fff4e0", ink: "#3d2c1e", acc: "#2a9d8f", warn: "#2a9d8f" } : { bg: "#dfe3ea", ink: "#4a5161", acc: "#8892a6", warn: "#e63946" };
  L.fill(P.bg); g.save(); g.translate(W / 2, 0); g.scale(Math.max(.001, flip), 1); g.translate(-W / 2, 0);
  if (!sol) g.translate(Math.sin(t * 40) * 3 * seg(t, 2, 3), 0);
  L.box(80, 220, 260, 80, 40, sol ? "#2a9d8f" : "#8892a6"); L.txt(sol ? "SOLUTION" : "PROBLEM", 210, 274, 40, "#fff", 800, "center", INTER);
  L.fit(sol ? "테이블 QR로 메뉴를 바로 확인" : "손님이 메뉴를 몰라 계속 물어봐요", 80, 400, 60, 920, P.ink, 900, "left");
  const person = (x, y, s, col) => { L.circ(x, y - 120 * s, 50 * s, col); L.box(x - 70 * s, y - 60 * s, 140 * s, 180 * s, 60 * s, col); L.circ(x - 16 * s, y - 128 * s, 6 * s, "#fff"); L.circ(x + 16 * s, y - 128 * s, 6 * s, "#fff"); };
  L.box(80, 1180, 920, 40, 10, sol ? "#c8a27a" : "#9aa1ad");
  person(220, 1060, 1, sol ? "#264653" : "#6c7486"); if (sol) L.txt("여유", 220, 860, 34, P.ink, 800, "center");
  [[480, 1100], [680, 1100], [880, 1100]].forEach(([x, y], i) => { person(x, y, .85, sol ? ["#e76f51", "#f4a261", "#e9c46a"][i] : "#9aa1ad");
    if (sol) { L.box(x - 40, 1120, 80, 60, 8, "#fff", P.ink, 3); for (let q = 0; q < 9; q++) if ((q * 7) % 3) L.box(x - 30 + (q % 3) * 20, 1126 + Math.floor(q / 3) * 16, 14, 14, 2, P.ink); }
    const bt = sol ? 6 + i * .3 : 1 + i * .5, bk = sol ? ease(t, bt, bt + .4, E.back) : (Math.floor((t - bt) * 1.5) % 2 === 0 && t > bt ? ease((t - bt) % (2 / 1.5), 0, .3, E.back) : 0);
    if (bk > 0) L.at(x + 50, y - 230, bk, 0, 1, () => { L.circ(0, 0, 54, "#fff", P.ink, 4); if (sol) { (i % 2 ? L.icon("check", 0, 0, 60, "#2a9d8f", 12) : L.icon("heart", 0, 0, 50, "#e63946")); } else L.txt("?", 0, 26, 76, "#e63946", 900, "center", INTER); }); });
  const stress = sol ? lerp(.92, .15, ease(t, 6, 9, E.io)) : ease(t, .8, 4.5, E.io) * .92;
  L.txt("직원 스트레스", 80, 1400, 38, P.ink, 800); L.box(80, 1430, 920, 50, 25, "rgba(0,0,0,.08)"); L.box(80, 1430, 920 * stress, 50, 25, L.mix("#2a9d8f", "#e63946", stress));
  g.restore();
  const e = ease(t, 10, 10.5, E.back); if (e > 0) L.at(W / 2, 1680, e, 0, e, () => { L.box(-420, -100, 840, 220, 40, "#264653"); L.txt("하루 QR 메뉴판", 0, -10, 60, "#fff", 900, "center"); L.txt("주문 문의 절반으로 (예시)", 0, 64, 38, "#e9c46a", 700, "center"); });
} };

// ---------- e09 daily cost ----------
S.e09 = { dur: 11, meta: {
  cat: "explainer", title: "월 가격을 하루 가격으로 쪼개 보여 주는 영상", poster: .75,
  desc: "월 가격이 30칸 달력으로 쪼개지며 하루 금액이 계산되고, 일상의 익숙한 지출과 나란히 비교돼요. 구독·정기배송 가격 설득에 좋아요.",
  prompt: `Create an 11-second vertical (1080x1920) "price per day" explainer as one HTML file with Canvas 2D. ${REC}

Product: [PRODUCT / SERVICE]. Monthly price: [29,900원]. Days: 30. Comparison item: [COMPARISON — e.g. 편의점 커피 1잔 1,500원].

0–1.5s: the monthly price appears huge in the center with a label "한 달".
1.5–4s: the number breaks apart into a 6x5 calendar grid of 30 small tiles that fly into place (staggered by position); each tile shows the daily amount.
4–6s: an equation writes itself: "29,900 ÷ 30 = 997원" — the result counts up and gets circled.
6–8.5s: two columns rise side by side: "[PRODUCT] 하루 997원" vs "[COMPARISON]" with simple drawn icons (a box vs a cup) and bars sized by price; the cheaper bar gets a highlight.
8.5–11s: closing line "[CLOSING LINE]"; fade out.

Friendly fintech style, mint and navy palette, Inter numbers + Noto Sans KR.`,
  how: "월 가격, 비교할 일상 지출(이름·가격)만 바꾸면 돼요. 일 단위 계산은 꼭 실제 가격으로 맞춰 넣고, 비교 대상은 소비자가 바로 떠올릴 수 있는 걸 고르세요."
}, draw(t) {
  const g = L.g; L.fill("#eafaf5"); const br = ease(t, 1.5, 2.2, E.io);
  L.at(W / 2, 600, 1 - .3 * br, 0, 1 - br, () => { L.txt("한 달", 0, -150, 50, "#2d6a4f", 800, "center"); L.txt("29,900원", 0, 0, 170, "#081c15", 900, "center", INTER); });
  const r = L.rng(5); for (let i = 0; i < 30; i++) { const cx = 190 + (i % 6) * 140, cy = 360 + Math.floor(i / 6) * 130, d = (i % 6 + Math.floor(i / 6)) * .06, k = ease(t, 1.6 + d, 2.4 + d, E.back);
    if (k <= 0) continue; const sx = W / 2 + (r() - .5) * 200, sy = 600 + (r() - .5) * 100; const x = lerp(sx, cx, k), y = lerp(sy, cy, k); const dim = 1 - .6 * ease(t, 6, 6.5);
    g.save(); g.globalAlpha = Math.min(1, k) * dim; L.box(x - 60, y - 55, 120, 110, 18, i === 0 ? "#40916c" : "#fff", "#b7e4c7", 3); L.txt(String(i + 1), x - 44, y - 18, 24, i === 0 ? "#d8f3dc" : "#74c69d", 700, "left", INTER); L.txt("997", x, y + 34, 34, i === 0 ? "#fff" : "#081c15", 800, "center", INTER); g.restore(); }
  const eqk = seg(t, 4, 5.2); if (eqk > 0) { const s = "29,900 ÷ 30 ="; g.save(); g.beginPath(); g.rect(0, 1000, 80 + 900 * eqk, 140); g.clip(); L.txt(s, 90, 1100, 76, "#081c15", 800, "left", INTER); g.restore();
    const v = Math.round(997 * ease(t, 4.8, 5.6, E.expo)); L.txt(v + "원", 990, 1100, 90, "#2d6a4f", 900, "right", INTER);
    const c = seg(t, 5.6, 6.1); if (c > 0) { g.beginPath(); g.ellipse(860, 1072, 190, 80, -.05, -1.6, -1.6 + c * 6.6); g.strokeStyle = "#ef476f"; g.lineWidth = 8; g.stroke(); } }
  const ck = ease(t, 6.2, 7.2, E.out); if (ck > 0) { const base = 1700;
    [["하루비타", 997, "#40916c"], ["커피 1잔", 1500, "#adb5bd"]].forEach(([nm, v, col], i) => { const x = 300 + i * 480, h = v / 1500 * 360 * ck;
      L.box(x - 110, base - h, 220, h, 24, col); L.txt(L.counter(Math.round(v * ck)) + "원", x, base - h - 30, 50, i ? "#6c757d" : "#2d6a4f", 900, "center", INTER); L.txt(nm, x, base + 60, 42, "#081c15", 800, "center");
      if (i === 0) L.icon("star", x, base - 60, 70 * ck, "#fff"); }); }
  L.at(W / 2, 1850, 1, 0, ease(t, 8.6, 9.2), () => L.txt("커피 한 잔보다 가볍게 (예시 가격)", 0, 0, 44, "#081c15", 800, "center"));
} };

// ---------- e10 cycle diagram ----------
{
  const nodes = ["콘텐츠", "방문", "구매", "후기"], cols = ["#ff006e", "#fb5607", "#ffbe0b", "#3a86ff"];
  S.e10 = { dur: 12, meta: {
    cat: "explainer", title: "화살표가 돌며 이어지는 순환 구조 설명", poster: .75,
    desc: "네 개의 원이 원형으로 배치되고 화살표가 차례로 이어지며 계속 돌아요. 한 바퀴 돌 때마다 가운데 숫자가 커져 '선순환'을 보여 줘요.",
    prompt: `Create a 12-second vertical (1080x1920) cycle diagram explainer as one HTML file with Canvas 2D. ${REC}

Cycle steps (4): [STEP 1], [STEP 2], [STEP 3], [STEP 4]. Center label: "[CENTER LABEL — e.g. 선순환]". Short descriptions under each node: [DESC 1–4].

0–1s: title "[TITLE]" rises in.
1–5s: four circular nodes (one color each) pop in at the 12, 3, 6 and 9 o'clock positions around a big circle; after each node, a curved arrow arc draws to the next node (ease-in-out), with an arrowhead that rotates with the tangent.
5–10s: a glowing dot travels around the loop twice, faster the second time; each node pulses when the dot passes. The center label shows a counter (e.g. "×1 → ×2 → ×4") that increases each lap; the whole ring rotates very slowly.
10–12s: the descriptions fade in under the nodes; fade out.

Bold modern infographic style on a dark background, Noto Sans KR.`,
    how: "순환 단계 4개와 가운데 문구만 바꾸면 돼요. 단계가 3개나 5개면 '노드 5개로'라고 적어 주세요."
  }, draw(t) {
    const g = L.g; L.fill("#0d0d1a"); L.glow(W / 2, 1000, 700, "#3a86ff", .12);
    L.rise("팔리는 가게의 선순환", W / 2, 240, 76, "#fff", t, 0, .05, .5);
    const cx = W / 2, cy = 1000, R = 330, rot = t * .03;
    const pos = i => { const a = -Math.PI / 2 + i * Math.PI / 2 + rot; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R, a]; };
    nodes.forEach((_, i) => { const t0 = 1.4 + i * .9, k = ease(t, t0, t0 + .7, E.io); if (k <= 0) return; const a0 = -Math.PI / 2 + i * Math.PI / 2 + rot + .32, a1 = a0 + (Math.PI / 2 - .64) * k;
      g.beginPath(); g.arc(cx, cy, R, a0, a1); g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 10; g.lineCap = "round"; g.stroke();
      if (k > .1) { g.save(); g.translate(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R); g.rotate(a1 + Math.PI / 2); g.beginPath(); g.moveTo(16, 0); g.lineTo(-14, -18); g.lineTo(-14, 18); g.closePath(); g.fillStyle = "#fff"; g.fill(); g.restore(); } });
    const lap = t < 5 ? 0 : t < 7.8 ? (t - 5) / 2.8 : 1 + (t - 7.8) / 1.8, dotA = -Math.PI / 2 + rot + Math.min(lap, 2) * Math.PI * 2;
    nodes.forEach((nm, i) => { const [x, y] = pos(i), t0 = 1 + i * .9, k = ease(t, t0, t0 + .5, E.back); const near = t > 5 && t < 9.6 ? Math.max(0, 1 - Math.abs(((dotA - (-Math.PI / 2 + i * Math.PI / 2 + rot)) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI) / .4) : 0;
      L.at(x, y, k * (1 + .15 * near), 0, 1, () => { L.glow(0, 0, 200, cols[i], .3 + .4 * near); L.circ(0, 0, 105, cols[i]); L.txt(nm, 0, 16, 46, "#fff", 900, "center"); }); });
    if (t > 5 && t < 9.6) { const x = cx + Math.cos(dotA) * R, y = cy + Math.sin(dotA) * R; L.glow(x, y, 80, "#ffffff", .8); L.circ(x, y, 16, "#fff"); }
    const mult = t < 5 ? 1 : t < 7.8 ? 1 : t < 9.6 ? 2 : 4; L.at(cx, cy, 1 + .1 * env(t, 7.8, 8.1, .05, .2) + .1 * env(t, 9.6, 9.9, .05, .2), 0, ease(t, 4.5, 5), () => { L.txt("선순환", 0, -20, 56, "#fff", 900, "center"); L.txt("×" + mult, 0, 70, 80, "#ffbe0b", 900, "center", INTER); });
    const descs = ["릴스·블로그", "프로필 링크", "스토어 주문", "사진 후기"]; descs.forEach((d, i) => { const [x, y] = pos(i); L.at(x, y + 160, 1, 0, ease(t, 10, 10.5), () => L.txt(d, 0, 0, 32, "rgba(255,255,255,.75)", 600, "center")); });
  } };
}

// ---------- e11 FAQ flip cards ----------
{
  const QA = [["배송은 얼마나 걸려요?", "평일 오후 2시 전 주문은 당일 출발해요"], ["교환·반품 되나요?", "받은 날부터 7일 안에 무료로 가능해요"], ["선물 포장 되나요?", "주문할 때 메모에 '선물'만 적어 주세요"]];
  S.e11 = { dur: 12, meta: {
    cat: "explainer", title: "질문 카드가 뒤집혀 답이 나오는 FAQ", poster: .3,
    desc: "질문이 적힌 카드가 하나씩 나와 뒤집히며 답이 보여요. 자주 받는 문의 3개를 영상으로 정리해 상세페이지나 채널 공지에 쓰기 좋아요.",
    prompt: `Create a 12-second vertical (1080x1920) FAQ video as one HTML file with Canvas 2D. ${REC}

Brand: [BRAND]. Three Q&A pairs: [Q1 / A1], [Q2 / A2], [Q3 / A3].

0–1s: header "자주 묻는 질문" with a small "Q&A" badge.
1–10s: each pair gets 3s: a card (rounded, soft shadow) slides up showing a big "Q" and the question; after 1s it flips around its vertical axis (scaleX 1 → 0 → 1 with a tiny vertical lift and shadow change) to reveal the back side colored [ACCENT] with a big "A" and the answer typed in at ~20 chars/s; then the card shrinks and docks into a small stack at the bottom, and the next card enters.
10–12s: the three docked cards fan out slightly; "더 궁금한 건 [CONTACT]" appears; fade out.

Clean, friendly customer-service tone, Noto Sans KR.`,
    how: "질문과 답 3쌍, 문의 채널만 바꾸면 돼요. 실제 고객 문의 중 가장 많이 받는 것 3개를 넣으면 문의 응대 시간이 줄어요."
  }, draw(t) {
    const g = L.g; L.fill("#f1f5ff");
    L.at(W / 2, 230, 1, 0, ease(t, 0, .6), () => { L.txt("자주 묻는 질문", 0, 0, 80, "#1d3557", 900, "center"); L.box(-70, 40, 140, 56, 28, "#e63946"); L.txt("Q&A", 0, 80, 34, "#fff", 800, "center", INTER); });
    QA.forEach(([q, a], i) => { const t0 = 1 + i * 3, lt = t - t0; if (lt < 0) return;
      const docked = ease(lt, 2.6, 3.1, E.io), fan = ease(t, 10, 10.6, E.back);
      const inK = ease(lt, 0, .5, E.out), fl = lt < 1.2 ? 1 : lt < 1.45 ? 1 - ease(lt, 1.2, 1.45, E.in) : ease(lt, 1.45, 1.7, E.out), back = lt >= 1.45;
      const x = lerp(W / 2, W / 2 + (i - 1) * (200 + 60 * fan), docked), y = lerp(1000, 1650, docked) + (1 - inK) * 800, s = lerp(1, .32, docked);
      g.save(); g.translate(x, y); g.rotate((i - 1) * .1 * fan); g.scale(s * Math.max(.002, fl), s);
      g.shadowColor = "rgba(29,53,87,.2)"; g.shadowBlur = 50; g.shadowOffsetY = 20; L.box(-420, -320, 840, 640, 44, back ? "#1d3557" : "#fff"); g.shadowColor = "transparent";
      if (!back) { L.txt("Q", -340, -160, 140, "#e63946", 900, "left", INTER); L.wrap(q, -340, 40, 700, 66, 86, "#1d3557", 900); }
      else { L.txt("A", -340, -160, 140, "#a8dadc", 900, "left", INTER); g.save(); const n = Math.floor(clamp((lt - 1.6) * 20, 0, a.length)); L.wrap(a.slice(0, n), -340, 30, 700, 56, 76, "#fff", 700); g.restore(); }
      g.restore(); });
    L.at(W / 2, 1850, 1, 0, ease(t, 10.4, 10.9), () => L.txt("더 궁금한 건 채팅 상담으로", 0, 0, 44, "#1d3557", 800, "center"));
  } };
}

// ---------- e12 gradient descent ball ----------
S.e12 = { dur: 12, meta: {
  cat: "explainer", title: "공이 굴러 내려가며 보여 주는 원리 설명", poster: .6,
  desc: "울퉁불퉁한 곡선 위에서 공이 기울기를 따라 조금씩 내려가며 가장 낮은 곳을 찾아가요. 'AI가 학습하는 방식' 같은 어려운 원리를 쉽게 설명할 때 좋아요.",
  prompt: `Create a 12-second vertical (1080x1920) concept explainer as one HTML file with Canvas 2D. ${REC}

Concept: [CONCEPT — e.g. 경사 하강법: AI가 오차를 줄이는 방법]. Key sentence: "[KEY SENTENCE]".

Draw a smooth curve (a valley with one shallow local dip and one deeper global minimum) across the middle of the screen with a soft gradient fill under it and a labeled axis "오차".
0–1.5s: title rises in; the curve draws from left to right.
1.5–9s: a ball starts high on the left. Every 0.6s it takes a "step": draw the tangent line at the ball (short segment), an arrow pointing downhill, then the ball rolls along the curve to the new position (x_new = x − learningRate × slope, computed numerically from the curve function). Steps get smaller near the bottom. Show a small panel: step count and current error value updating. After settling briefly in the shallow dip, add one bigger 'momentum' step that hops out and continues to the deepest point.
9–12s: the lowest point gets a flag "가장 낮은 오차"; the key sentence appears; fade out.

Clean educational style (dark navy board, chalk-like colors), Noto Sans KR, Inter numbers.`,
  how: "설명할 개념과 핵심 문장만 바꾸면 돼요. 다른 원리(예: 가격 최적점 찾기)도 '곡선과 공으로 설명해 줘'라고 하면 같은 방식으로 만들 수 있어요."
}, draw(t) {
  const g = L.g; L.fill("#0f1b2d");
  L.rise("AI는 이렇게 배운다", W / 2, 230, 78, "#e8f1ff", t, 0, .05, .5);
  L.at(W / 2, 310, 1, 0, ease(t, .5, 1), () => L.txt("경사 하강법, 공 굴리기로 이해하기", 0, 0, 38, "#8fb3e0", 600, "center"));
  const e = x => Math.pow((x - 700) / 330, 2) * 120 - 140 * Math.exp(-Math.pow((x - 330) / 80, 2)) - 260 * Math.exp(-Math.pow((x - 760) / 120, 2)), f = x => 1250 - e(x);
  const dk = ease(t, .3, 1.5, E.io); g.beginPath(); g.moveTo(80, f(80)); for (let x = 80; x <= 80 + 920 * dk; x += 6) g.lineTo(x, f(x)); g.strokeStyle = "#7bdff2"; g.lineWidth = 8; g.stroke();
  g.lineTo(80 + 920 * dk, 1600); g.lineTo(80, 1600); g.closePath(); const gr = g.createLinearGradient(0, 900, 0, 1600); gr.addColorStop(0, "rgba(123,223,242,.18)"); gr.addColorStop(1, "rgba(123,223,242,0)"); g.fillStyle = gr; g.fill();
  L.line(80, 600, 80, 1600, "rgba(232,241,255,.4)", 3); L.txt("오차", 100, 640, 32, "rgba(232,241,255,.6)", 700);
  // precompute steps
  const xs = [140]; for (let i = 0; i < 9; i++) { const x = xs[xs.length - 1], sl = (f(x + 1) - f(x - 1)) / 2; xs.push(clamp(x + sl * 30, 90, 990)); }
  xs.push(560); for (let i = 0; i < 6; i++) { const x = xs[xs.length - 1], sl = (f(x + 1) - f(x - 1)) / 2; xs.push(clamp(x + sl * 40, 90, 990)); }
  const st = clamp((t - 1.5) / .45, 0, xs.length - 1), i = Math.floor(st), u = ease(st - i, .35, 1, E.io), x = i >= xs.length - 1 ? xs[xs.length - 1] : lerp(xs[i], xs[i + 1], u);
  const hop = i === 9 ? Math.sin(u * Math.PI) * 160 : 0, by = f(x) - 36 - hop;
  if (t > 1.5) { const sl = (f(x + 1) - f(x - 1)) / 2, a = Math.atan(sl); if (u < .4 && i < xs.length - 1) { L.line(x - Math.cos(a) * 120, f(x) - Math.sin(a) * 120 - 36, x + Math.cos(a) * 120, f(x) + Math.sin(a) * 120 - 36, "rgba(255,209,102,.8)", 5); const dir = sl > 0 ? 1 : -1; L.at(x + dir * 70, by - 70, 1, 0, 1, () => { g.scale(dir, 1); L.icon("arrow", 0, 0, 70, "#ffd166", 8); }); }
    L.circ(x, by, 36, "#ff6b6b"); L.circ(x - 12, by - 12, 10, "rgba(255,255,255,.6)");
    L.box(640, 440, 380, 150, 20, "rgba(255,255,255,.06)", "rgba(255,255,255,.15)", 2); L.txt("STEP " + Math.min(i, xs.length - 1), 670, 500, 36, "#e8f1ff", 800, "left", INTER); L.txt("오차 " + Math.max(0, (f(760) - f(x)) / 12).toFixed(1), 670, 560, 36, "#7bdff2", 800, "left", INTER);
    if (i === 9 && u > 0 && u < 1) L.txt("관성 점프!", x, by - 120, 40, "#ffd166", 900, "center"); }
  const fk = ease(t, 9, 9.5, E.back); if (fk > 0) { const fx = 760; L.line(fx, f(fx) - 70, fx, f(fx) - 230, "#e8f1ff", 5); L.at(fx, f(fx) - 230, fk, 0, 1, () => { L.box(0, 0, 260, 70, 8, "#06d6a0"); L.txt("가장 낮은 오차", 130, 46, 32, "#0f1b2d", 900, "center"); }); }
  L.at(W / 2, 1760, 1, 0, ease(t, 9.6, 10.2), () => { L.txt("기울기 반대로, 조금씩", 0, 0, 62, "#e8f1ff", 900, "center"); L.txt("틀린 만큼 고치며 내려간다", 0, 76, 40, "#8fb3e0", 600, "center"); });
} };
})();
