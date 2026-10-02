import Link from 'next/link';
import { FEATURES } from '@/lib/content/features';
import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({ title: 'Features', description: 'Cash flow, net worth, debt, emergency fund, goals and scenarios. See what FinSight does.', path: '/features' });

export default function Features() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-bold">What FinSight does</h1>
      <p className="mt-3 max-w-prose text-lg">Seven tools built on one connected model of your finances.</p>
      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {FEATURES.map((f) => (
          <li key={f.slug} className="panel"><h2 className="text-xl font-bold"><Link href={`/features/${f.slug}`} className="hover:text-leaf">{f.title}</Link></h2>
            <p className="mt-2">{f.description}</p></li>
        ))}
      </ul>
    </div>
  );
}
