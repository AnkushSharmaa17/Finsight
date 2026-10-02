export const inr = (minor: number | null | undefined) =>
  minor == null ? '—' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(minor / 100);
export const toMinor = (rupees: number) => Math.round(rupees * 100);
export const pct = (n: number | null | undefined) => (n == null ? 'n/a' : `${n}%`);
