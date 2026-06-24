import Link from 'next/link';
import { BrandMark } from '@/components/brand/BrandMark';
import { Button } from '@/components/ui/Button';

const navItems = [
  { href: '/generate', label: 'Generate' },
  { href: '/collection', label: 'Collection' },
  { href: '/#discover', label: 'How It Works' },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="header-nav" aria-label="Primary navigation">
        <BrandMark />
        <div className="nav-links" aria-label="Main links">
          {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </div>
        <Button asChild variant="primary"><Link href="/generate">Create Character</Link></Button>
        <details className="mobile-menu">
          <summary aria-label="Open navigation menu">Menu</summary>
          <div className="mobile-menu__panel">
            {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <Link href="/generate">Create Character</Link>
          </div>
        </details>
      </nav>
    </header>
  );
}
