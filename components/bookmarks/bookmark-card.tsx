'use client';

import BookmarkActions from '@/components/bookmarks/bookmark-actions';
import { DynamicIcon } from '@/components/icons/dynamic-icon';
import { Card, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDeleteBookmarkMutation } from '@/hooks/api/bookmarks/useDeleteBookmarkMutation';
import { useUpdateBookmarkMutation } from '@/hooks/api/bookmarks/useUpdateBookmarkMutation';
import { Bookmark } from '@prisma/client';

interface BookmarkCardProps {
  bookmark: Partial<Bookmark>;
}

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const updateBookmarkMutation = useUpdateBookmarkMutation();
  const deleteBookmarkMutation = useDeleteBookmarkMutation();

  const onFavorite = (bookmark: Partial<Bookmark>) => {
    updateBookmarkMutation.mutate(bookmark);
  };

  const onDelete = (bookmark: Partial<Bookmark>) => {
    deleteBookmarkMutation.mutate(bookmark);
  };

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
                // <Search className="size-3.5" />
                <DynamicIcon
                  name={bookmark.iconName ?? 'Search'}
                  className="size-3.5"
                />
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
