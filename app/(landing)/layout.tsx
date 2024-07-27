'use client';

import Github from '@/components/icons/github';
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
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="container">
        <div className="flex pt-20 pb-5 items-center justify-between">
          <div className="flex items-center text-base">
            <p className="text-muted-foreground">
              Proudly built in open source by&nbsp;
            </p>
            <Link
              className="font-medium"
              href="https://github.com/Zac-Zajdel"
              target="_blank"
              prefetch={false}
            >
              Zac Zajdel
            </Link>
          </div>
          <div className="space-x-3">
            <Button
              variant="outline"
              size="icon"
            >
              <Link
                href="https://github.com/Zac-Zajdel/bookmark-oasis"
                target="_blank"
                prefetch={false}
              >
                <Github />
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </footer>
    </div>
  );
}
