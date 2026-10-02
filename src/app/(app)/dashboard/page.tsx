'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { inr, pct } from '@/lib/money';
import { useApi } from '@/lib/useApi';

export default function Dashboard() {
  const router = useRouter();
  const { data, error, loading } = useApi<any>('analysis/run');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const m = data?.baseline.metrics;

  async function generate() {
    setBusy(true); setMsg(null);
    try { const r = await api<any>('reports', { method: 'POST', body: {} }); router.push(`/reports/${r._id}`); }
    catch (e) { setMsg((e as ApiError).message); } finally { setBusy(false); }
  }
  if (error) return <p role="alert" className="text-ember">{error.message}</p>;
  if (loading || !m) return <p>Loading your financial picture…</p>;
  const cards: [string, string, string?][] = [
    ['Income / month', inr(m.monthlyIncomeMinor)], ['Spending / month', inr(m.monthlyExpensesMinor)],
    ['Surplus / month', inr(m.monthlySurplusMinor), m.monthlySurplusMinor < 0 ? 'text-ember' : 'text-leafdark'], ['Net worth', inr(m.netWorthMinor)],
    ['Savings rate', pct(m.savingsRatePct)], ['Debt-service ratio', pct(m.debtServiceRatioPct)],
    ['Emergency cover', m.emergencyMonths == null ? 'n/a' : `${m.emergencyMonths} months`], ['Liquid savings', inr(m.liquidSavingsMinor)],
  ];
  const empty = m.monthlyIncomeMinor === 0 && m.totalAssetsMinor === 0;
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold">Financial health</h1>
        <div className="flex gap-2"><Link href="/scenarios" className="btn-ghost">Run a scenario</Link><button onClick={generate} disabled={busy} className="btn-primary">{busy ? 'Generating…' : 'Generate report'}</button></div>
      </div>
      {msg && <p role="alert" className="mt-3 text-ember">{msg}</p>}
      {empty && <div className="panel mt-6"><p>Start by adding your <Link className="underline" href="/financials/income">income</Link> and <Link className="underline" href="/financials/expenses">expenses</Link>. Your metrics appear here as you add data.</p></div>}
      <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{cards.map(([k, v, c]) => (<div key={k} className="panel"><dt className="text-sm text-ink/70">{k}</dt><dd className={`font-display text-xl font-bold ${c ?? ''}`}>{v}</dd></div>))}</dl>

      <section className="mt-8" aria-labelledby="pri"><h2 id="pri" className="text-xl font-bold">Priorities</h2>
        {data.baseline.flags.length === 0 ? <p className="mt-2">Nothing flagged right now.</p> : (
          <ul className="mt-3 space-y-2">{data.baseline.flags.map((f: any, i: number) => (
            <li key={i} className="panel"><span className="mr-2 rounded bg-mist px-2 py-0.5 text-xs font-semibold">{f.severity === 'high' ? 'High priority' : f.severity === 'medium' ? 'Review' : 'Note'}</span>{f.text}<span className="ml-2 text-xs text-ink/60">{f.id}</span></li>))}</ul>)}
      </section>

      {data.baseline.goals.length > 0 && <section className="mt-8" aria-labelledby="g"><h2 id="g" className="text-xl font-bold">Goal progress</h2>
        <ul className="mt-3 space-y-3">{data.baseline.goals.map((g: any) => (<li key={g.goalId} className="panel"><div className="flex justify-between"><b>{g.name}</b><span>{g.fundingPct}% funded, {g.status === 'on_track' ? 'on track' : 'behind'}</span></div>
          <div className="mt-2 h-2 rounded-full bg-mist"><div className="h-2 rounded-full bg-leaf" style={{ width: `${Math.min(100, g.fundingPct)}%` }} /></div></li>))}</ul></section>}
    </div>
  );
}
