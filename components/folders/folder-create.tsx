'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateFolderMutation } from '@/hooks/api/folders/useCreateFolderMutation';
import { queryClient } from '@/lib/utils';
import { Folder } from '@prisma/client';
import { FolderIcon, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function FolderCreate() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createFolderMutation = useCreateFolderMutation();

  const onCreate = () => {
    createFolderMutation.mutate(
      {
        title,
        description,
      },
      {
        onSuccess: async ({
          folder,
          message,
        }: {
          folder: Folder;
          message: string;
        }) => {
          toast.success(
            <div>
              <div className="pb-3">{message}</div>
              <Link
                href={`/folders/${folder.id}`}
                className="hover:underline"
              >
                View Folder
              </Link>
            </div>,
            {
              duration: 5000,
            },
          );

          setDialogOpen(false);

          await queryClient.invalidateQueries({
            queryKey: ['folders'],
          });
        },
        onError(error) {
          toast.error(error.message);
        },
      },
    );
  };

  const onDialogChange = () => {
    setDialogOpen(!dialogOpen);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="flex items-center justify-between space-x-4">
      <Dialog
        open={dialogOpen}
        onOpenChange={onDialogChange}
      >
        <DialogTrigger asChild>
          <Button>
            <FolderIcon className="mr-2 size-4" />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogTitle>Create Folder</DialogTitle>
          <div className="my-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              autoFocus
              className="mt-1"
              placeholder="Folder Title . . ."
              value={title}
              onChange={(event) => setTitle(event?.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="mt-1"
              placeholder="Folder Description . . ."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={onCreate}
              disabled={createFolderMutation.isPending}
            >
              {createFolderMutation.isPending ? (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              ) : (
                <FolderIcon className="mr-2 size-4" />
              )}
              Add Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
