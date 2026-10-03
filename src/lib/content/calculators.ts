/* ────────────────────────────────────────────────────────────────── */
/*  src/lib/content/calculators.ts                                     */
/*  Source of truth for every calculator: math, copy, and SEO data.    */
/* ────────────────────────────────────────────────────────────────── */

/* ══════════════════════════════════════════════════════════════════ */
/*  Types                                                             */
/* ══════════════════════════════════════════════════════════════════ */

export type CalcUnit = '₹' | 'months' | '%' | 'years';

export type CalcTone = 'good' | 'warn' | 'bad';

export type CalcCategory =
  | 'planning'
  | 'savings'
  | 'debt'
  | 'investing';

export interface CalcInput {
  name: string;
  label: string;
  unit: CalcUnit;
  default: number;
  /** Optional sub-label shown under the input field. */
  hint?: string;
  /** Optional lower bound (inclusive). Used by the UI to clamp input. */
  min?: number;
  /** Optional upper bound (inclusive). */
  max?: number;
}

export interface CalcBadge {
  text: string;
  tone: CalcTone;
}

export interface CalcOutput {
  label: string;
  value: string;
  /** Optional qualitative verdict shown alongside the value. */
  badge?: CalcBadge;
}

export interface CalcFaq {
  q: string;
  a: string;
}

export interface Calc {
  slug: string;
  title: string;
  description: string;
  explainer: string;
  inputs: CalcInput[];
  compute: (v: Record<string, number>) => CalcOutput[];
  /** Taxonomy — powers grouped indexes and fallback related lists. */
  category: CalcCategory;
  /** FAQ — powers FAQPage schema (rich results in Google). */
  faq: CalcFaq[];
  /** Explicit related slugs — falls back to same-category siblings. */
  relatedSlugs: string[];
  /** ISO date string — freshness signal for SEO. */
  updatedAt: string;
}

/* ══════════════════════════════════════════════════════════════════ */
/*  Formatting + coercion helpers                                     */
/* ══════════════════════════════════════════════════════════════════ */

/** Coerce anything to a finite number, defaulting to `fallback`. */
const toNum = (v: unknown, fallback = 0): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/** Same as `toNum`, clamped to ≥ 0. */
const nonNeg = (v: unknown): number => Math.max(0, toNum(v));

/** Indian-format rupees. Always rounds to the nearest rupee. */
const inr = (n: number): string =>
  '₹' + Math.round(toNum(n)).toLocaleString('en-IN');

/** Percentage with fixed decimal places. */
const pct = (n: number, digits = 1): string =>
  `${toNum(n).toFixed(digits)}%`;

/** Decimal count with “months” suffix. */
const months = (n: number): string => `${toNum(n).toFixed(1)} months`;

/** Integer count with “years” suffix. */
const years = (n: number): string =>
  `${toNum(n).toFixed(1)} ${toNum(n) === 1 ? 'year' : 'years'}`;

/** Convenience: build a badge. */
const badge = (text: string, tone: CalcTone): CalcBadge => ({ text, tone });

/* ══════════════════════════════════════════════════════════════════ */
/*  Calculator definitions                                            */
/* ══════════════════════════════════════════════════════════════════ */

export const CALCULATORS: Calc[] = [
  /* ────────────────────────────────────────────────────────────── */
  /*  1. Emergency fund                                             */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'emergency-fund-calculator',
    title: 'Emergency fund calculator',
    description:
      'Find out how many months of essential expenses your savings cover, and how much more you need.',
    category: 'planning',
    updatedAt: '2026-01-15',
    explainer:
      'Months covered = liquid savings ÷ essential monthly expenses. Essential expenses are the bills you must pay even if income stops — rent, EMIs, utilities, groceries, insurance, school fees. Target fund = essential expenses × target months.',
    inputs: [
      {
        name: 'essential',
        label: 'Essential monthly expenses',
        unit: '₹',
        default: 45000,
        hint: 'Rent, EMIs, utilities, food, insurance, school fees',
        min: 0,
      },
      {
        name: 'savings',
        label: 'Liquid savings',
        unit: '₹',
        default: 180000,
        hint: 'Savings account, sweep-in FD, liquid funds',
        min: 0,
      },
      {
        name: 'target',
        label: 'Target months',
        unit: 'months',
        default: 6,
        hint: '3–6 months typical; 9–12 if income is variable',
        min: 1,
        max: 36,
      },
    ],
    compute: (v) => {
      const essential = nonNeg(v.essential);
      const savings = nonNeg(v.savings);
      const target = Math.max(1, nonNeg(v.target));

      if (essential === 0) {
        return [
          { label: 'Months covered', value: '—' },
          { label: 'Target fund', value: '—' },
          { label: 'Gap to target', value: '—' },
        ];
      }

      const covered = savings / essential;
      const targetFund = essential * target;
      const gap = Math.max(0, targetFund - savings);
      const surplus = Math.max(0, savings - targetFund);

      const verdict =
        covered >= target
          ? badge('On track', 'good')
          : covered >= target / 2
            ? badge('Getting there', 'warn')
            : badge('Below target', 'bad');

      return [
        { label: 'Months covered', value: months(covered), badge: verdict },
        { label: 'Target fund', value: inr(targetFund) },
        gap > 0
          ? { label: 'Shortfall', value: inr(gap) }
          : { label: 'Surplus over target', value: inr(surplus) },
      ];
    },
    faq: [
      {
        q: 'How many months should I save?',
        a: 'Most planners recommend 3–6 months of essential expenses. If your income is variable, you are a single earner, or you support a family, aim for 9–12 months.',
      },
      {
        q: 'What counts as liquid savings?',
        a: 'Money you can access within a day or two without penalty — savings accounts, sweep-in fixed deposits, and liquid mutual funds. Exclude equity, PPF, and locked FDs.',
      },
      {
        q: 'Should I include EMIs in essential expenses?',
        a: 'Yes. Any payment that would default if your income stopped belongs in this number, including loan EMIs and insurance premiums.',
      },
    ],
    relatedSlugs: [
      'savings-rate-calculator',
      'net-worth-calculator',
      'debt-service-ratio-calculator',
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  2. Savings rate                                               */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'savings-rate-calculator',
    title: 'Savings rate calculator',
    description:
      'Calculate the share of your monthly income that you actually keep after spending.',
    category: 'savings',
    updatedAt: '2026-01-15',
    explainer:
      'Savings rate = (monthly income − monthly expenses) ÷ monthly income × 100. Use take-home income and regular spending, including EMIs, so the number reflects reality.',
    inputs: [
      {
        name: 'income',
        label: 'Monthly take-home income',
        unit: '₹',
        default: 85000,
        hint: 'Salary after tax and PF, plus regular side income',
        min: 0,
      },
      {
        name: 'expenses',
        label: 'Monthly expenses, incl. EMIs',
        unit: '₹',
        default: 61000,
        hint: 'Everything you spend in a typical month',
        min: 0,
      },
    ],
    compute: (v) => {
      const income = nonNeg(v.income);
      const expenses = nonNeg(v.expenses);

      if (income === 0) {
        return [
          { label: 'Monthly surplus', value: '—' },
          { label: 'Savings rate', value: '—' },
        ];
      }

      const surplus = income - expenses;
      const rate = (surplus / income) * 100;

      const verdict =
        rate >= 30
          ? badge('Excellent', 'good')
          : rate >= 20
            ? badge('Strong', 'good')
            : rate >= 10
              ? badge('Moderate', 'warn')
              : rate >= 0
                ? badge('Low', 'warn')
                : badge('Deficit', 'bad');

      return [
        {
          label: surplus >= 0 ? 'Monthly surplus' : 'Monthly deficit',
          value: inr(Math.abs(surplus)),
        },
        { label: 'Savings rate', value: pct(rate), badge: verdict },
      ];
    },
    faq: [
      {
        q: 'What is a good savings rate?',
        a: '20% is the common benchmark. Above 30% puts you on a fast track to financial independence. Below 10% means you are living close to the edge.',
      },
      {
        q: 'Should I count EPF and NPS contributions?',
        a: 'Yes — they are your money being saved. Include both employee and employer contributions if you can see them on your payslip.',
      },
      {
        q: 'Should I use gross or take-home income?',
        a: 'Take-home (net) income is more realistic. Using gross overstates your rate by the tax and PF you never actually received.',
      },
    ],
    relatedSlugs: [
      'emergency-fund-calculator',
      'goal-sip-calculator',
      'net-worth-calculator',
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  3. Debt-service ratio                                         */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'debt-service-ratio-calculator',
    title: 'Debt-service ratio calculator',
    description:
      'See what percentage of your income goes toward EMIs and loan payments each month.',
    category: 'debt',
    updatedAt: '2026-01-15',
    explainer:
      'Debt-service ratio = monthly debt payments ÷ monthly income × 100. Lenders in India typically accept up to 36–40%; above 50% leaves very little room if your income drops.',
    inputs: [
      {
        name: 'income',
        label: 'Monthly take-home income',
        unit: '₹',
        default: 85000,
        min: 0,
      },
      {
        name: 'emi',
        label: 'Total monthly EMIs and card dues',
        unit: '₹',
        default: 28000,
        hint: 'Home, car, personal loans, credit card minimums',
        min: 0,
      },
    ],
    compute: (v) => {
      const income = nonNeg(v.income);
      const emi = nonNeg(v.emi);

      if (income === 0) {
        return [
          { label: 'Debt-service ratio', value: '—' },
          { label: 'Left after debt payments', value: '—' },
        ];
      }

      const ratio = (emi / income) * 100;
      const leftover = Math.max(0, income - emi);

      const verdict =
        ratio <= 36
          ? badge('Healthy', 'good')
          : ratio <= 50
            ? badge('Caution', 'warn')
            : badge('High', 'bad');

      return [
        { label: 'Debt-service ratio', value: pct(ratio), badge: verdict },
        { label: 'Left after debt payments', value: inr(leftover) },
      ];
    },
    faq: [
      {
        q: 'What is a healthy debt-service ratio?',
        a: 'Lenders in India typically accept up to 36–40%. Above 50% leaves very little room if income drops or rates rise.',
      },
      {
        q: 'Do credit card dues count?',
        a: 'Yes — and they count at the full outstanding balance, not the minimum due. Lenders look at total obligations, not just instalments.',
      },
      {
        q: 'Should I include rent in this ratio?',
        a: 'No. Debt-service ratio is about debt, not living costs. Rent belongs in your expense budget, not this ratio.',
      },
    ],
    relatedSlugs: [
      'home-loan-emi-calculator',
      'emergency-fund-calculator',
      'savings-rate-calculator',
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  4. Goal SIP                                                   */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'goal-sip-calculator',
    title: 'Goal SIP calculator',
    description:
      'Estimate the monthly SIP needed to reach a goal, given an assumed return. Illustrative only.',
    category: 'investing',
    updatedAt: '2026-01-15',
    explainer:
      'Uses monthly compounding. Required SIP = (target − current × (1 + r)ⁿ) × r ÷ ((1 + r)ⁿ − 1), where r is the monthly rate and n the number of months. Returns are assumptions, not promises.',
    inputs: [
      {
        name: 'target',
        label: 'Goal amount',
        unit: '₹',
        default: 2500000,
        min: 0,
      },
      {
        name: 'current',
        label: 'Already saved toward goal',
        unit: '₹',
        default: 200000,
        min: 0,
      },
      {
        name: 'years',
        label: 'Years to goal',
        unit: 'years',
        default: 10,
        min: 0.5,
        max: 50,
      },
      {
        name: 'ret',
        label: 'Assumed annual return',
        unit: '%',
        default: 8,
        hint: '8–12% for long-term equity; 6–7% for debt',
        min: 0,
        max: 30,
      },
    ],
    compute: (v) => {
      const target = nonNeg(v.target);
      const current = nonNeg(v.current);
      const yrs = Math.max(1 / 12, nonNeg(v.years));
      const annual = nonNeg(v.ret);

      const n = yrs * 12;
      const r = annual / 1200;
      const growth = r === 0 ? 1 : Math.pow(1 + r, n);
      const grown = current * growth;
      const gap = Math.max(0, target - grown);
      const sip = r === 0 ? gap / n : (gap * r) / (growth - 1);

      return [
        { label: 'Needed per month', value: inr(sip) },
        { label: 'Current savings will grow to', value: inr(grown) },
        { label: 'Remaining gap at goal', value: inr(gap) },
      ];
    },
    faq: [
      {
        q: 'What return should I assume?',
        a: 'For a 10-year horizon in a diversified equity fund, 10–12% is a common assumption. For shorter horizons or debt funds, use 6–7%. These are assumptions, not guarantees.',
      },
      {
        q: 'Does this account for inflation?',
        a: 'No. If your goal is 10 years away and you want ₹25L in today’s money, inflate the target first (roughly 6% per year) and then run the numbers.',
      },
      {
        q: 'What if I cannot afford the required SIP?',
        a: 'Either extend the timeline, lower the target, or increase what you have already saved. The calculator shows the gap so you can decide which lever to pull.',
      },
    ],
    relatedSlugs: [
      'compound-interest-calculator',
      'retirement-corpus-calculator',
      'savings-rate-calculator',
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  5. Compound interest                                          */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'compound-interest-calculator',
    title: 'Compound interest calculator',
    description:
      'See how a lump sum plus a monthly SIP grows over time, and how much of the final value is growth rather than contributions.',
    category: 'investing',
    updatedAt: '2026-01-15',
    explainer:
      'Compounds monthly. Future value = P × (1 + r)ⁿ + SIP × ((1 + r)ⁿ − 1) ÷ r, where P is the starting amount, SIP the monthly contribution, r the monthly rate, and n the number of months.',
    inputs: [
      {
        name: 'principal',
        label: 'Starting amount',
        unit: '₹',
        default: 100000,
        min: 0,
      },
      {
        name: 'sip',
        label: 'Monthly contribution',
        unit: '₹',
        default: 15000,
        min: 0,
      },
      {
        name: 'years',
        label: 'Years invested',
        unit: 'years',
        default: 15,
        min: 0.5,
        max: 50,
      },
      {
        name: 'ret',
        label: 'Assumed annual return',
        unit: '%',
        default: 10,
        min: 0,
        max: 30,
      },
    ],
    compute: (v) => {
      const principal = nonNeg(v.principal);
      const sip = nonNeg(v.sip);
      const yrs = Math.max(1 / 12, nonNeg(v.years));
      const annual = nonNeg(v.ret);

      const n = yrs * 12;
      const r = annual / 1200;
      const growth = r === 0 ? 1 : Math.pow(1 + r, n);
      const grownPrincipal = principal * growth;
      const grownSip = r === 0 ? sip * n : sip * ((growth - 1) / r);
      const total = grownPrincipal + grownSip;
      const contributed = principal + sip * n;
      const interest = Math.max(0, total - contributed);

      return [
        { label: 'Final value', value: inr(total) },
        { label: 'Total contributed', value: inr(contributed) },
        { label: 'Interest earned', value: inr(interest) },
      ];
    },
    faq: [
      {
        q: 'Is compounding monthly or yearly?',
        a: 'This calculator compounds monthly, which matches most SIPs, recurring deposits, and mutual fund growth curves in India.',
      },
      {
        q: 'What return should I assume?',
        a: 'Use 8–12% for long-term equity, 6–7% for debt funds or FDs. Anything above 12% over decades is optimistic.',
      },
      {
        q: 'How is this different from the SIP calculator?',
        a: 'The SIP calculator works backward from a goal to a required monthly amount. This one works forward from a monthly amount to a final value.',
      },
    ],
    relatedSlugs: [
      'goal-sip-calculator',
      'retirement-corpus-calculator',
      'home-loan-emi-calculator',
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  6. Home loan EMI                                              */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'home-loan-emi-calculator',
    title: 'Home loan EMI calculator',
    description:
      'Calculate your monthly EMI, total interest, and total repayment for a home loan at any rate and tenure.',
    category: 'debt',
    updatedAt: '2026-01-15',
    explainer:
      'EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P is the principal, r the monthly rate (annual ÷ 12 ÷ 100), and n the number of months. Total payment = EMI × n. Total interest = total payment − principal.',
    inputs: [
      {
        name: 'principal',
        label: 'Loan amount',
        unit: '₹',
        default: 5000000,
        min: 0,
      },
      {
        name: 'rate',
        label: 'Annual interest rate',
        unit: '%',
        default: 8.5,
        hint: 'Home loans in India typically sit between 8% and 10%',
        min: 0,
        max: 30,
      },
      {
        name: 'years',
        label: 'Tenure',
        unit: 'years',
        default: 20,
        min: 1,
        max: 40,
      },
    ],
    compute: (v) => {
      const principal = nonNeg(v.principal);
      const annual = nonNeg(v.rate);
      const yrs = Math.max(1 / 12, nonNeg(v.years));

      const n = yrs * 12;
      const r = annual / 1200;

      const emi =
        r === 0
          ? principal / n
          : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

      const total = emi * n;
      const interest = Math.max(0, total - principal);

      return [
        { label: 'Monthly EMI', value: inr(emi) },
        { label: 'Total interest', value: inr(interest) },
        { label: 'Total repayment', value: inr(total) },
        { label: 'Interest as % of loan', value: pct(principal > 0 ? (interest / principal) * 100 : 0) },
      ];
    },
    faq: [
      {
        q: 'What is the EMI formula?',
        a: 'EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P is the principal, r the monthly rate, and n the number of months.',
      },
      {
        q: 'Should I pick a longer tenure?',
        a: 'A longer tenure lowers the monthly EMI but increases total interest paid. Compare total repayment across tenures, not just the EMI.',
      },
      {
        q: 'How does prepayment help?',
        a: 'Prepaying reduces the principal, which shortens the loan or lowers later EMIs. Even one extra EMI per year can cut years off a 20-year loan.',
      },
    ],
    relatedSlugs: [
      'debt-service-ratio-calculator',
      'compound-interest-calculator',
      'net-worth-calculator',
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  7. Retirement corpus                                          */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'retirement-corpus-calculator',
    title: 'Retirement corpus calculator',
    description:
      'Estimate how much you need to save by retirement so your money lasts, after accounting for inflation.',
    category: 'planning',
    updatedAt: '2026-01-15',
    explainer:
      'Monthly expenses are inflated to your retirement year, then multiplied by 12, and finally by a “multiple” (typically 25–30× annual expenses) based on the 4% safe-withdrawal rule. Real return is derived from expected return minus inflation.',
    inputs: [
      {
        name: 'currentAge',
        label: 'Current age',
        unit: 'years',
        default: 30,
        min: 18,
        max: 70,
      },
      {
        name: 'retireAge',
        label: 'Retirement age',
        unit: 'years',
        default: 60,
        min: 30,
        max: 80,
      },
      {
        name: 'expense',
        label: 'Monthly expenses today',
        unit: '₹',
        default: 70000,
        min: 0,
      },
      {
        name: 'inflation',
        label: 'Expected inflation',
        unit: '%',
        default: 6,
        hint: '6–7% is a reasonable long-term assumption for India',
        min: 0,
        max: 15,
      },
      {
        name: 'multiple',
        label: 'Corpus multiple',
        unit: 'years',
        default: 30,
        hint: '25–30× annual expenses (4% rule)',
        min: 15,
        max: 50,
      },
    ],
    compute: (v) => {
      const currentAge = nonNeg(v.currentAge);
      const retireAge = Math.max(currentAge + 1, nonNeg(v.retireAge));
      const expense = nonNeg(v.expense);
      const infl = nonNeg(v.inflation);
      const multiple = Math.max(1, nonNeg(v.multiple));

      const yrs = retireAge - currentAge;
      const futureMonthly = expense * Math.pow(1 + infl / 100, yrs);
      const futureAnnual = futureMonthly * 12;
      const corpus = futureAnnual * multiple;

      return [
        { label: 'Years to retirement', value: years(yrs) },
        { label: 'Monthly expenses at retirement', value: inr(futureMonthly) },
        { label: 'Corpus needed', value: inr(corpus) },
      ];
    },
    faq: [
      {
        q: 'How much do I need to retire?',
        a: 'A common rule is 25–30× your annual expenses at retirement, adjusted for inflation. The exact number depends on your lifestyle, longevity, and how your savings are invested.',
      },
      {
        q: 'What inflation should I assume?',
        a: '6% is a reasonable long-term assumption for India. Conservative planners use 7% to account for medical inflation running hotter than the headline rate.',
      },
      {
        q: 'Does this include EPF, NPS, or pension?',
        a: 'This calculator shows the corpus you need. Subtract any EPF, NPS, or pension you will receive to get your personal gap.',
      },
    ],
    relatedSlugs: [
      'goal-sip-calculator',
      'compound-interest-calculator',
      'savings-rate-calculator',
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  /*  8. Net worth                                                  */
  /* ────────────────────────────────────────────────────────────── */
  {
    slug: 'net-worth-calculator',
    title: 'Net worth calculator',
    description:
      'Add up what you own, subtract what you owe, and see the number that actually tracks your financial progress.',
    category: 'planning',
    updatedAt: '2026-01-15',
    explainer:
      'Net worth = total assets − total liabilities. Count assets at realistic sale value (not the highest quote you once saw) and liabilities at the outstanding principal (not the original loan amount).',
    inputs: [
      {
        name: 'cash',
        label: 'Cash and bank balances',
        unit: '₹',
        default: 200000,
        min: 0,
      },
      {
        name: 'investments',
        label: 'Investments',
        unit: '₹',
        default: 1500000,
        hint: 'Mutual funds, stocks, EPF, NPS, FDs, gold',
        min: 0,
      },
      {
        name: 'property',
        label: 'Property and other assets',
        unit: '₹',
        default: 6000000,
        hint: 'Use a realistic market value, not peak valuations',
        min: 0,
      },
      {
        name: 'loans',
        label: 'Outstanding loans',
        unit: '₹',
        default: 3500000,
        hint: 'Only the principal still owed, not the original amount',
        min: 0,
      },
      {
        name: 'cards',
        label: 'Credit card dues and other debts',
        unit: '₹',
        default: 50000,
        min: 0,
      },
    ],
    compute: (v) => {
      const assets = nonNeg(v.cash) + nonNeg(v.investments) + nonNeg(v.property);
      const liabilities = nonNeg(v.loans) + nonNeg(v.cards);
      const netWorth = assets - liabilities;
      const leverage = assets > 0 ? (liabilities / assets) * 100 : 0;

      const verdict =
        netWorth > 0
          ? badge('Positive', 'good')
          : netWorth === 0
            ? badge('Break-even', 'warn')
            : badge('Negative', 'bad');

      return [
        { label: 'Total assets', value: inr(assets) },
        { label: 'Total liabilities', value: inr(liabilities) },
        { label: 'Net worth', value: inr(netWorth), badge: verdict },
        {
          label: 'Liabilities as % of assets',
          value: pct(leverage),
        },
      ];
    },
    faq: [
      {
        q: 'What should I count as assets?',
        a: 'Cash, bank balances, investments at current value, and property at a realistic market value. Do not inflate property — use a value you could actually sell at within three months.',
      },
      {
        q: 'How do I handle my home loan?',
        a: 'Count the outstanding principal as a liability, not the total loan amount. Only the amount you still owe matters.',
      },
      {
        q: 'What if my net worth is negative?',
        a: 'This is common for young borrowers with a home loan. What matters is the trend — is the number rising each quarter as you pay down debt and build investments?',
      },
    ],
    relatedSlugs: [
      'emergency-fund-calculator',
      'debt-service-ratio-calculator',
      'savings-rate-calculator',
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════ */
/*  Selectors                                                         */
/* ══════════════════════════════════════════════════════════════════ */

export const getCalc = (slug: string): Calc | undefined =>
  CALCULATORS.find((c) => c.slug === slug);

/**
 * Related calculators for a given slug.
 * Order: explicit `relatedSlugs` → same category → everything else.
 * Never returns the input calculator itself.
 */
export const getRelated = (slug: string, limit = 3): Calc[] => {
  const current = getCalc(slug);
  if (!current) return CALCULATORS.slice(0, limit);

  const seen = new Set<string>([slug]);
  const out: Calc[] = [];

  // 1. Explicit related
  for (const s of current.relatedSlugs) {
    if (out.length >= limit) break;
    if (seen.has(s)) continue;
    const c = getCalc(s);
    if (c) {
      seen.add(s);
      out.push(c);
    }
  }

  // 2. Same category
  if (out.length < limit) {
    for (const c of CALCULATORS) {
      if (out.length >= limit) break;
      if (seen.has(c.slug)) continue;
      if (c.category === current.category) {
        seen.add(c.slug);
        out.push(c);
      }
    }
  }

  // 3. Everything else
  if (out.length < limit) {
    for (const c of CALCULATORS) {
      if (out.length >= limit) break;
      if (seen.has(c.slug)) continue;
      seen.add(c.slug);
      out.push(c);
    }
  }

  return out;
};

/** Group calculators by category — handy for indexes. */
export const getCalcsByCategory = (): Record<CalcCategory, Calc[]> => {
  return CALCULATORS.reduce(
    (acc, c) => {
      (acc[c.category] ??= []).push(c);
      return acc;
    },
    {} as Record<CalcCategory, Calc[]>,
  );
};

/** Human-readable category labels. */
export const CATEGORY_LABELS: Record<CalcCategory, string> = {
  planning: 'Planning',
  savings: 'Savings',
  debt: 'Debt',
  investing: 'Investing',
};