'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useApi } from '@/lib/useApi';

const AGE = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const EMP = ['salaried', 'self_employed', 'business', 'student', 'retired', 'other'];

const DEFAULT = {
  ageBand: '25-34',
  employmentType: 'salaried',
  householdSize: 1,
  dependents: 0,
  horizonYears: 20,
  emergencyTargetMonths: 6,
  debtRatioThresholdPct: 40,
};

type Profile = typeof DEFAULT;

export default function Profile() {
  const router = useRouter();
  const { data: me } = useApi<any>('auth/me');
  const { data: prof, loading } = useApi<any>('profile');

  const [f, setF] = useState<Profile>(DEFAULT);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // hydrate from server without clobbering user edits
  useEffect(() => {
    if (!prof) return;
    setF((x) => ({
      ...x,
      ...Object.fromEntries(Object.entries(prof).filter(([k]) => k in x)),
    }));
  }, [prof]);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setF((x) => ({ ...x, [key]: value }));
    setDirty(true);
    setMsg(null);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await api('profile', {
        method: 'PUT',
        body: {
          ...f,
          householdSize: +f.householdSize,
          dependents: +f.dependents,
          horizonYears: +f.horizonYears,
          emergencyTargetMonths: +f.emergencyTargetMonths,
          debtRatioThresholdPct: +f.debtRatioThresholdPct,
        },
      });
      setMsg({ kind: 'ok', text: 'Profile saved.' });
      setDirty(false);
    } catch (x) {
      setMsg({ kind: 'err', text: (x as ApiError).message });
    } finally {
      setSaving(false);
    }
  }

  async function signOutAll() {
    await api('auth/logout-all', { method: 'POST' });
    router.replace('/login');
  }

  const initials = useMemo(() => {
    const n = (me?.name || me?.email || '?').trim();
    const parts = n.split(/[\s@.]+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
  }, [me]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
      {/* ---------- Identity banner ---------- */}
      <header
        className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-leaf/[0.07] via-paper to-gold/[0.05] p-6 sm:p-8"
        style={{ animation: 'fadeUp .5s cubic-bezier(.22,1,.36,1) both' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-leaf/10 blur-3xl"
        />
        <div className="relative flex flex-wrap items-center gap-5">
          <div
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-leaf to-leafdark font-display text-2xl font-bold text-paper shadow-[0_10px_28px_-12px_rgba(20,91,67,.55)]"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-leaf">
              Account
            </div>
            <h1 className="mt-0.5 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {me?.name || 'Your profile'}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-ink/60">
              <span className="truncate">{me?.email ?? '—'}</span>
              {me?.emailVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-leaf/30 bg-leaf/10 px-2 py-0.5 text-[11px] font-semibold text-leafdark">
                  <CheckIcon /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[11px] font-semibold text-gold">
                  <WarnIcon /> Unverified
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Two-column: form + live preview ---------- */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ---- FORM ---- */}
        <form
          onSubmit={save}
          className="space-y-6"
          style={{ animation: 'fadeUp .5s cubic-bezier(.22,1,.36,1) 80ms both' }}
        >
          <Section
            title="About you"
            hint="Used to tune ratios to your life stage"
            icon={<UserIcon />}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Age range">
                <Select
                  value={f.ageBand}
                  onChange={(v) => update('ageBand', v as Profile['ageBand'])}
                  options={AGE}
                />
              </Field>
              <Field label="Employment">
                <Select
                  value={f.employmentType}
                  onChange={(v) => update('employmentType', v as Profile['employmentType'])}
                  options={EMP}
                />
              </Field>
              <Field label="Household size" hint="People sharing your income">
                <NumberInput
                  value={f.householdSize}
                  min={1}
                  max={20}
                  onChange={(v) => update('householdSize', v)}
                />
              </Field>
              <Field label="Dependents" hint="Children, parents, others">
                <NumberInput
                  value={f.dependents}
                  min={0}
                  max={20}
                  onChange={(v) => update('dependents', v)}
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Planning targets"
            hint="Thresholds the engine checks against"
            icon={<TargetIcon />}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Planning horizon" hint="Years until major goal">
                <NumberInput
                  value={f.horizonYears}
                  min={1}
                  max={60}
                  suffix="years"
                  onChange={(v) => update('horizonYears', v)}
                />
              </Field>
              <Field label="Emergency fund target" hint="Months of expenses">
                <NumberInput
                  value={f.emergencyTargetMonths}
                  min={1}
                  max={24}
                  suffix="months"
                  onChange={(v) => update('emergencyTargetMonths', v)}
                />
              </Field>
              <Field
                label="Debt ratio limit"
                hint="Max % of income to debt payments"
              >
                <NumberInput
                  value={f.debtRatioThresholdPct}
                  min={5}
                  max={100}
                  suffix="%"
                  onChange={(v) => update('debtRatioThresholdPct', v)}
                />
              </Field>
            </div>
          </Section>

          {/* Save bar */}
          <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-paper/90 p-3 shadow-[0_10px_30px_-18px_rgba(19,40,60,.35)] backdrop-blur">
            <button
              type="submit"
              disabled={saving || !dirty}
              className="inline-flex items-center gap-2 rounded-xl bg-leaf px-5 py-2.5 text-sm font-semibold text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-leafdark hover:shadow-[0_10px_24px_-10px_rgba(20,91,67,.55)] disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {dirty && !saving && (
              <button
                type="button"
                onClick={() => {
                  if (!prof) return;
                  setF({
                    ...DEFAULT,
                    ...Object.fromEntries(
                      Object.entries(prof).filter(([k]) => k in DEFAULT),
                    ),
                  } as Profile);
                  setDirty(false);
                  setMsg(null);
                }}
                className="text-sm text-ink/60 transition-colors hover:text-ink"
              >
                Discard
              </button>
            )}
            {msg && (
              <span
                role="status"
                className={`ml-auto inline-flex items-center gap-1.5 text-sm ${
                  msg.kind === 'ok' ? 'text-leafdark' : 'text-ember'
                }`}
              >
                {msg.kind === 'ok' ? <CheckIcon /> : <WarnIcon />}
                {msg.text}
              </span>
            )}
          </div>
        </form>

        {/* ---- LIVE PREVIEW ---- */}
        <aside
          className="space-y-4 lg:sticky lg:top-6 lg:self-start"
          style={{ animation: 'fadeUp .5s cubic-bezier(.22,1,.36,1) 160ms both' }}
        >
          <div className="rounded-2xl border border-line bg-mist/40 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink/50">
              Live preview
            </div>
            <p className="mt-1 text-xs text-ink/55">
              How these settings shape your report.
            </p>

            <Preview
              label="Emergency fund target"
              value={`${f.emergencyTargetMonths} mo`}
              progress={(f.emergencyTargetMonths / 12) * 100}
              tone={f.emergencyTargetMonths >= 6 ? 'good' : 'warn'}
              caption={
                f.emergencyTargetMonths >= 6
                  ? 'Conservative — recommended'
                  : 'Aggressive — consider raising to 6'
              }
            />

            <Preview
              label="Debt ratio ceiling"
              value={`${f.debtRatioThresholdPct}%`}
              progress={(f.debtRatioThresholdPct / 60) * 100}
              tone={f.debtRatioThresholdPct <= 40 ? 'good' : 'warn'}
              caption={
                f.debtRatioThresholdPct <= 40
                  ? 'Standard threshold'
                  : 'Lenient — most lenders use 40%'
              }
            />

            <Preview
              label="Planning horizon"
              value={`${f.horizonYears} yr`}
              progress={(f.horizonYears / 40) * 100}
              tone={f.horizonYears >= 15 ? 'good' : 'warn'}
              caption={
                f.horizonYears >= 15
                  ? 'Long-term compounding window'
                  : 'Short horizon — favour liquid assets'
              }
            />
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink/50">
              Context
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              <Row k="Profile" v={f.employmentType.replace('_', ' ')} />
              <Row k="Age band" v={f.ageBand} />
              <Row
                k="Household"
                v={`${f.householdSize} ${f.householdSize === 1 ? 'person' : 'people'}${
                  f.dependents > 0 ? `, ${f.dependents} dependents` : ''
                }`}
              />
            </dl>
          </div>
        </aside>
      </div>

      {/* ---------- Security ---------- */}
      <section
        className="mt-10"
        style={{ animation: 'fadeUp .5s cubic-bezier(.22,1,.36,1) 240ms both' }}
      >
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Security
          </h2>
          <span className="text-xs text-ink/50">Sessions & access</span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SecurityCard
            icon={<KeyIcon />}
            title="Password"
            caption="Last changed — not tracked"
            action={
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-xs font-semibold text-leafdark hover:underline"
              >
                Reset via email →
              </button>
            }
          />
          <SecurityCard
            icon={<DeviceIcon />}
            title="Active sessions"
            caption="Sign out everywhere you're logged in"
            action={
              <button
                type="button"
                onClick={signOutAll}
                className="rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink/80 transition-all duration-200 hover:border-ember/40 hover:text-ember"
              >
                Sign out all devices
              </button>
            }
          />
        </div>
      </section>
    </div>
  );
}

/* ==================================================================
   Subcomponents
   ================================================================== */

function Section({
  title,
  hint,
  icon,
  children,
}: {
  title: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-leaf/10 text-leaf">
            {icon}
          </div>
        )}
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">
            {title}
          </h2>
          {hint && <p className="mt-0.5 text-xs text-ink/55">{hint}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/60">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink/45">{hint}</span>}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input appearance-none pr-10"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
      >
        <ChevronIcon />
      </span>
    </div>
  );
}

function NumberInput({
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  value: number | string;
  min?: number;
  max?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`input tabular-nums ${suffix ? 'pr-16' : ''}`}
      />
      {suffix && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink/45"
        >
          {suffix}
        </span>
      )}
    </div>
  );
}

function Preview({
  label,
  value,
  progress,
  tone,
  caption,
}: {
  label: string;
  value: string;
  progress: number;
  tone: 'good' | 'warn' | 'crit';
  caption: string;
}) {
  const pct = Math.min(100, Math.max(4, progress));
  const colors: Record<typeof tone, string> = {
    good: 'from-leaf to-leafdark',
    warn: 'from-gold to-[#B8860B]',
    crit: 'from-ember to-[#8B2E12]',
  };
  const text: Record<typeof tone, string> = {
    good: 'text-leafdark',
    warn: 'text-gold',
    crit: 'text-ember',
  };
  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-ink/70">{label}</span>
        <span className={`text-sm font-bold tabular-nums ${text[tone]}`}>
          {value}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors[tone]} transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1.5 text-[11px] text-ink/50">{caption}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/60 pb-2 last:border-0 last:pb-0">
      <dt className="text-xs text-ink/50">{k}</dt>
      <dd className="text-right text-sm font-medium capitalize text-ink">
        {v}
      </dd>
    </div>
  );
}

function SecurityCard({
  icon,
  title,
  caption,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  caption: string;
  action: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-paper p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-leaf/40 hover:shadow-[0_10px_28px_-14px_rgba(30,123,91,.22)]">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mist text-ink/70 transition-colors duration-300 group-hover:bg-leaf/10 group-hover:text-leaf">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-ink">{title}</div>
          <p className="mt-0.5 text-xs text-ink/55">{caption}</p>
          <div className="mt-3">{action}</div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Icons --------------------------- */

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function WarnIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l10 18H2L12 3zM12 10v4M12 18h.01" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l9-9M16 4l4 4M14 6l3 3" />
    </svg>
  );
}
function DeviceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="14" height="12" rx="2" />
      <path d="M8 20h10M13 16v4" />
      <rect x="17" y="10" width="5" height="10" rx="1" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}