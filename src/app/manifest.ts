import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
export default function manifest(): MetadataRoute.Manifest {
  return { name: SITE.name, short_name: SITE.name, description: SITE.description, start_url: '/dashboard', display: 'standalone', background_color: '#F3F6F5', theme_color: '#13283C' };
}
