// Renders public/og-image.png (link preview for WhatsApp, Facebook, etc.)
// from public/assets/og-art.svg plus text in the invitation's web fonts.
// Usage: node scripts/render-og-image.cjs   (needs Playwright + Chromium)
const path = require('path');
const fs = require('fs');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }

(async () => {
  const root = path.resolve(__dirname, '..');
  const art = fs.readFileSync(path.join(root, 'public/assets/og-art.svg'), 'utf8');
  // Fonts come from the @fontsource npm packages (FONT_DIR = their
  // node_modules folder) so rendering doesn't depend on Google Fonts access.
  const fontDir = process.env.FONT_DIR || path.join(root, 'node_modules/@fontsource');
  const font = (pkg, file) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(fontDir, pkg, 'files', file)).toString('base64');
  const html = `<!doctype html><html><head>
  <style>
    @font-face{font-family:Allura;src:url(${font('allura', 'allura-latin-400-normal.woff2')})}
    @font-face{font-family:'Delicious Handrawn';src:url(${font('delicious-handrawn', 'delicious-handrawn-latin-400-normal.woff2')})}
    @font-face{font-family:Lora;font-style:italic;font-weight:500;src:url(${font('lora', 'lora-latin-500-italic.woff2')})}
    @font-face{font-family:Lora;font-weight:500;src:url(${font('lora', 'lora-latin-500-normal.woff2')})}
    body{margin:0;width:1200px;height:630px;position:relative;overflow:hidden}
    .art{position:absolute;inset:0}
    .text{position:absolute;left:720px;right:60px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;color:#181818}
    .script{font-family:Allura,cursive;font-size:70px;white-space:nowrap;color:#B4533C;line-height:1}
    .title{font-family:'Delicious Handrawn',cursive;font-size:104px;line-height:.95;letter-spacing:2px;margin-top:6px}
    .sub{font-family:Lora,serif;font-style:italic;font-size:30px;margin-top:22px;color:#3b3b3b}
    .pill{margin-top:26px;padding:10px 28px;border:3px solid #181818;border-radius:999px;background:#EFE3C6;box-shadow:5px 5px 0 #181818;font-family:Lora,serif;font-size:26px;font-weight:500}
  </style></head><body>
  <div class="art">${art}</div>
  <div class="text">
    <div class="script">The Wedding Of</div>
    <div class="title">KAMI<br>MENIKAH!</div>
    <div class="sub">Dengan penuh sukacita kami mengundang Anda</div>
    <div class="pill">Buka undangan &rarr;</div>
  </div></body></html>`;
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await Promise.all([...document.fonts].map((f) => f.load())); await document.fonts.ready; });
  await page.screenshot({ path: path.join(root, 'public/og-image.png') });
  await browser.close();
  console.log('wrote public/og-image.png');
})();
