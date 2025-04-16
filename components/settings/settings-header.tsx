'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SettingsRoutes {
  title: string;
  url: string;
  active: boolean;
}

const navTabs: SettingsRoutes[] = [
  {
    title: 'Profile',
    url: '/settings/profile',
    active: true,
  },
  {
    title: 'API',
    url: '/settings/api',
    active: false,
  },
];

export default function SettingsHeader() {
  const pathname = usePathname();

  return (
    <div className="space-x-3 text-sm">
      {navTabs.map((tab, index) => {
        return (
          <Link
            href={tab.url}
            key={index}
            className={cn(
              pathname === tab.url
                ? 'border-b-muted-foreground border-b-2'
                : 'text-muted-foreground',
              'text-md font-lg px-1 pb-4 whitespace-nowrap',
            )}
          >
            {tab.title}
          </Link>
        );
      })}
    </div>
  );
}
