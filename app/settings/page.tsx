'use client';

import { Button } from '@/components/ui/button';
import { OasisError } from '@/lib/oasisError';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function Settings() {
  const { data: session } = useSession();

  const mutation = useMutation({
    mutationFn: createExternalApiToken,
  });

  async function createExternalApiToken(formData: { name: string }): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    const response = await fetch('/api/tokens', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.name,
      }),
    });

    const jsonData = await response.json();

    if (!response.ok) {
      throw new OasisError(jsonData?.message, 404);
    } else {
      toast.success(jsonData.message);
      toast.success(jsonData.data);
    }

    return jsonData;
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
