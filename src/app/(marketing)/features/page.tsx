import Link from 'next/link';
import { FEATURES } from '@/lib/content/features';
import { FeatureIcon } from '@/lib/content/feature-icons';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Features',
  description:
    'Cash flow, net worth, debt, emergency fund, goals and scenarios. See what FinSight does.',
  path: '/features',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://finsight.app';

/* ────────────────────────────────────────────────────────────────── */
/*  Background — layered, subtle, professional                        */
/* ────────────────────────────────────────────────────────────────── */
function BackgroundLayers() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-paper" />

      {/* Fine grid — masked so it fades out below the fold */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 95%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 95%)',
        }}
      />

      {/* Primary brand glow — top center */}
      <div className="absolute -top-48 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-leaf/25 blur-[120px]" />

      {/* Secondary orbs — asymmetric, keep the page from feeling flat */}
      <div className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-emerald-200/40 blur-[120px]" />
      <div className="absolute -right-40 top-1/2 h-[380px] w-[380px] rounded-full bg-sky-200/40 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 h-[360px] w-[360px] rounded-full bg-amber-100/40 blur-[120px]" />

      {/* Faint top hairline — gives the page a "designed" edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/40 to-transparent" />

      {/* Film grain — prevents banding in the gradients */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Page                                                              */
/* ────────────────────────────────────────────────────────────────── */
export default function Features() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'FinSight features',
    description: 'Seven tools built on one connected model of your finances.',
    numberOfItems: FEATURES.length,
    itemListElement: FEATURES.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.title,
      description: f.description,
      url: `${SITE_URL}/features/${f.slug}`,
    })),
  };

  return (
    <div className="relative isolate">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BackgroundLayers />

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Hero                                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-6xl px-5 pb-8 pt-14 sm:pt-20 lg:pt-28">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li>
              <Link
                href="/"
                className="rounded transition-colors hover:text-leaf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">
              /
            </li>
            <li aria-current="page" className="font-medium text-slate-700">
              Features
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-leaf/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-leaf">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
            Product
          </span>

          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            What FinSight does
          </h1>

          <p className="mt-5 max-w-prose text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            Seven tools built on one connected model of your finances — so a
            change in one place updates everywhere it matters.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-leaf px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-leaf/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-leaf/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
            >
              Start free
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
            >
              See pricing
            </Link>
          </div>

          {/* Trust strip */}
          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
            <li className="inline-flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 text-leaf"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Built for India, INR-native
            </li>
            <li className="inline-flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 text-leaf"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              No card required
            </li>
            <li className="inline-flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 text-leaf"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Your data stays yours
            </li>
          </ul>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Feature grid                                              */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section
        aria-label="FinSight features"
        className="relative mx-auto max-w-6xl px-5 pb-20 pt-10 sm:pt-14 lg:pb-28"
      >
        {/* Section hairline */}
        <div
          aria-hidden
          className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <li
              key={f.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1 hover:border-leaf/40 hover:shadow-xl hover:shadow-leaf/10 focus-within:-translate-y-1 focus-within:border-leaf/40 focus-within:shadow-xl motion-reduce:transform-none motion-reduce:transition-none"
            >
              {/* Card inner gradient — reveals on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              {/* Icon — from shared library */}
              <span
                aria-hidden="true"
                className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leaf/10 text-leaf ring-1 ring-inset ring-leaf/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-leaf group-hover:text-white group-hover:ring-leaf"
              >
                <FeatureIcon index={i} />
              </span>

              <h2 className="relative mt-5 text-lg font-bold tracking-tight text-slate-900">
                <Link
                  href={`/features/${f.slug}`}
                  className="rounded-sm transition-colors duration-200 after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2"
                >
                  {f.title}
                </Link>
              </h2>

              <p className="relative mt-2 flex-1 text-[15px] leading-relaxed text-slate-600">
                {f.description}
              </p>

              <span
                aria-hidden="true"
                className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf"
              >
                Learn more
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Closing CTA                                               */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-6xl px-5 pb-20 lg:pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 px-6 py-12 text-center shadow-2xl shadow-slate-900/10 sm:px-10 sm:py-16">
          {/* Inner glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/2 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-leaf/30 blur-[120px]"
          />
          {/* Inner grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage:
                'radial-gradient(ellipse 70% 60% at 50% 50%, #000 40%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 60% at 50% 50%, #000 40%, transparent 100%)',
            }}
          />
          {/* Top hairline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/60 to-transparent"
          />

          <div className="relative">
            <h2 className="text-balance font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              See it with your own numbers
            </h2>
            <p className="mx-auto mt-4 max-w-prose text-pretty text-base leading-relaxed text-slate-300">
              Connect an account or start from a blank slate — either way you
              get the full picture in under five minutes.
            </p>
            <Link
              href="/signup"
              className="group mt-8 inline-flex items-center justify-center gap-1.5 rounded-xl bg-leaf px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-leaf/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-leaf/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transform-none motion-reduce:transition-none"
            >
              Get started free
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}