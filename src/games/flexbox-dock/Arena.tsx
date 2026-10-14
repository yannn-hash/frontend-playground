import type { ReactNode } from 'react';
import './arena.css';
export const markup =
  '<div class="dock" data-node="dock">' +
  [1, 2, 3, 4, 5]
    .map(
      (i) =>
        `<div class="robot" data-node="robot${i}"><span class="robot-eyes">··</span><small>BOT / 0${i}</small></div>`,
    )
    .join('') +
  '</div>';
export default function Arena({ children }: { children: ReactNode }) {
  return <div className="flex-arena">{children}</div>;
}
