import type { ReactNode } from 'react';
import './arena.css';
export default function Arena({ children }: { children: ReactNode }) {
  return <div className="state-arena">{children}</div>;
}
