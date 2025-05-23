'use client';

import BookmarkCard from '@/components/bookmarks/bookmark-card';
import BookmarkCardSkeleton from '@/components/bookmarks/bookmark-card-skeleton';
import BookmarkCreate from '@/components/bookmarks/bookmark-create';
import { Button } from '@/components/ui/button';
import { EmptyPlaceholder } from '@/components/ui/empty-placeholder';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { useBookmarksQuery } from '@/hooks/api/bookmarks/useBookmarksQuery';
import { useDebounce } from '@/hooks/useDebounce';
import { Bookmark, ChevronLeft, ChevronRightIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BookmarkSection({
  description = 'Important and frequently visited websites.',
  folderId,
}: {
  description?: string;
  folderId?: string;
}) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => setPage(1), [debouncedSearch]);

  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { bookmarks, totalPages, isLoading } = useBookmarksQuery(
    debouncedSearch,
    page,
    itemsPerPage,
    folderId,
  );

  return (
    <div className="flex flex-col">
      <SectionHeader
        title="Bookmarks"
        description={description}
      >
        <BookmarkCreate folderId={folderId} />
      </SectionHeader>

      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <Input
            className="w-56 sm:w-80"
            value={search}
            onChange={(event) => setSearch(event?.target.value)}
            placeholder="Search Bookmarks..."
          />
          {search.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => setSearch('')}
              className="h-8 px-2"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      {((!isLoading && bookmarks.length) || isLoading) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <BookmarkCardSkeleton key={index} />
              ))
            : bookmarks?.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                />
              ))}
        </div>
      )}

      {!isLoading && bookmarks.length === 0 && (
        <EmptyPlaceholder className="min-h-56">
          <div className="bg-muted flex size-14 items-center justify-center rounded-full">
            <Bookmark className="size-6" />
          </div>
          <EmptyPlaceholder.Title>No Bookmarks created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Organize, manage, and access your favorite links all in one place.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </div>
  );
}
