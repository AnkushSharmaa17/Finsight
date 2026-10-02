import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (<main id="main" className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
    <Link href="/" className="mb-6 font-display text-2xl font-bold">FinSight</Link>{children}</main>);
}
