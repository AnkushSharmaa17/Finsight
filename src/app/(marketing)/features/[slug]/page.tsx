import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/marketing/JsonLd';
import { FeatureIcon } from '@/lib/content/feature-icons';
import { FEATURES, getFeature } from '@/lib/content/features';
import { breadcrumbLd, buildMetadata } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://finsight.app';

export const dynamicParams = false;
export const generateStaticParams = () =>
  FEATURES.map((f) => ({ slug: f.slug }));

export function generateMetadata({ params }: { params: { slug: string } }) {
  const f = getFeature(params.slug);
  if (!f) return {};
  return buildMetadata({
    title: f.title,
    description: f.description,
    path: `/features/${f.slug}`,
  });
}

/* ────────────────────────────────────────────────────────────────── */
/*  Background — mirrors the index page so the two feel continuous    */
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
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 90% 60% at 50% 0%, #000 25%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 60% at 50% 0%, #000 25%, transparent 90%)',
        }}
      />

      {/* Brand glow top-center */}
      <div className="absolute -top-48 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-leaf/20 blur-[120px]" />

      {/* Soft side orbs — fewer than index, page is narrower */}
      <div className="absolute -left-40 top-1/3 h-[380px] w-[380px] rounded-full bg-emerald-200/30 blur-[120px]" />
      <div className="absolute -right-40 top-2/3 h-[340px] w-[340px] rounded-full bg-sky-200/30 blur-[120px]" />

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
export default function FeaturePage({
  params,
}: {
  params: { slug: string };
}) {
  const f = getFeature(params.slug);
  if (!f) notFound();

  const idx = Math.max(
    0,
    FEATURES.findIndex((x) => x.slug === f.slug),
  );
  const others = FEATURES.filter((x) => x.slug !== f.slug).slice(0, 3);

  /* ── Structured data ─────────────────────────────────────────── */
  const breadcrumb = breadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: f.title, path: `/features/${f.slug}` },
  ]);

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}/features/${f.slug}#webpage`,
    url: `${SITE_URL}/features/${f.slug}`,
    name: f.title,
    description: f.description,
    inLanguage: 'en-IN',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: 'FinSight',
    },
    breadcrumb: {
      '@id': `${SITE_URL}/features/${f.slug}#breadcrumb`,
    },
    about: {
      '@type': 'Thing',
      name: f.title,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/og/features/${f.slug}.png`,
    },
  };

  return (
    <div className="relative isolate">
      <JsonLd data={{ '@context': 'https://schema.org', '@graph': [breadcrumb, webPage] }} />

      <BackgroundLayers />

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Hero                                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-4xl px-5 pt-10 pb-12 sm:pt-16 sm:pb-16 lg:pt-20">
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
                href="/features"
                className="rounded transition-colors hover:text-leaf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2"
              >
                Features
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">
              /
            </li>
            <li
              aria-current="page"
              className="truncate font-medium text-slate-700"
            >
              {f.title}
            </li>
          </ol>
        </nav>

        {/* Icon */}
        <span
          aria-hidden="true"
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf/10 text-leaf ring-1 ring-inset ring-leaf/20"
        >
          <FeatureIcon index={idx} className="h-7 w-7" />
        </span>

        {/* Title */}
        <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          {f.title}
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 sm:text-xl">
          {f.description}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-leaf px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-leaf/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-leaf/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
          >
            Try {f.title.toLowerCase()}
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
          >
            <span aria-hidden>←</span>
            All features
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  What you can do                                            */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="what-you-can-do"
        className="relative mx-auto max-w-4xl px-5 pb-16 sm:pb-20"
      >
        <div
          aria-hidden
          className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"
        />

        <h2
          id="what-you-can-do"
          className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          What you can do
        </h2>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {f.points.map((p) => (
            <li
              key={p}
              className="group flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-leaf/30 hover:shadow-md hover:shadow-leaf/5 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf/10 text-leaf ring-1 ring-inset ring-leaf/20 transition-colors duration-300 group-hover:bg-leaf group-hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span className="text-[15px] leading-relaxed text-slate-700">
                {p}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Related features                                           */}
      {/* ════════════════════════════════════════════════════════════ */}
      {others.length > 0 && (
        <section
          aria-labelledby="related-features"
          className="relative mx-auto max-w-4xl px-5 pb-16 sm:pb-20"
        >
          <div
            aria-hidden
            className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"
          />

          <h2
            id="related-features"
            className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Related
          </h2>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => {
              const oIdx = FEATURES.findIndex((x) => x.slug === o.slug);
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
                    <FeatureIcon
                      index={oIdx < 0 ? 0 : oIdx}
                      className="h-4.5 w-4.5"
                    />
                  </span>

                  <h3 className="relative mt-4 text-base font-bold tracking-tight text-slate-900">
                    <Link
                      href={`/features/${o.slug}`}
                      className="rounded-sm transition-colors duration-200 after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2"
                    >
                      {o.title}
                    </Link>
                  </h3>

                  <p className="relative mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                    {o.short}
                  </p>

                  <span
                    aria-hidden="true"
                    className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf"
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
              );
            })}
          </ul>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  Closing CTA                                                */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-4xl px-5 pb-20 lg:pb-28">
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
            <h2 className="text-balance font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Ready to try {f.title.toLowerCase()}?
            </h2>
            <p className="mx-auto mt-4 max-w-prose text-pretty text-base leading-relaxed text-slate-300">
              Connect an account or start from a blank slate — either way you
              get the full picture in under five minutes.
            </p>
            <Link
              href="/register"
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