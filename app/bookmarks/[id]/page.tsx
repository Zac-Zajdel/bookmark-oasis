'use client';

import BookmarkDetailsSkeleton from '@/components/bookmarks/bookmark-details-skeleton';
import { IconHolder } from '@/components/icons/icon-holder';
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
import { Textarea } from '@/components/ui/textarea';
import { useBookmarkQuery } from '@/hooks/api/bookmarks/useBookmarkQuery';
import { useUpdateBookmarkMutation } from '@/hooks/api/bookmarks/useUpdateBookmarkMutation';
import { truncate } from '@/lib/utils';
import { Save } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DetailsPage({ params }: { params: { id: string } }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [iconName, setIconName] = useState('');
  const [description, setDescription] = useState('');

  const { isLoading, data: bookmark } = useBookmarkQuery(params.id);

  useEffect(() => {
    if (bookmark) {
      setUrl(bookmark.url);
      setTitle(bookmark.title);
      setIconName(bookmark.iconName ?? '');
      setDescription(bookmark.description ?? '');
    }
  }, [bookmark]);

  const updateBookmarkMutation = useUpdateBookmarkMutation();
  const updateBookmark = (icon?: string) => {
    if (bookmark) {
      updateBookmarkMutation.mutate({
        ...bookmark,
        title,
        url,
        description,
        iconName: icon || bookmark.iconName,
      });
    }
  };

  const onSelectIcon = (icon: string) => {
    updateBookmark(icon);
    setIconName(icon);
  };

  if (isLoading || !bookmark) {
    return <BookmarkDetailsSkeleton />;
  }

  return (
    <div className="container mt-5">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/bookmarks">Bookmarks</Link>
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
          disabled={updateBookmarkMutation.isPending}
          onClick={() => updateBookmark()}
        >
          <Save className="mr-2 size-4" />
          Save
        </Button>
      </div>

      <div className="mt-2 flex flex-row items-center">
        <Card className="mt-5 min-h-24 min-w-24 content-center p-8">
          <div className="flex items-center justify-center">
            <IconHolder
              module={bookmark}
              iconName={iconName}
              isLoading={isLoading}
              onSelectIcon={onSelectIcon}
            />
          </div>
        </Card>
        <div className="ml-2 mt-1 w-full">
          <div className="mt-3">
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
          </div>

          <div className="text-sm">
            <Input
              id="url"
              style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              className="border-transparent text-muted-foreground"
              placeholder="Bookmark URL"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid w-full gap-1.5 pt-5">
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
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </div>
  );
}
