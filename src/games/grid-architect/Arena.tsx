import type { ReactNode } from 'react';
import './arena.css';
export const markup =
  '<div class="blueprint" data-node="board"><div class="tile header" data-node="tile1">HEADER <span>01</span></div><div class="tile sidebar" data-node="tile2">SIDEBAR <span>02</span></div><div class="tile main" data-node="tile3">MAIN <span>03</span></div><div class="tile footer" data-node="tile4">FOOTER <span>04</span></div></div>';
export default function Arena({ children }: { children: ReactNode }) {
  return <div className="grid-arena">{children}</div>;
}
