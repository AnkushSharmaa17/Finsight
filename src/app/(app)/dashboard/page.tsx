'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { inr, pct } from '@/lib/money';
import { useApi } from '@/lib/useApi';

/* Shared focus ring so every interactive element matches the marketing pages */
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2';

/* Map a flag severity to a left accent + badge style */
function severityStyles(severity: string) {
  switch (severity) {
    case 'high':
      return { bar: 'bg-ember', badge: 'bg-ember/10 text-ember', label: 'High priority' };
    case 'medium':
      return { bar: 'bg-leaf', badge: 'bg-mist text-ink/80', label: 'Review' };
    default:
      return { bar: 'bg-line', badge: 'bg-mist text-ink/70', label: 'Note' };
  }
}

export default function Dashboard() {
  const router = useRouter();

  /* ──────────────────────────────────────────────────────────── */
  /*  Backend call — POST /analysis/run with empty overrides      */
  /*  (backend route is POST-only; GET returns 404)               */
  /* ──────────────────────────────────────────────────────────── */
  const { data, error, loading } = useApi<any>('analysis/run', {
    method: 'POST',
    body: {},
  });

  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const m = data?.baseline.metrics;

  async function generate() {
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<any>('reports', { method: 'POST', body: {} });
      router.push(`/reports/${r._id}`);
    } catch (e) {
      setMsg((e as ApiError).message);
    } finally {
      setBusy(false);
    }
  }

  if (error)
    return (
      <p role="alert" className="text-ember [animation:fadeUp_0.4s_ease-out_both]">
        {error.message}
      </p>
    );

  /* ---- Loading: animated skeleton instead of a plain sentence ---- */
  if (loading || !m)
    return (
      <div className="mx-auto max-w-5xl" aria-busy="true" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <span className="sr-only">Loading your financial picture…</span>
          <div className="h-9 w-56 animate-pulse rounded-md bg-mist" />
          <div className="h-10 w-64 animate-pulse rounded-md bg-mist" />
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 60}ms` }}
              className="panel [animation:fadeUp_0.5s_ease-out_both]"
            >
              <div className="h-3 w-24 animate-pulse rounded bg-mist" />
              <div className="mt-3 h-6 w-28 animate-pulse rounded bg-mist" />
            </div>
          ))}
        </dl>
      </div>
    );

  const cards: [string, string, string?][] = [
    ['Income / month', inr(m.monthlyIncomeMinor)],
    ['Spending / month', inr(m.monthlyExpensesMinor)],
    [
      'Surplus / month',
      inr(m.monthlySurplusMinor),
      m.monthlySurplusMinor < 0 ? 'text-ember' : 'text-leafdark',
    ],
    ['Net worth', inr(m.netWorthMinor)],
    ['Savings rate', pct(m.savingsRatePct)],
    ['Debt-service ratio', pct(m.debtServiceRatioPct)],
  ['Emergency cover', m.emergencyMonths == null ? 'Not enough data' : `${m.emergencyMonths} months`],
   ['Liquid savings', m.liquidSavingsMinor == null ? 'Not provided' : inr(m.liquidSavingsMinor)],
  ];
 const empty = m.monthlyIncomeMinor === 0 && m.totalAssetsMinor === 0;

  return (
    <div className="mx-auto max-w-5xl">
      {/* ---------------------------------------------------------------- */}
      {/* Header + actions                                                 */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-wrap items-end justify-between gap-3 [animation:fadeUp_0.5s_ease-out_both]">
        <h1 className="text-3xl font-bold tracking-tight">Financial health</h1>

        <div className="flex gap-2">
          <Link
            href="/scenarios"
            className={`btn-ghost group inline-flex items-center overflow-hidden transition-[transform,background-color,box-shadow] duration-300 ease-out
                       hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md
                       active:translate-y-0 active:scale-[0.98]
                       ${FOCUS}`}
          >
            <span className="relative z-10">Run a scenario</span>
            <span
              aria-hidden
              className="relative z-10 ml-1 inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              →
            </span>
          </Link>

          <button
            onClick={generate}
            disabled={busy}
            className={`btn-primary group relative inline-flex items-center overflow-hidden transition-[transform,box-shadow,opacity] duration-300 ease-out
                       hover:-translate-y-0.5 hover:shadow-xl hover:shadow-leaf/30
                       active:translate-y-0 active:scale-[0.98]
                       disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none
                       ${FOCUS}`}
          >
            {/* sheen sweep — only when idle */}
            {!busy && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent
                           transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
            )}
            <span className="relative z-10">
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  />
                  Generating…
                </span>
              ) : (
                'Generate report'
              )}
            </span>
          </button>
        </div>
      </div>

      {msg && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-ember [animation:fadeUp_0.3s_ease-out_both]"
        >
          {msg}
        </p>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Empty state                                                      */}
      {/* ---------------------------------------------------------------- */}
      {empty && (
        <div className="panel mt-6 [animation:fadeUp_0.5s_ease-out_0.05s_both]">
          <p>
            Start by adding your{' '}
            <Link className={`rounded-sm underline ${FOCUS}`} href="/financials/income">
              income
            </Link>{' '}
            and{' '}
            <Link className={`rounded-sm underline ${FOCUS}`} href="/financials/expenses">
              expenses
            </Link>
            . Your metrics appear here as you add data.
          </p>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Metric cards                                                     */}
      {/* ---------------------------------------------------------------- */}
      <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map(([k, v, c], i) => (
          <div
            key={k}
            style={{ animationDelay: `${i * 55}ms` }}
            className="panel group relative overflow-hidden transition-[transform,border-color,box-shadow] duration-300 ease-out
                       hover:-translate-y-1 hover:border-leaf/40
                       hover:shadow-[0_10px_30px_-12px_rgba(19,40,60,0.25)]
                       [animation:fadeUp_0.55s_ease-out_both]"
          >
            {/* top accent that draws in on hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-leaf/70 via-leaf/30 to-transparent
                         transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
            <dt className="text-sm text-ink/70">{k}</dt>
            <dd
              className={`font-display text-xl font-bold transition-transform duration-300 ease-out group-hover:translate-x-0.5 ${c ?? ''}`}
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>

      {/* ---------------------------------------------------------------- */}
      {/* Priorities                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="mt-8" aria-labelledby="pri">
        <h2
          id="pri"
          className="text-xl font-bold tracking-tight [animation:fadeUp_0.5s_ease-out_both]"
        >
          Priorities
        </h2>

        {data.baseline.flags.length === 0 ? (
          <p className="mt-2 [animation:fadeUp_0.5s_ease-out_0.1s_both]">
            Nothing flagged right now.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {data.baseline.flags.map((f: any, i: number) => {
              const s = severityStyles(f.severity);
              return (
                <li
                  key={i}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="panel group relative overflow-hidden pl-5 transition-[transform,border-color,box-shadow] duration-300 ease-out
                             hover:-translate-y-0.5 hover:border-leaf/40
                             hover:shadow-[0_8px_24px_-14px_rgba(19,40,60,0.25)]
                             [animation:fadeUp_0.5s_ease-out_both]"
                >
                  {/* severity accent bar */}
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-1 ${s.bar} origin-top scale-y-100`}
                  />
                  <span
                    className={`mr-2 inline-block rounded px-2 py-0.5 text-xs font-semibold transition-transform duration-300 ease-out group-hover:scale-[1.03] ${s.badge}`}
                  >
                    {s.label}
                  </span>
                  {f.text}
                  <span className="ml-2 text-xs text-ink/60">{f.id}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Goal progress                                                    */}
      {/* ---------------------------------------------------------------- */}
      {data.baseline.goals.length > 0 && (
        <section className="mt-8" aria-labelledby="g">
          <h2
            id="g"
            className="text-xl font-bold tracking-tight [animation:fadeUp_0.5s_ease-out_both]"
          >
            Goal progress
          </h2>

          <ul className="mt-3 space-y-3">
            {data.baseline.goals.map((g: any, i: number) => {
              const onTrack = g.status === 'on_track';
              const width = Math.min(100, g.fundingPct);
              return (
                <li
                  key={g.goalId}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="panel group transition-[transform,border-color,box-shadow] duration-300 ease-out
                             hover:-translate-y-0.5 hover:border-leaf/40
                             hover:shadow-[0_8px_24px_-14px_rgba(19,40,60,0.25)]
                             [animation:fadeUp_0.55s_ease-out_both]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b className="transition-colors duration-200 ease-out group-hover:text-leaf">
                      {g.name}
                    </b>
                    <span className="text-sm text-ink/70">
                      <span className="font-semibold text-ink">{g.fundingPct}%</span> funded,{' '}
                      <span
                        className={
                          onTrack ? 'font-medium text-leafdark' : 'font-medium text-ember'
                        }
                      >
                        {onTrack ? 'on track' : 'behind'}
                      </span>
                    </span>
                  </div>

                  {/* animated progress track */}
                  <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-mist"
                    role="progressbar"
                    aria-valuenow={width}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${g.name} funding progress`}
                  >
                    <div
                      style={
                        {
                          '--target-w': `${width}%`,
                          animationDelay: `${i * 70 + 150}ms`,
                        } as React.CSSProperties
                      }
                      className={`h-2 rounded-full transition-[filter] duration-300 ease-out group-hover:brightness-110
                                 ${onTrack ? 'bg-leaf' : 'bg-ember'}
                                 [animation:barGrow_1s_cubic-bezier(0.22,1,0.36,1)_both]`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}