import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calculator } from '@/components/marketing/Calculator';
import { JsonLd } from '@/components/marketing/JsonLd';
import { CALCULATORS, getCalc } from '@/lib/content/calculators';
import { breadcrumbLd, buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => CALCULATORS.map((c) => ({ slug: c.slug }));
export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = getCalc(params.slug);
  return c ? buildMetadata({ title: c.title, description: c.description, path: `/calculators/${c.slug}` }) : {};
}

export default function CalculatorPage({ params }: { params: { slug: string } }) {
  const c = getCalc(params.slug);
  if (!c) notFound();
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <JsonLd data={[
        { '@context': 'https://schema.org', '@type': 'WebApplication', name: c.title, description: c.description, url: `${SITE.url}/calculators/${c.slug}`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' } },
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Calculators', path: '/calculators' }, { name: c.title, path: `/calculators/${c.slug}` }]),
      ]} />
      <Link href="/calculators" className="text-sm underline">All calculators</Link>
      <h1 className="mt-3 text-4xl font-bold">{c.title}</h1>
      <p className="mt-3 max-w-prose text-lg">{c.description}</p>
      <div className="mt-8"><Calculator slug={c.slug} /></div>
      <h2 className="mt-12 text-2xl font-bold">How it is calculated</h2>
      <p className="mt-2 max-w-prose">{c.explainer}</p>
      <p className="mt-6 text-sm text-ink/70">Results are illustrative and not financial advice.</p>
      <Link href="/register" className="btn-primary mt-6">Save this in your FinSight report</Link>
    </div>
  );
}
