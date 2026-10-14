import type { ReactNode } from 'react';
import './arena.css';
export const markup =
  '<div class="motion-stage"><div class="orbit" aria-hidden="true"></div><button class="motion-button" data-node="button">EXPLORE <span>↗</span></button><div class="motion-orb" data-node="orb"><span>✦</span></div><p>Gerak mengikuti maksud.</p></div>';
export default function Arena({ children }: { children: ReactNode }) {
  return <div className="motion-arena">{children}</div>;
}
