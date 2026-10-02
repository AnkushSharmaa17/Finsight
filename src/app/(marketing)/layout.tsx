import { Footer } from '@/components/marketing/Footer';
import { Header } from '@/components/marketing/Header';
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (<><Header /><main id="main">{children}</main><Footer /></>);
}
