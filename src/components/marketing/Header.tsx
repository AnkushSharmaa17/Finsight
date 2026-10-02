'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV, SITE, type NavItem } from '@/lib/site';

/* Matches your Tailwind `md` breakpoint (768px) */
const DESKTOP_MQ = '(min-width: 768px)';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------ */
  /*  Scroll-aware surface                                              */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Close on route change                                             */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* ------------------------------------------------------------------ */
  /*  Close when viewport grows past the mobile breakpoint              */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* ------------------------------------------------------------------ */
  /*  While open: lock body scroll, close on Esc / outside click,       */
  /*  trap focus inside the panel, return focus to trigger on close     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!mobileOpen) return;

    const panel = panelRef.current;
    const focusables = panel
      ? Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        )
      : [];
    focusables[0]?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        !toggleRef.current?.contains(t)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  const isActive = useCallback(
    (href: string): boolean =>
      href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  const closeMenu = useCallback(() => setMobileOpen(false), []);

  return (
    <header
      role="banner"
      className={[
        'sticky top-0 z-40 w-full',
        'border-b bg-paper/80 backdrop-blur supports-[backdrop-filter]:bg-paper/70',
        'transition-[box-shadow,border-color,background-color] duration-300 ease-out',
        'pt-[env(safe-area-inset-top)]',
        scrolled
          ? 'border-line shadow-[0_2px_24px_-12px_rgba(19,40,60,0.22)]'
          : 'border-transparent shadow-none',
      ].join(' ')}
    >
      {/* Thin scroll progress accent — respects reduced motion via globals.css */}
      <span
        aria-hidden
        className={[
          'pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-leaf/0 via-leaf/60 to-leaf/0',
          'transition-opacity duration-300',
          scrolled ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-5 md:h-16">
        {/* -------------------- Brand -------------------- */}
        <Link
          href="/"
          aria-label={`${SITE.name} — home`}
          className="group -mx-2 flex min-h-11 items-center rounded-md px-2 font-display text-lg font-bold tracking-tight
                     transition-colors duration-200 hover:text-leaf
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf/60 focus-visible:ring-offset-2
                     md:text-xl"
        >
          <span className="relative inline-block">
            {SITE.name}
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-leaf
                         transition-[width] duration-300 ease-out group-hover:w-full"
            />
          </span>
        </Link>

        {/* -------------------- Desktop nav -------------------- */}
        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-center gap-1 md:flex"
        >
          {NAV.map((n: NavItem) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'group relative inline-flex h-9 items-center rounded-md px-3 text-sm font-medium',
                  'transition-colors duration-200 ease-out',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf/60 focus-visible:ring-offset-2',
                  active
                    ? 'text-leaf'
                    : 'text-slate-700 hover:text-leaf',
                ].join(' ')}
              >
                {n.label}
                <span
                  aria-hidden
                  className={[
                    'absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-leaf',
                    'transition-transform duration-300 ease-out origin-left',
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  ].join(' ')}
                />
              </Link>
            );
          })}
        </nav>

        {/* -------------------- Desktop CTA -------------------- */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="btn-ghost inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium
                       transition-all duration-200 ease-out
                       hover:-translate-y-px hover:bg-slate-100
                       active:translate-y-0 active:scale-[0.98]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf/60 focus-visible:ring-offset-2"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="btn-primary group relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-lg px-3.5 text-sm font-semibold
                       transition-all duration-200 ease-out
                       hover:-translate-y-px hover:shadow-lg hover:shadow-leaf/25
                       active:translate-y-0 active:scale-[0.98]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf/60 focus-visible:ring-offset-2"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r
                         from-transparent via-white/25 to-transparent
                         transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            <span className="relative">Start free</span>
            <span
              aria-hidden
              className="relative transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>

        {/* -------------------- Mobile toggle -------------------- */}
        <div ref={menuRef} className="relative md:hidden">
          <button
            ref={toggleRef}
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-haspopup="true"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg
                       text-slate-700 transition-colors duration-200
                       hover:bg-slate-100 hover:text-leaf
                       active:scale-[0.95]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf/60 focus-visible:ring-offset-2"
          >
            <span className="relative block h-4 w-5" aria-hidden>
              <span
                className={[
                  'absolute left-0 h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-out',
                  mobileOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0.5',
                ].join(' ')}
              />
              <span
                className={[
                  'absolute left-0 top-1/2 h-[2px] w-5 -translate-y-1/2 rounded-full bg-current',
                  'transition-all duration-200 ease-out',
                  mobileOpen ? 'opacity-0' : 'opacity-100',
                ].join(' ')}
              />
              <span
                className={[
                  'absolute left-0 h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-out',
                  mobileOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-0.5',
                ].join(' ')}
              />
            </span>
          </button>

          {/* Mobile panel */}
          <div
            ref={panelRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className={[
              'fixed inset-x-0 top-[calc(env(safe-area-inset-top)+3.5rem)] z-40 origin-top',
              'mx-3 overflow-hidden rounded-2xl border border-line bg-white shadow-2xl',
              'transition-[opacity,transform] duration-200 ease-out',
              'md:hidden',
              mobileOpen
                ? 'pointer-events-auto scale-100 opacity-100'
                : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0',
            ].join(' ')}
          >
            <nav aria-label="Mobile" className="flex flex-col p-2">
              {NAV.map((n: NavItem, i: number) => {
                const active = isActive(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={closeMenu}
                    aria-current={active ? 'page' : undefined}
                    style={{ transitionDelay: mobileOpen ? `${i * 25}ms` : '0ms' }}
                    className={[
                      'flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-medium',
                      'transition-[background-color,color,transform,opacity] duration-200 ease-out',
                      mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
                      active
                        ? 'bg-leaf/10 text-leaf'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-leaf',
                    ].join(' ')}
                  >
                    <span>{n.label}</span>
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-2 border-t border-line p-3">
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-medium text-slate-700
                           transition-colors duration-200 hover:bg-slate-100 hover:text-leaf
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf/60 focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={closeMenu}
                className="btn-primary flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold
                           transition-all duration-200 ease-out
                           hover:shadow-lg hover:shadow-leaf/25 active:scale-[0.98]
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf/60 focus-visible:ring-offset-2"
              >
                <span>Start free</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}