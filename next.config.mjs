/** @type {import('next').NextConfig} */
const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';
export default {
  poweredByHeader: false,
  reactStrictMode: true,
  // Proxy /api/* to Express so the auth cookie stays first-party (same-site) in every environment.
  async rewrites() { return [{ source: '/api/:path*', destination: `${BACKEND}/api/v1/:path*` }]; },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ] }];
  },
};
