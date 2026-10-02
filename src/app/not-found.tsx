import Link from 'next/link';
export default function NotFound() {
  return (<main id="main" className="mx-auto max-w-xl px-5 py-24 text-center"><h1 className="text-4xl font-bold">Page not found</h1>
    <p className="mt-3">The page you want does not exist or has moved.</p><Link href="/" className="btn-primary mt-6">Go to home</Link></main>);
}
