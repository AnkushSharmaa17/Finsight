import { JsonLd } from '@/components/marketing/JsonLd';
import { FAQ } from '@/lib/content/faq';
import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({ title: 'FAQ', description: 'Answers about FinSight: advice boundaries, data privacy, AI use, calculations and account deletion.', path: '/faq' });

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
      <h1 className="text-4xl font-bold">Frequently asked questions</h1>
      <div className="mt-8 space-y-3">{FAQ.map((f) => (
        <details key={f.q} className="panel"><summary className="cursor-pointer font-semibold">{f.q}</summary><p className="mt-3">{f.a}</p></details>))}</div>
    </div>
  );
}
