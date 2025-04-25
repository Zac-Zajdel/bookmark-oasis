import { ColorPicker } from '@/components/tags/color-picker';
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
import { Label } from '@/components/ui/label';
import { useCreateTagMutation } from '@/hooks/api/tags/useCreateTagMutation';
import { useUpdateTagMutation } from '@/hooks/api/tags/useUpdateTagMutation';
import { Prisma, Tag } from '@prisma/client';
import { LoaderCircle, Tag as TagIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function TagActionDialog({
  mode,
  triggerChildren,
  tag,
  setDropdownOpen,
}: {
  mode: 'Create' | 'Update';
  triggerChildren: React.ReactNode;
  tag?: Partial<Tag>;
  setDropdownOpen?: (open: boolean) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tagData, setTagData] = useState<Partial<Prisma.TagCreateInput>>({
    name: tag?.name || '',
    color: tag?.color || 'Blue',
  });

  const createTagMutation = useCreateTagMutation();
  const updateTagMutation = useUpdateTagMutation();

  const isLoading = createTagMutation.isPending || updateTagMutation.isPending;

  const tagCreateAction = async () => {
    if (!tagData?.name) {
      return toast.error('You must supply a name.');
    }

    createTagMutation.mutate(
      { tag: tagData },
      {
        onSuccess: () => {
          setTagData({
            name: '',
            color: 'Blue',
          });
          setDialogOpen(false);
        },
      },
    );
  };

  const tagUpdateAction = async () => {
    if (!tagData?.name) {
      return toast.error('You must supply a name.');
    }

    updateTagMutation.mutate(
      { ...tagData, id: tag?.id },
      {
        onSuccess: () => {
          setTagData({
            name: '',
            color: 'Blue',
          });
          setDialogOpen(false);
          setDropdownOpen?.(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      <DialogTrigger asChild>{triggerChildren}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[525px]"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{mode} Tag</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Label htmlFor="name">Name</Label>
          <Input
            value={tagData?.name}
            id="name"
            required
            className="mt-1"
            onChange={(event) =>
              setTagData({
                ...tagData,
                name: event.target.value,
                color: tagData?.color || 'Blue',
              })
            }
            placeholder="Tag Name . . ."
          />
        </div>
        <div className="py-2">
          <div className="mb-2 text-sm leading-none font-medium">Color</div>
          <ColorPicker
            color={tagData.color || 'Blue'}
            setColor={(color) =>
              setTagData({
                ...tagData,
                color,
              })
            }
          />
        </div>
        <DialogFooter>
          <Button
            onClick={mode === 'Create' ? tagCreateAction : tagUpdateAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <TagIcon className="mr-2 size-4" />
            )}
            {mode} Tag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
