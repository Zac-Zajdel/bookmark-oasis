import BookmarkCard from '@/components/bookmarks/bookmark-card';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { Bookmark, Code, Folder, ListChecks, Tag } from 'lucide-react';
import { ReactNode } from 'react';
import { BentoApiAccess } from './bento-api-access';
import { BentoFolders } from './bento-folders';
import { BentoTags } from './bento-tags';
import { BentoTask } from './bento-task';

export interface BentoGridContent {
  className?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
}

export function BentoGridContainer() {
  return (
    <BentoGrid className="mx-auto max-w-4xl">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? 'md:col-span-2' : ''}
        />
      ))}
    </BentoGrid>
  );
}

const items: BentoGridContent[] = [
  {
    title: 'Bookmarks',
    description: 'Save your favorite websites for later.',
    header: (
      <BookmarkCard
        bookmark={{
          url: 'https://www.youtube.com/',
          title: 'Youtube',
          description:
            'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
          imageUrl:
            'https://www.youtube.com/s/desktop/87338098/img/favicon.ico',
        }}
        onDelete={() => {}}
        onFavorite={() => {}}
      />
    ),
    icon: <Bookmark className="size-4 text-neutral-500" />,
  },
  {
    title: 'Folders',
    description: 'Organize your content with folders.',
    header: <BentoFolders />,
    icon: <Folder className="size-4 text-neutral-500" />,
  },
  {
    title: 'API Access',
    description: 'Easy integration for any workflow.',
    header: <BentoApiAccess />,
    icon: <Code className="size-4 text-neutral-500" />,
  },
  {
    title: 'Tags',
    description: 'Categorize and search your bookmark using custom tags.',
    header: <BentoTags />,
    icon: <Tag className="size-4 text-neutral-500" />,
  },
  {
    title: 'Tasks',
    description: 'Add tasks for future action items.',
    header: <BentoTask />,
    icon: <ListChecks className="size-4 text-neutral-500" />,
  },
];
