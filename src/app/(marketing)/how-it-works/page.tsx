import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({ title: 'How it works', description: 'From adding your numbers to a dated financial health report: how FinSight calculates and explains your finances.', path: '/how-it-works' });

const STEPS = [
  ['Add your numbers', 'Enter income, expenses, loans, assets, investments and goals. Save drafts and edit any time.'],
  ['We calculate', 'Tested code converts everything to monthly equivalents and computes surplus, savings rate, debt ratio, net worth and emergency cover.'],
  ['Rules flag what matters', 'Fixed rules highlight negative cash flow, thin reserves, heavy debt and missing data, each tied to a metric.'],
  ['AI explains in plain language', 'A model writes the summary from the validated results. It cannot change a number. If it is unavailable you get a rules-based summary.'],
  ['Test scenarios and save a snapshot', 'Try a raise or a new EMI without touching your records. Reports stay tied to the snapshot they were built from.'],
];
export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl font-bold">How FinSight works</h1>
      <ol className="mt-10 space-y-6">
        {STEPS.map(([t, d], i) => (<li key={t} className="panel"><h2 className="text-xl font-bold">Step {i + 1}: {t}</h2><p className="mt-2">{d}</p></li>))}
      </ol>
      <Link href="/register" className="btn-primary mt-10">Start your report</Link>
    </div>
  );
}
