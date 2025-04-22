import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateTagMutation } from '@/hooks/api/tags/useCreateTagMutation';
import { queryClient } from '@/lib/utils';
import { Prisma, Tag } from '@prisma/client';
import { LoaderCircle, Tag as TagIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function CreateTagAction() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createTag, setCreateTag] = useState<Partial<Prisma.TagCreateInput>>({
    name: '',
    color: 'blue',
  });

  const createTagMutation = useCreateTagMutation();

  const tagCreateAction = async () => {
    if (!createTag?.name) {
      return toast.error('You must supply a name.');
    }
    createTagMutation.mutate(
      { tag: createTag },
      {
        onSuccess: async ({ message }: { tag: Tag; message: string }) => {
          toast.success(message);

          setCreateTag({
            name: '',
            color: 'blue',
          });
          setDialogOpen(false);

          await queryClient.invalidateQueries({
            queryKey: ['tags'],
          });
        },
      },
    );
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <TagIcon className="mr-2 size-4" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[525px]"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Input
            value={createTag?.name}
            required
            onChange={(event) =>
              setCreateTag({
                ...createTag,
                name: event.target.value,
                color: createTag?.color || 'blue',
              })
            }
            placeholder="Tag Name . . ."
          />
        </div>
        <DialogFooter>
          <Button
            onClick={tagCreateAction}
            disabled={createTagMutation.isPending}
          >
            {createTagMutation.isPending ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <TagIcon className="mr-2 size-4" />
            )}
            Create Tag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
