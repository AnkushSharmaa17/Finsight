import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ResourceManager } from '@/components/app/ResourceManager';
import { FINANCIAL_TYPES, getResource } from '@/lib/resources';
import { buildMetadata } from '@/lib/seo';

/* ────────────────────────────────────────────────────────────────── */
/*  Static generation                                                 */
/* ────────────────────────────────────────────────────────────────── */

export const dynamicParams = false;

export const generateStaticParams = () =>
  FINANCIAL_TYPES.map((type) => ({ type }));

/* ────────────────────────────────────────────────────────────────── */
/*  Metadata                                                          */
/* ────────────────────────────────────────────────────────────────── */

export function generateMetadata({
  params,
}: {
  params: { type: string };
}) {
  const resource = getResource(params.type);
  if (!resource) return {};

  /* Merge robots AFTER buildMetadata so it can't be overwritten. */
  return {
    ...buildMetadata({
      title: resource.title,
      description: resource.hint,
      path: `/financials/${params.type}`,
    }),
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

/* ────────────────────────────────────────────────────────────────── */
/*  Page                                                              */
/* ────────────────────────────────────────────────────────────────── */

export default function Financials({
  params,
}: {
  params: { type: string };
}) {
  const resource = getResource(params.type);
  if (!resource) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-5 sm:py-8 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <li>
            <Link
              href="/dashboard"
              className="rounded transition-colors hover:text-leaf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2"
            >
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-300">
            /
          </li>
          <li
            aria-current="page"
            className="min-w-0 truncate font-medium text-slate-700"
          >
            {resource.title}
          </li>
        </ol>
      </nav>

      <ResourceManager resource={resource} />
    </main>
  );
}