'use client';
import Link from 'next/link';
import { useApi } from '@/lib/useApi';

interface Report {
  _id: string;
  createdAt: string;
  status?: 'ready' | 'ai_fallback';
  content?: {
    summary?: string;
    confidence?: 'low' | 'medium' | 'high';
    priorities?: { order: number; title: string }[];
  };
}

export default function Reports() {
  const { data, error, loading } = useApi<Report[]>('reports');

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-leaf">
            History
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Reports
          </h1>
          <p className="mt-2 max-w-lg text-sm text-ink/60">
            Every report is a frozen snapshot of your numbers at a point in time.
          </p>
        </div>
        <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
          <span aria-hidden>+</span> New report
        </Link>
      </div>

      {/* States */}
      {loading && <SkeletonList />}

      {!loading && error && (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-ember/30 bg-ember/5 p-5"
        >
          <div className="text-sm font-semibold text-ember">Could not load reports</div>
          <p className="mt-1 text-sm text-ember/80">{error.message}</p>
        </div>
      )}

      {!loading && !error && data?.length === 0 && <EmptyState />}

      {/* List */}
      {!loading && !error && data && data.length > 0 && (
        <ul className="mt-8 grid gap-3 sm:gap-4">
          {data.map((r, i) => (
            <ReportCard key={r._id} report={r} index={i} />
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ReportCard({ report, index }: { report: Report; index: number }) {
  const date = new Date(report.createdAt);
  const dateStr = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const priorities = report.content?.priorities ?? [];
  const topThree = priorities.slice(0, 3);

  return (
    <li
      className="group"
      style={{
        animation: `cardIn .45s cubic-bezier(.22,1,.36,1) ${index * 55}ms both`,
      }}
    >
      <Link
        href={`/reports/${report._id}`}
        className="relative block overflow-hidden rounded-2xl border border-line bg-paper p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-leaf/40 hover:shadow-[0_12px_32px_-14px_rgba(30,123,91,.28)] focus-visible:-translate-y-0.5 focus-visible:border-leaf/40 focus-visible:shadow-[0_12px_32px_-14px_rgba(30,123,91,.28)] sm:p-6"
      >
        {/* soft gradient wash on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(600px 140px at 15% 0%, rgba(30,123,91,.08), transparent 60%), radial-gradient(500px 120px at 100% 100%, rgba(217,162,27,.06), transparent 60%)',
          }}
        />

        {/* left accent rail */}
        <span
          aria-hidden
          className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-leaf/0 transition-colors duration-300 group-hover:bg-leaf/70"
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            {/* Date row */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink/55">
              <CalendarIcon />
              <time dateTime={report.createdAt} className="font-medium text-ink/70">
                {dateStr}
              </time>
              <span aria-hidden className="text-ink/30">
                ·
              </span>
              <span>{timeStr}</span>

              {report.status === 'ai_fallback' && (
                <span className="ml-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
                  Engine only
                </span>
              )}
              {report.status === 'ready' && (
                <span className="ml-1 rounded-full border border-leaf/30 bg-leaf/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-leafdark">
                  AI written
                </span>
              )}
            </div>

            {/* Summary */}
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/80 sm:text-[15px]">
              {report.content?.summary ?? 'No summary recorded for this report.'}
            </p>

            {/* Priority chips */}
            {topThree.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {topThree.map((p) => (
                  <span
                    key={p.order}
                    className="rounded-md bg-mist px-2 py-0.5 text-[11px] font-medium text-ink/70 ring-1 ring-inset ring-line/60"
                  >
                    {p.title}
                  </span>
                ))}
                {priorities.length > 3 && (
                  <span className="rounded-md px-2 py-0.5 text-[11px] font-medium text-ink/50">
                    +{priorities.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
            <span className="hidden text-xs font-semibold uppercase tracking-wider text-ink/40 transition-colors duration-300 group-hover:text-leaf sm:inline">
              Open
            </span>
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-paper text-ink/60 transition-all duration-300 group-hover:border-leaf group-hover:bg-leaf group-hover:text-paper"
            >
              <ArrowIcon />
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-line bg-mist/40 px-6 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-leaf/10 text-leaf">
        <DocIcon />
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold text-ink">
        No reports yet
      </h2>
      <p className="mt-1.5 max-w-sm text-sm text-ink/60">
        Generate your first report from the dashboard. It'll freeze a snapshot of your
        finances and read back what the engine found.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-leaf px-5 py-2.5 text-sm font-semibold text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-leafdark hover:shadow-[0_10px_24px_-10px_rgba(20,91,67,.55)]"
      >
        Go to dashboard
        <ArrowIcon />
      </Link>
    </div>
  );
}

function SkeletonList() {
  return (
    <ul className="mt-8 grid gap-3 sm:gap-4" aria-hidden>
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="rounded-2xl border border-line bg-paper p-5 sm:p-6"
          style={{ animation: `pulseFade 1.4s ${i * 120}ms ease-in-out infinite` }}
        >
          <div className="h-3 w-32 rounded-full bg-mist" />
          <div className="mt-3 h-3 w-full rounded-full bg-mist/70" />
          <div className="mt-2 h-3 w-4/5 rounded-full bg-mist/70" />
          <div className="mt-4 flex gap-2">
            <div className="h-5 w-16 rounded-md bg-mist/60" />
            <div className="h-5 w-20 rounded-md bg-mist/60" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* --------------------------- Icons --------------------------- */

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}