// src/lib/content/feature-icons.tsx
import type { ReactNode } from 'react';

/** Index-matched to FEATURES. Wraps safely if the list grows. */
export const FEATURE_ICONS: ReactNode[] = [
  // cash flow
  <>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </>,
  // net worth
  <>
    <path d="M3 21h18" />
    <path d="M6 21v-6" />
    <path d="M11 21V9" />
    <path d="M16 21v-9" />
    <path d="M21 21V5" />
  </>,
  // debt
  <>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 10h19" />
  </>,
  // emergency fund
  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
  // goals
  <>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.5" />
  </>,
  // scenarios
  <>
    <path d="M4 8h4M14 8h6M4 16h8M18 16h2" />
    <circle cx="11" cy="8" r="2" />
    <circle cx="15" cy="16" r="2" />
  </>,
  // reports / insights
  <>
    <path d="M14 3v5h5" />
    <path d="M19 8v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5z" />
  </>,
];

/** Renders the icon for a given feature index, wrapping safely. */
export function FeatureIcon({
  index,
  className = 'h-5 w-5',
}: {
  index: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {FEATURE_ICONS[index % FEATURE_ICONS.length]}
    </svg>
  );
}