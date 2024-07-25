import { ClientSessionProvider } from '@/components/providers/client-session-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Bookmark Oasis',
  description: 'A better way to organize links',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientSessionProvider>
      <html
        lang="en"
        suppressHydrationWarning
      >
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable,
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClientSessionProvider>
  );
}
