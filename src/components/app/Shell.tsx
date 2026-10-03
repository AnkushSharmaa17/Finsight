'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/* Nav data — grouped by section for a proper hierarchy                */
/* ------------------------------------------------------------------ */
type NavItem = { href: string; label: string; icon: React.ReactNode };

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[18px] w-[18px] shrink-0"
    aria-hidden
  >
    {children}
  </svg>
);

const ICONS = {
  dashboard: (
    <Icon>
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </Icon>
  ),
  income: (
    <Icon>
      <path d="M3 15l4-4 3 3 6-7" />
      <path d="M16 7h-4" />
      <path d="M16 7v4" />
    </Icon>
  ),
  expenses: (
    <Icon>
      <rect x="2.5" y="5" width="15" height="10" rx="2" />
      <path d="M2.5 9h15" />
      <path d="M6 13h3" />
    </Icon>
  ),
  liabilities: (
    <Icon>
      <circle cx="10" cy="10" r="7" />
      <path d="M7.5 10h5" />
    </Icon>
  ),
  assets: (
    <Icon>
      <path d="M3 9.5l7-5.5 7 5.5" />
      <path d="M5 9v7h10V9" />
      <path d="M8.5 16v-4h3v4" />
    </Icon>
  ),
  investments: (
    <Icon>
      <path d="M3 17V9" />
      <path d="M8 17V5" />
      <path d="M13 17v-6" />
      <path d="M18 17V3" />
    </Icon>
  ),
  goals: (
    <Icon>
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="3.5" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </Icon>
  ),
  scenarios: (
    <Icon>
      <circle cx="5" cy="6" r="2" />
      <circle cx="15" cy="6" r="2" />
      <circle cx="10" cy="15" r="2" />
      <path d="M7 6h6" />
      <path d="M6 8v2a3 3 0 003 3" />
      <path d="M14 8v2a3 3 0 01-3 3" />
    </Icon>
  ),
  reports: (
    <Icon>
      <path d="M5 3h7l4 4v10a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M12 3v4h4" />
      <path d="M7 11h6" />
      <path d="M7 14h4" />
    </Icon>
  ),
  profile: (
    <Icon>
      <circle cx="10" cy="7" r="3" />
      <path d="M3.5 17c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5" />
    </Icon>
  ),
};

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: ICONS.dashboard },
      { href: '/financials/income', label: 'Income', icon: ICONS.income },
      { href: '/financials/expenses', label: 'Expenses', icon: ICONS.expenses },
      { href: '/financials/liabilities', label: 'Liabilities', icon: ICONS.liabilities },
      { href: '/financials/assets', label: 'Assets', icon: ICONS.assets },
      { href: '/financials/investments', label: 'Investments', icon: ICONS.investments },
    ],
  },
  {
    label: 'Plan',
    items: [
      { href: '/goals', label: 'Goals', icon: ICONS.goals },
      { href: '/scenarios', label: 'Scenarios', icon: ICONS.scenarios },
      { href: '/reports', label: 'Reports', icon: ICONS.reports },
    ],
  },
  {
    label: 'Account',
    items: [{ href: '/profile', label: 'Profile', icon: ICONS.profile }],
  },
];

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2';

export function Shell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: { name?: string; email?: string };
}) {
  const path = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* Close on route change */
  useEffect(() => { setDrawerOpen(false); }, [path]);

  /* Lock body scroll + return focus on close */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [drawerOpen]);

  /* Escape to close */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  /* Basic focus trap inside the drawer while open */
  useEffect(() => {
    if (!drawerOpen) return;
    const el = drawerRef.current;
    if (!el) return;
    const sel = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const focusables = el!.querySelectorAll<HTMLElement>(sel);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  async function logout() {
    if (signingOut) return;
    setSigningOut(true);
    await api('auth/logout', { method: 'POST' }).catch(() => null);
    router.replace('/login');
    router.refresh();
  }

  const initials = (user?.name ?? user?.email ?? '?')
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  /* Shared easing — iOS-style spring-out */
  const EASE = 'ease-[cubic-bezier(0.32,0.72,0,1)]';

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* ================================================================ */}
      {/* Mobile top bar                                                   */}
      {/* ================================================================ */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-line/80
                   bg-canvas/80 px-4 py-3 backdrop-blur-xl md:hidden"
      >
        <Link
          href="/"
          className={`inline-flex items-center gap-2 rounded-md font-display text-lg font-bold text-ink ${FOCUS}`}
        >
          <span className="relative">
            FinSight
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-leaf to-leaf/0"
            />
          </span>
        </Link>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
          aria-controls="app-drawer"
          className={`relative grid h-10 w-10 place-items-center rounded-xl border border-line
                     bg-surface text-ink shadow-[0_1px_2px_rgba(15,23,42,0.04)]
                     transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out
                     hover:-translate-y-px hover:border-leaf/40 hover:bg-mist
                     hover:shadow-[0_4px_12px_-4px_rgba(15,23,42,0.12)]
                     active:translate-y-0 active:scale-[0.96]
                     ${FOCUS}`}
        >
          <span aria-hidden className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current
                         transition-transform duration-300 ${EASE}
                         ${drawerOpen ? 'translate-y-[7px] rotate-45' : ''}`}
            />
            <span
              className={`absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-current
                         transition-[opacity,transform] duration-200 ${EASE}
                         ${drawerOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'}`}
            />
            <span
              className={`absolute left-0 top-[14px] h-[2px] w-5 rounded-full bg-current
                         transition-transform duration-300 ${EASE}
                         ${drawerOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
            />
          </span>
        </button>
      </header>

      {/* ================================================================ */}
      {/* Backdrop                                                         */}
      {/* ================================================================ */}
      <div
        aria-hidden
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm
                   transition-opacity duration-[350ms] ${EASE} md:hidden
                   ${drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      {/* ================================================================ */}
      {/* Layout                                                           */}
      {/* ================================================================ */}
      <div className="md:flex">
        {/* -------------------------------------------------------------- */}
        {/* Sidebar / Drawer                                               */}
        {/* -------------------------------------------------------------- */}
        <aside
          id="app-drawer"
          ref={drawerRef}
          data-state={drawerOpen ? 'open' : 'closed'}
          aria-hidden={!drawerOpen ? undefined : undefined}
          className={`group/drawer fixed inset-y-0 left-0 z-50 flex w-[19rem] flex-col
                     border-r border-line bg-surface
                     shadow-[8px_0_40px_-12px_rgba(15,23,42,0.25)]
                     transition-transform duration-[440ms] ${EASE}
                     -translate-x-full
                     data-[state=open]:translate-x-0
                     md:static md:z-auto md:w-64 md:translate-x-0 md:shadow-none
                     lg:w-72`}
        >
          {/* Right-edge glow — feels physical, like a raised surface */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-px inset-y-0 w-px
                       bg-gradient-to-b from-transparent via-leaf/40 to-transparent
                       opacity-0 transition-opacity duration-500
                       group-data-[state=open]/drawer:opacity-100
                       md:hidden"
          />

          {/* ---------------- Mobile drawer header ---------------- */}
          <div className="flex items-center justify-between px-4 pb-2 pt-4 md:hidden">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 rounded-md font-display text-lg font-bold text-ink ${FOCUS}`}
            >
              FinSight
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className={`grid h-9 w-9 place-items-center rounded-lg text-ink/60
                         transition-[background-color,color,transform] duration-200
                         hover:bg-mist hover:text-ink active:scale-[0.95] ${FOCUS}`}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4" aria-hidden>
                <path d="M5 5l10 10" />
                <path d="M15 5l-10 10" />
              </svg>
            </button>
          </div>

          {/* ---------------- User card (mobile drawer) ---------------- */}
          {user && (
            <div
              style={{ transitionDelay: drawerOpen ? '80ms' : '0ms' }}
              className={`mx-3 mt-1 flex items-center gap-3 rounded-xl border border-line/80 bg-canvas/60 p-3
                         opacity-0 -translate-x-2
                         transition-[opacity,transform] duration-300 ${EASE}
                         group-data-[state=open]/drawer:translate-x-0 group-data-[state=open]/drawer:opacity-100
                         md:hidden`}
            >
              <span
                aria-hidden
                className="grid h-10 w-10 place-items-center rounded-full
                           bg-gradient-to-br from-leaf to-leafdark text-sm font-bold text-white
                           shadow-[0_2px_8px_-2px_rgba(22,163,74,0.5)]"
              >
                {initials}
              </span>
              <span className="min-w-0">
                {user.name && <span className="block truncate text-sm font-semibold text-ink">{user.name}</span>}
                {user.email && <span className="block truncate text-xs text-ink/55">{user.email}</span>}
              </span>
            </div>
          )}

          {/* ---------------- Desktop brand ---------------- */}
          <div className="hidden px-5 pb-2 pt-6 md:block">
            <Link
              href="/"
              className={`group inline-flex items-center gap-2 rounded-md font-display text-xl font-bold text-ink
                         transition-transform duration-300 ${EASE} hover:-translate-y-0.5 ${FOCUS}`}
            >
              <span className="relative">
                FinSight
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-leaf
                             transition-transform duration-300 ${EASE} group-hover:scale-x-100"
                />
              </span>
              <span
                aria-hidden
                className="text-leaf -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 ${EASE}
                           group-hover:translate-x-0 group-hover:opacity-100"
              >
                →
              </span>
            </Link>
            <p className="mt-1.5 text-xs font-medium text-ink/50">Personal finance, in one place</p>
          </div>

          {/* ---------------- Nav ---------------- */}
          <nav aria-label="App" className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
            {NAV_SECTIONS.map((section, si) => (
              <div key={section.label} className={si > 0 ? 'mt-4' : ''}>
                <p
                  style={{ transitionDelay: drawerOpen ? `${120 + si * 60}ms` : '0ms' }}
                  className={`px-3 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink/40
                             opacity-0 transition-opacity duration-300
                             group-data-[state=open]/drawer:opacity-100
                             md:!opacity-100`}
                >
                  {section.label}
                </p>

                <ul className="space-y-0.5">
                  {section.items.map((item, i) => {
                    const active =
                      path === item.href ||
                      (item.href !== '/dashboard' && path.startsWith(item.href + '/'));
                    const delay = drawerOpen ? `${160 + si * 60 + i * 30}ms` : '0ms';
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? 'page' : undefined}
                          style={{ transitionDelay: delay }}
                          className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                                     opacity-0 -translate-x-3
                                     transition-[opacity,transform,background-color,color,box-shadow] duration-[420ms] ${EASE}
                                     group-data-[state=open]/drawer:translate-x-0 group-data-[state=open]/drawer:opacity-100
                                     hover:-translate-y-px hover:bg-mist hover:shadow-[0_4px_14px_-8px_rgba(15,23,42,0.2)]
                                     active:translate-y-0 active:scale-[0.98]
                                     md:!translate-x-0 md:!opacity-100
                                     ${active ? 'bg-mist text-ink shadow-[0_2px_10px_-6px_rgba(15,23,42,0.18)]' : 'text-ink/70 hover:text-ink'}
                                     ${FOCUS}`}
                        >
                          {/* Active left accent */}
                          <span
                            aria-hidden
                            className={`absolute inset-y-2 left-0 w-[3px] origin-top rounded-r-full bg-leaf
                                       transition-[transform,opacity] duration-300 ${EASE}
                                       ${active ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 group-hover:scale-y-50 group-hover:opacity-40'}`}
                          />

                          {/* Icon */}
                          <span
                            className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-lg
                                       transition-[background-color,color,transform] duration-300 ${EASE}
                                       ${active
                                         ? 'bg-white text-leaf shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
                                         : 'text-ink/55 group-hover:text-leaf group-hover:scale-[1.06]'}`}
                          >
                            {item.icon}
                          </span>

                          <span className="relative z-10 flex-1 truncate">{item.label}</span>

                          {/* Right arrow */}
                          <span
                            aria-hidden
                            className={`text-leaf transition-[opacity,transform] duration-300 ${EASE}
                                       ${active ? 'translate-x-0 opacity-100' : '-translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
                          >
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                              <path d="M4 8h8" />
                              <path d="M8.5 4.5L12 8l-3.5 3.5" />
                            </svg>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* ---------------- Footer: sign out ---------------- */}
          <div
            className="border-t border-line/80 p-3
                       pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <button
              onClick={logout}
              disabled={signingOut}
              style={{ transitionDelay: drawerOpen ? '360ms' : '0ms' }}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium
                         text-ink/70 opacity-0 -translate-x-3
                         transition-[opacity,transform,background-color,color] duration-[400ms] ${EASE}
                         group-data-[state=open]/drawer:translate-x-0 group-data-[state=open]/drawer:opacity-100
                         hover:-translate-y-px hover:bg-ember/10 hover:text-ember
                         active:translate-y-0 active:scale-[0.98]
                         disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0
                         md:!translate-x-0 md:!opacity-100
                         ${FOCUS}`}
            >
              <span
                aria-hidden
                className="absolute inset-y-2 left-0 w-[3px] origin-top scale-y-0 rounded-r-full bg-ember
                           transition-transform duration-300 ${EASE} group-hover:scale-y-50"
              />
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-current
                           transition-transform duration-300 ${EASE} group-hover:scale-[1.06]"
              >
                {signingOut ? (
                  <span
                    aria-hidden
                    className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ember/30 border-t-ember"
                  />
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                    <path d="M12 7V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h6a1 1 0 001-1v-2" />
                    <path d="M9 10h8" />
                    <path d="M14 7l3 3-3 3" />
                  </svg>
                )}
              </span>
              <span className="relative z-10">{signingOut ? 'Signing out…' : 'Sign out'}</span>
            </button>
          </div>
        </aside>

        {/* -------------------------------------------------------------- */}
        {/* Main                                                          */}
        {/* -------------------------------------------------------------- */}
        <main
          id="main"
          key={path}
          className={`min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10
                     transition-transform duration-[440ms] ${EASE}
                     ${drawerOpen ? 'md:transform-none' : ''}
                     [animation:fadeUp_0.45s_ease-out_both]`}
        >
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}