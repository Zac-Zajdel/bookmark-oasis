import { DynamicIcon } from '@/components/icons/dynamic-icon';
import { Button } from '@/components/ui/button';
import { Bookmark } from '@prisma/client';
import { useState } from 'react';

import dynamic from 'next/dynamic';
const IconPicker = dynamic(() => import('@/components/icons/icon-picker'), {
  ssr: false,
});

interface BookmarkIconProps {
  bookmark?: Bookmark;
  iconName: string;
  isLoading: boolean;
  onSelectIcon: (icon: string) => void;
}

export function BookmarkIcon({
  bookmark,
  iconName,
  isLoading,
  onSelectIcon,
}: BookmarkIconProps) {
  const [showIconPicker, setShowIconPicker] = useState(false);

  const selectIcon = (icon: string) => {
    selectNewIcon();
    onSelectIcon(icon);
  };

  const selectNewIcon = () => setShowIconPicker(!showIconPicker);

  return (
    <>
      {bookmark?.imageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bookmark.imageUrl}
            alt={bookmark.title}
            className="mx-4 size-5"
          />
        </>
      ) : (
        <div>
          <Button
            variant="ghost"
            className="relative"
            onClick={selectNewIcon}
          >
            <DynamicIcon
              name={isLoading ? 'Loading' : iconName || 'Search'}
              className="size-5"
            />
          </Button>

          <div className="absolute z-10 min-w-60 max-w-60 rounded-lg bg-background shadow-lg">
            {showIconPicker && (
              <div className="rounded-lg border p-2">
                <IconPicker onSelectIcon={selectIcon} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
