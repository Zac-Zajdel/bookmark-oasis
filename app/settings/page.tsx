'use client';

import { columns } from '@/components/apiTokens/columns';
import { DataTable } from '@/components/apiTokens/data-table';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/useDataTable';
import { OasisError } from '@/lib/oasisError';
import { OasisResponse } from '@/types/apiHelpers';
import { ApiToken } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Settings() {
  const [apiTokens, setApiTokens] = useState<ApiToken[]>([]);

  const createTokenMutation = useMutation({
    mutationFn: async (formData: { name: string }) => {
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
    },
  });

  const { table, pageIndex } = useDataTable<ApiToken>(apiTokens, columns);

  const { isLoading } = useQuery({
    queryKey: ['apiTokens', pageIndex + 1],
    queryFn: async (): Promise<ApiToken[]> => {
      const {
        success,
        message,
        data,
      }: OasisResponse<{ apiTokens: ApiToken[]; total: number }> = await (
        await fetch(`/api/tokens?page=${pageIndex + 1}&limit=10`)
      ).json();

      if (!success) {
        toast.error(message);
        return [];
      }

      setApiTokens(data.apiTokens);
      return data.apiTokens;
    },
  });

  return (
    <div className="container mt-10">
      <div className="flex justify-end">
        <Button
          variant="outline"
          disabled={createTokenMutation.isPending}
          onClick={() => {
            createTokenMutation.mutate({
              name: Math.random().toString(36).slice(2, 7),
            });
          }}
        >
          Create API Token
        </Button>
      </div>

      <div className="mt-10 flex justify-center">
        <DataTable
          data={apiTokens}
          columns={columns}
          table={table}
        />
      </div>
    </div>
  );
}
