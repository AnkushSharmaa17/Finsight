'use client';

import { useMemo, useRef, useState } from 'react';
import { inr } from '@/lib/money';

/* -------------------------------------------------------------------------- */
/*                                   Utils                                    */
/* -------------------------------------------------------------------------- */

const INCOME_MIN = 10_000;
const INCOME_MAX = 10_00_000;
const SPEND_MIN = 0;
const SPEND_MAX = 10_00_000;

function stepFor(value: number): number {
  if (value < 50_000) return 1_000;
  if (value < 2_00_000) return 5_000;
  return 10_000;
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** "400000" → "4,00,000" (Indian grouping) */
function groupIndian(digits: string): string {
  if (!digits) return '';
  const n = digits.replace(/^0+(?=\d)/, '');
  if (n.length <= 3) return n;
  const last3 = n.slice(-3);
  const rest = n.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
}

type RateTone = { label: string; className: string };
function getRateTone(rate: number, isNegative: boolean): RateTone {
  if (isNegative)
    return { label: 'Overspending', className: 'bg-ember/10 text-ember ring-ember/20' };
  if (rate < 10)
    return { label: 'Low', className: 'bg-amber-500/10 text-amber-700 ring-amber-500/20' };
  if (rate < 20)
    return { label: 'On track', className: 'bg-leaf/10 text-leafdark ring-leaf/20' };
  return { label: 'Strong', className: 'bg-leaf/15 text-leafdark ring-leaf/30' };
}

/* -------------------------------------------------------------------------- */
/*                                   Main                                     */
/* -------------------------------------------------------------------------- */

export function HeroDemo() {
  const [income, setIncome] = useState<number>(85000);
  const [spend, setSpend] = useState<number>(61000);

  const surplus = income - spend;
  const rate = income > 0 ? Math.round((surplus / income) * 100) : 0;
  const spendPct = Math.min(100, Math.round((spend / Math.max(income, 1)) * 100));
  const isNegative = surplus < 0;
  const tone = useMemo(() => getRateTone(rate, isNegative), [rate, isNegative]);

  const incomeFill = ((income - INCOME_MIN) / (INCOME_MAX - INCOME_MIN)) * 100;
  const spendFill = ((spend - SPEND_MIN) / (SPEND_MAX - SPEND_MIN)) * 100;

  return (
    <div
      className="panel group relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm
                 transition-all duration-500 ease-out
                 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ink/5"
      aria-label="Interactive cash flow demo"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-leaf/10 blur-3xl
                   transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-ember/5 blur-3xl
                   transition-transform duration-700 ease-out group-hover:scale-110"
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink/60">
            Live demo
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-2 py-0.5 text-[11px] font-medium text-leafdark">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-leaf" />
            </span>
            Interactive
          </span>
        </div>

        <h3 className="mt-2 font-display text-lg font-bold tracking-tight">
          Try it with your numbers
        </h3>
        <p className="mt-1 text-sm text-ink/70">
          Drag the slider or type your exact amount — up to ₹10,00,000 a month.
        </p>

        {/* -------------------- Income -------------------- */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="d-inc-num" className="text-sm font-medium text-ink/75">
              Monthly income
            </label>
            <NumberInput
              id="d-inc-num"
              value={income}
              min={INCOME_MIN}
              max={INCOME_MAX}
              onChange={setIncome}
              accent="leaf"
              ariaLabel="Monthly income in rupees"
            />
          </div>
          <input
            id="d-inc"
            type="range"
            min={INCOME_MIN}
            max={INCOME_MAX}
            step={stepFor(income)}
            value={income}
            onChange={(e) => setIncome(+e.target.value)}
            className="slider slider-leaf mt-2.5 w-full"
            style={{ '--fill': `${incomeFill}%` } as React.CSSProperties}
            aria-valuetext={`${inr(income * 100)} per month`}
            aria-label="Monthly income slider"
          />
        </div>

        {/* -------------------- Spending -------------------- */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="d-exp-num" className="text-sm font-medium text-ink/75">
              Monthly spending
            </label>
            <NumberInput
              id="d-exp-num"
              value={spend}
              min={SPEND_MIN}
              max={SPEND_MAX}
              onChange={setSpend}
              accent="ember"
              ariaLabel="Monthly spending in rupees"
            />
          </div>
          <input
            id="d-exp"
            type="range"
            min={SPEND_MIN}
            max={SPEND_MAX}
            step={stepFor(spend)}
            value={spend}
            onChange={(e) => setSpend(+e.target.value)}
            className="slider slider-ember mt-2.5 w-full"
            style={{ '--fill': `${spendFill}%` } as React.CSSProperties}
            aria-valuetext={`${inr(spend * 100)} per month`}
            aria-label="Monthly spending slider"
          />
        </div>

        {/* Spend bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-ink/60">
            <span>Spending vs income</span>
            <span className="tabular-nums">{spendPct}%</span>
          </div>
          <div
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-mist"
            role="progressbar"
            aria-valuenow={spendPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Spending is ${spendPct}% of income`}
          >
            <div
              className={[
                'h-full rounded-full transition-[width,background-color] duration-300 ease-out',
                isNegative
                  ? 'bg-gradient-to-r from-ember/70 to-ember'
                  : 'bg-gradient-to-r from-leaf/70 to-leaf',
              ].join(' ')}
              style={{ width: `${spendPct}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <dl className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-line bg-mist/40 p-3.5 transition-colors duration-300 group-hover:bg-mist/60">
            <dt className="text-[11px] font-medium uppercase tracking-wider text-ink/60">
              Left each month
            </dt>
            <dd
              className={[
                'mt-1 font-display text-2xl font-bold tabular-nums transition-colors duration-300',
                isNegative ? 'text-ember' : 'text-leafdark',
              ].join(' ')}
            >
              {inr(surplus * 100)}
            </dd>
          </div>

          <div className="rounded-xl border border-line bg-mist/40 p-3.5 transition-colors duration-300 group-hover:bg-mist/60">
            <dt className="text-[11px] font-medium uppercase tracking-wider text-ink/60">
              Savings rate
            </dt>
            <dd className="mt-1 flex items-center gap-2">
              <span className="font-display text-2xl font-bold tabular-nums">
                {rate}%
              </span>
              <span
                className={[
                  'inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1',
                  'transition-colors duration-300',
                  tone.className,
                ].join(' ')}
              >
                {tone.label}
              </span>
            </dd>
          </div>
        </dl>

        {/* Warning */}
        <div
          aria-live="polite"
          className={[
            'mt-4 flex items-start gap-2 overflow-hidden rounded-lg border text-sm',
            'transition-all duration-300 ease-out',
            isNegative
              ? 'max-h-24 translate-y-0 border-ember/20 bg-ember/5 p-3 text-ember opacity-100'
              : 'max-h-0 translate-y-1 border-transparent bg-transparent p-0 text-transparent opacity-0',
          ].join(' ')}
        >
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mt-0.5 h-4 w-4 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <p>Spending is higher than income in this example.</p>
        </div>

        <p className="mt-4 text-[11px] text-ink/50">
          Illustrative only. Educational planning, not investment advice.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                          Typed, free-form number input                     */
/* -------------------------------------------------------------------------- */

type NumberInputProps = {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  accent: 'leaf' | 'ember';
  ariaLabel: string;
};

function NumberInput({
  id,
  value,
  min,
  max,
  onChange,
  accent,
  ariaLabel,
}: NumberInputProps) {
  /**
   * `text` holds exactly what the user typed (formatted with commas).
   * While focused, we do NOT sync from `value` — the user owns the field.
   * On blur / Enter, we parse + clamp + push up, then re-format.
   */
  const [text, setText] = useState<string>(groupIndian(String(value)));
  const focusedRef = useRef<boolean>(false);

  /* When the slider changes the value and the input is NOT focused, update it. */
  if (!focusedRef.current && Number(text.replace(/,/g, '')) !== value) {
    setText(groupIndian(String(value)));
  }

  const handleChange = (raw: string) => {
    // strip everything except digits, then re-group
    const digits = raw.replace(/[^\d]/g, '');
    // hard cap length so users can't paste 1e12
    const capped = digits.slice(0, 9);
    setText(groupIndian(capped));
  };

  const commit = () => {
    const digits = text.replace(/,/g, '');
    const n = digits === '' ? min : clamp(parseInt(digits, 10), min, max);
    onChange(n);
    setText(groupIndian(String(n)));
  };

  const bump = (delta: number) => {
    const next = clamp(value + delta, min, max);
    onChange(next);
    setText(groupIndian(String(next)));
  };

  return (
    <div
      className={[
        'inline-flex items-center gap-1 rounded-lg border bg-white px-2 py-1',
        'transition-[border-color,box-shadow] duration-200 ease-out',
        accent === 'leaf'
          ? 'border-line focus-within:border-leaf/60 focus-within:ring-2 focus-within:ring-leaf/20'
          : 'border-line focus-within:border-ember/60 focus-within:ring-2 focus-within:ring-ember/20',
      ].join(' ')}
    >
      <span className="text-sm text-ink/60" aria-hidden>
        ₹
      </span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={(e) => {
          focusedRef.current = true;
          // select-all so a fresh keystroke replaces the current value
          requestAnimationFrame(() => e.target.select());
        }}
        onBlur={() => {
          focusedRef.current = false;
          commit();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
            (e.target as HTMLInputElement).blur();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            bump(stepFor(value));
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            bump(-stepFor(value));
          } else if (e.key === 'Escape') {
            // revert to the last committed value
            setText(groupIndian(String(value)));
            (e.target as HTMLInputElement).blur();
          }
        }}
        aria-label={ariaLabel}
        className="w-24 bg-transparent text-right font-display text-base font-semibold tabular-nums
                   outline-none placeholder:text-ink/40"
        placeholder="0"
      />
    </div>
  );
}