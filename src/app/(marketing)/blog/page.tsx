import Link from 'next/link';
import { POSTS } from '@/lib/content/blog';
import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({ title: 'Money guides', description: 'Plain-language guides on emergency funds, savings rate, debt and goal planning for India.', path: '/blog' });

export default function Blog() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl font-bold">Money guides</h1>
      <ul className="mt-8 space-y-4">{POSTS.map((p) => (
        <li key={p.slug} className="panel"><h2 className="text-xl font-bold"><Link href={`/blog/${p.slug}`} className="hover:text-leaf">{p.title}</Link></h2>
          <p className="mt-1 text-sm text-ink/70">{new Date(p.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}, {p.readMins} min read</p>
          <p className="mt-2">{p.description}</p></li>))}</ul>
    </div>
  );
}
