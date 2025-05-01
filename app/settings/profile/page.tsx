'use client';

import DangerZone from '@/components/settings/danger-zone';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SectionHeader } from '@/components/ui/section-header';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { UserThemes } from '@/types/settings';
import { Check, ChevronsUpDown, MonitorCog, Moon, Sun } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const themes: UserThemes[] = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
  },
  {
    value: 'system',
    label: 'System',
    icon: MonitorCog,
  },
];

export default function ProfileSettings() {
  const [open, setOpen] = useState(false);
  const { data: session, update } = useSession();

  const [name, setName] = useState('');
  const debouncedName = useDebounce(name, 250);

  useEffect(() => {
    if (session?.user?.name && !name) {
      setName(session.user.name);
      return;
    }

    if (debouncedName && debouncedName !== session?.user?.name) {
      update({ name: debouncedName });
      toast.success('Name updated.');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName, session?.user?.name, name]);

  const { theme, setTheme } = useTheme();
  const selectedTheme = themes.find((t) => t.value === theme);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div>
      <SectionHeader
        title="Profile"
        description="Adjust your personal information and preferences."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            required
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
            placeholder="Name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            required
            id="email"
            type="email"
            disabled
            readOnly
            defaultValue={session?.user?.email ?? ''}
            className="mt-1"
            placeholder="Email"
          />
        </div>

        <div>
          <h2 className="mt-1.5 mb-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Theme
          </h2>
          <Popover
            open={open}
            onOpenChange={setOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {mounted && selectedTheme ? (
                  <div className="flex items-center">
                    {selectedTheme.icon && (
                      <selectedTheme.icon className="mr-2 size-4" />
                    )}
                    {selectedTheme.label}
                  </div>
                ) : (
                  'Select theme...'
                )}
                <ChevronsUpDown className="size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="flex justify-start p-0"
              align="start"
            >
              <Command>
                <CommandList>
                  <CommandGroup>
                    {themes.map((themeOption) => (
                      <CommandItem
                        key={themeOption.value}
                        value={themeOption.value}
                        onSelect={(currentValue) => {
                          setTheme(currentValue);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          {themeOption.icon && (
                            <themeOption.icon className="mr-2 size-4" />
                          )}
                          {themeOption.label}
                        </div>
                        <Check
                          className={cn(
                            'ml-auto',
                            theme === themeOption.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="created">Created</Label>
          <Input
            disabled
            id="created"
            type="text"
            readOnly
            defaultValue={
              session?.user?.createdAt
                ? new Date(session.user.createdAt).toLocaleDateString()
                : ''
            }
            className="mt-1"
            placeholder="Created At"
          />
        </div>
      </div>

      <Separator className="my-10" />
      <DangerZone />
    </div>
  );
}
