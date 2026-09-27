// Renders the invitation's default gallery video (public/assets/video/our-story.webm):
// a short doodle "story" slideshow drawn on a canvas and recorded with
// MediaRecorder in headless Chromium.
// Usage: FONT_DIR=<node_modules/@fontsource> node scripts/render-story-video.cjs
const path = require('path');
const fs = require('fs');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }

const root = path.resolve(__dirname, '..');
const fontDir = process.env.FONT_DIR || path.join(root, 'node_modules/@fontsource');
const b64 = (file) => fs.readFileSync(file).toString('base64');

const slides = [1, 2, 3, 6, 9].map((n) => ({
  src: 'data:image/svg+xml;base64,' + b64(path.join(root, `public/assets/gallery/gallery-${n}.svg`)),
}));
const coupleArt = 'data:image/svg+xml;base64,' + b64(path.join(root, 'public/assets/og-art.svg'));
const fonts = {
  allura: b64(path.join(fontDir, 'allura/files/allura-latin-400-normal.woff2')),
  delicious: b64(path.join(fontDir, 'delicious-handrawn/files/delicious-handrawn-latin-400-normal.woff2')),
  lora: b64(path.join(fontDir, 'lora/files/lora-latin-500-italic.woff2')),
};

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent('<canvas id="c" width="1280" height="720"></canvas>');
  // MediaRecorder writes WebM without a duration, which breaks the seek bar;
  // fix-webm-duration (npm) patches it in. FIX_WEBM_DIR = its package folder.
  const fixDir = process.env.FIX_WEBM_DIR || path.join(root, 'node_modules/fix-webm-duration');
  await page.addScriptTag({ path: path.join(fixDir, 'fix-webm-duration.js') });

  const webmBase64 = await page.evaluate(async ({ slides, coupleArt, fonts }) => {
    const W = 1280, H = 720, FPS = 30;
    for (const [family, data] of [['Allura', fonts.allura], ['Delicious', fonts.delicious], ['LoraItalic', fonts.lora]]) {
      const f = new FontFace(family, `url(data:font/woff2;base64,${data})`);
      await f.load();
      document.fonts.add(f);
    }
    const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
    const imgs = await Promise.all(slides.map((s) => load(s.src)));
    const couple = await load(coupleArt);

    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const INK = '#181818', CREAM = '#FAF7EE', TERRA = '#B4533C', BLUSH = '#F7C6BA';

    const heartPath = (x, y, s) => {
      ctx.beginPath();
      ctx.moveTo(x, y + 6 * s);
      ctx.bezierCurveTo(x - 8 * s, y - 4 * s, x - 20 * s, y + 2 * s, x - 12 * s, y + 12 * s);
      ctx.lineTo(x, y + 24 * s);
      ctx.lineTo(x + 12 * s, y + 12 * s);
      ctx.bezierCurveTo(x + 20 * s, y + 2 * s, x + 8 * s, y - 4 * s, x, y + 6 * s);
      ctx.closePath();
    };
    const hearts = Array.from({ length: 16 }, (_, i) => ({
      x: (i * 97) % W, speed: 18 + (i % 5) * 7, size: 0.5 + (i % 4) * 0.2, phase: i * 1.7, color: i % 3 ? BLUSH : TERRA,
    }));
    const background = (t) => {
      ctx.fillStyle = CREAM;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(24,24,24,0.06)';
      for (let y = 8; y < H; y += 22) for (let x = 8; x < W; x += 22) ctx.fillRect(x, y, 2, 2);
      for (const h of hearts) {
        const y = H + 40 - ((t * h.speed + h.phase * 60) % (H + 120));
        const x = h.x + Math.sin(t * 0.8 + h.phase) * 14;
        heartPath(x, y, h.size);
        ctx.fillStyle = h.color; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1;
      }
    };
    const text = (str, x, y, font, color, align = 'center') => {
      ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
      ctx.fillText(str, x, y);
    };
    const polaroid = (img, cx, cy, h, rot, alpha, zoom) => {
      const w = h * 0.75;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.fillStyle = INK; ctx.fillRect(-w / 2 - 14 + 8, -h / 2 - 14 + 8, w + 28, h + 70); // shadow
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-w / 2 - 14, -h / 2 - 14, w + 28, h + 70);
      ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.strokeRect(-w / 2 - 14, -h / 2 - 14, w + 28, h + 70);
      ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip();
      const zw = w * zoom, zh = h * zoom;
      ctx.drawImage(img, -zw / 2, -zh / 2, zw, zh);
      ctx.restore();
    };

    // Timeline (seconds)
    const TITLE = 2.6, SLIDE = 2.2, END = 2.8;
    const total = TITLE + slides.length * SLIDE + END;
    const captions = ['Pertama bertemu', 'Hari-hari cerah', 'Piknik berdua', 'Senja favorit', 'Menuju hari bahagia'];
    const ease = (x) => 0.5 - Math.cos(Math.PI * Math.min(1, Math.max(0, x))) / 2;

    const draw = (t) => {
      background(t);
      if (t < TITLE) {
        const a = ease(t / 0.8) * (1 - ease((t - TITLE + 0.5) / 0.5));
        ctx.globalAlpha = a;
        ctx.drawImage(couple, 12, 12, 676, 606, 60, 57, 676, 606); // skip the frame border of the source art
        text('Kisah Kami', 960, 300, '120px Allura', TERRA);
        text('OUR STORY', 960, 410, '84px Delicious', INK);
        ctx.globalAlpha = 1;
        return;
      }
      const st = t - TITLE;
      const idx = Math.floor(st / SLIDE);
      if (idx < slides.length) {
        const local = (st % SLIDE) / SLIDE;
        const inA = ease(local / 0.25), outA = 1 - ease((local - 0.8) / 0.2);
        const alpha = Math.min(inA, idx === slides.length - 1 ? 1 : outA);
        const rot = (idx % 2 ? 1 : -1) * 0.05;
        polaroid(imgs[idx], 640, 330 + (1 - inA) * 30, 470, rot, alpha, 1.0 + local * 0.08);
        ctx.globalAlpha = alpha;
        text(captions[idx], 640, 648, '44px LoraItalic', INK);
        ctx.globalAlpha = 1;
        return;
      }
      const et = st - slides.length * SLIDE;
      const a = ease(et / 0.7) * (1 - ease((et - END + 0.5) / 0.5));
      ctx.globalAlpha = a;
      text('Sampai jumpa', 640, 300, '130px Allura', TERRA);
      text('DI HARI BAHAGIA KAMI', 640, 420, '72px Delicious', INK);
      heartPath(640, 480, 2.2); ctx.fillStyle = TERRA; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const stream = c.captureStream(FPS);
    const rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 2_500_000 });
    const chunks = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const done = new Promise((r) => (rec.onstop = r));
    rec.start(250);
    const start = performance.now();
    await new Promise((resolve) => {
      const tick = () => {
        const t = (performance.now() - start) / 1000;
        draw(Math.min(t, total));
        if (t >= total) return resolve();
        requestAnimationFrame(tick);
      };
      tick();
    });
    rec.stop();
    await done;
    const fixed = await window.ysFixWebmDuration(new Blob(chunks, { type: 'video/webm' }), total * 1000, { logger: false });
    const buf = new Uint8Array(await fixed.arrayBuffer());
    let bin = '';
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return btoa(bin);
  }, { slides, coupleArt, fonts });

  const out = path.join(root, 'public/assets/video/our-story.webm');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(webmBase64, 'base64'));
  await browser.close();
  console.log(`wrote ${path.relative(root, out)} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
})();
