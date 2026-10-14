import { test, expect, type Page } from '@playwright/test';
import { missions as box } from '../../src/games/box-model/missions';
import { missions as flex } from '../../src/games/flexbox-dock/missions';
import { missions as grid } from '../../src/games/grid-architect/missions';
import { missions as responsive } from '../../src/games/responsive-rescue/missions';
import { missions as state } from '../../src/games/state-quest/missions';
import { missions as motion } from '../../src/games/motion-studio/missions';
async function edit(page: Page, code: string) {
  const codeTab = page.getByRole('button', { name: 'style.css', exact: true });
  if (await codeTab.count()) await codeTab.click();
  const editor = page.getByRole('textbox', { name: 'Editor kode misi' });
  await editor.click();
  await editor.press('ControlOrMeta+a');
  await editor.fill(code);
}
for (const [id, missions] of [
  ['box-model', box],
  ['flexbox-dock', flex],
  ['grid-architect', grid],
  ['responsive-rescue', responsive],
  ['state-quest', state],
  ['motion-studio', motion],
] as const) {
  for (const [index, mission] of missions.entries())
    test(`${id} misi ${index + 1}: starter fails, solution passes`, async ({ page }) => {
      await page.goto(`/#game=${id}&level=${index + 1}`);
      await expect(page.getByRole('heading', { name: mission.title, exact: true })).toBeVisible();
      const run = page.getByRole('button', {
        name: id === 'state-quest' ? 'Jalankan & periksa' : 'Periksa hasil',
      });
      await run.click();
      await expect(page.getByText('Hampir sampai. Coba satu perubahan lagi.')).toBeVisible();
      if (id === 'box-model' || id === 'flexbox-dock') {
        for (const control of mission.controls) {
          const desired = mission.solution
            .match(new RegExp(`${control.property}\\s*:\\s*([^;]+)`))![1]
            .trim();
          if (control.type === 'select')
            await page.getByLabel(control.label, { exact: false }).selectOption(desired);
          else {
            const input = page.getByLabel(control.label, { exact: false });
            await input.evaluate(
              (element, value) => {
                const setter = Object.getOwnPropertyDescriptor(
                  HTMLInputElement.prototype,
                  'value',
                )!.set!;
                setter.call(element, value);
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
              },
              String(parseFloat(desired)),
            );
          }
        }
      } else await edit(page, mission.solution);
      await run.click();
      await expect(page.getByText('Misi selesai. Konsepnya mulai terasa!')).toBeVisible();
      await expect(page.getByText('Selesai', { exact: true })).toBeVisible();
    });
}
test('progress and draft persist; reset retains completion', async ({ page }) => {
  await page.goto('/#game=grid-architect&level=1');
  await edit(page, grid[0].solution);
  await page.getByRole('button', { name: 'Periksa hasil' }).click();
  await expect(page.getByText('Misi selesai. Konsepnya mulai terasa!')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Selesai', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'style.css', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Editor kode misi' })).toContainText(
    'repeat(3,1fr)',
  );
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByText('Selesai', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Periksa hasil' }).click();
  await expect(page.getByText('Hampir sampai. Coba satu perubahan lagi.')).toBeVisible();
});
test('JavaScript syntax errors and infinite loops recover without freezing', async ({ page }) => {
  await page.goto('/#game=state-quest&level=1');
  await edit(page, 'function nextState( {');
  await page.getByRole('button', { name: 'Jalankan & periksa' }).click();
  await expect(page.getByText('Kode perlu diperiksa.')).toBeVisible();
  await edit(page, 'function nextState(){while(true){}}');
  await page.getByRole('button', { name: 'Jalankan & periksa' }).click();
  await expect(page.getByText('Kode melebihi 2 detik.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByText('Kode perlu diperiksa.')).not.toBeVisible();
});
test('filter, search, deep links and back navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Menengah', exact: true }).first().click();
  await expect(
    page.getByRole('navigation', { name: 'Daftar game' }).getByRole('button'),
  ).toHaveCount(2);
  await page.getByRole('button', { name: 'Semua', exact: true }).first().click();
  await page.getByRole('textbox', { name: 'Cari game atau topik' }).first().fill('State');
  await page.getByRole('navigation', { name: 'Daftar game' }).getByRole('button').first().click();
  await expect(page).toHaveURL(/state-quest/);
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Box Model Lab.' })).toBeVisible();
});
test('blocked storage remains playable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Blocked');
      },
    });
  });
  await page.goto('/');
  await expect(
    page.getByText('Penyimpanan browser tidak tersedia.', { exact: false }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Petunjuk', exact: true }).click();
  await expect(page.getByText(box[0].hints[0])).toBeVisible();
});
for (const width of [375, 768, 1024, 1440])
  test(`layout and keyboard at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Box Model Lab.' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 375) {
      await page.getByRole('button', { name: 'Buka katalog game' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
    }
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });
test('CSS cannot execute markup or scripts in the arena', async ({ page }) => {
  await page.goto('/#game=grid-architect&level=1');
  await edit(page, '</style><script>parent.document.body.dataset.injected="yes"</script>');
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => document.body.dataset.injected)).toBeUndefined();
  await expect(page.getByRole('heading', { name: 'Grid Architect.' })).toBeVisible();
});
test('reduced motion solution works with browser preference enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#game=motion-studio&level=3');
  await edit(page, motion[2].solution);
  await page.getByRole('button', { name: 'Periksa hasil' }).click();
  await expect(page.getByText('Misi selesai. Konsepnya mulai terasa!')).toBeVisible();
});
test('alternative grid solution and keyboard search remain usable', async ({ page }) => {
  await page.goto('/#game=grid-architect&level=1');
  await edit(page, '.blueprint{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}');
  await page.getByRole('button', { name: 'Periksa hasil' }).click();
  await expect(page.getByText('Misi selesai. Konsepnya mulai terasa!')).toBeVisible();
  await page.locator('h1').click();
  await page.keyboard.press('/');
  await expect(page.getByRole('textbox', { name: 'Cari game atau topik' }).first()).toBeFocused();
});
test('a malformed worker message cannot crash the application', async ({ page }) => {
  await page.goto('/#game=state-quest&level=1');
  await edit(
    page,
    'self.postMessage({traces:[[{status:{},requestId:1}]]}); function nextState(s){return s;}',
  );
  await page.getByRole('button', { name: 'Jalankan & periksa' }).click();
  await expect(page.getByText('Kode perlu diperiksa.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'State Quest.' })).toBeVisible();
});
test('all three badges can be represented without score inflation', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'riskiyanto.arcade.progress.v1',
      JSON.stringify({
        version: 1,
        completed: ['box-model/space', 'box-model/size', 'box-model/overflow'],
        drafts: {},
      }),
    ),
  );
  await page.goto('/');
  await expect(page.locator('.game-heading-icon')).toHaveClass(/badge-earned/);
  await expect(page.locator('.global-progress strong')).toHaveText('3 / 18');
});
