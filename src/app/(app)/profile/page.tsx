'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useApi } from '@/lib/useApi';

const AGE = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const EMP = ['salaried', 'self_employed', 'business', 'student', 'retired', 'other'];

export default function Profile() {
  const router = useRouter();
  const { data: me } = useApi<any>('auth/me');
  const { data: prof } = useApi<any>('profile');
  const [f, setF] = useState<any>({ ageBand: '25-34', employmentType: 'salaried', householdSize: 1, dependents: 0, horizonYears: 20, emergencyTargetMonths: 6, debtRatioThresholdPct: 40 });
  const [msg, setMsg] = useState<string | null>(null);
  const [pw, setPw] = useState('');
  useEffect(() => { if (prof) setF((x: any) => ({ ...x, ...Object.fromEntries(Object.entries(prof).filter(([k]) => k in x)) })); }, [prof]);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setMsg(null);
    try {
      await api('profile', { method: 'PUT', body: { ...f, householdSize: +f.householdSize, dependents: +f.dependents, horizonYears: +f.horizonYears, emergencyTargetMonths: +f.emergencyTargetMonths, debtRatioThresholdPct: +f.debtRatioThresholdPct } });
      setMsg('Profile saved');
    } catch (x) { setMsg((x as ApiError).message); }
  }
  async function exportData() {
    const d = await api('profile/export');
    const url = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' }));
    Object.assign(document.createElement('a'), { href: url, download: 'finsight-export.json' }).click(); URL.revokeObjectURL(url);
  }
  async function del() {
    if (!confirm('This permanently deletes your account and all financial data. Continue?')) return;
    try { await api('profile/account', { method: 'DELETE', body: { password: pw } }); router.replace('/'); router.refresh(); } catch (x) { setMsg((x as ApiError).message); }
  }
  const sel = (k: string, label: string, opts: string[]) => (<div><label className="label" htmlFor={k}>{label}</label>
    <select id={k} className="input" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}>{opts.map((o) => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}</select></div>);
  const num = (k: string, label: string) => (<div><label className="label" htmlFor={k}>{label}</label><input id={k} className="input" type="number" min={0} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></div>);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">Profile and security</h1>
      {me && <p className="mt-1 text-sm">{me.email}. {me.emailVerified ? 'Email verified.' : 'Email not verified: you need this to generate reports.'}</p>}
      <form onSubmit={save} className="panel mt-6 grid gap-4 md:grid-cols-2">
        {sel('ageBand', 'Age range', AGE)}{sel('employmentType', 'Work type', EMP)}
        {num('householdSize', 'People in household')}{num('dependents', 'Dependents')}
        {num('horizonYears', 'Planning horizon (years)')}{num('emergencyTargetMonths', 'Emergency fund target (months)')}
        {num('debtRatioThresholdPct', 'Debt ratio limit (%)')}
        <div className="md:col-span-2 flex items-center gap-3"><button className="btn-primary">Save profile</button>{msg && <span role="status" className="text-sm">{msg}</span>}</div>
      </form>
      <section className="panel mt-6"><h2 className="text-xl font-bold">Your data</h2>
        <p className="mt-1 text-sm">Download everything FinSight stores about you, or delete your account.</p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <button className="btn-ghost" onClick={exportData}>Export my data</button>
          <div><label htmlFor="pw" className="label">Password to confirm deletion</label><input id="pw" type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <button className="btn border border-ember text-ember" onClick={del} disabled={!pw}>Delete account</button></div></section>
      <button className="btn-ghost mt-6" onClick={async () => { await api('auth/logout-all', { method: 'POST' }); router.replace('/login'); }}>Sign out of all devices</button>
    </div>
  );
}
