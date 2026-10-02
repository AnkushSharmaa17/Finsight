'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const LINKS = [
  ['/dashboard', 'Dashboard'], ['/financials/income', 'Income'], ['/financials/expenses', 'Expenses'], ['/financials/liabilities', 'Liabilities'],
  ['/financials/assets', 'Assets'], ['/financials/investments', 'Investments'], ['/goals', 'Goals'], ['/scenarios', 'Scenarios'], ['/reports', 'Reports'], ['/profile', 'Profile'],
];
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const router = useRouter();
  async function logout() { await api('auth/logout', { method: 'POST' }).catch(() => null); router.replace('/login'); router.refresh(); }
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-line bg-white md:min-h-screen md:w-56 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-4 py-3 md:block">
          <Link href="/dashboard" className="font-display text-xl font-bold">FinSight</Link>
        </div>
        <nav aria-label="App" className="flex gap-1 overflow-x-auto px-2 pb-2 md:block md:space-y-1 md:pb-0">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}
              className={`block whitespace-nowrap rounded-md px-3 py-2 text-sm ${path === href ? 'bg-mist font-semibold' : 'hover:bg-mist'}`}>{label}</Link>))}
          <button onClick={logout} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-mist">Sign out</button>
        </nav>
      </aside>
      <main id="main" className="flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}
