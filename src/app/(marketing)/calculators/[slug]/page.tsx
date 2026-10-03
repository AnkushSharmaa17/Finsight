import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calculator } from '@/components/marketing/Calculator';
import { JsonLd } from '@/components/marketing/JsonLd';
import { CALCULATORS, getCalc } from '@/lib/content/calculators';
import { breadcrumbLd, buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () =>
  CALCULATORS.map((c) => ({ slug: c.slug }));

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = getCalc(params.slug);
  return c
    ? buildMetadata({
        title: c.title,
        description: c.description,
        path: `/calculators/${c.slug}`,
      })
    : {};
}

/* ────────────────────────────────────────────────────────────────── */
/*  Icons — index-matched to CALCULATORS                              */
/* ────────────────────────────────────────────────────────────────── */
const CALC_ICONS = [
  // emergency fund — shield
  <path key="shield" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
  // savings rate — percent
  <g key="percent">
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </g>,
  // debt-service — scales
  <g key="scales">
    <path d="M12 3v18" />
    <path d="M5 7h14" />
    <path d="M5 7l-2 6a3 3 0 0 0 6 0z" />
    <path d="M19 7l-2 6a3 3 0 0 0 6 0z" />
  </g>,
  // goal SIP — target
  <g key="target">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </g>,
  // net worth — chart
  <g key="chart">
    <path d="M3 21h18" />
    <path d="M6 21v-6" />
    <path d="M11 21V9" />
    <path d="M16 21v-9" />
    <path d="M21 21V5" />
  </g>,
  // loan / EMI — card
  <g key="card">
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 10h19" />
  </g>,
  // compound — trending
  <g key="trend">
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </g>,
];

function CalcIcon({
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
      {CALC_ICONS[index % CALC_ICONS.length]}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Background — mirrors the calculators index                        */
/* ────────────────────────────────────────────────────────────────── */
function BackgroundLayers() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-paper" />

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

      <div className="absolute -top-48 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-leaf/25 blur-[120px]" />
      <div className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-emerald-200/40 blur-[120px]" />
      <div className="absolute -right-40 top-1/2 h-[380px] w-[380px] rounded-full bg-sky-200/40 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 h-[360px] w-[360px] rounded-full bg-amber-100/40 blur-[120px]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/40 to-transparent" />

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
export default function CalculatorPage({
  params,
}: {
  params: { slug: string };
}) {
  const c = getCalc(params.slug);
  if (!c) notFound();

  const idx = Math.max(
    0,
    CALCULATORS.findIndex((x) => x.slug === c.slug),
  );
  const others = CALCULATORS.filter((x) => x.slug !== c.slug).slice(0, 3);

  /* ── Structured data ─────────────────────────────────────────── */
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${SITE.url}/calculators/${c.slug}#app`,
    name: c.title,
    description: c.description,
    url: `${SITE.url}/calculators/${c.slug}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE.url}#website`,
      url: SITE.url,
      name: SITE.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
  };

  const breadcrumb = breadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Calculators', path: '/calculators' },
    { name: c.title, path: `/calculators/${c.slug}` },
  ]);

  return (
    <div className="relative isolate">
      <JsonLd data={[webApp, breadcrumb]} />

      <BackgroundLayers />

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Hero                                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-5xl px-5 pb-8 pt-10 sm:pt-14 lg:pt-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
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
            <li>
              <Link
                href="/calculators"
                className="rounded transition-colors hover:text-leaf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2"
              >
                Calculators
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">
              /
            </li>
            <li
              aria-current="page"
              className="truncate font-medium text-slate-700"
            >
              {c.title}
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          {/* Icon */}
          <span
            aria-hidden="true"
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf/10 text-leaf ring-1 ring-inset ring-leaf/20"
          >
            <CalcIcon index={idx} className="h-7 w-7" />
          </span>

          {/* Eyebrow */}
          <span className="mt-5 ml-4 inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-leaf/5 px-3 py-1 align-middle text-xs font-semibold uppercase tracking-wider text-leaf">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
            Free calculator
          </span>

          <h1 className="mt-4 text-balance font-display text-3xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {c.title}
          </h1>

          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            {c.description}
          </p>

          {/* Trust strip */}
          <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
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
              Updates as you type
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
              No sign-up
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
              Nothing stored
            </li>
          </ul>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Calculator surface                                        */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section
        aria-label={`${c.title} tool`}
        className="relative mx-auto max-w-5xl px-5 pb-16 sm:pb-20"
      >
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-6 lg:p-8">
          {/* Inner gradient wash */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf/[0.03] via-transparent to-transparent"
          />
          {/* Top hairline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/40 to-transparent"
          />

          <div className="relative">
            <Calculator slug={c.slug} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  How it is calculated                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="method-heading"
        className="relative mx-auto max-w-3xl px-5 pb-16 sm:pb-20"
      >
        <div
          aria-hidden
          className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"
        />

        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 backdrop-blur">
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
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          Methodology
        </span>

        <h2
          id="method-heading"
          className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          How it is calculated
        </h2>

        <div className="mt-5 max-w-prose space-y-4 text-[15px] leading-relaxed text-slate-700 sm:text-base">
          <p>{c.explainer}</p>
        </div>

        {/* Disclaimer */}
        <div
          role="note"
          className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4 text-sm leading-relaxed text-amber-900 backdrop-blur"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <p>
            Results are illustrative and not financial advice. Figures are
            computed in your browser from the values you enter, and nothing is
            sent to our servers.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Related calculators                                        */}
      {/* ════════════════════════════════════════════════════════════ */}
      {others.length > 0 && (
        <section
          aria-labelledby="related-calculators"
          className="relative mx-auto max-w-5xl px-5 pb-16 sm:pb-20"
        >
          <div
            aria-hidden
            className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"
          />

          <h2
            id="related-calculators"
            className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Try another calculator
          </h2>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => {
              const oIdx = Math.max(
                0,
                CALCULATORS.findIndex((x) => x.slug === o.slug),
              );
              return (
                <li
                  key={o.slug}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1 hover:border-leaf/40 hover:shadow-xl hover:shadow-leaf/10 focus-within:-translate-y-1 focus-within:border-leaf/40 focus-within:shadow-xl motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <span
                    aria-hidden="true"
                    className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf/10 text-leaf ring-1 ring-inset ring-leaf/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-leaf group-hover:text-white group-hover:ring-leaf"
                  >
                    <CalcIcon index={oIdx} className="h-5 w-5" />
                  </span>

                  <h3 className="relative mt-4 text-base font-bold tracking-tight text-slate-900">
                    <Link
                      href={`/calculators/${o.slug}`}
                      className="rounded-sm transition-colors duration-200 after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2"
                    >
                      {o.title}
                    </Link>
                  </h3>

                  <p className="relative mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                    {o.description}
                  </p>

                  <span
                    aria-hidden="true"
                    className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf"
                  >
                    Open calculator
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
              );
            })}
          </ul>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Closing CTA                                                */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-5xl px-5 pb-20 lg:pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 px-6 py-12 sm:px-10 sm:py-16">
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

          <div className="relative text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-leaf">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
              Save your numbers
            </span>

            <h2 className="mt-5 text-balance font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Get this and six other metrics in one report
            </h2>

            <p className="mx-auto mt-4 max-w-prose text-pretty text-base leading-relaxed text-slate-300">
              FinSight ties cash flow, net worth, debt, emergency cover and
              goals into a single snapshot — then lets you test scenarios
              without touching your records.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-leaf px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-leaf/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-leaf/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transform-none motion-reduce:transition-none"
              >
                Save this in your report
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <Link
                href="/calculators"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transform-none motion-reduce:transition-none"
              >
                Browse all calculators
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}