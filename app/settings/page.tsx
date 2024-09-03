'use client';

import { Button } from '@/components/ui/button';
import { OasisError } from '@/lib/oasisError';
import { OasisResponse } from '@/types/apiHelpers';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function Settings() {
  const { data: session } = useSession();

  const mutation = useMutation({
    mutationFn: createExternalApiToken,
  });

  async function createExternalApiToken(formData: { name: string }) {
    const { success, message, data }: OasisResponse<string> = await (
      await fetch('/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
        }),
      })
    ).json();

    if (!success) {
      throw new OasisError(message, 404);
    } else {
      toast.success(message);
      toast.success(data);
    }
  }

  return (
    <div className="mt-24 flex flex-col items-center space-y-10">
      <div>ID: {session?.user?.id}</div>
      <div>Name: {session?.user?.name}</div>

      <Button
        variant="outline"
        disabled={mutation.isPending}
        onClick={() => {
          mutation.mutate({ name: Math.random().toString(36).slice(2, 7) });
        }}
      >
        Create API Token
      </Button>
    </div>
  );
}
