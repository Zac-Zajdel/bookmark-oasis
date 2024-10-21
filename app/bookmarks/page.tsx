'use client';

import BookmarkCard from '@/components/bookmarks/bookmark-card';
import BookmarkCardSkeleton from '@/components/bookmarks/bookmark-card-skeleton';
import BookmarkHeader from '@/components/bookmarks/bookmark-header';
import { Button } from '@/components/ui/button';
import { EmptyPlaceholder } from '@/components/ui/empty-placeholder';
import { useBookmarksQuery } from '@/hooks/api/bookmarks/useBookmarksQuery';
import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Bookmarks() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { bookmarks, total, isLoading } = useBookmarksQuery(
    debouncedSearch,
    page,
    itemsPerPage,
  );

  const totalPages = bookmarks ? Math.ceil(total / itemsPerPage) : 1;

  return (
    <div className="mt-10 flex flex-col items-center space-y-10">
      <BookmarkHeader onSearch={setSearch} />

      {!isLoading && bookmarks.length > 0 && (
        <div className="container">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <BookmarkCardSkeleton key={index} />
                ))
              : bookmarks?.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                  />
                ))}
          </div>
        </div>
      )}

      {bookmarks.length === 0 ? (
        <div className="container">
          <EmptyPlaceholder>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Bookmark className="size-6" />
            </div>
            <EmptyPlaceholder.Title>
              No Bookmarks created
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              Organize, manage, and access your favorite links all in one place.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        </div>
      ) : (
        <div className="flex w-full max-w-xs items-center justify-between py-8 text-sm">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span>
            Page {page} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
