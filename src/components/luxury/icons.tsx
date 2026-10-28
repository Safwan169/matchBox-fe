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
