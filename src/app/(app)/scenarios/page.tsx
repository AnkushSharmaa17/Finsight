'use client';
import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { inr, pct, toMinor } from '@/lib/money';

export default function Scenarios() {
  const [a, setA] = useState({ incomeChangePct: 0, expenseChangePct: 0, extraSaving: 0, newEmi: 0 });
  const [res, setRes] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const assumptions = () => ({ incomeChangePct: a.incomeChangePct, expenseChangePct: a.expenseChangePct, extraSavingMinor: toMinor(a.extraSaving), newEmiMinor: toMinor(a.newEmi) });

  async function run(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setSaved(false);
    try { setRes(await api('analysis/run', { method: 'POST', body: assumptions() })); } catch (x) { setErr((x as ApiError).message); }
  }
  async function save() { await api('scenarios', { method: 'POST', body: { name: name || 'My scenario', assumptions: assumptions() } }); setSaved(true); }
  const num = (k: keyof typeof a, label: string, suffix: string) => (
    <div><label className="label" htmlFor={k}>{label} ({suffix})</label>
      <input id={k} className="input" type="number" value={a[k]} onChange={(e) => setA({ ...a, [k]: Number(e.target.value) })} /></div>);
  const b = res?.baseline.metrics, s = res?.scenario?.metrics;
  const rows: [string, string, string][] = b && s ? [
    ['Income / month', inr(b.monthlyIncomeMinor), inr(s.monthlyIncomeMinor)], ['Spending / month', inr(b.monthlyExpensesMinor), inr(s.monthlyExpensesMinor)],
    ['Debt payments / month', inr(b.monthlyDebtServiceMinor), inr(s.monthlyDebtServiceMinor)], ['Surplus / month', inr(b.monthlySurplusMinor), inr(s.monthlySurplusMinor)],
    ['Savings rate', pct(b.savingsRatePct), pct(s.savingsRatePct)], ['Debt-service ratio', pct(b.debtServiceRatioPct), pct(s.debtServiceRatioPct)]] : [];
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold">Scenarios</h1>
      <p className="mt-1 text-sm text-ink/70">Test a change against your baseline. Your real records are never modified.</p>
      <form onSubmit={run} className="panel mt-6 grid gap-4 md:grid-cols-2">
        {num('incomeChangePct', 'Income change', '%')}{num('expenseChangePct', 'Spending change', '%')}
        {num('extraSaving', 'Extra monthly saving', '₹')}{num('newEmi', 'New monthly EMI', '₹')}
        <div className="md:col-span-2"><button className="btn-primary">Compare with baseline</button></div>
      </form>
      {err && <p role="alert" className="mt-3 text-ember">{err}</p>}
      {rows.length > 0 && (<>
        <table className="mt-6 w-full overflow-hidden rounded-lg border border-line bg-white text-left text-sm">
          <thead className="bg-mist"><tr><th className="px-4 py-3">Measure</th><th className="px-4 py-3">Baseline</th><th className="px-4 py-3">Scenario</th></tr></thead>
          <tbody>{rows.map(([k, x, y]) => (<tr key={k} className="border-t border-line"><td className="px-4 py-3">{k}</td><td className="px-4 py-3">{x}</td><td className="px-4 py-3 font-semibold">{y}</td></tr>))}</tbody></table>
        <p className="mt-2 text-xs text-ink/70">Illustrative scenario based on the assumptions above. Not a prediction or guarantee.</p>
        <div className="mt-4 flex gap-2"><input aria-label="Scenario name" className="input max-w-xs" placeholder="Scenario name" value={name} onChange={(e) => setName(e.target.value)} /><button className="btn-ghost" onClick={save}>Save scenario</button>{saved && <span role="status" className="self-center text-sm text-leafdark">Saved</span>}</div>
      </>)}
    </div>
  );
}
