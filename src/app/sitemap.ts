import type { MetadataRoute } from 'next';
import { CALCULATORS } from '@/lib/content/calculators';
import { FEATURES } from '@/lib/content/features';
import { POSTS } from '@/lib/content/blog';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const fixed = ['', '/features', '/how-it-works', '/calculators', '/blog', '/faq', '/about', '/privacy', '/terms'];
  return [
    ...fixed.map((p) => ({ url: SITE.url + p, lastModified: now, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })),
    ...FEATURES.map((f) => ({ url: `${SITE.url}/features/${f.slug}`, lastModified: now, priority: 0.8 })),
    ...CALCULATORS.map((c) => ({ url: `${SITE.url}/calculators/${c.slug}`, lastModified: now, priority: 0.9 })),
    ...POSTS.map((p) => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 })),
  ];
}
