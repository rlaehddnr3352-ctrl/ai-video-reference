// index.html(siteData 방식)을 열어 카드 201장의 계산된 값(미리보기 HTML, 프롬프트 등)을 JSON으로 뽑는다.
// 사용: node export_items.js <index.html> <out.json>
const { chromium } = require("playwright"), fs = require("fs"), path = require("path");
(async () => {
  const [src, out] = process.argv.slice(2);
  let html = fs.readFileSync(src, "utf8");
  const hook = `window.__dump = () => ITEMS.map(it => ({key:it.key, cat:it.cat, code:it.code, name:it.name, en:it.en||"", desc:it.desc||"", when:it.when||"", caution:it.caution||"", fit:it.fit||"", dur:it.dur||"", uses:it.uses||[], tags:it.tags||[], ytq:it.ytq||"", pad:!!it.pad, visual:(()=>{const t=document.createElement("div");t.innerHTML=it.visual();return t.innerHTML;})(), simple:it.simple(), detail:it.detail()}));
  window.__cats = CATS;\n  renderAll();\n\n  const embedded`;
  if (!html.includes("renderAll();\n\n  const embedded")) throw new Error("hook point not found");
  html = html.replace("renderAll();\n\n  const embedded", hook);
  const tmp = path.join(path.dirname(path.resolve(src)), ".export_tmp.html");
  fs.writeFileSync(tmp, html);
  const b = await chromium.launch(); const p = await b.newPage();
  await p.route(/^https?:/, r => r.abort());
  await p.goto("file://" + tmp); await p.waitForTimeout(500);
  const items = await p.evaluate(() => { localStorage.clear(); return window.__dump(); });
  const cats = await p.evaluate(() => window.__cats);
  const fill = t => t.replace(/==(.+?)==/g, (m, k) => k === "제품" ? "[product]" : "[" + k + "]").replace(/제품/g, "[product]");
  items.forEach(it => { it.simple = fill(it.simple); it.detail = fill(it.detail); });
  fs.writeFileSync(out, JSON.stringify({ cats, items }, null, 1));
  fs.unlinkSync(tmp); await b.close();
  console.log("items", items.length);
})();
