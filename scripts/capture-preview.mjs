import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const url = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto(url);
  await page.frameLocator('iframe').getByText('Paket frontend').waitFor();
  await page.screenshot({ path: 'artifacts/desktop-final.png', fullPage: true });
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.screenshot({ path: 'artifacts/mobile-final.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1100 });
  for (const [id, title] of [
    ['grid-architect', 'Grid Architect.'],
    ['responsive-rescue', 'Responsive Rescue.'],
    ['state-quest', 'State Quest.'],
    ['motion-studio', 'Motion Studio.'],
  ]) {
    await page.goto(`${url}/#game=${id}&level=1`);
    await page.getByRole('heading', { name: title }).waitFor();
    if (id !== 'grid-architect')
      await page.getByRole('textbox', { name: 'Editor kode misi' }).waitFor();
    await page.screenshot({ path: `artifacts/${id}.png`, fullPage: true });
  }
  console.log('Preview screenshots written to artifacts/.');
} finally {
  await browser.close();
}
