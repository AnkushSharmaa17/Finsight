import Link from 'next/link';
import { FEATURES } from '@/lib/content/features';
import { SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-white">{SITE.name}</p>
          <p className="mt-2 text-sm">{SITE.tagline}.</p>
        </div>
        <nav aria-label="Features"><p className="mb-2 font-semibold text-white">Features</p>
          <ul className="space-y-1 text-sm">{FEATURES.slice(0, 5).map((f) => <li key={f.slug}><Link href={`/features/${f.slug}`}>{f.title}</Link></li>)}</ul></nav>
        <nav aria-label="Learn"><p className="mb-2 font-semibold text-white">Learn</p>
          <ul className="space-y-1 text-sm"><li><Link href="/calculators">Calculators</Link></li><li><Link href="/blog">Guides</Link></li><li><Link href="/faq">FAQ</Link></li><li><Link href="/how-it-works">How it works</Link></li></ul></nav>
        <nav aria-label="Company"><p className="mb-2 font-semibold text-white">Company</p>
          <ul className="space-y-1 text-sm"><li><Link href="/about">About</Link></li><li><Link href="/privacy">Privacy</Link></li><li><Link href="/terms">Terms</Link></li></ul></nav>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-8 text-xs text-white/60">FinSight provides educational information, not investment, tax or legal advice. Projections are illustrative and not guaranteed.</p>
    </footer>
  );
}
