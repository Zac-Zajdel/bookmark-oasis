import Navbar from '@/components/ui/navbar';
import { ViewTransitions } from 'next-view-transitions';

interface BookmarkLayoutProps {
  children: React.ReactNode;
}

export default function BookmarkLayout({ children }: BookmarkLayoutProps) {
  return (
    <ViewTransitions>
      <div className="min-h-screen">
        <Navbar />
        {children}
      </div>
    </ViewTransitions>
  );
}
