'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { api, ApiError } from '@/lib/api';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter(); const sp = useSearchParams();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState<ApiError | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isReg = mode === 'register';

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    try {
      if (isReg) {
        const r = await api<any>('auth/register', { method: 'POST', body: f });
        await api('auth/login', { method: 'POST', body: { email: f.email, password: f.password } });
        if (r.devVerifyUrl) { setDevLink(r.devVerifyUrl); return; }
      } else await api('auth/login', { method: 'POST', body: { email: f.email, password: f.password } });
      const next = sp.get('next'); router.replace(next && next.startsWith('/') ? next : '/dashboard'); router.refresh();
    } catch (x) { setErr(x as ApiError); } finally { setBusy(false); }
  }
  if (devLink) return (<div className="panel"><h1 className="text-2xl font-bold">Check your email</h1>
    <p className="mt-2 text-sm">Development mode: no email is sent. <a className="underline" href={devLink}>Verify now</a>, or <Link className="underline" href="/dashboard">continue to the dashboard</Link>.</p></div>);
  return (
    <form onSubmit={submit} className="panel space-y-4">
      <h1 className="text-2xl font-bold">{isReg ? 'Create your account' : 'Sign in'}</h1>
      {isReg && <div><label className="label" htmlFor="name">Name</label><input id="name" className="input" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>}
      <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required autoComplete="email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-invalid={!!err?.details?.email} />
        {err?.details?.email && <p role="alert" className="mt-1 text-sm text-ember">{err.details.email[0]}</p>}</div>
      <div><label className="label" htmlFor="pw">Password</label><input id="pw" type="password" required minLength={isReg ? 10 : 1} autoComplete={isReg ? 'new-password' : 'current-password'} className="input" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        {isReg && <p className="mt-1 text-xs text-ink/70">At least 10 characters.</p>}
        {err?.details?.password && <p role="alert" className="mt-1 text-sm text-ember">{err.details.password[0]}</p>}</div>
      {err && !err.details && <p role="alert" className="text-sm text-ember">{err.message}</p>}
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Please wait…' : isReg ? 'Create account' : 'Sign in'}</button>
      <p className="text-sm">{isReg ? <>Already have an account? <Link className="underline" href="/login">Sign in</Link></> : <>New here? <Link className="underline" href="/register">Create an account</Link></>}</p>
    </form>
  );
}
