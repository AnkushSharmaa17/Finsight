import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/marketing/JsonLd';
import { FEATURES, getFeature } from '@/lib/content/features';
import { breadcrumbLd, buildMetadata } from '@/lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => FEATURES.map((f) => ({ slug: f.slug }));
export function generateMetadata({ params }: { params: { slug: string } }) {
  const f = getFeature(params.slug);
  return f ? buildMetadata({ title: f.title, description: f.description, path: `/features/${f.slug}` }) : {};
}

export default function FeaturePage({ params }: { params: { slug: string } }) {
  const f = getFeature(params.slug);
  if (!f) notFound();
  const others = FEATURES.filter((x) => x.slug !== f.slug).slice(0, 3);
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Features', path: '/features' }, { name: f.title, path: `/features/${f.slug}` }])} />
      <nav aria-label="Breadcrumb" className="text-sm"><Link href="/features" className="underline">Features</Link></nav>
      <h1 className="mt-3 text-4xl font-bold">{f.title}</h1>
      <p className="mt-4 text-lg">{f.description}</p>
      <h2 className="mt-10 text-2xl font-bold">What you can do</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6">{f.points.map((p) => <li key={p}>{p}</li>)}</ul>
      <Link href="/register" className="btn-primary mt-8">Try {f.title.toLowerCase()}</Link>
      <h2 className="mt-14 text-xl font-bold">Related</h2>
      <ul className="mt-3 space-y-2">{others.map((o) => <li key={o.slug}><Link className="underline" href={`/features/${o.slug}`}>{o.title}</Link>: {o.short}</li>)}</ul>
    </article>
  );
}
