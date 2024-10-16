import * as LucideIcons from 'lucide-react';
import { icons } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

type LucideIcon = keyof typeof icons;

const iconsArray = Object.keys(icons) as LucideIcon[];

const IconButton = React.memo(function IconButton({
  iconName,
  onClick,
  isSelected,
}: {
  iconName: LucideIcon;
  onClick: (iconName: LucideIcon) => void;
  isSelected: boolean;
}) {
  const IconComponent = LucideIcons[iconName];

  return (
    <div
      className={`cursor-pointer justify-self-center rounded-md border p-2 ${
        isSelected ? 'bg-muted-foreground/20' : ''
      }`}
      onClick={() => onClick(iconName)}
    >
      <IconComponent size={24} />
    </div>
  );
});

export default function EmojiPicker() {
  const [selectedIcon, setSelectedIcon] = useState<LucideIcon | null>(null);

  // Memoize the click handler with useCallback to avoid unnecessary re-renders
  const handleIconClick = useCallback((iconName: LucideIcon) => {
    setSelectedIcon(iconName);
  }, []);

  // Memoizing the iconsArray as it will not change during the component's lifecycle
  const memoizedIconsArray = useMemo(() => iconsArray, []);

  return (
    <>
      <div className="mb-5 flex items-center justify-center">
        {selectedIcon ? (
          <>
            <div className="pr-4">
              {React.createElement(LucideIcons[selectedIcon], { size: 32 })}
            </div>
            <p>{selectedIcon}</p>
          </>
        ) : (
          <p>No icon selected</p>
        )}
      </div>

      <div className="grid grid-cols-12 gap-2">
        <Virtuoso
          style={{ height: '1000px' }}
          totalCount={memoizedIconsArray.length}
          itemContent={(index) => {
            const iconName = memoizedIconsArray[index];
            return (
              <IconButton
                key={iconName}
                iconName={iconName}
                onClick={handleIconClick}
                isSelected={selectedIcon === iconName}
              />
            );
          }}
        />
        {/* {memoizedIconsArray.map((iconName) => (
          <IconButton
            key={iconName}
            iconName={iconName}
            onClick={handleIconClick}
            isSelected={selectedIcon === iconName}
          />
        ))} */}
      </div>
    </>
  );
}
