import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'ASHOKA INTERNATIONAL | Secure Your Future | Nizamabad Corporate Office',
  description: 'Ashoka International is a premier corporate office and international placement agency in Subhash Nagar, Nizamabad. LGBTQ+ friendly corporate placement and global operational excellence.',
  keywords: ['Ashoka International', 'Secure Your Future', 'Nizamabad Corporate Office', 'Placement Agency Telangana', 'LGBTQ Friendly Jobs'],
  authors: [{ name: 'Ashoka International' }],
  openGraph: {
    title: 'ASHOKA INTERNATIONAL | Secure Your Future',
    description: 'Premier Corporate Office & Career Placement Hub in Nizamabad, Telangana.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased bg-sky-950 text-white min-h-screen">
        <ErrorBoundary>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
