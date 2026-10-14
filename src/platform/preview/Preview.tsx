import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { applyCode, frameDocument } from './frame';
export default function Preview({
  html,
  base,
  code,
  mission,
  width = 480,
}: {
  html: string;
  base: string;
  code: string;
  mission: number;
  width?: number;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      if (ref.current) applyCode(ref.current, code);
    }, 250);
    return () => clearTimeout(timer);
  }, [code, ready]);
  return (
    <div className="preview-scroll" style={{ '--preview-width': `${width}px` } as CSSProperties}>
      <iframe
        ref={ref}
        title="Live preview arena"
        sandbox="allow-same-origin"
        srcDoc={frameDocument(html, base, mission)}
        style={{ width, maxWidth: 'none' }}
        onLoad={() => {
          setReady(true);
          if (ref.current) applyCode(ref.current, code);
        }}
      />
      <span className="preview-coordinate" aria-hidden="true">
        LIVE CANVAS / {width} PX
      </span>
    </div>
  );
}
