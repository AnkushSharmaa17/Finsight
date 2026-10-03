// src/lib/site.ts

export const SITE = {
  name: 'FinSight',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  tagline: 'Understand your money in one picture',
  description:
    'FinSight turns your income, expenses, loans, assets and goals into one clear financial health report and what-if scenarios. Built for India, in INR.',
  locale: 'en_IN',
} as const;

export type NavItem = {
  href: string;
  label: string;
  /** Set true to render as an external link (target="_blank" + rel="noopener"). */
  external?: boolean;
  /** Set true to hide from the nav unless the user is authenticated. */
  requiresAuth?: boolean;
  /** Nested items — useful if you later add dropdowns. */
  children?: NavItem[];
};

export const NAV: readonly NavItem[] = [
  { href: '/features',     label: 'Features'     },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/calculators',  label: 'Calculators'  },
  { href: '/blog',         label: 'Guides'       },
  { href: '/faq',          label: 'FAQ'          },
];