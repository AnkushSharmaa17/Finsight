import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata({ title: 'Privacy notice', description: 'How FinSight handles your personal and financial data.', path: '/privacy' });
export default function Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-5 py-16">
      <h1 className="text-4xl font-bold">Privacy notice</h1>
      <p>This is a placeholder. Replace it with a reviewed notice covering purpose, AI and cloud processing, retention, your rights to export and delete, and grievance contact, aligned with the DPDP Act, 2023 and Rules, 2025.</p>
      <p>FinSight never asks for bank passwords, UPI PINs or card CVVs.</p>
    </div>
  );
}
