import type { ReactNode } from "react";
import florals from "@/assets/florals.png";

const CORNER =
  "M2 58 C2 30 12 12 32 5 C42 2 50 2 58 2 M12 48 C12 32 20 20 34 15 C26 23 24 31 30 35 C36 39 42 31 37 25 M8 8 C17 8 21 13 21 21 C13 21 8 16 8 8 Z M26 6 C24 12 20 16 14 18";

export function Corner({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <path className="draw corner" pathLength={1} d={CORNER} stroke="currentColor" strokeWidth={0.9} />
    </g>
  );
}

export function FrameOrnament() {
  return (
    <svg className="frame-ornament" viewBox="0 0 300 420" preserveAspectRatio="none" aria-hidden>
      <rect className="draw border-line" pathLength={1} x="8" y="8" width="284" height="404" stroke="currentColor" strokeWidth={1.2} />
      <rect className="draw border-line" pathLength={1} x="13" y="13" width="274" height="394" stroke="currentColor" strokeWidth={0.4} />
      <Corner transform="translate(16,16)" />
      <Corner transform="translate(284,16) scale(-1,1)" />
      <Corner transform="translate(16,404) scale(1,-1)" />
      <Corner transform="translate(284,404) scale(-1,-1)" />
      <path className="draw corner" pathLength={1} stroke="currentColor" strokeWidth={0.8}
        d="M120 13 C135 13 140 24 150 24 C160 24 165 13 180 13 M150 24 L150 30 M144 30 L150 36 L156 30 Z" />
      <path className="draw corner" pathLength={1} stroke="currentColor" strokeWidth={0.8}
        d="M120 407 C135 407 140 396 150 396 C160 396 165 407 180 407 M150 396 L150 390 M144 390 L150 384 L156 390 Z" />
    </svg>
  );
}

export function Frame({ children, florals: showFlorals = true, id }: { children?: ReactNode; florals?: boolean; id?: string }) {
  return (
    <div className="frame" data-frame id={id}>
      <div className="frame-moulding">
        <div className="frame-paper paper">
          <FrameOrnament />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[12%] text-center">{children}</div>
          <div className="light-sweep" />
        </div>
      </div>
      {showFlorals && (
        <>
          <img src={florals} alt="" width={1024} height={1024} className="floral floral-tl" />
          <img src={florals} alt="" width={1024} height={1024} className="floral floral-br" loading="lazy" />
        </>
      )}
    </div>
  );
}

export const SIGNATURE_PATH =
  "M20 140 C60 60 90 50 100 90 C108 120 80 150 70 130 C60 110 120 70 150 80 C175 90 150 140 170 140 C190 140 200 90 220 95 C240 100 225 140 245 138 C270 135 280 80 300 90 C320 100 300 150 330 130 C350 118 370 110 390 112";

export function Pen({ className }: { className?: string }) {
  // Nib tip sits at (0,0); the pen leans up and to the right.
  return (
    <g className={className}>
      <g transform="rotate(32)">
        <path d="M0 0 L-5 -16 L0 -22 L5 -16 Z" fill="var(--brass)" stroke="var(--brass-deep)" strokeWidth={0.6} />
        <line x1="0" y1="-2" x2="0" y2="-15" stroke="var(--ink)" strokeWidth={0.6} />
        <rect x="-6" y="-34" width="12" height="13" rx="2" fill="var(--brass-deep)" />
        <rect x="-6.5" y="-110" width="13" height="78" rx="6" fill="var(--ink)" />
        <rect x="-6.5" y="-62" width="13" height="3" fill="var(--brass)" />
        <rect x="-1" y="-104" width="2" height="34" rx="1" fill="var(--brass-light)" />
      </g>
    </g>
  );
}
