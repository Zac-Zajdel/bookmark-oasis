import BookmarkCard from '@/components/bookmarks/bookmark-card';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { Bookmark, Code, Folder, Tag, Trash } from 'lucide-react';
import { BentoApiAccess } from './bento-api-access';
import { BentoFolders } from './bento-folders';
import { BentoTags } from './bento-tags';

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

// TODO - Remove Afterward
const Skeleton = () => (
  <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"></div>
);

// TODO - Add TypeScript interface
const items = [
  {
    title: 'Bookmarks',
    description: 'Save links to your favorite content in a central location.',
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
    description: 'Organize your bookmarks using folders for easy retrieval.',
    header: <BentoFolders />,
    icon: <Folder className="size-4 text-neutral-500" />,
  },
  {
    title: 'API Access',
    description:
      'For developers to add bookmark management to apps and workflows.',
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
    title: 'The Joy of Creation',
    description: 'Experience the thrill of bringing ideas to life.',
    header: <Skeleton />,
    icon: <Trash className="size-4 text-neutral-500" />,
  },
];
