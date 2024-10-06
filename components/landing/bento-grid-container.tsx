import { Bookmark, Folder, Star, Tag, Trash } from 'lucide-react';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';

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
const Skeleton = () => (
  <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"></div>
);
const items = [
  {
    title: 'Bookmarks',
    description: 'Save links to your favorite content in a central location.',
    header: <Skeleton />,
    icon: <Bookmark className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'Folders',
    description: 'Organize your bookmarks using folders for easy retrieval.',
    header: <Skeleton />,
    icon: <Folder className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'Tags',
    description: 'Categorize and search your bookmark using custom tags.',
    header: <Skeleton />,
    icon: <Tag className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'The Pursuit of Knowledge',
    description: 'Join the quest for understanding and enlightenment.',
    header: <Skeleton />,
    icon: <Star className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'The Joy of Creation',
    description: 'Experience the thrill of bringing ideas to life.',
    header: <Skeleton />,
    icon: <Trash className="h-4 w-4 text-neutral-500" />,
  },
];
