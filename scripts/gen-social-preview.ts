/**
 * Generates the 1280×640 social-preview PNG for the GitHub repo.
 * Run with: npm run gen:social-preview
 */

import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const WIDTH = 1280;
const HEIGHT = 640;
const OUT_PATH = resolve(__dirname, "..", "docs", "social-preview.png");

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  :root {
    --bg: #0a0d12;
    --bg-card: #121722;
    --border: #1e2533;
    --text: #f5f7fb;
    --muted: #8b95a8;
    --accent: #10b981;
    --accent-soft: rgba(16, 185, 129, 0.14);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }
  body {
    display: grid;
    grid-template-columns: 1fr 440px;
    gap: 56px;
    padding: 64px 72px;
    background:
      radial-gradient(ellipse 1100px 540px at 110% 50%, rgba(16, 185, 129, 0.10), transparent 60%),
      var(--bg);
  }
  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }
  .brand {
    display: flex; align-items: center; gap: 12px;
    font-size: 20px; font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.01em;
  }
  .brand-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 14px rgba(16, 185, 129, 0.7);
  }
  h1 {
    font-size: 72px;
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: -0.025em;
  }
  h1 em {
    font-style: normal;
    color: var(--accent);
  }
  .sub {
    margin-top: 22px;
    font-size: 26px;
    font-weight: 400;
    color: var(--muted);
    line-height: 1.35;
    max-width: 640px;
  }
  .badges {
    display: flex; gap: 10px; flex-wrap: wrap;
  }
  .badge {
    padding: 10px 18px;
    font-size: 17px; font-weight: 500;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--text);
  }
  .badge.accent {
    background: var(--accent-soft);
    border-color: rgba(16, 185, 129, 0.45);
    color: var(--accent);
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 14px;
  }
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 18px 20px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);
  }
  .cc {
    font-family: "SF Mono", "Menlo", "Consolas", monospace;
    font-size: 15px; font-weight: 700;
    background: var(--accent-soft);
    color: var(--accent);
    padding: 8px 12px;
    border-radius: 8px;
    letter-spacing: 0.05em;
    min-width: 54px;
    text-align: center;
  }
  .code-wrap { flex: 1; min-width: 0; }
  .label {
    font-size: 12px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 500;
  }
  .code {
    font-family: "SF Mono", "Menlo", "Consolas", monospace;
    font-size: 24px;
    font-weight: 600;
    margin-top: 4px;
    letter-spacing: 0.01em;
  }
  .check {
    width: 36px; height: 36px;
    background: var(--accent);
    color: var(--bg);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 20px;
  }
</style>
</head>
<body>
  <div class="left">
    <div class="brand">
      <span class="brand-dot"></span>
      postal-code-checker
    </div>
    <div>
      <h1>Validate postal codes<br/>for <em>249 countries</em>.</h1>
      <p class="sub">TypeScript-first. Zero runtime dependencies. Works everywhere JavaScript runs.</p>
    </div>
    <div class="badges">
      <span class="badge accent">TypeScript</span>
      <span class="badge">ESM + CommonJS</span>
      <span class="badge">Zero deps</span>
      <span class="badge">MIT</span>
    </div>
  </div>
  <div class="right">
    <div class="card">
      <div class="cc">US</div>
      <div class="code-wrap">
        <div class="label">United States</div>
        <div class="code">90210</div>
      </div>
      <span class="check">&#10003;</span>
    </div>
    <div class="card">
      <div class="cc">GB</div>
      <div class="code-wrap">
        <div class="label">United Kingdom</div>
        <div class="code">SW1A 1AA</div>
      </div>
      <span class="check">&#10003;</span>
    </div>
    <div class="card">
      <div class="cc">JP</div>
      <div class="code-wrap">
        <div class="label">Japan</div>
        <div class="code">100-0001</div>
      </div>
      <span class="check">&#10003;</span>
    </div>
  </div>
</body>
</html>`;

async function main() {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.setContent(HTML, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const buffer = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });

    await mkdir(dirname(OUT_PATH), { recursive: true });
    await writeFile(OUT_PATH, buffer);

    const kb = (buffer.byteLength / 1024).toFixed(1);
    console.log(`Wrote ${OUT_PATH} (${kb} KB, ${WIDTH}x${HEIGHT})`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
