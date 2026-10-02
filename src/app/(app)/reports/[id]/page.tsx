'use client';
import Link from 'next/link';
import { inr, pct } from '@/lib/money';
import { useApi } from '@/lib/useApi';

export default function ReportView({ params }: { params: { id: string } }) {
  const { data: r, error } = useApi<any>(`reports/${params.id}`);
  if (error) return <p role="alert" className="text-ember">{error.message}</p>;
  if (!r) return <p>Loading…</p>;
  const c = r.content, m = c.metrics;
  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/reports" className="text-sm underline">All reports</Link>
      <h1 className="mt-2 text-3xl font-bold">Financial health report</h1>
      <p className="text-sm text-ink/70">{new Date(r.createdAt).toLocaleString('en-IN')}. Confidence: {c.confidence}. {r.status === 'ai_fallback' ? 'Rules-based summary.' : 'AI-assisted summary.'}</p>
      <p className="panel mt-5 text-lg">{c.summary}</p>
      <h2 className="mt-8 text-xl font-bold">Key numbers</h2>
      <table className="mt-3 w-full rounded-lg border border-line bg-white text-left text-sm"><tbody>
        {[['Monthly surplus', inr(m.monthlySurplusMinor)], ['Savings rate', pct(m.savingsRatePct)], ['Debt-service ratio', pct(m.debtServiceRatioPct)], ['Net worth', inr(m.netWorthMinor)], ['Emergency cover', m.emergencyMonths == null ? 'n/a' : `${m.emergencyMonths} months`]]
          .map(([k, v]) => (<tr key={k} className="border-t border-line first:border-0"><th scope="row" className="px-4 py-3 font-medium">{k}</th><td className="px-4 py-3">{v}</td></tr>))}</tbody></table>
      <h2 className="mt-8 text-xl font-bold">Priorities</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-6">{c.priorities.map((p: any) => <li key={p.order}>{p.reason}{p.explanation && <span className="block text-sm text-ink/70">{p.explanation}</span>}</li>)}{c.priorities.length === 0 && <li>Nothing flagged.</li>}</ol>
      <h2 className="mt-8 text-xl font-bold">Assumptions</h2><ul className="mt-2 list-disc pl-6">{c.assumptions.map((a: string) => <li key={a}>{a}</li>)}</ul>
      <h2 className="mt-8 text-xl font-bold">Disclosures</h2><ul className="mt-2 list-disc pl-6 text-sm">{c.disclosures.map((a: string) => <li key={a}>{a}</li>)}</ul>
    </article>
  );
}
