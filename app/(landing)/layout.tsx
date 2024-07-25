'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex flex-col">
      <motion.div
        className="mx-20"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.2,
          delay: 0.2,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <header className="container">
          <div className="flex h-20 items-center justify-between">
            <h1 className="text-xl tracking-wide font-medium">
              Bookmark Oasis
            </h1>
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
      </motion.div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
