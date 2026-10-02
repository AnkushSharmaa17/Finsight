import { notFound } from 'next/navigation';
import { ResourceManager } from '@/components/app/ResourceManager';
import { FINANCIAL_TYPES, RESOURCES } from '@/lib/resources';

export const dynamicParams = false;
export const generateStaticParams = () => FINANCIAL_TYPES.map((type) => ({ type }));
export function generateMetadata({ params }: { params: { type: string } }) { return { title: RESOURCES[params.type]?.title ?? 'Financials' }; }

export default function Financials({ params }: { params: { type: string } }) {
  const resource = (FINANCIAL_TYPES as readonly string[]).includes(params.type) ? RESOURCES[params.type] : undefined;
  if (!resource) notFound();
  return <ResourceManager resource={resource} />;
}
