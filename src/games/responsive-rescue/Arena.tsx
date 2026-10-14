import type { ReactNode } from 'react';
import './arena.css';
export const markup =
  '<main class="rescue" data-node="rescue"><div class="rescue-heading"><span class="rescue-logo">R.</span><span>STUDIO / RESPONSIVE</span></div><div class="rescue-layout" data-node="layout"><div class="rescue-card" data-node="card1"><span class="rescue-art">01</span><strong>Ide jadi antarmuka.</strong><p>Ruang untuk berpikir. Ruang untuk tumbuh.</p><button tabindex="-1">Jelajahi karya ↗</button></div><div class="rescue-card" data-node="card2"><span class="rescue-art second">02</span><strong>Setiap layar berarti.</strong><p>Pengalaman baik mengikuti penggunanya.</p></div></div></main>';
export default function Arena({ children }: { children: ReactNode }) {
  return <div className="responsive-arena">{children}</div>;
}
