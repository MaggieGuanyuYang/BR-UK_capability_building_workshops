import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL ?? "http://127.0.0.1:5173";
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome",
});
try {
  await mkdir("public", { recursive: true });
  for (const { mode, width, height, file } of [
    { mode: "social", width: 1200, height: 627, file: "social-preview.png" },
    { mode: "square", width: 1080, height: 1080, file: "linkedin-post.png" },
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    await page.goto(`${base}/?export=${mode}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".social-card").screenshot({ path: `public/${file}` });
    console.log(`Saved public/${file} (${width}×${height})`);
    await page.close();
  }
} finally {
  await browser.close();
}
