'use client';
import { useState } from 'react';
import { getCalc } from '@/lib/content/calculators';

export function Calculator({ slug }: { slug: string }) {
  const calc = getCalc(slug)!;
  const [v, setV] = useState<Record<string, number>>(Object.fromEntries(calc.inputs.map((i) => [i.name, i.default])));
  const out = calc.compute(v);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form className="panel space-y-4" onSubmit={(e) => e.preventDefault()}>
        {calc.inputs.map((i) => (
          <div key={i.name}>
            <label className="label" htmlFor={i.name}>{i.label} ({i.unit})</label>
            <input id={i.name} className="input" type="number" min={0} inputMode="decimal" value={Number.isFinite(v[i.name]) ? v[i.name] : ''}
              onChange={(e) => setV({ ...v, [i.name]: Math.max(0, Number(e.target.value)) })} />
          </div>
        ))}
      </form>
      <div className="panel" aria-live="polite">
        <h2 className="font-display text-lg font-bold">Result</h2>
        <dl className="mt-4 space-y-4">{out.map((o) => (<div key={o.label}><dt className="text-sm text-ink/70">{o.label}</dt><dd className="font-display text-2xl font-bold text-leafdark">{o.value}</dd></div>))}</dl>
      </div>
    </div>
  );
}
