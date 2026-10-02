import type { Metadata } from 'next';
import { Shell } from '@/components/app/Shell';
export const metadata: Metadata = { robots: { index: false, follow: false }, title: { default: 'FinSight', template: '%s | FinSight' } };
export default function AppLayout({ children }: { children: React.ReactNode }) { return <Shell>{children}</Shell>; }
