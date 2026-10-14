import type { ReactNode } from 'react';
import './arena.css';
export const markup =
  '<div class="box-stage" data-node="stage"><div class="parcel" data-node="parcel"><span class="parcel-symbol">{ }</span><strong>Paket frontend</strong><small>CONTENT</small></div><div class="measure-note">Setiap ruang punya peran.</div></div>';
export default function Arena({ children }: { children: ReactNode }) {
  return <div className="box-arena">{children}</div>;
}
