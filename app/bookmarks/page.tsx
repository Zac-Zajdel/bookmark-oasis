import BookmarkSection from '@/components/bookmarks/bookmark-section';
import FolderSection from '@/components/folders/folder-section';
import { Separator } from '@/components/ui/separator';

export default function Bookmarks() {
  return (
    <div className="container">
      <FolderSection />
      <Separator className="my-10" />
      <BookmarkSection />
    </div>
  );
}
