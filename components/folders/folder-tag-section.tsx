import TagSearchDropdown from '@/components/tags/tag-search-dropdown';
import { Label } from '@/components/ui/label';
import { useCreateFolderTagMutation } from '@/hooks/api/folderTag/useCreateFolderTagMutation';
import { useDeleteFolderTagMutation } from '@/hooks/api/folderTag/useDeleteFolderTagMutation';

export default function FolderTagSection({ folderId }: { folderId: string }) {
  const createFolderTagMutation = useCreateFolderTagMutation();
  const deleteFolderTagMutation = useDeleteFolderTagMutation();

  return (
    <>
      <Label className="mb-1">Tags</Label>
      <TagSearchDropdown
        isPendingMutation={
          createFolderTagMutation.isPending || deleteFolderTagMutation.isPending
        }
        folderId={folderId}
        onSelect={(option) => {
          createFolderTagMutation.mutate({
            tagId: option.id,
            folderId,
          });
        }}
        onCreate={(option) => {
          createFolderTagMutation.mutate({
            folderId,
            tagName: option.value,
            tagColor: option.color,
          });
        }}
        onRemove={(option) => {
          deleteFolderTagMutation.mutate({
            tagId: option.id,
            folderId,
          });
        }}
      />
    </>
  );
}
