'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { inr, pct } from '@/lib/money';
import { useApi } from '@/lib/useApi';

type Confidence = 'low' | 'medium' | 'high';

interface Report {
  _id: string;
  createdAt: string;
  status?: 'ready' | 'ai_fallback';
  content: {
    summary: string;
    confidence: Confidence;
    metrics: {
      monthlySurplusMinor: number;
      savingsRatePct: number | null;
      debtServiceRatioPct: number | null;
      netWorthMinor: number | null;
      emergencyMonths: number | null;
    };
    priorities: { order: number; title: string; reason: string; explanation?: string }[];
    assumptions: string[];
    disclosures: string[];
  };
}

export default function ReportView({ params }: { params: { id: string } }) {
  const { data: r, error, loading } = useApi<Report>(`reports/${params.id}`);

  const printRef = useRef<HTMLElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'finsight-report',
  });

  if (loading) return <ReportSkeleton />;

  if (error)
    return (
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <Link href="/reports" className="text-sm text-ink/60 hover:text-ink">
          ← All reports
        </Link>
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-ember/30 bg-ember/5 p-5"
        >
          <div className="text-sm font-semibold text-ember">Could not load report</div>
          <p className="mt-1 text-sm text-ember/80">{error.message}</p>
        </div>
      </div>
    );

  if (!r) return null;

  const c = r.content;
  const m = c.metrics;
  const date = new Date(r.createdAt);
  const isFallback = r.status === 'ai_fallback';

  const metrics = [
    {
      label: 'Monthly surplus',
      value: inr(m.monthlySurplusMinor),
      note: m.monthlySurplusMinor >= 0 ? 'Positive cash flow' : 'Spending exceeds income',
      tone: m.monthlySurplusMinor >= 0 ? ('good' as const) : ('crit' as const),
      icon: <TrendIcon />,
    },
    {
      label: 'Savings rate',
      value: pct(m.savingsRatePct),
      note:
        m.savingsRatePct == null
          ? 'No income recorded'
          : m.savingsRatePct >= 30
            ? 'Above target'
            : 'Below 30% target',
      tone:
        m.savingsRatePct == null
          ? ('muted' as const)
          : m.savingsRatePct >= 30
            ? ('good' as const)
            : m.savingsRatePct >= 20
              ? ('warn' as const)
              : ('crit' as const),
      icon: <PigIcon />,
    },
    {
      label: 'Debt-service ratio',
      value: pct(m.debtServiceRatioPct),
      note:
        m.debtServiceRatioPct == null
          ? 'No income recorded'
          : m.debtServiceRatioPct <= 15
            ? 'Comfortable'
            : m.debtServiceRatioPct <= 30
              ? 'Moderate'
              : 'Stressed',
      tone:
        m.debtServiceRatioPct == null
          ? ('muted' as const)
          : m.debtServiceRatioPct <= 15
            ? ('good' as const)
            : m.debtServiceRatioPct <= 30
              ? ('warn' as const)
              : ('crit' as const),
      icon: <ScaleIcon />,
    },
    {
      label: 'Net worth',
      value: m.netWorthMinor == null ? 'Not provided' : inr(m.netWorthMinor),
      note:
        m.netWorthMinor == null
          ? 'Assets and liabilities missing'
          : 'Assets minus liabilities',
      tone:
        m.netWorthMinor == null
          ? ('muted' as const)
          : m.netWorthMinor >= 0
            ? ('good' as const)
            : ('crit' as const),
      icon: <VaultIcon />,
    },
    {
      label: 'Emergency cover',
      value: m.emergencyMonths == null ? '—' : `${m.emergencyMonths} mo`,
      note:
        m.emergencyMonths == null
          ? 'Not enough data'
          : m.emergencyMonths >= 6
            ? 'Meets 6-month target'
            : 'Below 6-month target',
      tone:
        m.emergencyMonths == null
          ? ('muted' as const)
          : m.emergencyMonths >= 6
            ? ('good' as const)
            : m.emergencyMonths >= 3
              ? ('warn' as const)
              : ('crit' as const),
      icon: <ShieldIcon />,
    },
  ];

  return (
    <article
      ref={printRef as React.RefObject<HTMLElement>}
      className="print-root mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-8 sm:pt-8"
    >
      {/* Breadcrumb */}
      <Link
        href="/reports"
        className="no-print inline-flex items-center gap-1 text-sm text-ink/60 transition-colors hover:text-ink"
      >
        <span aria-hidden>←</span> All reports
      </Link>

      {/* Header */}
      <header
        className="mt-4 border-b border-line pb-6"
        style={{ animation: 'fadeUp .5s cubic-bezier(.22,1,.36,1) both' }}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink/55">
          <span className="font-semibold uppercase tracking-wider text-leaf">
            Report
          </span>
          <span aria-hidden>·</span>
          <time dateTime={r.createdAt}>{date.toLocaleString('en-IN')}</time>
        </div>

        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Financial health report
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={r.status} />
          <ConfidenceBadge confidence={c.confidence} />

          <button
            type="button"
            onClick={handlePrint}
            className="no-print ml-auto inline-flex items-center gap-2 rounded-xl border border-line bg-paper px-3.5 py-1.5 text-xs font-semibold text-ink/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-leaf/50 hover:bg-leaf/5 hover:text-leafdark hover:shadow-[0_8px_20px_-12px_rgba(30,123,91,.35)]"
          >
            <DownloadIcon />
            Download PDF
          </button>
        </div>

        <p className="mt-3 text-xs text-ink/55">
          {isFallback
            ? 'Rules-based summary — the AI layer was not available when this was generated.'
            : 'AI-assisted summary — every figure below was computed by the rules engine.'}
        </p>
      </header>

      {/* Summary */}
      <section
        className="mt-6"
        style={{ animation: 'fadeUp .5s cubic-bezier(.22,1,.36,1) 80ms both' }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-leaf/[0.06] via-paper to-gold/[0.04] p-5 sm:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-leaf/10 blur-2xl"
          />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-leafdark">
              <SparkIcon />
              Executive summary
            </div>
            <p className="text-base leading-relaxed text-ink/85 sm:text-lg">
              {c.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Key numbers */}
      <section
        className="mt-10"
        style={{ animation: 'fadeUp .5s cubic-bezier(.22,1,.36,1) 160ms both' }}
      >
        <SectionHeader title="Key numbers" hint="Computed by the engine" />

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((mc, i) => (
            <MetricCard key={mc.label} {...mc} index={i} />
          ))}
        </div>
      </section>

      {/* Priorities */}
      <section
        className="mt-10"
        style={{ animation: 'fadeUp .5s cubic-bezier(.22,1,.36,1) 240ms both' }}
      >
        <SectionHeader
          title="Priorities"
          hint={
            c.priorities.length === 0
              ? 'Nothing flagged'
              : `${c.priorities.length} item${c.priorities.length > 1 ? 's' : ''} to address`
          }
        />

        {c.priorities.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-leaf/25 bg-leaf/5 p-5 text-sm text-leafdark">
            No corrective action was flagged. Maintain current allocations and
            review quarterly.
          </div>
        ) : (
          <ol className="mt-4 space-y-3">
            {c.priorities.map((p, i) => (
              <PriorityItem key={p.order} priority={p} index={i} />
            ))}
          </ol>
        )}
      </section>

      {/* Assumptions */}
      <section
        className="mt-10"
        style={{ animation: 'fadeUp .5s cubic-bezier(.22,1,.36,1) 320ms both' }}
      >
        <SectionHeader title="Assumptions" />
        <ul className="mt-4 space-y-2 rounded-2xl border border-line bg-mist/40 p-5 text-sm text-ink/75">
          {c.assumptions.map((a) => (
            <li key={a} className="flex gap-2.5">
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf/70"
              />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Disclosures */}
      <section
        className="mt-10"
        style={{ animation: 'fadeUp .5s cubic-bezier(.22,1,.36,1) 400ms both' }}
      >
        <SectionHeader title="Disclosures" />
        <ul className="mt-4 space-y-2 border-t border-line pt-5 text-xs leading-relaxed text-ink/60">
          {c.disclosures.map((d) => (
            <li key={d} className="flex gap-2">
              <span aria-hidden className="text-ink/30">
                §
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer CTA */}
      <div className="no-print mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-ink"
        >
          <span aria-hidden>←</span> Back to reports
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-leaf px-5 py-2.5 text-sm font-semibold text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-leafdark hover:shadow-[0_10px_24px_-10px_rgba(20,91,67,.55)]"
        >
          Generate a new report
        </Link>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
        {title}
      </h2>
      {hint && <span className="text-xs text-ink/50">{hint}</span>}
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const isFallback = status === 'ai_fallback';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
        isFallback
          ? 'border-gold/40 bg-gold/10 text-gold'
          : 'border-leaf/30 bg-leaf/10 text-leafdark'
      }`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${isFallback ? 'bg-gold' : 'bg-leaf'}`}
      />
      {isFallback ? 'Engine only' : 'AI written'}
    </span>
  );
}

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const map: Record<
    Confidence,
    { bg: string; fg: string; border: string; label: string }
  > = {
    low: {
      bg: 'bg-ember/10',
      fg: 'text-ember',
      border: 'border-ember/30',
      label: 'Low confidence',
    },
    medium: {
      bg: 'bg-gold/10',
      fg: 'text-gold',
      border: 'border-gold/40',
      label: 'Medium confidence',
    },
    high: {
      bg: 'bg-leaf/10',
      fg: 'text-leafdark',
      border: 'border-leaf/30',
      label: 'High confidence',
    },
  };
  const s = map[confidence];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${s.bg} ${s.fg} ${s.border}`}
    >
      {s.label}
    </span>
  );
}

function MetricCard({
  label,
  value,
  note,
  tone,
  icon,
  index,
}: {
  label: string;
  value: string;
  note: string;
  tone: 'good' | 'warn' | 'crit' | 'muted';
  icon: React.ReactNode;
  index: number;
}) {
  const toneStyles: Record<
    typeof tone,
    { ring: string; badge: string; iconBg: string; iconFg: string }
  > = {
    good: {
      ring: 'hover:border-leaf/40',
      badge: 'text-leafdark',
      iconBg: 'bg-leaf/10',
      iconFg: 'text-leaf',
    },
    warn: {
      ring: 'hover:border-gold/50',
      badge: 'text-gold',
      iconBg: 'bg-gold/10',
      iconFg: 'text-gold',
    },
    crit: {
      ring: 'hover:border-ember/40',
      badge: 'text-ember',
      iconBg: 'bg-ember/10',
      iconFg: 'text-ember',
    },
    muted: {
      ring: 'hover:border-line',
      badge: 'text-ink/50',
      iconBg: 'bg-mist',
      iconFg: 'text-ink/50',
    },
  };
  const t = toneStyles[tone];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-line bg-paper p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-14px_rgba(19,40,60,.22)] ${t.ring}`}
      style={{
        animation: `fadeUp .45s cubic-bezier(.22,1,.36,1) ${index * 60 + 200}ms both`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-leaf/0 blur-2xl transition-colors duration-500 group-hover:bg-leaf/10"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink/50">
            {label}
          </div>
          <div className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink tabular-nums">
            {value}
          </div>
          <div className={`mt-1 text-xs font-medium ${t.badge}`}>{note}</div>
        </div>
        <div
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${t.iconBg} ${t.iconFg} transition-transform duration-300 group-hover:scale-105`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function PriorityItem({
  priority,
  index,
}: {
  priority: { order: number; title: string; reason: string; explanation?: string };
  index: number;
}) {
  return (
    <li
      className="group relative overflow-hidden rounded-2xl border border-line bg-paper p-4 transition-all duration-300 hover:border-leaf/40 hover:shadow-[0_8px_24px_-14px_rgba(30,123,91,.28)] sm:p-5"
      style={{
        animation: `fadeUp .45s cubic-bezier(.22,1,.36,1) ${index * 70 + 300}ms both`,
      }}
    >
      <span
        aria-hidden
        className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-leaf/0 transition-colors duration-300 group-hover:bg-leaf/70"
      />
      <div className="flex gap-3.5">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-leaf/10 font-display text-sm font-bold text-leafdark transition-colors duration-300 group-hover:bg-leaf group-hover:text-paper">
          {priority.order}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-ink">{priority.title}</div>
          <p className="mt-1 text-sm leading-relaxed text-ink/75">
            {priority.reason}
          </p>
          {priority.explanation && (
            <p className="mt-2 border-l-2 border-leaf/30 pl-3 text-sm italic leading-relaxed text-ink/60">
              {priority.explanation}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

function ReportSkeleton() {
  return (
    <div
      className="mx-auto max-w-3xl px-5 pb-16 pt-6 sm:px-8 sm:pt-8"
      aria-hidden
    >
      <div className="h-3 w-24 rounded-full bg-mist" />
      <div className="mt-4 h-3 w-40 rounded-full bg-mist/70" />
      <div className="mt-3 h-9 w-72 rounded-lg bg-mist" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-24 rounded-full bg-mist/70" />
        <div className="h-6 w-28 rounded-full bg-mist/70" />
      </div>

      <div
        className="mt-6 h-32 rounded-2xl bg-mist/60"
        style={{ animation: 'pulseFade 1.4s ease-in-out infinite' }}
      />

      <div className="mt-10 h-5 w-32 rounded bg-mist" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-line bg-paper p-4"
            style={{
              animation: `pulseFade 1.4s ${i * 100}ms ease-in-out infinite`,
            }}
          >
            <div className="h-3 w-20 rounded-full bg-mist/70" />
            <div className="mt-3 h-6 w-28 rounded bg-mist" />
            <div className="mt-2 h-3 w-24 rounded-full bg-mist/70" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Icons --------------------------- */

function DownloadIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

function PigIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 10c0-2.8-2.2-5-5-5H9a5 5 0 0 0-5 5v4a3 3 0 0 0 3 3h1v2a1 1 0 0 0 2 0v-2h4v2a1 1 0 0 0 2 0v-2h1a3 3 0 0 0 3-3v-2h1v-3h-1z" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18M7 21h10M5 7h14l-3 6a4 4 0 0 1-8 0L5 7z" />
    </svg>
  );
}

function VaultIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 8v-1M12 17v-1M8 12h-1M17 12h-1" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  );
}