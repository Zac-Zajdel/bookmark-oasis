'use client';

import BookmarkActions from '@/components/bookmarks/bookmark-actions';
import { Card, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bookmark } from '@prisma/client';
import { Search } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: Partial<Bookmark>;
  onDelete: (bookmark: Partial<Bookmark>) => void;
  onFavorite: (bookmark: Partial<Bookmark>) => void;
}

export default function BookmarkCard({
  bookmark,
  onDelete,
  onFavorite,
}: BookmarkCardProps) {
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
          <h1 className="text-md h-10 overflow-hidden truncate text-ellipsis whitespace-nowrap pl-2 pt-2 font-semibold leading-snug tracking-tight">
            {bookmark.title}
          </h1>
        </div>
        <p className="line-clamp-2 text-xs text-gray-500 text-muted-foreground">
          {bookmark.description}
        </p>
      </CardHeader>

      <Separator className="opacity-75" />

      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <BookmarkActions
          bookmark={bookmark}
          onFavorite={onFavorite}
          onDelete={onDelete}
        />
      </div>
    </Card>
  );
}
