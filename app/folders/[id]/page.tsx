'use client';

import BookmarkSection from '@/components/bookmarks/bookmark-section';
import FolderDetailsSkeleton from '@/components/folders/folder-details-skeleton';
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
import { useFolderQuery } from '@/hooks/api/folders/useFolderQuery';
import { useUpdateFolderMutation } from '@/hooks/api/folders/useUpdateFolderMutation';
import { truncate } from '@/lib/utils';
import { Save } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FolderDetails({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [iconName, setIconName] = useState('');
  const [description, setDescription] = useState('');

  const { isLoading, data: folder } = useFolderQuery(params.id);

  useEffect(() => {
    if (folder) {
      setTitle(folder.title);
      setIconName(folder.iconName ?? '');
      setDescription(folder.description ?? '');
    }
  }, [folder]);

  const updateFolderMutation = useUpdateFolderMutation();
  const updateFolder = (icon?: string) => {
    if (folder) {
      updateFolderMutation.mutate({
        ...folder,
        title,
        description,
        iconName: icon || folder.iconName,
      });
    }
  };

  const onSelectIcon = (icon: string) => {
    updateFolder(icon);
    setIconName(icon);
  };

  if (isLoading || !folder) {
    return <FolderDetailsSkeleton />;
  }

  return (
    <div className="container mt-5">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/folders">Folders</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {truncate(folder?.title ?? '...', 35)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          disabled={updateFolderMutation.isPending}
          onClick={() => updateFolder()}
        >
          <Save className="mr-2 size-4" />
          Save
        </Button>
      </div>

      <div className="mt-2 flex flex-row items-center">
        <Card className="mt-5 min-h-24 min-w-24 content-center p-8">
          <div className="flex items-center justify-center">
            <IconHolder
              module={folder}
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
              placeholder="Folder Title"
              autoComplete="off"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          placeholder="Folder information"
          value={description}
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mt-10">
        <BookmarkSection
          description="Bookmarks associated to this folder."
          folderId={folder?.id}
        />
      </div>
    </div>
  );
}
