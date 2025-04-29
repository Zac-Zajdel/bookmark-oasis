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
import { Folder } from '@prisma/client';
import { Save } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

export default function FolderDetails(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const [iconName, setIconName] = useState('');

  const { isLoading, data: folder } = useFolderQuery(params.id);
  const [loadedFolder, setLoadedFolder] = useState<Folder>({} as Folder);

  useEffect(() => {
    if (folder) {
      setLoadedFolder(folder);
      setIconName(folder.iconName ?? '');
    }
  }, [folder]);

  const updateFolderMutation = useUpdateFolderMutation();
  const updateFolder = (icon?: string) => {
    updateFolderMutation.mutate({
      ...loadedFolder,
      iconName: icon || loadedFolder.iconName,
    });
  };

  const onSelectIcon = (icon: string) => {
    updateFolder(icon);
    setIconName(icon);
  };

  if (isLoading || !folder || !loadedFolder) {
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
                {truncate(loadedFolder?.title ?? '...', 35)}
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
        <div className="mt-1 ml-2 w-full">
          <div className="mt-3">
            <Input
              id="text"
              style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              className="border-transparent text-xl"
              placeholder="Folder Title"
              autoComplete="off"
              required
              value={loadedFolder?.title || ''}
              onChange={(e) =>
                setLoadedFolder({
                  ...loadedFolder,
                  title: e.target.value,
                })
              }
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
          value={loadedFolder?.description || ''}
          rows={8}
          onChange={(e) =>
            setLoadedFolder({
              ...loadedFolder,
              description: e.target.value,
            })
          }
        />
      </div>

      <div className="mt-10">
        <BookmarkSection
          description="Bookmarks associated to this folder."
          folderId={loadedFolder?.id}
        />
      </div>
    </div>
  );
}
