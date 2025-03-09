'use client';

import { DynamicIcon } from '@/components/icons/dynamic-icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteFolderMutation } from '@/hooks/api/folders/useDeleteFolderMutation';
import { cn } from '@/lib/utils';
import { Folder } from '@prisma/client';
import { EllipsisVertical, Loader, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// TODO - Experiment with that...
// type FolderWithCount = Folder & {
//   _count: {
//     bookmarks: number;
//   };
// };

export default function FolderCard({ folder }: { folder: Folder }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const deleteFolderMutation = useDeleteFolderMutation();

  // TODO - Force them to type Delete {INSERT_NAME} and make this a reusable component to be used here and elsewhere...
  const handleDeleteClick = async (
    event: React.MouseEvent,
    keepBookmarks: boolean = false,
  ) => {
    event.preventDefault();

    setIsLoading(true);
    await deleteFolderMutation.mutateAsync({ folder, keepBookmarks });
    setIsLoading(false);

    setShowDeleteAlert(false);
  };

  const openDeleteDialog = () => {
    setIsDropdownOpen(false);
    setShowDeleteAlert(true);
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

      {showDeleteAlert && (
        <AlertDialog
          open={showDeleteAlert}
          onOpenChange={setShowDeleteAlert}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Folder</AlertDialogTitle>
              <AlertDialogDescription>
                Please choose from your options below. You can still delete your
                folder without loosing your bookmarks!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isLoading}
                onClick={() => setShowDeleteAlert(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className={cn(
                  'text-primary',
                  buttonVariants({ variant: 'outline' }),
                )}
                disabled={isLoading}
                onClick={(e) => handleDeleteClick(e, true)}
              >
                {isLoading ? (
                  <Loader className="mr-2 size-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 size-4 text-red-500" />
                )}
                <span>Delete and Keep Bookmarks</span>
              </AlertDialogAction>
              <AlertDialogAction
                className={cn(
                  'text-primary',
                  buttonVariants({ variant: 'outline' }),
                )}
                disabled={isLoading}
                onClick={handleDeleteClick}
              >
                {isLoading ? (
                  <Loader className="mr-2 size-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 size-4 text-red-500" />
                )}
                <span>Delete</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
