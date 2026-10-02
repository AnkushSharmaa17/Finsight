import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({ title: 'Terms of use', description: 'Terms for using the FinSight platform.', path: '/terms' });
export default function Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-5 py-16">
      <h1 className="text-4xl font-bold">Terms of use</h1>
      <p>This is a placeholder. Replace it with reviewed terms. FinSight is educational and is not investment, tax or legal advice.</p>
    </div>
  );
}
