'use client';

import BookmarkCard from '@/components/bookmarks/bookmark-card';
import BookmarkCardSkeleton from '@/components/bookmarks/bookmark-card-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { queryClient } from '@/lib/utils';
import { Bookmark } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Bookmarks() {
  const [url, setUrl] = useState('');

  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const [totalBookmarks, setTotalBookmarks] = useState(0);

  const bookmarkMutation = useMutation({
    mutationFn: createBookmark,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['bookmarks', page] });
    },
  });

  async function createBookmark() {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({
        url: url,
      }),
    });

    const jsonData = await response.json();
    if (!jsonData.success) {
      toast.error(jsonData.message);
    } else {
      toast.success(jsonData.message);
      setUrl('');
    }
  }

  const { isLoading, data: bookmarks } = useQuery({
    queryKey: ['bookmarks', page, itemsPerPage],
    queryFn: async (): Promise<Bookmark[] | []> => {
      const response = await fetch(
        `/api/bookmarks?page=${page}&limit=${itemsPerPage}`,
      );
      const jsonData = await response.json();

      if (!jsonData.success) {
        toast.error(jsonData.message);
        return [];
      }

      setTotalBookmarks(jsonData.data.total);
      return jsonData.data.bookmarks;
    },
  });

  const totalPages = bookmarks ? Math.ceil(totalBookmarks / itemsPerPage) : 1;

  return (
    <div className="mt-24 flex flex-col items-center space-y-10">
      <div className="container flex items-center justify-center space-x-4">
        <Input
          type="url"
          value={url}
          onChange={(event) => setUrl(event?.target.value)}
          placeholder="Add Bookmark URL"
        />
        <Button
          variant="outline"
          disabled={bookmarkMutation.isPending}
          onClick={() => {
            bookmarkMutation.mutate();
          }}
        >
          Create
        </Button>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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

      <div className="mt-8 flex w-full max-w-xs items-center justify-between text-sm">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
