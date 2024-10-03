'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { truncate } from '@/lib/utils';
import { Bookmark } from '@prisma/client';
import {
  BookOpen,
  Link,
  Search,
  SquareArrowOutUpRight,
  Star,
  Trash,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (bookmark: Bookmark) => void;
  onFavorite: (bookmark: Bookmark) => void;
}

export default function BookmarkCard({
  bookmark,
  onDelete,
  onFavorite,
}: BookmarkCardProps) {
  const router = useRouter();

  function onCopyLink(url: string) {
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard');
  }

  return (
    <Card className="flex h-full w-full flex-col justify-between rounded-lg">
      <CardHeader className="flex h-full flex-col items-start p-5">
        <div className="flex w-full items-center justify-start">
          <div className="min-w-8">
            <div className="inline-flex size-7 items-center justify-center rounded-md border">
              {bookmark.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bookmark.imageUrl}
                    alt={bookmark.title}
                    className="size-4"
                  />
                </>
              ) : (
                <Search className="size-3.5" />
              )}
            </div>
          </div>
          <h1 className="text-md line-clamp-2 h-[40px] overflow-hidden pl-2 pt-2 font-semibold leading-snug tracking-tight">
            {truncate(bookmark.title, 80)}
          </h1>
        </div>
        <p className="line-clamp-2 text-xs text-gray-500 text-muted-foreground">
          {truncate(bookmark.description || '', 100)}
        </p>
      </CardHeader>

      <Separator className="opacity-75" />

      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex size-7 items-center justify-center"
                onClick={() => window.open(bookmark.url, '_blank')}
              >
                <SquareArrowOutUpRight className="size-4 dark:text-gray-200" />
                <span className="sr-only">Visit URL</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visit URL</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex size-7 items-center justify-center"
                onClick={() => router.push(`/bookmarks/${bookmark.id}`)}
              >
                <BookOpen className="size-4 dark:text-gray-200" />
                <span className="sr-only">Details Page Link</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Metadata</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex size-7 items-center justify-center"
                onClick={() =>
                  onFavorite({
                    ...bookmark,
                    isFavorite: !bookmark.isFavorite,
                  })
                }
              >
                <Star className="size-4 dark:text-gray-200" />
                <span className="sr-only">
                  {bookmark.isFavorite ? 'Remove Favorite' : 'Favorite'}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {bookmark.isFavorite ? 'Remove Favorite' : 'Favorite'}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex size-7 items-center justify-center"
                onClick={() => onCopyLink(bookmark.url)}
              >
                <Link className="size-4 dark:text-gray-200" />
                <span className="sr-only">Copy Link</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy Link</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex size-7 items-center justify-center"
                onClick={() => onDelete(bookmark)}
              >
                <Trash className="size-4 dark:text-gray-200" />
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}
