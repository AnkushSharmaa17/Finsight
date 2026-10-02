import type { Metadata, Viewport } from 'next';
import './globals.css';
import { JsonLd } from '@/components/marketing/JsonLd';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { siteName: SITE.name, locale: SITE.locale, type: 'website' },
  alternates: { canonical: SITE.url },
};
export const viewport: Viewport = { themeColor: '#13283C', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:p-2">Skip to content</a>
        <JsonLd data={[
          { '@context': 'https://schema.org', '@type': 'Organization', name: SITE.name, url: SITE.url },
          { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url, inLanguage: 'en-IN' },
        ]} />
        {children}
      </body>
    </html>
  );
}