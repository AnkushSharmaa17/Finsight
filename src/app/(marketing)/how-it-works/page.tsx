import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/marketing/JsonLd';

export const metadata = buildMetadata({
  title: 'How it works',
  description:
    'From adding your numbers to a dated financial health report: how FinSight calculates and explains your finances.',
  path: '/how-it-works',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://finsight.app';

/* ────────────────────────────────────────────────────────────────── */
/*  Step data — ordered, index-matched to STEP_ICONS                  */
/* ────────────────────────────────────────────────────────────────── */
const STEPS = [
  {
    title: 'Add your numbers',
    description:
      'Enter income, expenses, loans, assets, investments and goals. Save drafts and edit any time.',
    icon: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
  },
  {
    title: 'We calculate',
    description:
      'Tested code converts everything to monthly equivalents and computes surplus, savings rate, debt ratio, net worth and emergency cover.',
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8" />
        <path d="M8 12h2" />
        <path d="M12 12h2" />
        <path d="M16 12h0.01" />
        <path d="M8 16h2" />
        <path d="M12 16h2" />
      </>
    ),
  },
  {
    title: 'Rules flag what matters',
    description:
      'Fixed rules highlight negative cash flow, thin reserves, heavy debt and missing data, each tied to a metric.',
    icon: (
      <>
        <path d="M4 22V4a2 2 0 0 1 2-2h9l5 5v15" />
        <path d="M4 22h16" />
        <path d="M9 11h6" />
        <path d="M9 15h6" />
      </>
    ),
  },
  {
    title: 'AI explains in plain language',
    description:
      'A model writes the summary from the validated results. It cannot change a number. If it is unavailable you get a rules-based summary.',
    icon: (
      <>
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="M6.3 6.3l2.8 2.8" />
        <path d="M14.9 14.9l2.8 2.8" />
        <path d="M17.7 6.3l-2.8 2.8" />
        <path d="M9.1 14.9l-2.8 2.8" />
      </>
    ),
  },
  {
    title: 'Test scenarios and save a snapshot',
    description:
      'Try a raise or a new EMI without touching your records. Reports stay tied to the snapshot they were built from.',
    icon: (
      <>
        <path d="M4 21v-7" />
        <path d="M4 10V3" />
        <path d="M12 21v-9" />
        <path d="M12 8V3" />
        <path d="M20 21v-5" />
        <path d="M20 12V3" />
        <path d="M1 14h6" />
        <path d="M9 8h6" />
        <path d="M17 16h6" />
      </>
    ),
  },
];

/* ────────────────────────────────────────────────────────────────── */
/*  Background — mirrors Features pages for visual continuity         */
/* ────────────────────────────────────────────────────────────────── */
function BackgroundLayers() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-paper" />

      {/* Masked grid */}
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

      {/* Brand glow */}
      <div className="absolute -top-48 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-leaf/25 blur-[120px]" />

      {/* Side orbs */}
      <div className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-emerald-200/40 blur-[120px]" />
      <div className="absolute -right-40 top-1/2 h-[380px] w-[380px] rounded-full bg-sky-200/40 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 h-[360px] w-[360px] rounded-full bg-amber-100/40 blur-[120px]" />

      {/* Top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/40 to-transparent" />

      {/* Film grain */}
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
export default function HowItWorks() {
  /* ── Structured data ─────────────────────────────────────────── */
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'How it works',
        item: `${SITE_URL}/how-it-works`,
      },
    ],
  };

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}/how-it-works#webpage`,
    url: `${SITE_URL}/how-it-works`,
    name: 'How FinSight works',
    description:
      'From adding your numbers to a dated financial health report: how FinSight calculates and explains your finances.',
    inLanguage: 'en-IN',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: 'FinSight',
    },
    breadcrumb: { '@id': `${SITE_URL}/how-it-works#breadcrumb` },
  };

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How FinSight works',
    description:
      'From adding your numbers to a dated financial health report: how FinSight calculates and explains your finances.',
    totalTime: 'PT5M',
    step: STEPS.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.description,
      url: `${SITE_URL}/how-it-works#step-${i + 1}`,
    })),
  };

  return (
    <div className="relative isolate">
      <JsonLd data={{ '@context': 'https://schema.org', '@graph': [breadcrumb, webPage, howTo] }} />

      <BackgroundLayers />

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Hero                                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-4xl px-5 pb-10 pt-14 sm:pt-20 lg:pt-28">
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
              How it works
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-leaf/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-leaf">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
            Process
          </span>

          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            How FinSight works
          </h1>

          <p className="mt-5 max-w-prose text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            Five steps from raw numbers to a dated report you can act on. No
            spreadsheets, no guesswork, and nothing the AI can rewrite under
            you.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-leaf px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-leaf/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-leaf/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
            >
              Start your report
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
            >
              See all features
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
              Takes under 5 minutes
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
              Deterministic calculations
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
              AI can't alter numbers
            </li>
          </ul>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Timeline                                                   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="steps-heading"
        className="relative mx-auto max-w-4xl px-5 pb-20 pt-6 sm:pt-10 lg:pb-28"
      >
        <div
          aria-hidden
          className="mb-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"
        />

        <h2 id="steps-heading" className="sr-only">
          The five steps
        </h2>

        <ol className="relative space-y-6 sm:space-y-8">
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1;
            const stepNumber = String(i + 1).padStart(2, '0');

            return (
              <li
                key={step.title}
                id={`step-${i + 1}`}
                className="group relative flex gap-4 sm:gap-6"
              >
                {/* ── Number rail ──────────────────────────────── */}
                <div className="relative flex flex-col items-center">
                  {/* Node */}
                  <span
                    aria-hidden="true"
                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-leaf/20 bg-white font-mono text-xs font-bold text-leaf shadow-sm ring-4 ring-paper transition-all duration-300 group-hover:border-leaf group-hover:bg-leaf group-hover:text-white group-hover:ring-leaf/10 sm:h-12 sm:w-12 sm:text-sm"
                  >
                    {stepNumber}
                  </span>

                  {/* Connector */}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="mt-2 w-px flex-1 bg-gradient-to-b from-leaf/40 via-slate-200 to-slate-200 sm:mt-3"
                    />
                  )}
                </div>

                {/* ── Card ─────────────────────────────────────── */}
                <div className="relative flex-1 pb-2">
                  <div
                    className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1 hover:border-leaf/40 hover:shadow-xl hover:shadow-leaf/10 sm:p-6 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {/* Inner gradient on hover */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <div className="relative flex items-start gap-4">
                      {/* Step icon */}
                      <span
                        aria-hidden="true"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf/10 text-leaf ring-1 ring-inset ring-leaf/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-leaf group-hover:text-white group-hover:ring-leaf"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.75}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          {step.icon}
                        </svg>
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-balance text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                          <span className="text-leaf">
                            Step {i + 1}:
                          </span>{' '}
                          {step.title}
                        </h3>

                        <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Closing CTA                                                */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-4xl px-5 pb-20 lg:pb-28">
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
              Ready to see your number?
            </h2>
            <p className="mx-auto mt-4 max-w-prose text-pretty text-base leading-relaxed text-slate-300">
              Five steps, five minutes, one report. No card, no clutter, no
              AI rewriting your figures behind your back.
            </p>
            <Link
              href="/register"
              className="group mt-8 inline-flex items-center justify-center gap-1.5 rounded-xl bg-leaf px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-leaf/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-leaf/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transform-none motion-reduce:transition-none"
            >
              Start your report
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