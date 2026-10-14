import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('..', 'portfolio-frontdev');
await mkdir('integration', { recursive: true });
const htmlPath = 'src/partials/playground.html';
const cssPath = 'src/styles/playground.css';
const originalHtml = await readFile(path.join(root, htmlPath), 'utf8');
const originalCss = await readFile(path.join(root, cssPath), 'utf8');
const teaser = `      <aside class="playground-teaser" aria-labelledby="arcade-teaser-title">
        <p class="eyebrow">NEW / FRONTEND EXPERIMENT ARCADE</p>
        <h3 id="arcade-teaser-title">Small experiments. Real frontend skills.</h3>
        <p>Play through six interactive CSS and JavaScript games, from spacing to state and motion.</p>
        <a class="text-link" href="https://playground.smtmtc.com/">
          Explore the Playground
          <svg class="icon" aria-hidden="true"><use href="#icon-arrow-up" /></svg>
        </a>
      </aside>
`;
const css = `
/* Separate learning playground; the top-up demo remains available below. */
.playground-teaser {
  margin-top: 24px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
}
.playground-teaser .eyebrow { font-size: 9px; color: var(--accent); margin: 0 0 10px; }
.playground-teaser h3 { font-size: 18px; line-height: 1.35; margin: 0 0 10px; }
.playground-teaser > p:not(.eyebrow) { font-size: 13px; line-height: 1.7; color: var(--muted); margin: 0 0 14px; }
.playground-teaser .text-link { color: var(--accent); font-size: 13px; }
`;
const updatedHtml = originalHtml.replace(
  '      <div class="demo-disclaimer">',
  `${teaser}      <div class="demo-disclaimer">`,
);
if (updatedHtml === originalHtml)
  throw new Error('Portfolio source differs; inspect before preparing patch.');
function patch(file, before, after) {
  const a = before.replaceAll('\r\n', '\n').trimEnd().split('\n');
  const b = after.replaceAll('\r\n', '\n').trimEnd().split('\n');
  return (
    `diff --git a/${file} b/${file}\n--- a/${file}\n+++ b/${file}\n@@ -1,${a.length} +1,${b.length} @@\n` +
    a.map((line) => `-${line}\n`).join('') +
    b.map((line) => `+${line}\n`).join('')
  );
}
await writeFile(
  'integration/portfolio-playground.patch',
  patch(htmlPath, originalHtml, updatedHtml) + patch(cssPath, originalCss, originalCss + css),
);
console.log('Prepared portfolio teaser patch. Apply only after playground domain is ready.');
