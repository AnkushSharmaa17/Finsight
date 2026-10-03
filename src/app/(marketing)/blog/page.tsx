import Link from 'next/link';
import { POSTS } from '@/lib/content/blog';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/marketing/JsonLd';

export const metadata = buildMetadata({
  title: 'Money guides',
  description:
    'Plain-language guides on emergency funds, savings rate, debt and goal planning for India.',
  path: '/blog',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://finsight.app';

/* ────────────────────────────────────────────────────────────────── */
/*  Background — mirrors Features / Calculators / How it works        */
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
/*  Helpers                                                           */
/* ────────────────────────────────────────────────────────────────── */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const isoDate = (iso: string) => new Date(iso).toISOString();

/* ────────────────────────────────────────────────────────────────── */
/*  Page                                                              */
/* ────────────────────────────────────────────────────────────────── */
export default function Blog() {
  /* Sort newest first — assumes `date` is an ISO string */
  const sorted = [...POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const [featured, ...rest] = sorted;

  /* ── Structured data ─────────────────────────────────────────── */
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Money guides',
        item: `${SITE_URL}/blog`,
      },
    ],
  };

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/blog#webpage`,
    url: `${SITE_URL}/blog`,
    name: 'Money guides',
    description:
      'Plain-language guides on emergency funds, savings rate, debt and goal planning for India.',
    inLanguage: 'en-IN',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: 'FinSight',
    },
    breadcrumb: { '@id': `${SITE_URL}/blog#breadcrumb` },
  };

  const blog = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: 'Money guides',
    description:
      'Plain-language guides on emergency funds, savings rate, debt and goal planning for India.',
    inLanguage: 'en-IN',
    publisher: {
      '@type': 'Organization',
      name: 'FinSight',
      url: SITE_URL,
    },
    blogPost: sorted.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: isoDate(p.date),
      dateModified: isoDate(p.date),
      author: {
        '@type': 'Organization',
        name: 'FinSight',
      },
      publisher: {
        '@type': 'Organization',
        name: 'FinSight',
        url: SITE_URL,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/blog/${p.slug}`,
      },
    })),
  };

  return (
    <div className="relative isolate">
      <JsonLd data={[breadcrumb, webPage, blog]} />

      <BackgroundLayers />

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Hero                                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-5xl px-5 pb-10 pt-14 sm:pt-20 lg:pt-28">
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
              Money guides
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-leaf/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-leaf">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
            Guides
          </span>

          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Money guides
          </h1>

          <p className="mt-5 max-w-prose text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            Plain-language guides on emergency funds, savings rate, debt and
            goal planning — written for India, in rupees, without jargon.
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
              No jargon
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
              INR-native
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
              {sorted.length} guides and counting
            </li>
          </ul>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Featured post                                              */}
      {/* ════════════════════════════════════════════════════════════ */}
      {featured && (
        <section
          aria-labelledby="featured-heading"
          className="relative mx-auto max-w-5xl px-5 pb-10"
        >
          <div
            aria-hidden
            className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"
          />

          <h2 id="featured-heading" className="sr-only">
            Latest guide
          </h2>

          <article className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1 hover:border-leaf/40 hover:shadow-xl hover:shadow-leaf/10 sm:p-8 lg:p-10 motion-reduce:transform-none motion-reduce:transition-none">
            {/* Inner gradient */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            {/* Top hairline */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/40 to-transparent"
            />

            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-leaf/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-leaf">
                  Latest
                </span>

                <h3 className="mt-4 text-balance font-display text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="rounded-sm transition-colors duration-200 after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2"
                  >
                    {featured.title}
                  </Link>
                </h3>

                <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-slate-600 sm:text-base">
                  {featured.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                  <time
                    dateTime={isoDate(featured.date)}
                    className="inline-flex items-center gap-1.5"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4" />
                      <path d="M8 2v4" />
                      <path d="M3 10h18" />
                    </svg>
                    {formatDate(featured.date)}
                  </time>
                  <span className="inline-flex items-center gap-1.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    {featured.readMins} min read
                  </span>
                </div>
              </div>

              {/* Arrow affordance */}
              <span
                aria-hidden="true"
                className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-leaf/10 text-leaf ring-1 ring-inset ring-leaf/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-leaf group-hover:text-white group-hover:ring-leaf lg:inline-flex"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </article>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  All posts                                                  */}
      {/* ════════════════════════════════════════════════════════════ */}
      {rest.length > 0 && (
        <section
          aria-labelledby="all-guides-heading"
          className="relative mx-auto max-w-5xl px-5 pb-20 pt-4 lg:pb-28"
        >
          <div
            aria-hidden
            className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"
          />

          <h2
            id="all-guides-heading"
            className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            All guides
          </h2>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <li
                key={p.slug}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1 hover:border-leaf/40 hover:shadow-xl hover:shadow-leaf/10 focus-within:-translate-y-1 focus-within:border-leaf/40 focus-within:shadow-xl motion-reduce:transform-none motion-reduce:transition-none"
              >
                {/* Inner gradient */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                {/* Date + reading time */}
                <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  <time
                    dateTime={isoDate(p.date)}
                    className="inline-flex items-center gap-1.5"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                      aria-hidden="true"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4" />
                      <path d="M8 2v4" />
                      <path d="M3 10h18" />
                    </svg>
                    {formatDate(p.date)}
                  </time>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span>{p.readMins} min</span>
                </div>

                <h3 className="relative mt-4 text-lg font-bold tracking-tight text-slate-900">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="rounded-sm transition-colors duration-200 after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2"
                  >
                    {p.title}
                  </Link>
                </h3>

                <p className="relative mt-2 flex-1 text-[15px] leading-relaxed text-slate-600">
                  {p.description}
                </p>

                <span
                  aria-hidden="true"
                  className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf"
                >
                  Read guide
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
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Closing CTA                                                */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-5xl px-5 pb-20 lg:pb-28">
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
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-leaf">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden />
              From reading to doing
            </span>

            <h2 className="mt-5 text-balance font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Guides help you understand. FinSight helps you act.
            </h2>

            <p className="mx-auto mt-4 max-w-prose text-pretty text-base leading-relaxed text-slate-300">
              Turn the ideas you just read into a personal report — cash flow,
              net worth, debt, emergency cover and goals in one place.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-leaf px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-leaf/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-leaf/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transform-none motion-reduce:transition-none"
              >
                Get your report
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
                Try a calculator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}