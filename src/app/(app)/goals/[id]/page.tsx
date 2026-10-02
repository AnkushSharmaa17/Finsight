'use client';
import Link from 'next/link';
import { useApi } from '@/lib/useApi';
import { inr } from '@/lib/money';

export default function GoalDetail({ params }: { params: { id: string } }) {
  const { data: g, error } = useApi<any>(`goals/${params.id}`);
  if (error) return <p role="alert" className="text-ember">{error.message}</p>;
  if (!g) return <p>Loading…</p>;
  const months = Math.max(0, Math.round((new Date(g.targetDate).getTime() - Date.now()) / (30.4375 * 864e5)));
  const r = g.expectedReturnPct / 1200;
  const grow = r === 0 ? 1 : Math.pow(1 + r, months);
  const projected = g.currentAmountMinor * grow + (r === 0 ? g.monthlyContributionMinor * months : g.monthlyContributionMinor * ((grow - 1) / r));
  const gap = Math.max(0, g.targetAmountMinor - g.currentAmountMinor * grow);
  const needed = months === 0 ? gap : r === 0 ? gap / months : (gap * r) / (grow - 1);
  const funding = Math.round((g.currentAmountMinor / g.targetAmountMinor) * 100);
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/goals" className="text-sm underline">All goals</Link>
      <h1 className="mt-2 text-3xl font-bold">{g.name}</h1>
      <div className="mt-6 h-3 overflow-hidden rounded-full bg-mist" role="img" aria-label={`${funding}% funded`}><div className="h-full bg-leaf" style={{ width: `${Math.min(100, funding)}%` }} /></div>
      <p className="mt-2 text-sm">{funding}% funded: {inr(g.currentAmountMinor)} of {inr(g.targetAmountMinor)}</p>
      <dl className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="panel"><dt className="text-sm text-ink/70">Months left</dt><dd className="font-display text-2xl font-bold">{months}</dd></div>
        <div className="panel"><dt className="text-sm text-ink/70">Projected at target date</dt><dd className="font-display text-2xl font-bold">{inr(Math.round(projected))}</dd></div>
        <div className="panel"><dt className="text-sm text-ink/70">Monthly needed</dt><dd className="font-display text-2xl font-bold">{inr(Math.ceil(needed))}</dd></div>
      </dl>
      <p className="mt-4 text-sm text-ink/70">Illustrative: assumes {g.expectedReturnPct}% annual return, monthly compounding and {inr(g.monthlyContributionMinor)} contributed each month. Not a guarantee.</p>
    </div>
  );
}
