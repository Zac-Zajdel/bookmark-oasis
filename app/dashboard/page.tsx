import BookmarkSection from '@/components/bookmarks/bookmark-section';
import FolderSection from '@/components/folders/folder-section';
import { Separator } from '@/components/ui/separator';

export default function Dashboard() {
  return (
    <div className="container">
      <FolderSection />
      <Separator className="mt-10 mb-5" />
      <BookmarkSection />
    </div>
  );
}
