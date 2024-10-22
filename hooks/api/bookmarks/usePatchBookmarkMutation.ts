import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type PartialExceptId<T extends { id: string }> = Partial<T> & { id: T['id'] };

export const usePatchBookmarkMutation = () => {
  return useMutation({
    mutationFn: async (
      bookmark: PartialExceptId<Bookmark>,
    ): Promise<{
      bookmark: Bookmark;
      message: string;
      onlyVisitsUpdated: boolean;
    }> => {
      const updatedFields = {
        ...(bookmark.url && { url: bookmark.url }),
        ...(bookmark.title && { title: bookmark.title }),
        ...(bookmark.isFavorite !== undefined && {
          isFavorite: bookmark.isFavorite,
        }),
        ...(bookmark.description && { description: bookmark.description }),
        ...(bookmark.iconName && { iconName: bookmark.iconName }),
        ...(bookmark.visits !== undefined && { visits: bookmark.visits }),
      };

      const { success, message, data }: OasisResponse<Bookmark> = await (
        await fetch(`/api/bookmarks/${bookmark.id}`, {
          method: 'PATCH',
          body: JSON.stringify(updatedFields),
        })
      ).json();

      if (!success) throw new Error(message);

      const onlyVisitsUpdated =
        Object.keys(updatedFields).length === 1 &&
        updatedFields.visits !== undefined;

      return {
        bookmark: data,
        message,
        onlyVisitsUpdated,
      };
    },
    onSuccess: async ({
      message,
      onlyVisitsUpdated,
    }: {
      message: string;
      onlyVisitsUpdated: boolean;
    }) => {
      if (!onlyVisitsUpdated) toast.success(message);

      await queryClient.invalidateQueries({
        queryKey: ['bookmarks'],
      });
    },
    onError: (error: any) => toast.error(error.message),
  });
};
