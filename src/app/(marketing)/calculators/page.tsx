import Link from 'next/link';
import { CALCULATORS } from '@/lib/content/calculators';
import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({ title: 'Free money calculators', description: 'Emergency fund, savings rate, debt-service ratio and goal SIP calculators in INR. No sign-up needed.', path: '/calculators' });

export default function Calculators() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-bold">Free money calculators</h1>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">{CALCULATORS.map((c) => (
        <li key={c.slug} className="panel"><h2 className="text-xl font-bold"><Link href={`/calculators/${c.slug}`} className="hover:text-leaf">{c.title}</Link></h2><p className="mt-2">{c.description}</p></li>))}</ul>
    </div>
  );
}
