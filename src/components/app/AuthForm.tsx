'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api, ApiError } from '@/lib/api';

type Step = 'creds' | 'otp';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const sp = useSearchParams();
  const isReg = mode === 'register';

  const [step, setStep] = useState<Step>('creds');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [code, setCode] = useState('');
  const [err, setErr] = useState<ApiError | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === 'otp') codeRef.current?.focus();
  }, [step]);

  function go() {
    const next = sp.get('next');
    router.replace(next && next.startsWith('/') ? next : '/dashboard');
    router.refresh();
  }

  /* ------- step 1: creds ------- */
  async function submitCreds(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setInfo(null);
    try {
      if (isReg) {
        await api('auth/register', { method: 'POST', body: f });
        setStep('otp');
        setCooldown(30);
        setInfo(`We sent a 6-digit code to ${f.email}. Check your inbox (and spam).`);
      } else {
        try {
          await api('auth/login', { method: 'POST', body: { email: f.email, password: f.password } });
          go();
        } catch (x) {
          // Unverified account: the server refuses login. Kick them into the OTP step
          // instead of leaving them stuck on a dead-end error.
          if ((x as ApiError)?.code === 'EMAIL_NOT_VERIFIED') {
            await api('auth/resend-otp', { method: 'POST', body: { email: f.email } }).catch(() => {});
            setStep('otp');
            setCooldown(30);
            setInfo('Your account is not verified yet. We sent a new code to your email.');
            return;
          }
          throw x;
        }
      }
    } catch (x) {
      setErr(x as ApiError);
    } finally {
      setBusy(false);
    }
  }

  /* ------- step 2: OTP ------- */
  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await api('auth/verify-otp', { method: 'POST', body: { email: f.email, code } });
      go();
    } catch (x) {
      setErr(x as ApiError);
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (cooldown > 0 || busy) return;
    setBusy(true);
    setErr(null);
    try {
      await api('auth/resend-otp', { method: 'POST', body: { email: f.email } });
      setInfo('A new code is on its way.');
      setCooldown(30);
    } catch (x) {
      setErr(x as ApiError);
    } finally {
      setBusy(false);
    }
  }

  /* ------- OTP screen ------- */
  if (step === 'otp') {
    return (
      <form onSubmit={submitOtp} className="panel space-y-4">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-sm text-ink/70">
          Enter the 6-digit code we sent to <b className="text-ink">{f.email}</b>.
        </p>

        {info && !err && (
          <p className="rounded-lg border border-leaf/30 bg-leaf/5 px-3 py-2 text-sm text-leafdark">
            {info}
          </p>
        )}
        {err && !err.details && (
          <p role="alert" className="rounded-lg border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-ember">
            {err.message}
          </p>
        )}

        <div>
          <label className="label" htmlFor="otp">6-digit code</label>
          <input
            ref={codeRef}
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="input text-center text-2xl font-bold tracking-[0.5em]"
            placeholder="••••••"
          />
        </div>

        <button className="btn-primary w-full" disabled={busy || code.length !== 6}>
          {busy ? 'Verifying…' : 'Verify and continue'}
        </button>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => {
              setStep('creds');
              setErr(null);
              setInfo(null);
              setCode('');
            }}
            className="text-ink/60 hover:text-ink"
          >
            ← {isReg ? 'Change details' : 'Back'}
          </button>
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0 || busy}
            className="text-leafdark hover:underline disabled:opacity-40"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
        </div>
      </form>
    );
  }

  /* ------- creds screen ------- */
  return (
    <form onSubmit={submitCreds} className="panel space-y-4">
      <h1 className="text-2xl font-bold">{isReg ? 'Create your account' : 'Sign in'}</h1>

      {isReg && (
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input
            id="name"
            className="input"
            autoComplete="name"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
        </div>
      )}

      <div>
        <label className="label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          className="input"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          aria-invalid={!!err?.details?.email}
        />
        {err?.details?.email && (
          <p role="alert" className="mt-1 text-sm text-ember">{err.details.email[0]}</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="pw">Password</label>
        <input
          id="pw"
          type="password"
          required
          minLength={isReg ? 10 : 1}
          autoComplete={isReg ? 'new-password' : 'current-password'}
          className="input"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />
        {isReg && (
          <p className="mt-1 text-xs text-ink/70">
            At least 10 characters. We'll email you a code to confirm.
          </p>
        )}
        {err?.details?.password && (
          <p role="alert" className="mt-1 text-sm text-ember">{err.details.password[0]}</p>
        )}
      </div>

      {err && !err.details && (
        <p role="alert" className="text-sm text-ember">{err.message}</p>
      )}

      <button className="btn-primary w-full" disabled={busy}>
        {busy ? 'Please wait…' : isReg ? 'Send verification code' : 'Sign in'}
      </button>

      <p className="text-sm">
        {isReg ? (
          <>Already have an account? <Link className="underline" href="/login">Sign in</Link></>
        ) : (
          <>New here? <Link className="underline" href="/register">Create an account</Link></>
        )}
      </p>
    </form>
  );
}