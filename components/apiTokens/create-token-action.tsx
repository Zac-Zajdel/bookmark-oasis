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
import { OasisError } from '@/lib/oasisError';
import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { useMutation } from '@tanstack/react-query';
import { KeyRound, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function CreateTokenAction() {
  const [tokenName, setTokenName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const createTokenMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!name.length) {
        return toast.error('You must supply a name.');
      }

      const { success, message, data }: OasisResponse<string> = await (
        await fetch('/api/tokens', {
          method: 'POST',
          body: JSON.stringify({
            name,
          }),
        })
      ).json();

      if (!success) {
        throw new OasisError(message, 404);
      } else {
        // TODO - Improve this experience by putting this inside a AlertDialog component for easy copy using clipboard.
        toast.success(message);
        toast.success(data);

        setTokenName('');
        setDialogOpen(false);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['apiTokens'],
      });
    },
  });

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <KeyRound className="mr-3 size-4" />
          Create API Token
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[525px]"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Create API Token</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Input
            value={tokenName}
            onChange={(event) => setTokenName(event?.target.value)}
            placeholder="Token Name . . ."
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => createTokenMutation.mutate(tokenName)}
            disabled={createTokenMutation.isPending}
          >
            {createTokenMutation.isPending ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <KeyRound className="mr-2 size-4" />
            )}
            Generate Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
