import { createRequire } from 'module';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/ryanf/puppeteer-test/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const width = parseInt(process.argv[4]) || 1280;

const dir = './temporary screenshots';
if (!existsSync(dir)) mkdirSync(dir);

const existing = readdirSync(dir).map(f => {
  const m = f.match(/^screenshot-(\d+)/);
  return m ? parseInt(m[1]) : 0;
});
const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;

const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = join(dir, filename);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/ryanf/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2' });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
