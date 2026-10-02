'use client';
import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { inr, toMinor } from '@/lib/money';
import { useApi } from '@/lib/useApi';
import type { Field, Resource } from '@/lib/resources';

type Row = Record<string, any> & { _id: string };

const display = (f: string, v: any, res: Resource) => {
  if (v === null || v === undefined || v === '') return '—';
  if (f.endsWith('Minor')) return inr(v);
  if (f.endsWith('Pct')) return `${v}%`;
  if (f === 'targetDate' || f === 'maturityDate') return new Date(v).toLocaleDateString('en-IN');
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return String(v).replace(/_/g, ' ');
};

function initial(res: Resource, row?: Row) {
  const o: Record<string, any> = {};
  res.fields.forEach((f) => {
    const raw = row?.[f.name];
    if (f.type === 'money') o[f.name] = raw == null ? '' : String(raw / 100);
    else if (f.type === 'date') o[f.name] = raw ? String(raw).slice(0, 10) : '';
    else if (f.type === 'boolean') o[f.name] = raw ?? true;
    else if (f.type === 'select') o[f.name] = raw ?? f.options![0]![0];
    else o[f.name] = raw ?? (f.name === 'expectedReturnPct' ? 8 : f.name === 'priority' ? 5 : '');
  });
  return o;
}

function payload(res: Resource, form: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const f of res.fields) {
    const v = form[f.name];
    if (v === '' || v === undefined) { if (f.nullable) out[f.name] = null; continue; }
    out[f.name] = f.type === 'money' ? toMinor(Number(v)) : f.type === 'number' ? Number(v) : v;
  }
  return out;
}

export function ResourceManager({ resource }: { resource: Resource }) {
  const { data, error, loading, reload } = useApi<Row[]>(resource.endpoint);
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [err, setErr] = useState<ApiError | null>(null);
  const [busy, setBusy] = useState(false);

  const open = (row?: Row) => { setErr(null); setForm(initial(resource, row)); setEditing(row ?? 'new'); };

  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    try {
      const body = payload(resource, form);
      if (editing === 'new') await api(resource.endpoint, { method: 'POST', body });
      else await api(`${resource.endpoint}/${(editing as Row)._id}`, { method: 'PATCH', body });
      setEditing(null); await reload();
    } catch (x) { setErr(x as ApiError); } finally { setBusy(false); }
  }
  async function remove(row: Row) {
    if (!confirm(`Delete this ${resource.singular}?`)) return;
    await api(`${resource.endpoint}/${row._id}`, { method: 'DELETE' }); await reload();
  }

  const label = (name: string) => resource.fields.find((f) => f.name === name)?.label.replace(/ \(₹\)| \(%\)/, '') ?? name;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-3xl font-bold">{resource.title}</h1><p className="mt-1 text-sm text-ink/70">{resource.hint}</p></div>
        <button className="btn-primary" onClick={() => open()}>Add {resource.singular}</button>
      </div>

      {error && <p role="alert" className="mt-4 text-ember">{error.message}</p>}
      {loading && <p className="mt-6">Loading…</p>}
      {data && data.length === 0 && !editing && <div className="panel mt-6"><p>No {resource.title.toLowerCase()} yet. Add your first {resource.singular} to include it in your analysis.</p></div>}

      {data && data.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{resource.title}</caption>
            <thead className="bg-mist"><tr>{resource.columns.map((c) => <th key={c} scope="col" className="px-4 py-3 font-semibold">{label(c)}</th>)}<th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{data.map((row) => (
              <tr key={row._id} className="border-t border-line">
                {resource.columns.map((c) => <td key={c} className="px-4 py-3 capitalize">{display(c, row[c], resource)}</td>)}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  {resource.key === 'goals' && <a className="mr-3 underline" href={`/goals/${row._id}`}>Details</a>}
                  <button className="mr-3 underline" onClick={() => open(row)}>Edit</button>
                  <button className="text-ember underline" onClick={() => remove(row)}>Delete</button>
                </td></tr>))}</tbody>
          </table>
        </div>
      )}

      {editing && (
        <form onSubmit={save} className="panel mt-6 grid gap-4 md:grid-cols-2" aria-label={`${editing === 'new' ? 'Add' : 'Edit'} ${resource.singular}`}>
          {resource.fields.map((f) => <FieldInput key={f.name} f={f} value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} error={err?.details?.[f.name]?.[0]} />)}
          {err && !err.details && <p role="alert" className="text-ember md:col-span-2">{err.message}</p>}
          <div className="flex gap-2 md:col-span-2">
            <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

function FieldInput({ f, value, onChange, error }: { f: Field; value: any; onChange: (v: any) => void; error?: string }) {
  const id = `f-${f.name}`;
  return (
    <div>
      {f.type === 'boolean' ? (
        <label className="flex items-center gap-2 pt-6 text-sm font-medium"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />{f.label}</label>
      ) : (<>
        <label htmlFor={id} className="label">{f.label}{f.required && ' *'}</label>
        {f.type === 'select' ? (
          <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>{f.options!.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        ) : (
          <input id={id} className="input" required={f.required} placeholder={f.placeholder}
            type={f.type === 'date' ? 'date' : f.type === 'text' ? 'text' : 'number'} min={f.type === 'text' || f.type === 'date' ? undefined : 0} step={f.type === 'money' ? '0.01' : 'any'}
            inputMode={f.type === 'text' ? undefined : 'decimal'} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />)}
      </>)}
      {error && <p role="alert" className="mt-1 text-sm text-ember">{error}</p>}
    </div>
  );
}
