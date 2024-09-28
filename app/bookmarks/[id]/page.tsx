'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DetailsPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const { data: bookmark } = useQuery({
    queryKey: ['bookmark-details', params.id],
    queryFn: async (): Promise<Bookmark | undefined> => {
      const {
        success,
        message,
        data: bookmark,
      }: OasisResponse<Bookmark> = await (
        await fetch(`/api/bookmarks/${params.id}`)
      ).json();

      if (!success) {
        toast.error(message);
        return;
      }

      setTitle(bookmark.title);
      setUrl(bookmark.url);

      return bookmark;
    },
  });

  const updateBookmarkMutation = useMutation({
    mutationFn: async (updated: Partial<Bookmark>): Promise<Bookmark> => {
      const {
        success,
        message,
        data: updatedBookmark,
      }: OasisResponse<Bookmark> = await (
        await fetch(`/api/bookmarks/${params.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            url: updated.url,
            title: updated.title,
            isFavorite: bookmark?.isFavorite,
            description: bookmark?.description,
          }),
        })
      ).json();

      !success ? toast.error(message) : toast.success(message);

      return updatedBookmark;
    },
    onSuccess: async (updatedBookmark) => {
      queryClient.setQueryData(
        ['bookmark-details', params.id],
        updatedBookmark,
      );
    },
  });

  return (
    <div className="container mt-10">
      <div className="flex justify-between">
        <Link
          href="/bookmarks"
          prefetch={false}
        >
          <Button variant="outline">
            <ChevronLeft className="mr-1 size-4" />
            Back
          </Button>
        </Link>
        <Button
          variant="outline"
          disabled={updateBookmarkMutation.isPending}
          onClick={useDebounce(
            () => updateBookmarkMutation.mutate({ title, url }),
            250,
          )}
        >
          <Save className="mr-2 size-4" />
          {bookmark?.title !== title || bookmark?.url !== url
            ? 'Save'
            : 'Saved'}
        </Button>
      </div>

      <div className="mt-10 flex flex-col items-center md:flex-row md:items-start">
        <Card className="w-80 flex-none">
          <div className="overflow-hidden p-5">
            <div className="relative mx-auto pb-[56.25%]">
              {bookmark ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bookmark?.imageUrl || '/placeholder.svg'}
                    alt={bookmark?.title}
                    className="absolute left-0 top-0 h-full w-full rounded-md object-cover"
                  />
                </>
              ) : (
                <Skeleton className="absolute left-0 top-0 h-full w-full rounded-md object-cover" />
              )}
            </div>
          </div>
        </Card>
        <div className="mt-4 w-full sm:mt-0 md:ml-4">
          <div className="mt-5">
            {bookmark ? (
              <>
                <Label htmlFor="text">Title</Label>
                <Input
                  id="text"
                  className="mt-2"
                  placeholder="Bookmark Title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="flex">
                  <div className="w-full space-y-2">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-5 text-sm">
            {bookmark ? (
              <>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  className="mt-2"
                  placeholder="Bookmark URL"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="flex">
                  <div className="w-full space-y-2">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
