import Navbar from '@/components/ui/navbar';

interface BookmarkLayoutProps {
  children: React.ReactNode;
}

export default function FolderLayout({ children }: BookmarkLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}
