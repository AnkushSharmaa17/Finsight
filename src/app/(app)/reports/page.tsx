'use client';
import Link from 'next/link';
import { useApi } from '@/lib/useApi';

export default function Reports() {
  const { data, error, loading } = useApi<any[]>('reports');
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">Reports</h1>
      {loading && <p className="mt-4">Loading…</p>}{error && <p role="alert" className="mt-4 text-ember">{error.message}</p>}
      {data?.length === 0 && <p className="panel mt-4">No reports yet. Generate one from the <Link className="underline" href="/dashboard">dashboard</Link>.</p>}
      <ul className="mt-6 space-y-3">{data?.map((r) => (
        <li key={r._id} className="panel"><Link className="font-semibold underline" href={`/reports/${r._id}`}>Report from {new Date(r.createdAt).toLocaleString('en-IN')}</Link>
          <p className="mt-1 text-sm">{r.content?.summary}</p></li>))}</ul>
    </div>
  );
}
