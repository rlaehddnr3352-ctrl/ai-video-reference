// index.html의 카드 데이터(const 배열/객체)를 JSON으로 뽑아낸다.
const fs = require("fs"), vm = require("vm");
const html = fs.readFileSync(process.argv[2], "utf8");
const lines = html.split("\n");
const a = lines.findIndex(l => l.includes("/* ================= knowledge ================= */"));
const b = lines.findIndex(l => l.includes("/* ================= visuals ================= */"));
const code = lines.slice(a, b).join("\n");
const names = [...code.matchAll(/^  const ([A-Z_]+) *=/gm)].map(m => m[1]);
const ctx = { pad: n => String(n).padStart(2, "0"), esc: s => String(s ?? ""), SET: {}, out: {} };
vm.createContext(ctx);
vm.runInContext(code + "\n" + names.map(n => `out.${n} = ${n};`).join("\n"), ctx);
const res = {}, skipped = [];
for (const n of names) {
  const v = ctx.out[n];
  if (typeof v === "function") { skipped.push(n); continue; }
  const s = JSON.stringify(v);
  if (/function|=>/.test(String(v)) && s === undefined) { skipped.push(n); continue; }
  res[n] = v;
}
const m = html.match(/<script id="refsData" type="application\/json">([\s\S]*?)<\/script>/);
res.REFS = JSON.parse(m[1]);
console.error("kept", Object.keys(res).join(","), "| skipped", skipped.join(","));
fs.writeFileSync(process.argv[3], JSON.stringify(res, null, 1));
