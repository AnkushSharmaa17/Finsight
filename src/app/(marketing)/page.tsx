import Link from 'next/link';
import { JsonLd } from '@/components/marketing/JsonLd';
import { HeroDemo } from '@/components/marketing/HeroDemo';
import { CALCULATORS } from '@/lib/content/calculators';
import { FEATURES } from '@/lib/content/features';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildMetadata({
  title: `${SITE.name}: personal financial health report and planner for India`,
  description: SITE.description,
  path: '/',
});

/* Shared focus ring so every interactive element matches */
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2';

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: SITE.name,
          url: SITE.url,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          description: SITE.description,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-10 overflow-hidden px-5 pt-8 pb-16 md:grid-cols-2 md:pt-12 md:pb-24">
        {/* ambient glow — drifts slowly, purely decorative */}
        <span
          aria-hidden
          className="pointer-events-none absolute -left-28 -top-24 h-80 w-80 rounded-full bg-leaf/10 blur-3xl
                     [animation:drift_14s_ease-in-out_infinite]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-mist/40 blur-3xl
                     [animation:drift_18s_ease-in-out_infinite_reverse]"
        />

        <div className="relative z-10 [animation:fadeUp_0.7s_ease-out_both]">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Know where your money stands, then{' '}
            <span className="relative inline-block">
              <span className="relative z-10">decide what to do next.</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 z-0 h-3 origin-left scale-x-0 bg-leaf/25
                           [animation:grow_1s_cubic-bezier(0.22,1,0.36,1)_0.4s_forwards]"
              />
            </span>
          </h1>

          <p className="mt-5 max-w-prose text-lg text-ink/80 [animation:fadeUp_0.7s_ease-out_0.1s_both]">
            Add your income, spending, loans, assets and goals. FinSight shows your
            monthly surplus, net worth and emergency cover, and lets you test what-if
            scenarios before you change anything real.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 [animation:fadeUp_0.7s_ease-out_0.2s_both]">
            {/* Primary CTA */}
            <Link
              href="/register"
              className={`btn-primary group relative inline-flex items-center overflow-hidden
                         transition-[transform,box-shadow] duration-300 ease-out
                         hover:-translate-y-0.5 hover:shadow-xl hover:shadow-leaf/30
                         active:translate-y-0 active:scale-[0.98]
                         ${FOCUS}`}
            >
              {/* sheen sweep */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r
                           from-transparent via-white/25 to-transparent
                           transition-transform duration-700 ease-out
                           group-hover:translate-x-full"
              />
              <span className="relative z-10">Create your report</span>
              <span
                aria-hidden
                className="relative z-10 ml-1 inline-block transition-transform duration-300 ease-out
                           group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/how-it-works"
              className={`btn-ghost group relative inline-flex items-center overflow-hidden
                         transition-[transform,background-color,box-shadow] duration-300 ease-out
                         hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md
                         active:translate-y-0 active:scale-[0.98]
                         ${FOCUS}`}
            >
              <span className="relative z-10">See how it works</span>
              <span
                aria-hidden
                className="relative z-10 ml-1 inline-block transition-transform duration-300 ease-out
                           group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          <p className="mt-4 text-sm text-ink/70 [animation:fadeUp_0.7s_ease-out_0.3s_both]">
            No bank passwords. Educational planning, not investment advice.
          </p>
        </div>

        {/* Demo panel — lifts gently on hover */}
        <div
          className="relative z-10 transition-transform duration-500 ease-out will-change-transform
                     hover:-translate-y-1
                     [animation:fadeUp_0.9s_ease-out_0.15s_both]"
        >
          <HeroDemo />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Features                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-12" aria-labelledby="feat">
        <div className="flex items-end justify-between gap-4">
          <h2 id="feat" className="text-3xl font-bold tracking-tight">
            Everything in one financial model
          </h2>
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <li
              key={f.slug}
              style={{ animationDelay: `${i * 60}ms` }}
              className="panel group relative overflow-hidden rounded-xl border border-line p-5
                         transition-[transform,border-color,box-shadow] duration-300 ease-out
                         hover:-translate-y-1 hover:border-leaf/40
                         hover:shadow-[0_10px_30px_-12px_rgba(19,40,60,0.25)]
                         [animation:fadeUp_0.6s_ease-out_both]"
            >
              {/* corner glow */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full
                           bg-leaf/20 opacity-0 blur-2xl transition-opacity duration-500 ease-out
                           group-hover:opacity-100"
              />

              {/* top accent line that draws in from the left */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0
                           bg-gradient-to-r from-leaf/70 via-leaf/30 to-transparent
                           transition-transform duration-500 ease-out group-hover:scale-x-100"
              />

              <h3 className="relative text-lg font-bold">
                <Link
                  href={`/features/${f.slug}`}
                  className={`rounded-sm transition-colors duration-200 ease-out
                             group-hover:text-leaf
                             focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-leaf focus-visible:ring-offset-2`}
                >
                  {f.title}
                  {/* stretched hit area so the whole card is clickable */}
                  <span aria-hidden className="absolute inset-0" />
                </Link>
              </h3>

              <p className="relative mt-2 text-sm text-ink/80">{f.short}</p>

              <span
                aria-hidden
                className="relative mt-3 inline-flex -translate-x-1 items-center gap-1 text-sm font-medium
                           text-leaf opacity-0 transition-[opacity,transform] duration-300 ease-out
                           group-hover:translate-x-0 group-hover:opacity-100
                           group-focus-within:translate-x-0 group-focus-within:opacity-100"
              >
                Learn more <span aria-hidden>→</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Calculators                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-12" aria-labelledby="calc">
        <h2 id="calc" className="text-3xl font-bold tracking-tight">
          Free calculators
        </h2>
        <p className="mt-2 max-w-prose">Quick answers, no sign-up needed.</p>

        <ul className="mt-6 grid gap-4 md:grid-cols-4">
          {CALCULATORS.map((c, i) => (
            <li
              key={c.slug}
              style={{ animationDelay: `${i * 50}ms` }}
              className="[animation:fadeUp_0.6s_ease-out_both]"
            >
              <Link
                href={`/calculators/${c.slug}`}
                className={`panel group relative block overflow-hidden rounded-xl border border-line p-4
                           font-semibold
                           transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out
                           hover:-translate-y-1 hover:border-leaf/50 hover:bg-leaf/5
                           hover:shadow-[0_10px_24px_-12px_rgba(19,40,60,0.25)]
                           active:translate-y-0 active:scale-[0.99]
                           ${FOCUS}`}
              >
                <span className="relative z-10 flex items-center justify-between gap-2">
                  <span className="transition-colors duration-200 ease-out group-hover:text-leaf">
                    {c.title}
                  </span>
                  <span
                    aria-hidden
                    className="text-leaf opacity-0 transition-[opacity,transform] duration-300 ease-out
                               group-hover:translate-x-0.5 group-hover:opacity-100
                               group-focus-visible:translate-x-0.5 group-focus-visible:opacity-100"
                  >
                    →
                  </span>
                </span>

                {/* underline that grows left → right */}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-leaf
                             transition-transform duration-300 ease-out group-hover:scale-x-100
                             group-focus-visible:scale-x-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Final CTA                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-16">
        <div
          className="group relative overflow-hidden rounded-xl bg-ink p-8 text-white
                     transition-shadow duration-500 ease-out
                     hover:shadow-[0_20px_60px_-20px_rgba(19,40,60,0.6)] md:p-12"
        >
          {/* floating blobs */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-leaf/20 blur-3xl
                       transition-transform duration-700 ease-out
                       group-hover:translate-x-4 group-hover:translate-y-4"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl
                       transition-transform duration-700 ease-out
                       group-hover:-translate-x-4 group-hover:-translate-y-4"
          />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Your first report in about ten minutes
            </h2>
            <p className="mt-3 max-w-prose text-white/80">
              Verify your email, enter your numbers, and generate a dated report you
              can come back to.
            </p>

            <Link
              href="/register"
              className="group/cta relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-lg
                         bg-white px-5 py-2.5 font-semibold text-ink
                         transition-[transform,background-color,box-shadow] duration-300 ease-out
                         hover:-translate-y-0.5 hover:bg-mist hover:shadow-lg
                         active:translate-y-0 active:scale-[0.98]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                         focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {/* sheen sweep */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r
                           from-transparent via-ink/10 to-transparent
                           transition-transform duration-700 ease-out
                           group-hover/cta:translate-x-full"
              />
              <span className="relative z-10">Start free</span>
              <span
                aria-hidden
                className="relative z-10 inline-block transition-transform duration-300 ease-out
                           group-hover/cta:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}