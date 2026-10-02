import type { Metadata } from 'next';
import { SITE } from './site';

export function buildMetadata(o: { title: string; description: string; path: string; type?: 'website' | 'article'; publishedTime?: string; noindex?: boolean }): Metadata {
  const url = SITE.url + o.path;
  return {
    title: o.title, description: o.description,
    alternates: { canonical: url },
    robots: o.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title: o.title, description: o.description, url, siteName: SITE.name, locale: SITE.locale, type: o.type ?? 'website', ...(o.publishedTime ? { publishedTime: o.publishedTime } : {}) },
    twitter: { card: 'summary_large_image', title: o.title, description: o.description },
  };
}
export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE.url + it.path })),
});
