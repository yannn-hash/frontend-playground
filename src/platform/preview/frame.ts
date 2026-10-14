import type { ElementSnapshot, LayoutSnapshot } from '../../shared/contracts/game';
const properties = [
  'visibility',
  'opacity',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'border-left-width',
  'box-sizing',
  'display',
  'grid-template-columns',
  'transition-property',
  'transition-duration',
  'transform',
  'animation-name',
  'animation-duration',
  'animation-iteration-count',
  'animation-direction',
];
export const baseCss =
  'html,body{margin:0;min-height:100%;color-scheme:dark;font-family:Segoe UI,Arial,sans-serif;color:#eff1e8;background:#171e18;background-image:radial-gradient(#7d997a28 1px,transparent 1px);background-size:20px 20px}body{overflow:hidden}*{font-synthesis:none}button:focus-visible{outline:2px solid white;outline-offset:4px}';
export function frameDocument(html: string, css: string, missionIndex: number) {
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; script-src 'none'; connect-src 'none'; font-src 'none'"><style>${baseCss}${css}</style><style id="participant-style"></style></head><body data-mission="${missionIndex}">${html}</body></html>`;
}
export function applyCode(frame: HTMLIFrameElement, code: string) {
  const style = frame.contentDocument?.getElementById('participant-style');
  if (style) style.textContent = code;
}
export function readSnapshot(frame: HTMLIFrameElement, viewport: number): LayoutSnapshot {
  const doc = frame.contentDocument,
    win = frame.contentWindow;
  if (!doc || !win) throw new Error('Arena belum siap.');
  const nodes: Record<string, ElementSnapshot> = {};
  doc.querySelectorAll<HTMLElement>('[data-node]').forEach((element) => {
    const rect = element.getBoundingClientRect();
    const computed = win.getComputedStyle(element);
    const styles = Object.fromEntries(properties.map((p) => [p, computed.getPropertyValue(p)]));
    if (element.dataset.node === 'orb') {
      let usesTransform = false,
        usesOpacity = false;
      for (const sheet of [...doc.styleSheets])
        for (const rule of [...sheet.cssRules])
          if (rule.type === CSSRule.KEYFRAMES_RULE) {
            const keyframes = rule as CSSKeyframesRule;
            if (keyframes.name === styles['animation-name'])
              for (const keyframe of [...keyframes.cssRules] as CSSKeyframeRule[]) {
                usesTransform ||= !!keyframe.style.transform;
                usesOpacity ||= !!keyframe.style.opacity;
              }
          }
      styles['keyframes-transform-opacity'] = String(usesTransform && usesOpacity);
    }
    nodes[element.dataset.node!] = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      styles,
    };
  });
  return { viewport, nodes };
}
const waitFrame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
function rewriteMedia(rules: CSSRuleList, target: 'normal' | 'reduce'): string {
  return [...rules]
    .map((rule) => {
      if (rule.type === CSSRule.MEDIA_RULE) {
        const media = rule as CSSMediaRule;
        let condition = media.conditionText;
        condition = condition.replace(
          /\(\s*prefers-reduced-motion\s*:\s*(reduce|no-preference)\s*\)/gi,
          (_match, value: string) =>
            value === (target === 'reduce' ? 'reduce' : 'no-preference')
              ? '(min-width: 0px)'
              : '(min-width: 99999px)',
        );
        return `@media ${condition}{${rewriteMedia(media.cssRules, target)}}`;
      }
      return rule.cssText;
    })
    .join('\n');
}
export async function evaluateCss(options: {
  html: string;
  base: string;
  code: string;
  mission: number;
  viewports: number[];
  motion: boolean;
  signal?: AbortSignal;
}): Promise<LayoutSnapshot[]> {
  const frame = document.createElement('iframe');
  frame.setAttribute('sandbox', 'allow-same-origin');
  frame.title = 'Pemeriksaan internal';
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;
  frame.style.cssText =
    'position:fixed;left:-12000px;top:0;height:500px;border:0;pointer-events:none;';
  try {
    await new Promise<void>((resolve, reject) => {
      if (options.signal?.aborted) {
        reject(new DOMException('Dibatalkan', 'AbortError'));
        return;
      }
      const abort = () => {
        clearTimeout(timer);
        reject(new DOMException('Dibatalkan', 'AbortError'));
      };
      const timer = setTimeout(() => {
        options.signal?.removeEventListener('abort', abort);
        reject(new Error('Arena tidak merespons. Coba lagi.'));
      }, 3000);
      options.signal?.addEventListener('abort', abort, { once: true });
      frame.onload = () => {
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', abort);
        resolve();
      };
      frame.srcdoc = frameDocument(options.html, options.base, options.mission);
      document.body.append(frame);
    });
    applyCode(frame, options.code);
    const results: LayoutSnapshot[] = [];
    const style = frame.contentDocument!.getElementById('participant-style') as HTMLStyleElement;
    const parsed = style.sheet;
    const normal =
      options.motion && parsed ? rewriteMedia(parsed.cssRules, 'normal') : options.code;
    const reduced =
      options.motion && parsed ? rewriteMedia(parsed.cssRules, 'reduce') : options.code;
    for (const width of options.viewports) {
      if (options.signal?.aborted) throw new DOMException('Dibatalkan', 'AbortError');
      frame.style.width = `${width}px`;
      style.textContent = normal;
      await waitFrame();
      const snapshot = readSnapshot(frame, width);
      if (options.motion) {
        const button = frame.contentDocument!.querySelector<HTMLButtonElement>('.motion-button');
        button?.focus();
        await new Promise((resolve) => setTimeout(resolve, 450));
        if (button && snapshot.nodes.button) {
          const transform = frame.contentWindow!.getComputedStyle(button).transform;
          snapshot.nodes.button.styles['tested-translate-y'] =
            transform === 'none' ? '0' : String(new DOMMatrix(transform).m42);
        }
        style.textContent = reduced;
        await waitFrame();
        snapshot.reduced = readSnapshot(frame, width).nodes;
      }
      results.push(snapshot);
    }
    return results;
  } finally {
    frame.remove();
  }
}
