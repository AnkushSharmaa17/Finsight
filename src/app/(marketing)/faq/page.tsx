import Link from 'next/link';
import { JsonLd } from '@/components/marketing/JsonLd';
import { FAQ } from '@/lib/content/faq';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'FAQ',
  description:
    'Answers about FinSight: advice boundaries, data privacy, AI use, calculations and account deletion.',
  path: '/faq',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://finsight.app';

/* ────────────────────────────────────────────────────────────────── */
/*  Background — identical to Features / Calculators / Blog           */
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
export default function FaqPage() {
  /* ── Structured data ─────────────────────────────────────────── */
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQ',
        item: `${SITE_URL}/faq`,
      },
    ],
  };

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}/faq#webpage`,
    url: `${SITE_URL}/faq`,
    name: 'Frequently asked questions',
    description:
      'Answers about FinSight: advice boundaries, data privacy, AI use, calculations and account deletion.',
    inLanguage: 'en-IN',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: 'FinSight',
    },
    breadcrumb: { '@id': `${SITE_URL}/faq#breadcrumb` },
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/faq#faq`,
    url: `${SITE_URL}/faq`,
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${SITE_URL}/faq#webpage` },
    mainEntity: FAQ.map((f, i) => ({
      '@type': 'Question',
      '@id': `${SITE_URL}/faq#q${i + 1}`,
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <div className="relative isolate">
      <JsonLd data={[breadcrumb, webPage, faqPage]} />

      <BackgroundLayers />

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Hero                                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-3xl px-5 pb-10 pt-14 sm:pt-20 lg:pt-28">
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
              FAQ
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-leaf/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-leaf">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
            Support
          </span>

          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Frequently asked questions
          </h1>

          <p className="mt-5 max-w-prose text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            Straight answers about what FinSight does, what it does not do, and
            how your data is handled. If something is not covered here, email
            us and we will add it.
          </p>

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
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
              {FAQ.length} answers
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
              No sales talk
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
              Updated regularly
            </li>
          </ul>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  FAQ list                                                   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="faq-heading"
        className="relative mx-auto max-w-3xl px-5 pb-16 sm:pb-20"
      >
        <div
          aria-hidden
          className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"
        />

        <h2 id="faq-heading" className="sr-only">
          Questions and answers
        </h2>

        <ul className="space-y-3">
          {FAQ.map((f, i) => (
            <li key={f.q}>
              <details className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur transition-all duration-300 ease-out hover:border-leaf/40 hover:shadow-lg hover:shadow-leaf/5 open:border-leaf/40 open:shadow-xl open:shadow-leaf/10 motion-reduce:transition-none">
                {/* Left accent bar — appears when open */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-leaf/60 via-leaf to-leaf/60 transition-transform duration-300 ease-out group-open:scale-y-100 motion-reduce:transition-none"
                />

                {/* Inner gradient on hover/open */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-open:opacity-100"
                />

                <summary className="relative flex cursor-pointer list-none items-start gap-4 px-5 py-4 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                  {/* Number */}
                  <span
                    aria-hidden="true"
                    className="hidden w-8 shrink-0 pt-0.5 font-mono text-xs text-slate-400 transition-colors duration-300 group-hover:text-leaf group-open:text-leaf sm:inline-block"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Question */}
                  <span className="min-w-0 flex-1 pr-2 text-[15px] font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-leaf group-open:text-leaf sm:text-base">
                    {f.q}
                  </span>

                  {/* Chevron */}
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-300 ease-out group-hover:border-leaf/40 group-hover:bg-leaf/10 group-hover:text-leaf group-open:rotate-180 group-open:border-leaf group-open:bg-leaf group-open:text-white motion-reduce:transition-none"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.25}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </summary>

                {/* Answer */}
                <div className="relative overflow-hidden">
                  <div className="border-t border-slate-200/70 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pl-[4.5rem]">
                    <p className="text-pretty text-[15px] leading-relaxed text-slate-600 sm:text-base">
                      {f.a}
                    </p>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Still have questions                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-3xl px-5 pb-16 sm:pb-20">
        <div
          aria-hidden
          className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"
        />

        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 text-center backdrop-blur sm:p-10">
          <span
            aria-hidden="true"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf/10 text-leaf ring-1 ring-inset ring-leaf/20"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>

          <h2 className="mt-5 text-balance font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Still have a question?
          </h2>

          <p className="mx-auto mt-3 max-w-prose text-pretty text-base leading-relaxed text-slate-600">
            We read every message. If your question is not answered here, we
            will reply personally — and usually add it to this page.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-leaf px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-leaf/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-leaf/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
            >
              Contact us
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Closing CTA                                                */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-3xl px-5 pb-20 lg:pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 px-6 py-12 text-center shadow-2xl shadow-slate-900/10 sm:px-10 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/2 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-leaf/30 blur-[120px]"
          />
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
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/60 to-transparent"
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-leaf">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
              Ready when you are
            </span>

            <h2 className="mt-5 text-balance font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              See your own number in five minutes
            </h2>

            <p className="mx-auto mt-4 max-w-prose text-pretty text-base leading-relaxed text-slate-300">
              No card, no commitment. Your data stays yours, and you can delete
              everything with one click.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-leaf px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-leaf/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-leaf/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transform-none motion-reduce:transition-none"
              >
                Get started
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transform-none motion-reduce:transition-none"
              >
                Explore features
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}