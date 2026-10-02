'use client';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

function Verify() {
  const token = useSearchParams().get('token');
  const [state, setState] = useState<'working' | 'ok' | 'fail'>('working');
  useEffect(() => { if (!token) return setState('fail'); api('auth/verify-email', { method: 'POST', body: { token } }).then(() => setState('ok')).catch(() => setState('fail')); }, [token]);
  return (<div className="panel" role="status">
    {state === 'working' && <p>Verifying your email…</p>}
    {state === 'ok' && <><h1 className="text-2xl font-bold">Email verified</h1><Link href="/dashboard" className="btn-primary mt-4">Go to dashboard</Link></>}
    {state === 'fail' && <><h1 className="text-2xl font-bold">Link invalid or expired</h1><p className="mt-2 text-sm">Sign in and request a new verification link.</p><Link href="/login" className="btn-primary mt-4">Sign in</Link></>}
  </div>);
}
export default function VerifyEmail() { return <Suspense><Verify /></Suspense>; }
