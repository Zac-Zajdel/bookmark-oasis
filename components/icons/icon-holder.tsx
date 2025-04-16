import DynamicIcon from '@/components/icons/dynamic-icon';
import { Button } from '@/components/ui/button';
import { Bookmark, Folder } from '@prisma/client';
import { useState } from 'react';

import { IconName } from 'lucide-react/dynamic';
import dynamic from 'next/dynamic';
const IconPicker = dynamic(() => import('@/components/icons/icon-picker'), {
  ssr: false,
});

interface IconHolderProps {
  module?: Bookmark | Folder;
  iconName: string;
  isLoading: boolean;
  onSelectIcon: (icon: string) => void;
}

export function IconHolder({
  module,
  iconName,
  isLoading,
  onSelectIcon,
}: IconHolderProps) {
  const [showIconPicker, setShowIconPicker] = useState(false);

  const selectIcon = (icon: string) => {
    selectNewIcon();
    onSelectIcon(icon);
  };

  const selectNewIcon = () => setShowIconPicker(!showIconPicker);

  const IconPickerWrapper = () => {
    if (!showIconPicker) return null;

    return (
      <div className="bg-background absolute z-10 max-w-60 min-w-60 rounded-lg shadow-lg">
        <div className="rounded-lg border p-2">
          <IconPicker onSelectIcon={selectIcon} />
        </div>
      </div>
    );
  };

  return (
    <>
      {module && 'imageUrl' in module && module.imageUrl !== null ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={module.imageUrl}
            alt={module.title}
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
              name={
                isLoading
                  ? ('loader' as IconName)
                  : (iconName as IconName) || ('search' as IconName)
              }
              className="size-5"
            />
          </Button>

          <div className="bg-background absolute z-10 max-w-60 min-w-60 rounded-lg shadow-lg">
            <IconPickerWrapper />
          </div>
        </div>
      )}
    </>
  );
}
