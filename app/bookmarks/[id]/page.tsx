'use client';

import { DynamicIcon } from '@/components/dynamic-icon';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useBookmarkQuery } from '@/hooks/api/bookmarks/useBookmarkQuery';
import { useUpdateBookmarkMutation } from '@/hooks/api/bookmarks/useUpdateBookmarkMutation';
import { truncate } from '@/lib/utils';
import { Save } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
const IconPicker = dynamic(() => import('@/components/icon-picker'), {
  ssr: false,
});

export default function DetailsPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const { data: bookmark } = useBookmarkQuery(params.id);

  useEffect(() => {
    if (bookmark) {
      setUrl(bookmark.url);
      setTitle(bookmark.title);
      setDescription(bookmark.description ?? '');
    }
  }, [bookmark]);

  const updateBookmarkMutation = useUpdateBookmarkMutation();
  const updateBookmark = () => {
    updateBookmarkMutation.mutate({
      id: bookmark?.id,
      isFavorite: bookmark?.isFavorite,
      title,
      url,
      description,
    });
  };

  const [bookmarkIcon, setBookmarkIcon] = useState('Search');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const selectNewIcon = () => setShowIconPicker(!showIconPicker);

  const onSelectIcon = (icon: string) => {
    setBookmarkIcon(icon);
    setShowIconPicker(false);
  };

  return (
    <div className="container mt-5">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/bookmarks">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {truncate(bookmark?.title ?? '...', 35)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="outline"
          disabled={updateBookmarkMutation.isPending}
          onClick={updateBookmark}
        >
          <Save className="mr-2 size-4" />
          {bookmark?.title !== title || bookmark?.url !== url
            ? 'Save'
            : 'Saved'}
        </Button>
      </div>

      <div className="mt-2 flex flex-row items-center">
        <Card className="mt-5 min-w-20 content-center p-8">
          <div className="flex items-center justify-center">
            {/* Make this into its own component */}
            {bookmark?.imageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bookmark.imageUrl}
                  alt={bookmark.title}
                  className="size-4"
                />
              </>
            ) : (
              <div>
                <Button
                  variant="ghost"
                  className="relative"
                  onClick={selectNewIcon}
                >
                  <DynamicIcon
                    name={bookmarkIcon}
                    className="size-5"
                  />
                </Button>

                <div className="absolute z-10 w-[30%] rounded-lg bg-muted">
                  {showIconPicker && (
                    <div className="rounded-lg p-2">
                      <IconPicker onSelectIcon={onSelectIcon} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
        <div className="ml-2 mt-1 w-full">
          <div className="mt-3">
            {bookmark ? (
              <>
                <Input
                  id="text"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                  className="border-transparent text-xl"
                  placeholder="Bookmark Title"
                  autoComplete="off"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="ml-2 flex">
                  <div className="w-full space-y-2">
                    <Skeleton className="mb-5 h-6 w-56" />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="text-sm">
            {bookmark ? (
              <>
                <Input
                  id="url"
                  style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
                  className="border-transparent text-muted-foreground"
                  placeholder="Bookmark URL"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="ml-2 flex">
                  <div className="w-full space-y-2">
                    <Skeleton className="h-6 w-80" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid w-full gap-1.5 pt-5">
        {bookmark ? (
          <>
            <Label
              htmlFor="description"
              className="mb-1"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Bookmark information"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        ) : (
          <>
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-14 w-full" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
