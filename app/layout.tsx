import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const metadata: Metadata = {
  metadataBase: new URL('https://diceborn.app'),
  title: {
    default: 'Diceborn — Every Roll Begins a Story',
    template: '%s | Diceborn',
  },
  description: 'Create cinematic fantasy characters for campaigns, concept art, and stories.',
  applicationName: 'Diceborn',
  keywords: ['Diceborn', 'fantasy character generator', 'D&D character generator', 'concept art prompt generator'],
  openGraph: {
    title: 'Diceborn — Every Roll Begins a Story',
    description: 'Create cinematic fantasy characters for campaigns, concept art, and stories.',
    siteName: 'Diceborn',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diceborn — Every Roll Begins a Story',
    description: 'Create cinematic fantasy characters for campaigns, concept art, and stories.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
  themeColor: '#08111f',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content" className="site-main" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
