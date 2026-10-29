// Fine-line icons for the luxury design (1.25px strokes).
import type { ReactNode } from "react";

function Line({ className = "h-5 w-5", children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {children}
    </svg>
  );
}

export const FlameMark = ({ className = "h-5 w-5" }: { className?: string }) => (
  <Line className={className}>
    <path d="M12 21c-3.3 0-6-2.5-6-5.8 0-3.6 3.2-5.6 3.9-9.7.1-.6.8-.8 1.2-.4C13.4 7.400 18 10.900 18 15.200 18 18.500 15.300 21 12 21z" />
    <path d="M12 21c-1.400 0-2.500-1.100-2.500-2.500 0-1.600 1.300-2.500 2.500-4 1.200 1.500 2.500 2.400 2.500 4 0 1.400-1.100 2.500-2.500 2.500z" />
  </Line>
);
export const SearchLine = ({ className }: { className?: string }) => (
  <Line className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.200-4.200" />
  </Line>
);
export const UserLine = ({ className }: { className?: string }) => (
  <Line className={className}>
    <circle cx="12" cy="8" r="3.800" />
    <path d="M4.500 20.500a7.500 7.500 0 0 1 15 0" />
  </Line>
);
export const BagLine = ({ className }: { className?: string }) => (
  <Line className={className}>
    <path d="M5 8h14l-1 12.500H6z" />
    <path d="M9 8V6.500a3 3 0 0 1 6 0V8" />
  </Line>
);
export const MenuLine = ({ className }: { className?: string }) => (
  <Line className={className}>
    <path d="M3.500 8h17M3.500 16h11" />
  </Line>
);
export const CloseLine = ({ className }: { className?: string }) => (
  <Line className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Line>
);
export const ArrowLine = ({ className = "h-4 w-4" }: { className?: string }) => (
  <Line className={className}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Line>
);
export const HomeLine = ({ className }: { className?: string }) => (
  <Line className={className}>
    <path d="M4 10.500 12 4l8 6.500V20h-5v-5.500H9V20H4z" />
  </Line>
);
export const GridLine = ({ className }: { className?: string }) => (
  <Line className={className}>
    <rect x="4" y="4" width="6.500" height="6.500" />
    <rect x="13.500" y="4" width="6.500" height="6.500" />
    <rect x="4" y="13.500" width="6.500" height="6.500" />
    <rect x="13.500" y="13.500" width="6.500" height="6.500" />
  </Line>
);
export const SealLine = ({ className }: { className?: string }) => (
  <Line className={className}>
    <circle cx="12" cy="10" r="6" />
    <path d="m9.500 10 1.800 1.800L14.800 8.300M8.500 15.200 7 21l5-2.500 5 2.500-1.500-5.800" />
  </Line>
);
export const BoxLine = ({ className }: { className?: string }) => (
  <Line className={className}>
    <path d="M20.500 7.500 12 3 3.500 7.500v9L12 21l8.500-4.500z" />
    <path d="m3.500 7.500 8.500 4.500 8.500-4.500M12 12v9" />
  </Line>
);
export const HandLine = ({ className }: { className?: string }) => (
  <Line className={className}>
    <rect x="3" y="6.500" width="18" height="11" rx="1.500" />
    <circle cx="12" cy="12" r="2.500" />
    <path d="M6.500 9.500v.01M17.500 14.500v.01" />
  </Line>
);

// Brand marks for the footer social buttons (filled).
export const FacebookMark = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
  </svg>
);
export const InstagramMark = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className={className}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
  </svg>
);
export const TikTokMark = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.37-2.48V9.66a5.7 5.7 0 0 0-.77-.05A5.7 5.7 0 0 0 4.17 15.3 5.7 5.7 0 0 0 9.86 21a5.7 5.7 0 0 0 5.69-5.690V9.010a7.35 7.35 0 0 0 4.28 1.370V7.300s-1.88.09-3.23-1.48" />
  </svg>
);
