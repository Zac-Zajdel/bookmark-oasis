'use client';

import { TagActionDialog } from '@/components/tags/tag-action-dialog';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteTagMutation } from '@/hooks/api/tags/useDeleteTagMutation';
import { cn } from '@/lib/utils';
import { Tag } from '@prisma/client';
import { Row } from '@tanstack/react-table';
import { EllipsisVertical, Loader, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function TagTableAction({ row }: { row: Row<Tag> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const deleteTagMutation = useDeleteTagMutation();

  const handleDeleteClick = async (event: React.MouseEvent) => {
    event.preventDefault();

    setIsLoading(true);
    await deleteTagMutation.mutateAsync(row.original.id);
    setIsLoading(false);

    setShowDeleteAlert(false);
  };

  const openDeleteDialog = () => {
    setIsDropdownOpen(false);
    setShowDeleteAlert(true);
  };

  return (
    <div className="flex items-center justify-end pr-4">
      <DropdownMenu
        open={isDropdownOpen}
        modal={false}
        onOpenChange={setIsDropdownOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="size-7 rounded-md border p-0"
          >
            <span className="sr-only">Open menu</span>
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <TagActionDialog
            mode="Update"
            tag={row.original}
            setDropdownOpen={setIsDropdownOpen}
            triggerChildren={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-3 size-3.5" />
                Edit
              </DropdownMenuItem>
            }
          />
          <DropdownMenuItem onSelect={openDeleteDialog}>
            <Trash2 className="mr-3 size-3.5 text-red-500" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Tag {row?.getValue('name')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tag? Any bookmarks or folders
              with this tag will no longer have it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-end">
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                'text-primary',
                buttonVariants({ variant: 'outline' }),
              )}
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
    </div>
  );
}
