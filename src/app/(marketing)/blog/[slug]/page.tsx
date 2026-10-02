import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/marketing/JsonLd';
import { POSTS, getPost } from '@/lib/content/blog';
import { breadcrumbLd, buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => POSTS.map((p) => ({ slug: p.slug }));
export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  return p ? buildMetadata({ title: p.title, description: p.description, path: `/blog/${p.slug}`, type: 'article', publishedTime: p.date }) : {};
}

export default function Post({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) notFound();
  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <JsonLd data={[
        { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, datePublished: p.date, author: { '@type': 'Organization', name: SITE.name }, publisher: { '@type': 'Organization', name: SITE.name }, mainEntityOfPage: `${SITE.url}/blog/${p.slug}` },
        breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }]),
      ]} />
      <Link href="/blog" className="text-sm underline">All guides</Link>
      <h1 className="mt-3 text-4xl font-bold">{p.title}</h1>
      <p className="mt-2 text-sm text-ink/70"><time dateTime={p.date}>{new Date(p.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</time>, {p.readMins} min read</p>
      <div className="mt-8 space-y-4 text-lg leading-relaxed">
        {p.body.map((b, i) => (<section key={i}>{b.h && <h2 className="mb-2 text-2xl font-bold">{b.h}</h2>}<p>{b.p}</p></section>))}
      </div>
      <p className="mt-10 text-sm text-ink/70">Educational information only, not financial advice.</p>
      <Link href="/calculators" className="btn-primary mt-6">Try the calculators</Link>
    </article>
  );
}
