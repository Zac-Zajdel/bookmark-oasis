'use client';

import BookmarkActions from '@/components/bookmarks/bookmark-actions';
import { DynamicIcon } from '@/components/icons/dynamic-icon';
import { Card, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDeleteBookmarkMutation } from '@/hooks/api/bookmarks/useDeleteBookmarkMutation';
import { usePatchBookmarkMutation } from '@/hooks/api/bookmarks/usePatchBookmarkMutation';
import { Bookmark } from '@prisma/client';

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const patchBookmarkMutation = usePatchBookmarkMutation();
  const deleteBookmarkMutation = useDeleteBookmarkMutation();

  const onFavorite = (bookmark: Bookmark) => {
    patchBookmarkMutation.mutate({
      id: bookmark.id,
      isFavorite: !!bookmark.isFavorite,
    });
  };

  const onVisit = (bookmark: Bookmark) => {
    patchBookmarkMutation.mutate({
      id: bookmark.id,
      visits: bookmark.visits + 1,
    });
  };

  const onDelete = (bookmark: Bookmark) => {
    deleteBookmarkMutation.mutate(bookmark);
  };

  return (
    <Card className="bg-secondary/20 dark:bg-background flex h-full w-full flex-col justify-between rounded-lg">
      <CardHeader className="flex h-full flex-col items-start p-5">
        <div className="flex w-full items-center justify-start">
          <div className="min-w-8">
            <div className="inline-flex size-7 items-center justify-center rounded-md border shadow-xs">
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
                <DynamicIcon
                  name={bookmark.iconName ?? 'Search'}
                  className="size-3.5"
                />
              )}
            </div>
          </div>
          <h1 className="text-md h-10 truncate pt-2 pl-2 leading-snug font-semibold tracking-tight whitespace-nowrap">
            {bookmark.title}
          </h1>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-xs text-gray-500">
          {bookmark.description}
        </p>
      </CardHeader>

      <Separator className="opacity-75" />

      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <BookmarkActions
          bookmark={bookmark}
          onFavorite={onFavorite}
          onDelete={onDelete}
          onVisit={onVisit}
        />
      </div>
    </Card>
  );
}
