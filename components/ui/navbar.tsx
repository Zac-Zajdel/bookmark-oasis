'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (['/', '/login', '/signup'].includes(pathname)) return;

  return (
    <nav>
      <div className="mx-auto border-b px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-12 items-center justify-between">
          <div className="flex flex-1 items-center sm:items-center sm:justify-start">
            <div className="hidden shrink-0 items-center sm:block">
              <Link
                href="/dashboard"
                prefetch={false}
              >
                <h1 className="mr-4 text-lg font-bold">Bookmark Oasis</h1>
              </Link>
            </div>
            <div className="ml-4 flex items-center justify-between">
              <div className="space-x-5">
                <Link
                  href="/folders"
                  prefetch={false}
                  className={cn(
                    pathname.includes('/folders')
                      ? 'border-b-muted-foreground border-b-2 dark:border-b-white'
                      : 'text-muted-foreground',
                    'px-2 pb-[0.90rem] text-sm font-medium whitespace-nowrap',
                  )}
                >
                  Folders
                </Link>
                <Link
                  href="/bookmarks"
                  prefetch={false}
                  className={cn(
                    pathname.includes('/bookmarks')
                      ? 'border-b-muted-foreground border-b-2 dark:border-b-white'
                      : 'text-muted-foreground',
                    'px-2 pb-[0.90rem] text-sm font-medium whitespace-nowrap',
                  )}
                >
                  Bookmarks
                </Link>
                <Link
                  href="/settings/profile"
                  prefetch={false}
                  className={cn(
                    pathname.includes('/settings')
                      ? 'border-b-muted-foreground border-b-2'
                      : 'text-muted-foreground',
                    'px-2 pb-[0.90rem] text-sm font-medium whitespace-nowrap',
                  )}
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
          <div className="mr-4">
            <ModeToggle />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="mr-4 sm:mr-0"
            >
              <button className="flex cursor-pointer rounded-full hover:bg-black">
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image as string}
                    alt="Profile Photo"
                  />
                  <AvatarFallback>
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-1 mr-2">
              <DropdownMenuItem onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
