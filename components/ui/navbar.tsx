'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav>
      <div className="mx-auto px-2 sm:px-6 lg:px-8 border-b">
        <div className="relative flex h-12 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <h1 className="text-lg font-bold">Bookmark Oasis</h1>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center justify-between mx-8 h-14">
                <ul className="space-x-3">
                  <Link
                    href="/bookmarks"
                    className={cn(
                      pathname === '/bookmarks'
                        ? 'border-b-2 border-b-white'
                        : 'text-muted-foreground',
                      'whitespace-nowrap px-2 pb-[0.90rem] text-sm',
                    )}
                  >
                    Bookmarks
                  </Link>
                  <Link
                    href="/settings"
                    className={cn(
                      pathname === '/settings'
                        ? 'border-b-2 border-b-white'
                        : 'text-muted-foreground',
                      'whitespace-nowrap px-2 pb-[0.90rem] text-sm',
                    )}
                  >
                    Settings
                  </Link>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex rounded-full hover:bg-black cursor-pointer">
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
              <DropdownMenuContent className="mt-1 mr-2 sm:mr-5 xl:mr-1">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* This is on mobile displays */}
      <div className="sm:hidden pt-2 mx-2">
        <ul className="space-x-3">
          <Link
            href="/bookmarks"
            className={cn(
              pathname === '/bookmarks'
                ? 'border-b-2 border-b-white'
                : 'text-muted-foreground',
              'whitespace-nowrap px-2 pb-4 text-sm',
            )}
          >
            Bookmarks
          </Link>
          <Link
            href="/settings"
            className={cn(
              pathname === '/settings'
                ? 'border-b-2 border-b-white'
                : 'text-muted-foreground',
              'whitespace-nowrap px-2 pb-4 text-sm',
            )}
          >
            Settings
          </Link>
        </ul>
      </div>
    </nav>
  );
}
