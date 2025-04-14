'use client';

import { DynamicIcon } from '@/components/icons/dynamic-icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialogModal } from '@/components/ui/confirm-dialog-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteFolderMutation } from '@/hooks/api/folders/useDeleteFolderMutation';
import { Folder } from '@prisma/client';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// TODO - Experiment with that...
// type FolderWithCount = Folder & {
//   _count: {
//     bookmarks: number;
//   };
// };

export default function FolderCard({ folder }: { folder: Folder }) {
  const [loadingAction, setLoadingAction] = useState<null | 'keep' | 'delete'>(
    null,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteFolderMutation = useDeleteFolderMutation();

  const createDeleteHandler = (keepBookmarks: boolean) => {
    return async (event: React.MouseEvent) => {
      event.preventDefault();

      setLoadingAction(keepBookmarks ? 'keep' : 'delete');

      try {
        await deleteFolderMutation.mutateAsync({ folder, keepBookmarks });
        setIsModalOpen(false);
      } finally {
        setLoadingAction(null);
      }
    };
  };

  const openDeleteDialog = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Card className="flex h-full w-full flex-col justify-between rounded-lg bg-secondary/20 dark:bg-background">
        <div className="flex w-full items-center justify-between px-3 py-2">
          <Link
            href={`/folders/${folder.id}`}
            className="min-w-0 flex-1 hover:underline"
          >
            <div className="flex items-center">
              <div className="inline-flex size-7 items-center justify-center rounded-md border shadow-sm">
                <DynamicIcon
                  name={folder.iconName ?? 'Search'}
                  className="size-3.5"
                />
              </div>
              <h1 className="min-w-0 flex-1 truncate whitespace-nowrap pl-2 text-xs font-semibold leading-snug tracking-tight">
                {folder.title}
              </h1>
            </div>
          </Link>
          <DropdownMenu
            open={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="ml-1 size-6 rounded-md border p-1"
              >
                <span className="sr-only">Open menu</span>
                <EllipsisVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={openDeleteDialog}>
                <Trash2 className="mr-3 size-3.5 text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <ConfirmDialogModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Delete Folder"
        description="You can still delete your folder without losing your bookmarks!"
        actions={[
          {
            label: 'Delete and keep bookmarks',
            variant: 'outline',
            isLoading: loadingAction === 'keep',
            icon: <Trash2 className="mr-2 size-4 text-red-500" />,
            onClick: createDeleteHandler(true),
          },
          {
            label: 'Delete',
            variant: 'destructive',
            isLoading: loadingAction === 'delete',
            icon: <Trash2 className="mr-2 size-4 text-red-500" />,
            onClick: createDeleteHandler(false),
          },
        ]}
      />
    </div>
  );
}
