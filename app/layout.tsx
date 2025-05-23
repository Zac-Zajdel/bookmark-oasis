import { ClientSessionProvider } from '@/components/providers/client-session-provider';
import { ReactQueryClientProvider } from '@/components/providers/react-query-client-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import Navbar from '@/components/ui/navbar';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const META_URL =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https://www.bookmarkoasis.com';

export const metadata: Metadata = {
  metadataBase: new URL(META_URL),
  title: 'Bookmark Oasis',
  description:
    'Organize, manage, and access your favorite links all in one place.',
  applicationName: 'Bookmark Oasis',
  authors: [{ name: 'Zac', url: 'https://www.zaczajdel.com/' }],
  keywords: ['Tools', 'Bookmarks', 'Browser'],
  openGraph: {
    title: 'Bookmark Oasis',
    description:
      'Organize, manage, and access your favorite links all in one place.',
    siteName: 'Bookmark Oasis',
    images: '/android-chrome-192x192.png',
    url: 'https://www.bookmarkoasis.com/',
  },
  twitter: {
    title: 'Bookmark Oasis',
    description:
      'Organize, manage, and access your favorite links all in one place.',
    creator: '@zac_zajdel',
  },
  icons: [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: `${META_URL}/favicon-32x32.png`,
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: `${META_URL}/favicon-16x16.png`,
    },
  ],
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <ClientSessionProvider>
        <html
          lang="en"
          suppressHydrationWarning
        >
          <body
            className={cn(
              'bg-background min-h-screen font-sans antialiased',
              fontSans.variable,
            )}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main className="min-h-screen">
                <Navbar />
                {children}
              </main>
              <Analytics />
              <Toaster
                richColors
                closeButton
                toastOptions={{
                  duration: 3000,
                }}
              />
              <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
          </body>
        </html>
      </ClientSessionProvider>
    </ReactQueryClientProvider>
  );
}
