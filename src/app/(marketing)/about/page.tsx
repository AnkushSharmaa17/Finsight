import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({ title: 'About FinSight', description: 'Why FinSight exists and what it will not do.', path: '/about' });
export default function Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-5 py-16">
      <h1 className="text-4xl font-bold">About FinSight</h1>
      <p>FinSight helps people in India see income, spending, debt, assets and goals as one picture, then test decisions before making them.</p>
      <p>We keep calculations in tested code, explain results in plain language, and stay on the educational side of the line: no stock tips, no promised returns.</p>
    </div>
  );
}
