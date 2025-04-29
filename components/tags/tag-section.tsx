import TagSearchDropdown from '@/components/tags/tag-search-dropdown';
import { Label } from '@/components/ui/label';
import { useCreateBookmarkTagMutation } from '@/hooks/api/bookmarkTag/useCreateBookmarkTagMutation';
import { useDeleteBookmarkTagMutation } from '@/hooks/api/bookmarkTag/useDeleteBookmarkTagMutation';

export default function TagSection({ bookmarkId }: { bookmarkId: string }) {
  const createBookmarkTagMutation = useCreateBookmarkTagMutation();
  const deleteBookmarkTagMutation = useDeleteBookmarkTagMutation();

  return (
    <>
      <Label className="mb-1">Tags</Label>
      <TagSearchDropdown
        isPendingMutation={
          createBookmarkTagMutation.isPending ||
          deleteBookmarkTagMutation.isPending
        }
        bookmarkId={bookmarkId}
        onSelect={(option) => {
          createBookmarkTagMutation.mutate({
            tagId: option.id,
            bookmarkId,
          });
        }}
        onCreate={(option) => {
          createBookmarkTagMutation.mutate({
            bookmarkId,
            tagName: option.value,
            tagColor: option.color,
          });
        }}
        onRemove={(option) => {
          deleteBookmarkTagMutation.mutate({
            tagId: option.id,
            bookmarkId,
          });
        }}
      />
    </>
  );
}
