import FolderCardSkeleton from '@/components/folders/folder-card-skeleton';
import { SectionHeader } from '@/components/ui/section-header';

export default function FolderSection() {
  return (
    <div className="mt-10 flex flex-col">
      <SectionHeader
        title="Folders"
        description="Structure and organizer your content."
      >
        Create Folder Button
      </SectionHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <FolderCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
