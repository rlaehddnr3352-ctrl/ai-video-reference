// batch 5 — Three.js 3D scenes
(() => {
const { E, ease, seg, env, lerp, clamp } = L;
const REC = "Expose window.render(t) that sets the whole scene for time t (seconds) and renders one frame — no requestAnimationFrame clock — so it can be recorded frame by frame.";
const proj = {}; // projected label positions shared from 3D to 2D overlay
function project(THREE, cam, v) { const p = v.clone().project(cam); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; }

// ---------- d02 cube grid wave ----------
S.d02 = { dur: 10, three: true, meta: {
  cat: "3d", title: "물결치는 3D 큐브 바닥 위 브랜드 타이틀", poster: .6,
  desc: "수백 개의 작은 큐브가 파도처럼 오르내리며 색이 번지고, 그 위로 브랜드 이름이 떠올라요. 오프닝·인트로 배경으로 쓰기 좋아요.",
  prompt: `Create a 10-second vertical (1080x1920) 3D intro as one HTML file using Three.js. ${REC}

Brand: [BRAND NAME], subtitle "[SUBTITLE]". Gradient colors: [COLOR A] → [COLOR B].

Scene: a 16 x 28 grid of small rounded-looking cubes (InstancedMesh for speed) on a dark background, seen from a low 3/4 angle with fog fading the far rows.
Motion: each cube's height = sin(distance from a moving center × frequency − t × speed) so ripples spread outward; cube color interpolates between the two colors by height; a slow camera dolly forward and a slight orbit.
0–2s: the grid rises from flat (amplitude 0 → 1).
2–7s: ripples travel; a second ripple source appears at 4s to create interference patterns.
7–10s: a 2D overlay shows the brand name with letter-by-letter rise and the subtitle; waves calm down; fade out.

Lighting: hemisphere light + one directional light with soft shadows off for speed; ACES tone mapping.`,
  how: "브랜드 이름과 두 가지 색만 바꾸면 돼요. 음악이 있으면 '박자에 맞춰 파도가 한 번씩 튀게'라고 BPM을 함께 적어 주세요."
}, async setup(THREE, renderer) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#07060f"); scene.fog = new THREE.Fog("#07060f", 8, 26);
  const cam = new THREE.PerspectiveCamera(42, 1080 / 1920, .1, 100);
  const nx = 16, nz = 28, n = nx * nz, geo = new THREE.BoxGeometry(.42, 1, .42), mat = new THREE.MeshStandardMaterial({ roughness: .35, metalness: .2 });
  const mesh = new THREE.InstancedMesh(geo, mat, n); scene.add(mesh);
  scene.add(new THREE.HemisphereLight("#b7a6ff", "#0a0820", .9)); const d = new THREE.DirectionalLight("#ffffff", 2); d.position.set(4, 8, 3); scene.add(d);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), cA = new THREE.Color("#5b2eff"), cB = new THREE.Color("#ff4fa3"), c = new THREE.Color();
  return t => {
    const amp = L.ease(t, 0, 2, L.E.io) * (1 - .6 * L.ease(t, 7, 9.5, L.E.io)), src2 = L.ease(t, 4, 5);
    let k = 0; for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) { const x = (i - nx / 2 + .5) * .5, z = (j - nz / 2) * .5 - 2;
      const d1 = Math.hypot(x, z + 1), d2 = Math.hypot(x - 2, z + 5); const h = amp * (Math.sin(d1 * 1.6 - t * 3.2) + src2 * .7 * Math.sin(d2 * 1.9 - t * 3.8)) * .55;
      const hh = .3 + Math.max(0, h + .6); p.set(x, hh / 2 - .3, z); s.set(1, hh, 1); m.compose(p, q, s); mesh.setMatrixAt(k, m); c.copy(cA).lerp(cB, L.clamp((h + .6) / 1.4)); mesh.setColorAt(k, c); k++; }
    mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
    const a = .5 + t * .03, r = lerp(12, 9.5, L.ease(t, 0, 10, L.E.io)); cam.position.set(Math.sin(a) * r * .55, lerp(4.2, 3.4, t / 10), Math.cos(a) * r * .9 - 2); cam.lookAt(0, 0, -3.5);
    renderer.render(scene, cam);
  };
}, draw(t) {
  L.rise("WAVELAB", W / 2, 520, 150, "#fff", t, 7, .07, .55, 800, "center", INTER, 90);
  L.at(W / 2, 610, 1, 0, L.ease(t, 7.8, 8.4), () => L.txt("소리가 보이는 스피커", 0, 0, 50, "#e4dcff", 700, "center"));
  L.vignette(.5);
} };

// ---------- d03 low-poly island sunrise ----------
S.d03 = { dur: 11, three: true, meta: {
  cat: "3d", title: "로우폴리 섬에 해가 뜨는 3D 장면", poster: .7,
  desc: "각진 로우폴리 섬과 출렁이는 바다 위로 해가 떠오르며 하늘색이 밤에서 아침으로 바뀌어요. 숙소·여행·힐링 브랜드 무드 영상에 좋아요.",
  prompt: `Create an 11-second vertical (1080x1920) low-poly 3D scene as one HTML file using Three.js. ${REC}

Mood line: "[MOOD LINE]". Brand: [BRAND NAME].

Scene (flatShading: true on all materials for the faceted look):
- an island built from a squashed icosahedron/cone with vertex noise (green top, sand rim), 5–7 cone trees, one small cabin made of two boxes and a prism roof with a warm emissive window;
- an ocean plane with a vertex wave (update positions each frame from t) in deep teal;
- a sun sphere (emissive) that rises from behind the horizon along an arc.
Sky: background color and fog interpolate night navy → dawn pink → morning sky blue as the sun rises; light intensity follows.
Camera: slow orbit around the island (about 40° total) with a slight push-in.
0–2s night (stars as small points), 2–7s sunrise, 7–11s morning — the mood line and brand name appear as a 2D overlay at 7.5s; fade out.`,
  how: "문구와 브랜드 이름만 바꾸면 돼요. 섬 위 건물을 '카페', '텐트', '등대'처럼 우리 업종에 맞게 바꿔 달라고 하면 돼요."
}, async setup(THREE, renderer) {
  renderer.toneMappingExposure = 1;
  const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(40, 1080 / 1920, .1, 200); scene.fog = new THREE.Fog("#0b1026", 18, 60);
  const r = L.rng(21);
  const isl = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4.2, 1.4, 9, 2), new THREE.MeshStandardMaterial({ color: "#5c9e4c", flatShading: true, roughness: 1 }));
  const pos = isl.geometry.attributes.position; for (let i = 0; i < pos.count; i++) { pos.setY(i, pos.getY(i) + (r() - .5) * .35); pos.setX(i, pos.getX(i) * (1 + (r() - .5) * .12)); } isl.geometry.computeVertexNormals(); isl.position.y = -.2; scene.add(isl);
  const sand = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.8, .6, 9), new THREE.MeshStandardMaterial({ color: "#e8d3a2", flatShading: true })); sand.position.y = -.85; scene.add(sand);
  for (let i = 0; i < 7; i++) { const tr = new THREE.Mesh(new THREE.ConeGeometry(.45 + r() * .2, 1.4 + r() * .6, 6), new THREE.MeshStandardMaterial({ color: "#2f6b3a", flatShading: true })); const a = r() * Math.PI * 2, rad = 1 + r() * 1.8; tr.position.set(Math.cos(a) * rad, 1.15, Math.sin(a) * rad); if (Math.abs(tr.position.x - .9) < .9 && Math.abs(tr.position.z - .6) < .9) tr.position.x -= 2; scene.add(tr); }
  const cab = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, .8, .9), new THREE.MeshStandardMaterial({ color: "#c97b4a", flatShading: true })); body.position.y = .4; cab.add(body);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(.01, .85, .7, 4), new THREE.MeshStandardMaterial({ color: "#7a3b2e", flatShading: true })); roof.rotation.y = Math.PI / 4; roof.position.y = 1.15; cab.add(roof);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(.3, .3), new THREE.MeshStandardMaterial({ color: "#ffd27a", emissive: "#ffb347", emissiveIntensity: 2 })); win.position.set(0, .45, .456); cab.add(win); cab.position.set(.9, .45, .6); cab.rotation.y = -.4; scene.add(cab);
  const seaG = new THREE.PlaneGeometry(80, 80, 60, 60); seaG.rotateX(-Math.PI / 2); const sea = new THREE.Mesh(seaG, new THREE.MeshStandardMaterial({ color: "#1b6f8a", flatShading: true, roughness: .5, metalness: .1 })); sea.position.y = -.9; scene.add(sea); const base = seaG.attributes.position.array.slice();
  const sun = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 12), new THREE.MeshBasicMaterial({ color: "#ffd38a" })); scene.add(sun);
  const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(Array.from({ length: 600 }, (_, i) => i % 3 === 1 ? 8 + r() * 30 : (r() - .5) * 120), 3)), new THREE.PointsMaterial({ color: "#ffffff", size: .25, transparent: true })); scene.add(stars);
  const hemi = new THREE.HemisphereLight("#9bb7ff", "#203040", .4); scene.add(hemi); const sunL = new THREE.DirectionalLight("#ffd6a0", 0); scene.add(sunL);
  const night = new THREE.Color("#0b1026"), dawn = new THREE.Color("#f29e9e"), day = new THREE.Color("#8fd3ff"), sky = new THREE.Color();
  return t => {
    const u = L.ease(t, 1.5, 8, L.E.io); sky.copy(night).lerp(dawn, L.clamp(u * 2)).lerp(day, L.clamp(u * 2 - 1)); scene.background = sky; scene.fog.color = sky;
    const sa = lerp(-.25, .55, u); sun.position.set(-14 + u * 4, Math.sin(sa) * 30 - 3, -40); sunL.position.copy(sun.position); sunL.intensity = 2.8 * u; hemi.intensity = .35 + 1.1 * u; stars.material.opacity = 1 - L.clamp(u * 2.5);
    sun.material.color.set(u < .5 ? "#ff9a6b" : "#fff2c4");
    const a = seaG.attributes.position.array; for (let i = 0; i < a.length; i += 3) { const x = base[i], z = base[i + 2]; a[i + 1] = Math.sin(x * .5 + t * 1.6) * .18 + Math.cos(z * .45 + t * 1.2) * .18; } seaG.attributes.position.needsUpdate = true; seaG.computeVertexNormals();
    const ang = .9 - t * .065, rad = lerp(15, 12.5, t / 11); cam.position.set(Math.sin(ang) * rad, lerp(5.5, 4.3, t / 11), Math.cos(ang) * rad); cam.lookAt(0, .6, 0);
    renderer.render(scene, cam);
  };
}, draw(t) {
  L.at(W / 2, 330, 1, 0, L.ease(t, 7.5, 8.2), () => { L.txt("아침이 오는 섬", 0, 0, 96, "#fff", 900, "center", SERIF); L.txt("ISLAND STAY · 바다 앞 독채", 0, 80, 40, "rgba(255,255,255,.85)", 700, "center"); });
  L.at(W / 2, 330, 1, 0, L.env(t, .4, 4), () => L.txt("05:42", 0, 0, 90, "rgba(255,255,255,.8)", 300, "center", INTER));
} };

// ---------- d04 particles form text ----------
S.d04 = { dur: 11, three: true, meta: {
  cat: "3d", title: "흩어진 입자가 모여 글자가 되는 3D 오프닝", poster: .5,
  desc: "공간에 흩어져 반짝이던 수천 개의 입자가 소용돌이치며 모여 글자를 만들고, 마지막에 다시 터지듯 흩어져요. 오픈·런칭 공지 오프닝에 좋아요.",
  prompt: `Create an 11-second vertical (1080x1920) particle text reveal as one HTML file using Three.js. ${REC}

Text to form: "[WORD — short, e.g. OPEN]". Subtitle (2D overlay): "[SUBTITLE]". Colors: [COLOR A] and [COLOR B].

How: draw the word on an offscreen 2D canvas, sample the filled pixels on a grid to get ~4000 target points (x,y) and give each a small random z. Each particle also gets a random start position inside a large sphere.
0–2s: particles drift and twinkle in the sphere (size flicker), camera slowly rotates.
2–5.5s: particles travel to their targets along a swirl — interpolate with ease-in-out per particle with a random delay (0–0.8s) and add a rotation around the Y axis that decreases to zero on arrival.
5.5–8s: the word holds and breathes (tiny noise offsets); color shifts across the word from A to B; the subtitle fades in below as a 2D overlay.
8–9.5s: particles burst outward from the center with velocity and gravity, fading.
9.5–11s: fade out.

Use THREE.Points with additive blending, a soft round sprite (generate a radial gradient CanvasTexture), dark background.`,
  how: "모을 단어(짧을수록 선명해요)와 아래 문구, 색 두 가지만 바꾸면 돼요. 로고 PNG가 있으면 '글자 대신 이 이미지 모양으로 입자를 모아 줘'라고 하세요."
}, async setup(THREE, renderer) {
  renderer.toneMapping = THREE.NoToneMapping;
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#04040a"); const cam = new THREE.PerspectiveCamera(45, 1080 / 1920, .1, 100); cam.position.set(0, 0, 14);
  const c = document.createElement("canvas"); c.width = 600; c.height = 260; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.font = "800 220px Inter"; x.textAlign = "center"; x.fillText("OPEN", 300, 210);
  const d = x.getImageData(0, 0, 600, 260).data, tg = []; for (let yy = 0; yy < 260; yy += 3) for (let xx = 0; xx < 600; xx += 3) if (d[(yy * 600 + xx) * 4 + 3] > 128) tg.push([(xx - 300) / 110, -(yy - 130) / 110]);
  const r = L.rng(4), N = tg.length, P = new Float32Array(N * 3), C = new Float32Array(N * 3), st = [], dl = [], vel = [];
  for (let i = 0; i < N; i++) { const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = 6 + r() * 6; st.push([Math.sqrt(1 - u * u) * Math.cos(th) * rad, u * rad * 1.4, Math.sqrt(1 - u * u) * Math.sin(th) * rad]); dl.push(r() * .8); vel.push([(r() - .5) * 2, r() * 1.5, (r() - .5) * 2]); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(P, 3)); geo.setAttribute("color", new THREE.BufferAttribute(C, 3));
  const sp = document.createElement("canvas"); sp.width = sp.height = 64; const sx = sp.getContext("2d"); const gr = sx.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.4, "rgba(255,255,255,.5)"); gr.addColorStop(1, "rgba(255,255,255,0)"); sx.fillStyle = gr; sx.fillRect(0, 0, 64, 64);
  const mat = new THREE.PointsMaterial({ size: .16, map: new THREE.CanvasTexture(sp), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }); const pts = new THREE.Points(geo, mat); scene.add(pts);
  const cA = new THREE.Color("#42e8ff"), cB = new THREE.Color("#ff5cc8"), cc = new THREE.Color();
  return t => {
    const boom = L.clamp((t - 8) / 1.5);
    for (let i = 0; i < N; i++) { const [sx0, sy0, sz0] = st[i], [tx, ty] = tg[i], k = L.ease(t, 2 + dl[i], 4.7 + dl[i], L.E.io), sw = (1 - k) * 2.4;
      let px = lerp(sx0, tx, k), py = lerp(sy0, ty, k), pz = lerp(sz0, (r() - .5) * 0 + Math.sin(i) * .15, k); const ca = Math.cos(sw), sa = Math.sin(sw); [px, pz] = [px * ca - pz * sa, px * sa + pz * ca];
      if (t > 5.5 && t < 8) { py += Math.sin(t * 3 + i * .3) * .02; }
      if (boom > 0) { const bt = boom * 1.5, [vx, vy, vz] = vel[i]; px += (tx * .8 + vx * 3) * bt; py += (ty * .5 + vy * 3) * bt - 4 * bt * bt; pz += vz * 6 * bt; }
      P[i * 3] = px; P[i * 3 + 1] = py; P[i * 3 + 2] = pz;
      const tw = .55 + .45 * Math.sin(t * 6 + i * 1.7); cc.copy(cA).lerp(cB, L.clamp((tx + 5) / 10 + Math.sin(t) * .2)).multiplyScalar((k > .95 ? 1 : tw) * (1 - boom)); C[i * 3] = cc.r; C[i * 3 + 1] = cc.g; C[i * 3 + 2] = cc.b; }
    geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
    const ra = (1 - L.ease(t, 2, 5.5, L.E.io)) * .6 + Math.sin(t * .4) * .08; cam.position.set(Math.sin(ra) * 14, Math.sin(t * .3) * .5, Math.cos(ra) * 14); cam.lookAt(0, 0, 0);
    renderer.render(scene, cam);
  };
}, draw(t) {
  L.at(W / 2, 1250, 1, 0, L.env(t, 5.6, 8.3, .5, .4), () => { L.txt("11월 1일, 성수동 1호점", 0, 0, 56, "#fff", 800, "center"); L.txt("GRAND OPEN", 0, 70, 34, "rgba(255,255,255,.6)", 700, "center", INTER); });
} };

// ---------- d05 3D bar chart ----------
S.d05 = { dur: 11, three: true, meta: {
  cat: "3d", title: "카메라가 도는 3D 막대 차트", poster: .7,
  desc: "바닥에서 3D 막대가 솟아오르고 카메라가 천천히 돌아가며 비교를 보여 줘요. 가장 높은 막대에 불이 들어오며 핵심 숫자가 강조돼요.",
  prompt: `Create an 11-second vertical (1080x1920) 3D bar chart as one HTML file using Three.js. ${REC}

Title: "[TITLE]". Bars (label, value): [A 32], [B 48], [C 41], [D 77], [E 59]. Highlight bar: [D]. Unit: "[UNIT]".

Scene: a glossy dark floor with a subtle grid, five rounded-look boxes (BoxGeometry, slightly bevel by scaling a second inner box) spaced along X, soft studio lighting with a rim light.
0–1s: title appears (2D overlay); camera starts low and close.
1–5s: bars grow from height 0 to value with ease-out-back, 0.3s stagger; each bar's 2D label (value counting up + name) follows the projected top position of the bar (project the 3D point to screen each frame).
5–8.5s: camera orbits ~70° and rises to a 3/4 view; the highlight bar turns emissive [ACCENT COLOR], others desaturate; a callout "[KEY MESSAGE]" connects to it.
8.5–11s: hold; footnote "[SOURCE]"; fade out.`,
  how: "막대 5개의 이름과 값, 강조할 막대, 핵심 문구만 바꾸면 돼요. 2D 차트보다 '고급 보고서·발표' 느낌을 내고 싶을 때 좋아요."
}, async setup(THREE, renderer) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#0d1117"); const cam = new THREE.PerspectiveCamera(38, 1080 / 1920, .1, 100);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: "#11161f", roughness: .4, metalness: .4 })); floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const grid = new THREE.GridHelper(20, 20, "#2a3242", "#1b2230"); grid.position.y = .001; scene.add(grid);
  scene.add(new THREE.HemisphereLight("#cbd7ff", "#0d1117", .7)); const key = new THREE.DirectionalLight("#ffffff", 2.2); key.position.set(-4, 8, 6); scene.add(key); const rim = new THREE.PointLight("#5ad1ff", 25, 20); rim.position.set(4, 5, -4); scene.add(rim);
  const vals = [32, 48, 41, 77, 59], names = ["1월", "2월", "3월", "4월", "5월"], bars = [];
  vals.forEach((v, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.9, 1, .9), new THREE.MeshStandardMaterial({ color: "#4b6584", roughness: .3, metalness: .2, emissive: "#000000" })); m.position.x = (i - 2) * 1.35; scene.add(m); bars.push(m); });
  const hi = new THREE.Color("#ff7a59"), base = new THREE.Color("#4b6584"), dim = new THREE.Color("#2f3b4c");
  proj.d05 = [];
  return t => {
    const hk = L.ease(t, 5, 6.2, L.E.io);
    bars.forEach((m, i) => { const k = L.ease(t, 1 + i * .3, 2.2 + i * .3, L.E.back), h = Math.max(.001, vals[i] / 20 * k); m.scale.y = h; m.position.y = h / 2;
      if (i === 3) { m.material.color.copy(base).lerp(hi, hk); m.material.emissive.copy(hi).multiplyScalar(.35 * hk); } else m.material.color.copy(base).lerp(dim, hk); });
    const a = lerp(-.15, .95, L.ease(t, 4.5, 8.5, L.E.io)), rad = lerp(9, 11, L.ease(t, 0, 8, L.E.io)); cam.position.set(Math.sin(a) * rad, lerp(1.6, 5.2, L.ease(t, 0, 8.5, L.E.io)), Math.cos(a) * rad); cam.lookAt(0, 1.8, 0);
    renderer.render(scene, cam);
    proj.d05 = bars.map((m, i) => [...project(THREE, cam, new THREE.Vector3(m.position.x, m.scale.y + .35, 0)), vals[i], names[i], L.ease(t, 1 + i * .3, 2.2 + i * .3)]);
  };
}, draw(t) {
  L.at(W / 2, 260, 1, 0, L.ease(t, 0, .7), () => { L.txt("월별 신규 회원", 0, 0, 80, "#fff", 900, "center"); L.txt("단위: 백 명 · 예시", 0, 64, 34, "#8b98ad", 600, "center"); });
  (proj.d05 || []).forEach(([x, y, z, v, nm, k], i) => { if (k <= 0) return; L.at(x, y, 1, 0, L.clamp(k * 2), () => { L.txt(String(Math.round(v * L.clamp(k))), 0, -20, 52, i === 3 && t > 5.5 ? "#ff7a59" : "#fff", 900, "center", INTER); L.txt(nm, 0, 22, 28, "#8b98ad", 700, "center"); }); });
  const c = L.ease(t, 6.5, 7.1, E.back); if (c > 0 && proj.d05 && proj.d05[3]) { const [x, y] = proj.d05[3]; L.line(x, y - 80, x, 560, "rgba(255,122,89,.8)", 4); L.at(x, 520, c, 0, c, () => { L.box(-230, -55, 460, 100, 50, "#ff7a59"); L.txt("4월, 이벤트로 2배", 0, 12, 40, "#fff", 900, "center"); }); }
} };

// ---------- d06 iridescent knot ----------
S.d06 = { dur: 10, three: true, meta: {
  cat: "3d", title: "빛이 도는 금속 오브젝트 무드 루프", poster: .45,
  desc: "매끈한 금속 매듭 오브젝트가 천천히 돌고, 주변을 도는 세 가지 색 조명이 표면에 비쳐 색이 계속 바뀌어요. 끝과 처음이 이어지는 루프 배경이에요.",
  prompt: `Create a 10-second seamless-loop vertical (1080x1920) 3D mood piece as one HTML file using Three.js. ${REC} Frame at 0s and 10s must match.

Object: a TorusKnotGeometry (high segment count) with MeshStandardMaterial metalness 1, roughness 0.18, color near white.
Lights: three colored point lights ([COLOR A], [COLOR B], [COLOR C]) orbiting the object on tilted circles with periods 10s, 5s and 10/3s so the loop is exact; a faint ambient light. Add an environment-like look by placing a few large emissive planes (soft gradient) around the scene so the metal has something to reflect.
Motion: the knot rotates exactly one full turn on Y and half a turn on X over 10s; the camera breathes in/out ±3%.
Overlay (2D): a single centered line "[LINE]" in light serif that fades in from 2s to 8s, plus a tiny brand mark at the bottom. Add subtle grain.

Dark background with a soft radial glow behind the object.`,
  how: "문구 한 줄과 조명 색 3가지만 바꾸면 돼요. 매듭 대신 '구', '링', '우리 로고를 두껍게 만든 모양'으로 바꿔 달라고 할 수도 있어요."
}, async setup(THREE, renderer) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#060608"); const cam = new THREE.PerspectiveCamera(40, 1080 / 1920, .1, 100);
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.6, .52, 360, 48), new THREE.MeshStandardMaterial({ color: "#f2f2f2", metalness: 1, roughness: .18 })); scene.add(knot);
  scene.add(new THREE.AmbientLight("#ffffff", .08));
  const cols = ["#ff4fd8", "#3de0ff", "#ffd23d"], ls = cols.map(c => { const l = new THREE.PointLight(c, 60, 14); scene.add(l); return l; });
  return t => {
    const w = Math.PI * 2 / 10; knot.rotation.set(Math.sin(w * t) * .5, w * t, 0);
    ls.forEach((l, i) => { const a = w * t * (i + 1) + i * 2; l.position.set(Math.cos(a) * 4.5, Math.sin(a * (i === 1 ? 1 : 1)) * 3 * (i === 2 ? -1 : 1), Math.sin(a) * 4.5 + 1); });
    const z = 10.5 * (1 + .03 * Math.sin(w * t)); cam.position.set(0, 0, z); cam.lookAt(0, 0, 0);
    renderer.render(scene, cam);
  };
}, draw(t) {
  L.glow(W / 2, H / 2, 700, "#7a5cff", .06);
  L.at(W / 2, 1600, 1, 0, L.env(t, 2, 8.2, .8, .8), () => L.txt("빛을 입은 모든 순간", 0, 0, 70, "#f4f0ff", 900, "center", SERIF));
  L.txt("LUMEN JEWELRY", W / 2, 1800, 30, "rgba(255,255,255,.55)", 700, "center", INTER); L.grain(t, .05);
}, fin: 0, fout: 0 };

// ---------- d07 tunnel flight ----------
S.d07 = { dur: 10, three: true, meta: {
  cat: "3d", title: "빛의 터널을 빠르게 통과하는 속도감 영상", poster: .5,
  desc: "네온 고리로 된 터널을 카메라가 빠르게 통과하며 점점 빨라지고, 끝에서 하얗게 빠져나오며 메시지가 나와요. 빠른 배송·속도·업그레이드 강조용이에요.",
  prompt: `Create a 10-second vertical (1080x1920) 3D tunnel fly-through as one HTML file using Three.js. ${REC}

Message: "[MESSAGE — e.g. 더 빠르게]", sub line "[SUB LINE]". Neon colors: [COLOR A], [COLOR B].

Scene: 80 torus rings (thin tube) spaced along a gently curving path (CatmullRomCurve3), each ring emissive with color alternating A/B and brightness pulsing; between rings, a few streak lines (thin stretched boxes) along the walls. Black background with exponential fog so far rings fade.
Camera: moves along the curve using getPointAt(u) and looks ahead at getPointAt(u+0.01). Speed ramps up: slow for 0–2s, accelerating to fast 2–7s (add slight FOV widening for speed feel), then at 7.5s flies into a bright white exit (fade the screen to white via a 2D overlay).
2D overlay: a speed readout "[NUMBER] km/h" counting up in a corner; on the white exit, the message and sub line in black bold.`,
  how: "메시지와 숫자 단위만 바꾸면 돼요. 숫자는 '배송 시간', '처리 속도' 같은 우리 강점을 넣으세요. 색을 브랜드 색 두 가지로 바꾸면 더 우리 것 같아요."
}, async setup(THREE, renderer) {
  renderer.toneMapping = THREE.NoToneMapping;
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#000"); scene.fog = new THREE.FogExp2("#000000", .045); const cam = new THREE.PerspectiveCamera(70, 1080 / 1920, .1, 200);
  const pts = []; for (let i = 0; i < 40; i++) pts.push(new THREE.Vector3(Math.sin(i * .4) * 4, Math.cos(i * .3) * 3, -i * 6)); const curve = new THREE.CatmullRomCurve3(pts);
  const rings = []; for (let i = 0; i < 90; i++) { const u = i / 90, p = curve.getPointAt(u), tg = curve.getTangentAt(u); const m = new THREE.Mesh(new THREE.TorusGeometry(2.2, .05, 8, 48), new THREE.MeshBasicMaterial({ color: i % 2 ? "#ff2bd6" : "#2bd9ff" })); m.position.copy(p); m.lookAt(p.clone().add(tg)); scene.add(m); rings.push(m); }
  const r = L.rng(3); for (let i = 0; i < 160; i++) { const u = r(), p = curve.getPointAt(u), tg = curve.getTangentAt(u), a = r() * Math.PI * 2; const s = new THREE.Mesh(new THREE.BoxGeometry(.03, .03, 1.6), new THREE.MeshBasicMaterial({ color: r() > .5 ? "#ffffff" : "#8a7dff" })); s.position.copy(p).add(new THREE.Vector3(Math.cos(a) * 1.9, Math.sin(a) * 1.9, 0)); s.lookAt(s.position.clone().add(tg)); scene.add(s); }
  return t => {
    const u = L.clamp(.002 + .015 * t + .09 * Math.pow(L.clamp((t - 2) / 6), 2.2)); cam.position.copy(curve.getPointAt(u)); cam.lookAt(curve.getPointAt(Math.min(1, u + .012)));
    cam.fov = 70 + 25 * L.ease(t, 2, 7.5, L.E.io); cam.updateProjectionMatrix();
    rings.forEach((m, i) => { const b = .5 + .5 * Math.sin(t * 8 - i * .5); m.material.color.set(i % 2 ? "#ff2bd6" : "#2bd9ff").multiplyScalar(.5 + b); });
    renderer.render(scene, cam);
  };
}, draw(t) {
  const sp = Math.round(40 + 860 * Math.pow(L.ease(t, 1, 7.5, x => x), 2)); L.at(80, 200, 1, 0, L.ease(t, .5, 1) * (1 - L.ease(t, 7.5, 7.9)), () => { L.txt(L.counter(sp), 0, 0, 90, "#fff", 800, "left", INTER); L.txt("km/h", 0, 54, 34, "#2bd9ff", 700, "left", INTER); });
  const w = L.ease(t, 7.3, 7.9, E.in); if (w > 0) { L.g.save(); L.g.globalAlpha = w; L.fill("#ffffff"); L.g.restore(); }
  L.at(W / 2, H / 2, 1, 0, L.ease(t, 7.9, 8.5), () => { L.rise("더 빠르게", 0, 0, 170, "#000", t, 7.9, .07, .45); L.txt("오늘 주문, 내일 아침 도착", 0, 110, 50, "#333", 800, "center"); });
} };

// ---------- d08 rotating can ----------
S.d08 = { dur: 10, three: true, meta: {
  cat: "3d", title: "탄산 기포 속에서 회전하는 3D 캔", poster: .6,
  desc: "라벨을 입힌 3D 캔이 기포가 올라오는 배경 속에서 회전하고, 시원한 조명이 표면을 훑고 지나가요. 음료·화장품 용기 광고 컷으로 좋아요.",
  prompt: `Create a 10-second vertical (1080x1920) 3D beverage can shot as one HTML file using Three.js. ${REC}

Product: [DRINK NAME], flavor "[FLAVOR]", label color [COLOR], claim "[CLAIM — e.g. 제로 칼로리]".

Can: CylinderGeometry body with a CanvasTexture label (draw the label on a 2D canvas: color band, product name vertically centered, small claim text, wrap-around stripes), metallic top/bottom caps (slightly smaller cylinders, metalness 1).
Background: vertical gradient in a fresh tone; 150 bubbles (small transparent spheres or point sprites) rising with slight wobble and looping.
0–2s: the can tilts in from below with a spin.
2–7s: the can rotates slowly (one full turn) while a bright specular light sweeps across it from left to right twice; small water droplets (tiny glossy spheres) cling to the body.
7–10s: the can settles at a 10° tilt; 2D overlay with product name, flavor and claim pops in; fade out.`,
  how: "음료 이름, 맛, 라벨 색, 문구만 바꾸면 돼요. 실제 라벨 디자인 이미지가 있으면 '캔 라벨 텍스처로 이 이미지를 써 줘'라고 하세요."
}, async setup(THREE, renderer) {
  const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(32, 1080 / 1920, .1, 100); cam.position.set(0, .3, 11); cam.lookAt(0, 0, 0);
  const bg = document.createElement("canvas"); bg.width = 2; bg.height = 256; const bx = bg.getContext("2d"); const gg = bx.createLinearGradient(0, 0, 0, 256); gg.addColorStop(0, "#b8f2e6"); gg.addColorStop(1, "#2a9d8f"); bx.fillStyle = gg; bx.fillRect(0, 0, 2, 256); const bt = new THREE.CanvasTexture(bg); bt.colorSpace = THREE.SRGBColorSpace; scene.background = bt;
  const lc = document.createElement("canvas"); lc.width = 1024; lc.height = 512; const x = lc.getContext("2d"); x.fillStyle = "#f8f9fa"; x.fillRect(0, 0, 1024, 512); x.fillStyle = "#2a9d8f"; x.fillRect(0, 0, 1024, 120); x.fillRect(0, 430, 1024, 82);
  for (let i = 0; i < 12; i++) { x.fillStyle = i % 2 ? "#e9c46a" : "#2a9d8f"; x.fillRect(i * 86, 380, 43, 40); }
  x.fillStyle = "#264653"; x.font = "900 120px 'Noto Sans CJK KR'"; x.textAlign = "center"; x.fillText("청량수", 512, 290); x.font = "700 44px 'Noto Sans CJK KR'"; x.fillStyle = "#2a9d8f"; x.fillText("라임 · 제로 칼로리", 512, 360); x.fillStyle = "#fff"; x.font = "900 54px Inter"; x.fillText("SPARKLING", 512, 85);
  const lt = new THREE.CanvasTexture(lc); lt.colorSpace = THREE.SRGBColorSpace; lt.anisotropy = 8;
  const can = new THREE.Group(); const body = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3.6, 96, 1, true), new THREE.MeshStandardMaterial({ map: lt, roughness: .25, metalness: .35 })); can.add(body);
  const capM = new THREE.MeshStandardMaterial({ color: "#d9dde2", metalness: 1, roughness: .25 }); const top = new THREE.Mesh(new THREE.CylinderGeometry(.86, 1, .22, 96), capM); top.position.y = 1.91; can.add(top); const bot = new THREE.Mesh(new THREE.CylinderGeometry(1, .86, .2, 96), capM); bot.position.y = -1.9; can.add(bot);
  const r = L.rng(6), drops = new THREE.Group(); for (let i = 0; i < 60; i++) { const a = r() * Math.PI * 2, y = (r() - .5) * 3.2; const d = new THREE.Mesh(new THREE.SphereGeometry(.025 + r() * .035, 8, 6), new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0, metalness: .1, transparent: true, opacity: .75 })); d.position.set(Math.cos(a) * 1.02, y, Math.sin(a) * 1.02); d.scale.z = .5; drops.add(d); } can.add(drops); scene.add(can);
  const bub = []; for (let i = 0; i < 140; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(.05 + r() * .09, 10, 8), new THREE.MeshStandardMaterial({ color: "#ffffff", transparent: true, opacity: .35, roughness: .1 })); b.userData = [(r() - .5) * 9, r() * 14, -2 - r() * 6, .6 + r() * .9, r() * 6]; scene.add(b); bub.push(b); }
  scene.add(new THREE.HemisphereLight("#ffffff", "#1d6b62", 1.1)); const key = new THREE.DirectionalLight("#ffffff", 1.6); key.position.set(-3, 4, 6); scene.add(key); const sweep = new THREE.PointLight("#ffffff", 40, 8); scene.add(sweep);
  return t => {
    const inK = L.ease(t, 0, 1.8, L.E.back); can.position.y = lerp(-9, 0, inK); can.rotation.y = -1.6 + inK * 1.6 + L.ease(t, 2, 7, L.E.io) * Math.PI * 2; can.rotation.z = lerp(.5, -.17, L.ease(t, 0, 8, L.E.io));
    const sw = ((t - 2) / 2.5) % 1; sweep.position.set(lerp(-5, 5, sw), 1, 3); sweep.intensity = t > 2 && t < 7 ? 40 : 0;
    bub.forEach(b => { const [bx0, by0, bz, sp, ph] = b.userData; b.position.set(bx0 + Math.sin(t * 2 + ph) * .15, ((by0 + t * sp) % 14) - 7, bz); });
    renderer.render(scene, cam);
  };
}, draw(t) {
  L.at(W / 2, 300, 1, 0, L.ease(t, 7.2, 7.8), () => { L.txt("청량수 라임", 0, 0, 110, "#fff", 900, "center"); L.txt("0kcal · 탄산 강하게", 0, 80, 46, "#e9fff9", 700, "center"); });
  const b = L.ease(t, 7.6, 8.1, E.back); if (b > 0) L.at(800, 1540, b, -.15, b, () => { L.circ(0, 0, 110, "#e9c46a"); L.txt("ZERO", 0, 0, 52, "#264653", 900, "center", INTER); L.txt("칼로리", 0, 48, 30, "#264653", 800, "center"); });
} };

// ---------- d09 domino chain ----------
S.d09 = { dur: 11, three: true, meta: {
  cat: "3d", title: "도미노가 연달아 넘어지며 로고를 여는 3D 영상", poster: .8,
  desc: "곡선으로 늘어선 도미노가 차례로 쓰러지고, 마지막 도미노가 큰 블록을 넘어뜨리면 그 뒤에서 메시지가 나타나요. '작은 행동이 큰 결과로' 같은 메시지에 좋아요.",
  prompt: `Create an 11-second vertical (1080x1920) 3D domino chain as one HTML file using Three.js. ${REC}

Message on the final block: "[MESSAGE]". Brand: [BRAND]. Domino colors: gradient [COLOR A] → [COLOR B].

Scene: a clean light floor with soft shadows; 30 thin dominoes placed along an S-curve, each facing the path direction. A final large block stands at the end with the message printed on its front (CanvasTexture).
Physics-free animation: each domino i starts falling at time t0 + i×0.18s and rotates forward 0 → 72° with ease-in (gravity feel), stopping against the next one; the camera tracks the falling front along the curve (lerp to the current domino position with an offset) and pulls back at the end.
At the end, the last domino hits the big block, which tips over backward slowly (0 → 90°) revealing the message face upward; the camera cranes up to look down at it.
2D overlay at the end: the brand line "[BRAND LINE]"; fade out.`,
  how: "마지막 블록에 쓸 메시지와 브랜드 문구, 색 두 가지만 바꾸면 돼요. 도미노 대신 '우리 제품 상자'를 세워 달라고 해도 재미있어요."
}, async setup(THREE, renderer) {
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#f3efe8"); scene.fog = new THREE.Fog("#f3efe8", 18, 40); const cam = new THREE.PerspectiveCamera(42, 1080 / 1920, .1, 100);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: "#efe9df", roughness: .9 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  scene.add(new THREE.HemisphereLight("#ffffff", "#d9cfc0", 1.2)); const sun = new THREE.DirectionalLight("#fff6e8", 2.2); sun.position.set(6, 12, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14 }); scene.add(sun);
  const N = 30, path = new THREE.CatmullRomCurve3([new THREE.Vector3(-3, 0, 8), new THREE.Vector3(2, 0, 4), new THREE.Vector3(-2, 0, -1), new THREE.Vector3(2, 0, -6), new THREE.Vector3(0, 0, -9)]);
  const cA = new THREE.Color("#ff6b6b"), cB = new THREE.Color("#4d96ff"), doms = [];
  for (let i = 0; i < N; i++) { const u = i / (N - 1) * .9, p = path.getPointAt(u), tg = path.getTangentAt(u); const pivot = new THREE.Group(); pivot.position.copy(p); pivot.lookAt(p.clone().add(tg));
    const m = new THREE.Mesh(new THREE.BoxGeometry(.7, 1.4, .16), new THREE.MeshStandardMaterial({ color: cA.clone().lerp(cB, i / (N - 1)), roughness: .4 })); m.position.set(0, .7, .08); m.castShadow = true; pivot.add(m); scene.add(pivot); doms.push(pivot); }
  const bc = document.createElement("canvas"); bc.width = 512; bc.height = 512; const bx = bc.getContext("2d"); bx.fillStyle = "#222"; bx.fillRect(0, 0, 512, 512); bx.fillStyle = "#fff"; bx.textAlign = "center"; bx.font = "900 92px 'Noto Sans CJK KR'"; bx.fillText("작은 시작이", 256, 220); bx.fillStyle = "#ffd166"; bx.fillText("큰 변화로", 256, 340);
  const bt = new THREE.CanvasTexture(bc); bt.colorSpace = THREE.SRGBColorSpace; const dark = new THREE.MeshStandardMaterial({ color: "#222" });
  const end = path.getPointAt(1), etg = path.getTangentAt(1); const bp = new THREE.Group(); bp.position.copy(end).add(etg.clone().multiplyScalar(.6)); bp.lookAt(bp.position.clone().add(etg));
  const block = new THREE.Mesh(new THREE.BoxGeometry(3, 3, .6), [dark, dark, dark, dark, new THREE.MeshStandardMaterial({ color: "#222" }), new THREE.MeshStandardMaterial({ map: bt })]); block.castShadow = true;
  const bpv = new THREE.Group(); bpv.position.set(0, 0, .3); block.position.set(0, 1.5, -.3); bpv.add(block); bp.add(bpv); scene.add(bp);
  const look = new THREE.Vector3();
  return t => {
    const t0 = 1.2, step = .18;
    doms.forEach((d, i) => { const u = i / (N - 1) * .9, p = path.getPointAt(u), tg = path.getTangentAt(u); d.position.copy(p); d.lookAt(p.clone().add(tg)); const k = L.ease(t, t0 + i * step, t0 + i * step + .32, L.E.in); d.rotateX(k * 1.26); });
    const tb = t0 + N * step; bpv.rotation.x = L.ease(t, tb, tb + 1.6, L.E.io) * Math.PI / 2;
    const front = L.clamp((t - t0) / (N * step)), fp = path.getPointAt(Math.min(.98, front * .9 + .02)); const endK = L.ease(t, tb - .2, tb + 2.4, L.E.io);
    look.copy(fp).lerp(bp.position, endK); cam.position.set(look.x + lerp(5, 0, endK), lerp(4, 11, endK), look.z + lerp(7, 1.5, endK)); cam.lookAt(look);
    renderer.render(scene, cam);
  };
}, draw(t) {
  L.at(W / 2, 1720, 1, 0, L.ease(t, 9, 9.6), () => { L.txt("하루 10분 습관 앱 · 하루루틴", 0, 0, 48, "#222", 800, "center"); });
} };

// ---------- d10 orbit ecosystem ----------
S.d10 = { dur: 11, three: true, meta: {
  cat: "3d", title: "행성처럼 도는 서비스 구성 3D 다이어그램", poster: .6,
  desc: "가운데 큰 구 주위를 작은 구 네 개가 궤도를 그리며 돌고, 각 구에 기능 이름표가 따라다녀요. 서비스 구성·브랜드 라인업 소개에 좋아요.",
  prompt: `Create an 11-second vertical (1080x1920) 3D "ecosystem" orbit diagram as one HTML file using Three.js. ${REC}

Center: [MAIN SERVICE]. Orbiting items (4): [ITEM 1], [ITEM 2], [ITEM 3], [ITEM 4], each with a color.

Scene: dark space background with a few hundred faint star points; a glossy central sphere with an emissive rim (Fresnel-like look via a slightly larger back-side transparent sphere); four smaller spheres on tilted orbit rings (thin line circles), each with different radius and speed.
2D labels: each frame, project every sphere's position to screen and draw a rounded label with its name next to it; labels of spheres behind the center get dimmer (use projected depth).
0–2s: the center sphere scales in; orbit rings draw in (opacity 0 → 1).
2–8s: planets appear one by one and orbit; the camera slowly tilts from a side view to a 30° top view.
8–11s: all planets align briefly for a 'family photo'; the title "[TITLE]" appears; fade out.`,
  how: "가운데 이름과 주변 4개 항목, 색만 바꾸면 돼요. 제품 라인업(본품·리필·세트·굿즈)이나 서비스 기능 소개에도 그대로 쓸 수 있어요."
}, async setup(THREE, renderer) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#05060d"); const cam = new THREE.PerspectiveCamera(40, 1080 / 1920, .1, 200);
  const r = L.rng(10); scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(Array.from({ length: 1500 }, () => (r() - .5) * 120), 3)), new THREE.PointsMaterial({ color: "#8aa0ff", size: .15 })));
  scene.add(new THREE.AmbientLight("#ffffff", .25)); const key = new THREE.PointLight("#ffffff", 200, 40); key.position.set(6, 8, 10); scene.add(key);
  const core = new THREE.Mesh(new THREE.SphereGeometry(1.25, 64, 48), new THREE.MeshStandardMaterial({ color: "#6c63ff", roughness: .25, metalness: .3, emissive: "#2a1f8f", emissiveIntensity: .6 })); scene.add(core);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.45, 48, 32), new THREE.MeshBasicMaterial({ color: "#8f88ff", transparent: true, opacity: .12, side: THREE.BackSide })); scene.add(halo);
  const items = [["주문", "#ff6b6b", 2.3, .55, .2], ["배송", "#ffd166", 2.85, .4, -.25], ["리뷰", "#06d6a0", 3.35, .3, .15], ["재구매", "#4cc9f0", 3.8, .22, -.1]];
  const ps = items.map(([nm, c, rad, sp, tilt], i) => { const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 128 }, (_, k) => new THREE.Vector3(Math.cos(k / 128 * Math.PI * 2) * rad, 0, Math.sin(k / 128 * Math.PI * 2) * rad))), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0 }));
    const grp = new THREE.Group(); grp.rotation.x = tilt; grp.add(ring); const m = new THREE.Mesh(new THREE.SphereGeometry(.34, 32, 24), new THREE.MeshStandardMaterial({ color: c, roughness: .35, emissive: c, emissiveIntensity: .25 })); grp.add(m); scene.add(grp); return { ring, m, grp, rad, sp, nm, c, i }; });
  proj.d10 = [];
  return t => {
    core.scale.setScalar(L.ease(t, 0, 1.2, L.E.back) + .001); halo.scale.copy(core.scale);
    const align = L.ease(t, 8, 9.2, L.E.io);
    ps.forEach(p => { p.ring.material.opacity = .5 * L.ease(t, .5 + p.i * .2, 1.5 + p.i * .2); const a = (t - 2) * p.sp + p.i * 1.6, aa = lerp(a, -Math.PI / 2 + .9, align); p.m.position.set(Math.cos(aa) * p.rad, 0, Math.sin(aa) * p.rad); p.m.scale.setScalar(L.ease(t, 2 + p.i * .6, 2.6 + p.i * .6, L.E.back) + .001); });
    const tilt = lerp(.08, .62, L.ease(t, 2, 8, L.E.io)), rad = 17; cam.position.set(0, Math.sin(tilt) * rad, Math.cos(tilt) * rad); cam.lookAt(0, -.6, 0);
    renderer.render(scene, cam);
    const cz = project(THREE, cam, new THREE.Vector3())[2];
    proj.d10 = ps.map(p => { const v = new THREE.Vector3(); p.m.getWorldPosition(v); const [x, y, z] = project(THREE, cam, v); return [x, y, z > cz ? .4 : 1, p.nm, p.c, L.ease(t, 2.3 + p.i * .6, 2.8 + p.i * .6)]; });
  };
}, draw(t) {
  const c = L.ease(t, .6, 1.2); L.at(W / 2, H / 2 + 60, 1, 0, c, () => L.txt("하루공방", 0, 0, 0 + 46, "#fff", 900, "center"));
  (proj.d10 || []).forEach(([x, y, a, nm, col, k]) => { if (k <= 0) return; L.at(x, y - 70, 1, 0, a * k, () => { const w = L.tw(nm, 36, 800) + 50; L.box(-w / 2, -32, w, 64, 32, "rgba(10,12,30,.75)", col, 3); L.txt(nm, 0, 12, 36, "#fff", 800, "center"); }); });
  L.at(W / 2, 330, 1, 0, L.ease(t, 8.4, 9), () => { L.txt("한 바퀴 돌면", 0, 0, 80, "#fff", 900, "center"); L.txt("단골이 됩니다", 0, 100, 80, "#ffd166", 900, "center"); });
} };
})();
