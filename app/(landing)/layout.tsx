'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import Link from 'next/link';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex flex-col">
      <header className="container">
        <div className="flex h-20 items-center justify-between">
          <h1 className="text-xl font-bold">Bookmark Oasis</h1>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
