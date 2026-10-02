export interface CalcInput { name: string; label: string; unit: '₹' | 'months' | '%' | 'years'; default: number }
export interface CalcOutput { label: string; value: string }
export interface Calc { slug: string; title: string; description: string; inputs: CalcInput[]; compute: (v: Record<string, number>) => CalcOutput[]; explainer: string }
const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

export const CALCULATORS: Calc[] = [
  { slug: 'emergency-fund-calculator', title: 'Emergency fund calculator', description: 'Find out how many months of essential expenses your savings cover and how much more you need.',
    explainer: 'Months covered = liquid savings ÷ essential monthly expenses. Essential expenses are the bills you must pay even if income stops.',
    inputs: [{ name: 'essential', label: 'Essential monthly expenses', unit: '₹', default: 45000 }, { name: 'savings', label: 'Liquid savings', unit: '₹', default: 180000 }, { name: 'target', label: 'Target months', unit: 'months', default: 6 }],
    compute: (v) => { const m = v.essential! > 0 ? v.savings! / v.essential! : NaN; return [
      { label: 'Months covered', value: isFinite(m) ? m.toFixed(1) : 'Enter essential expenses' },
      { label: 'Target fund', value: inr(v.essential! * v.target!) },
      { label: 'Shortfall', value: inr(Math.max(0, v.essential! * v.target! - v.savings!)) }]; } },
  { slug: 'savings-rate-calculator', title: 'Savings rate calculator', description: 'Calculate the share of your monthly income that you keep after spending.',
    explainer: 'Savings rate = (income − expenses) ÷ income × 100. Use regular monthly income and regular spending.',
    inputs: [{ name: 'income', label: 'Monthly income', unit: '₹', default: 85000 }, { name: 'expenses', label: 'Monthly expenses incl. EMIs', unit: '₹', default: 61000 }],
    compute: (v) => [{ label: 'Monthly surplus', value: inr(v.income! - v.expenses!) }, { label: 'Savings rate', value: v.income! > 0 ? ((v.income! - v.expenses!) / v.income! * 100).toFixed(1) + '%' : 'Enter income' }] },
  { slug: 'debt-service-ratio-calculator', title: 'Debt-service ratio calculator', description: 'See what percentage of your income goes toward EMIs and loan payments.',
    explainer: 'Debt-service ratio = monthly debt payments ÷ monthly income × 100.',
    inputs: [{ name: 'income', label: 'Monthly income', unit: '₹', default: 85000 }, { name: 'emi', label: 'Total monthly EMIs and card dues', unit: '₹', default: 28000 }],
    compute: (v) => [{ label: 'Debt-service ratio', value: v.income! > 0 ? (v.emi! / v.income! * 100).toFixed(1) + '%' : 'Enter income' }, { label: 'Left after debt payments', value: inr(v.income! - v.emi!) }] },
  { slug: 'goal-sip-calculator', title: 'Goal SIP calculator', description: 'Estimate the monthly amount needed to reach a goal, under an assumed return. Illustrative only.',
    explainer: 'Uses monthly compounding: required = (target − current × (1+r)ⁿ) × r ÷ ((1+r)ⁿ − 1), where r is the monthly rate and n the months. Returns are assumptions, not promises.',
    inputs: [{ name: 'target', label: 'Goal amount', unit: '₹', default: 2500000 }, { name: 'current', label: 'Already saved', unit: '₹', default: 200000 }, { name: 'years', label: 'Years to goal', unit: 'years', default: 10 }, { name: 'ret', label: 'Assumed annual return', unit: '%', default: 8 }],
    compute: (v) => { const n = Math.max(1, v.years! * 12), r = v.ret! / 1200; const g = r === 0 ? 1 : Math.pow(1 + r, n);
      const gap = Math.max(0, v.target! - v.current! * g); const sip = r === 0 ? gap / n : (gap * r) / (g - 1);
      return [{ label: 'Needed per month', value: inr(sip) }, { label: 'Savings grown at assumed return', value: inr(v.current! * g) }]; } },
];
export const getCalc = (slug: string) => CALCULATORS.find((c) => c.slug === slug);
