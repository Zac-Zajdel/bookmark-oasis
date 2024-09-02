'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { truncate } from '@/lib/utils';
import { Bookmark } from '@prisma/client';
import { EllipsisVertical, Link2Icon, Trash } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (bookmark: Bookmark) => void;
}

export default function BookmarkCard({
  bookmark,
  onDelete,
}: BookmarkCardProps) {
  function onCopyLink(url: string) {
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard');
  }

  return (
    <Link
      href={bookmark.url}
      target="_blank"
    >
      <Card className="flex h-full w-full flex-col justify-between">
        <CardHeader className="flex h-full flex-col items-start p-5">
          <div className="flex w-full items-start justify-between">
            <div className="flex-1">
              <h1 className="line-clamp-2 h-[40px] font-semibold leading-snug tracking-tight">
                {truncate(bookmark.title, 80)}
              </h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2 h-6 w-6 flex-shrink-0"
                >
                  <EllipsisVertical className="h-[1rem] w-[1rem]" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onCopyLink(bookmark.url)}>
                  <Link2Icon className="mr-4 size-4" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onDelete(bookmark)}>
                  <Trash className="mr-4 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="line-clamp-2 pt-2 text-sm text-gray-500 text-muted-foreground">
            {truncate(bookmark.description || '', 60)}
          </p>
          <div className="flex-grow"></div>
          <div className="w-full overflow-hidden">
            <div className="relative mx-auto pb-[56.25%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bookmark.imageUrl || '/placeholder.svg'}
                alt={bookmark.title}
                className="absolute left-0 top-0 h-full w-full rounded-md object-cover"
              />
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
