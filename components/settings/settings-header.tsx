'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SettingsRoutes {
  title: string;
  url: string;
}

const navTabs: SettingsRoutes[] = [
  {
    title: 'Profile',
    url: '/settings/profile',
  },
  // {
  //   title: 'Tags',
  //   url: '/settings/tags',
  // },
  {
    title: 'API',
    url: '/settings/api',
  },
];

export default function SettingsHeader() {
  const pathname = usePathname();

  return (
    <div className="-mt-3 space-x-5 text-sm">
      {navTabs.map((tab, index) => {
        return (
          <Link
            href={tab.url}
            key={index}
            className={cn(
              pathname === tab.url
                ? 'border-b-muted-foreground'
                : 'text-muted-foreground',
              'text-md font-lg whitespace-nowrap',
            )}
          >
            <Badge
              className="inline-block min-w-32 rounded-xl p-2 text-center"
              variant={pathname === tab.url ? 'secondary' : 'outline'}
            >
              {tab.title}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
