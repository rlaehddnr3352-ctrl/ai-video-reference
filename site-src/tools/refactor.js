// 1회용: index.html 안의 카드 데이터 리터럴을 <script id="siteData"> JSON으로 옮기고, 깃허브 데이터 덮어쓰기 코드를 넣는다.
const fs = require("fs"), acorn = require("acorn");
const [src, dataPath, out] = process.argv.slice(2);
let html = fs.readFileSync(src, "utf8");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const KEYS = Object.keys(data).filter(k => k !== "REFS");
const LETS = ["MGV", "AVOID"];
const sStart = html.indexOf("<script>\n(function(){") + "<script>".length;
const sEnd = html.indexOf("</script>", sStart);
let js = html.slice(sStart, sEnd);
const ast = acorn.parse(js, { ecmaVersion: 2022 });
const body = ast.body[0].expression.callee.body.body; // (function(){ ... })()
const cut = [];
for (const st of body) {
  if (st.type === "VariableDeclaration" && st.declarations.length === 1 && KEYS.includes(st.declarations[0].id.name)) cut.push([st.start, st.end, st.declarations[0].id.name]);
}
if (cut.length !== KEYS.length) throw new Error("found " + cut.length + " of " + KEYS.length + ": " + KEYS.filter(k => !cut.some(c => c[2] === k)));
cut.sort((a, b) => b[0] - a[0]);
for (const [a, b, n] of cut) {
  // 줄 전체 지우기(앞 공백·뒤 줄바꿈)
  let s = a; while (s > 0 && js[s - 1] === " ") s--;
  let e = b; if (js[e] === "\n") e++;
  js = js.slice(0, s) + js.slice(e);
}
const consts = KEYS.filter(k => !LETS.includes(k));
const decl = `  /* ================= knowledge ================= */
  /* 카드 데이터는 위 <script id="siteData">에 있어요(원본: 저장소 data/site-data.json, 배포 때 빌드가 넣음).
     배포 없이 고친 내용은 페이지가 열린 뒤 깃허브 main의 data/site-data.json을 읽어 덮어써요(applyRemoteData). */
  const SITE = JSON.parse(document.getElementById("siteData").textContent);
  const {${consts.join(", ")}} = SITE;
  let {${LETS.join(", ")}} = SITE;`;
js = js.replace("  /* ================= knowledge ================= */", decl);
const overlay = `
  /* 배포 없이 카드 데이터 갱신: 깃허브 main의 data/site-data.json이 내장본과 다르면 덮어쓰고 다시 그려요. 실패하거나 형식이 안 맞으면 내장본 그대로. */
  (async function applyRemoteData(){
    try{
      const r = await fetch("https://raw.githubusercontent.com/rlaehddnr3352-ctrl/ai-video-reference/main/data/site-data.json", {cache:"no-cache"});
      if(!r.ok) return;
      const d = await r.json();
      if(!d || typeof d !== "object") return;
      const same = ${JSON.stringify(consts.concat(LETS))}.every(k => JSON.stringify(d[k]) === JSON.stringify(SITE[k])) && JSON.stringify(d.REFS) === JSON.stringify(state.refs);
      if(same) return;
      const ok = k => d[k] !== undefined && Array.isArray(d[k]) === Array.isArray(SITE[k]) && typeof d[k] === typeof SITE[k] && (!Array.isArray(d[k]) || d[k].length > 0);
      const live = {${consts.join(", ")}};
      Object.keys(live).forEach(k => { if(!ok(k)) return; const t = live[k]; if(Array.isArray(t)) t.splice(0, t.length, ...d[k]); else { Object.keys(t).forEach(x => delete t[x]); Object.assign(t, d[k]); } });
      if(typeof d.MGV === "string") MGV = d.MGV;
      if(typeof d.AVOID === "string") AVOID = d.AVOID;
      if(Array.isArray(d.REFS) && d.REFS.length) state.refs = d.REFS;
      renderAll();
    }catch(e){}
  })();
})();`;
const tail = js.lastIndexOf("})();");
js = js.slice(0, tail) + overlay.trimStart().replace(/^/, "") + js.slice(tail + 5);
html = html.slice(0, sStart) + js + html.slice(sEnd);
const siteData = JSON.stringify(Object.fromEntries(KEYS.map(k => [k, data[k]]))).replace(/<\//g, "<\\/");
html = html.replace('<script id="refsData"', `<script id="siteData" type="application/json">${siteData}</script>\n<script id="refsData"`);
fs.writeFileSync(out, html);
console.log("removed", cut.length, "literals; size", html.length);
