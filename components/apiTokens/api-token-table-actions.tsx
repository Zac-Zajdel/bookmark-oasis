'use client';

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
import { useDeleteApiTokenMutation } from '@/hooks/apiToken/useDeleteApiTokenMutation';
import { cn } from '@/lib/utils';
import { ApiToken } from '@prisma/client';
import { Row } from '@tanstack/react-table';
import { EllipsisVertical, Loader, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function ApiTokenTableActions({ row }: { row: Row<ApiToken> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const deleteTokenMutation = useDeleteApiTokenMutation();

  return (
    <>
      <div className="flex items-center justify-end pr-4">
        <DropdownMenu>
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
            <DropdownMenuItem onSelect={() => setShowDeleteAlert(true)}>
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
                Delete {row?.getValue('name')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                If this token is used by any of your integrations, they will no
                longer have access. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={cn(
                  'text-primary',
                  buttonVariants({ variant: 'outline' }),
                )}
                onClick={async (event) => {
                  event.preventDefault();

                  setIsLoading(true);
                  await deleteTokenMutation.mutateAsync(row.original.id);
                  setIsLoading(false);

                  setShowDeleteAlert(false);
                }}
              >
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                )}
                <span>Delete</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
