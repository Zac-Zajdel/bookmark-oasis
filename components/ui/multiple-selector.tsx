'use client';

import { TagBadge } from '@/components/tags/tag-badge';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import * as React from 'react';
import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface Option {
  id: string;
  value: string;
  label: string;
  color?: string;
  disable?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}

interface GroupOption {
  [key: string]: Option[];
}

interface MultipleSelectorProps {
  value?: Option[];
  defaultOptions?: Option[];
  /** manually controlled options */
  options?: Option[];
  placeholder?: string;
  isPendingMutation?: boolean;
  /** Loading component. */
  loadingIndicator?: ReactNode;
  /** Empty component. */
  emptyIndicator?: ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>;
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => Option[];
  onSelect?: (options: Option) => void;
  onCreate?: (value: Option) => void;
  onRemove?: (option: Option) => void;
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  /** Group the options base on provided key. */
  groupBy?: string;
  className?: string;
  badgeClassName?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >;
}

export interface MultipleSelectorRef {
  selectedValue: Option[];
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {};
  }

  if (!groupBy) {
    return {
      '': options,
    };
  }

  const groupOption: GroupOption = {};
  options.forEach((option) => {
    const key = (option[groupBy] as string) || '';
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });

  return groupOption;
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption;

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(
      (val) => !picked.find((p) => p.value === val.value),
    );
  }

  return cloneOption;
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (
      value.some((option) => targetOption.find((p) => p.value === option.value))
    ) {
      return true;
    }
  }

  return false;
}

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 **/
const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn('py-3 text-center text-sm', className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});
CommandEmpty.displayName = 'CommandEmpty';

const MultipleSelector = React.forwardRef<
  MultipleSelectorRef,
  MultipleSelectorProps
>(
  (
    {
      value,
      onSelect,
      onCreate,
      onRemove,
      onSearch,
      onSearchSync,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      loadingIndicator,
      emptyIndicator,
      hidePlaceholderWhenSelected,
      disabled,
      groupBy,
      className,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      isPendingMutation,
    }: MultipleSelectorProps,
    ref: React.Ref<MultipleSelectorRef>,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [onScrollbar, setOnScrollbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [selected, setSelected] = useState<Option[]>(value || []);
    const [options, setOptions] = useState<GroupOption>(
      transToGroupOption(arrayDefaultOptions, groupBy),
    );
    const [inputValue, setInputValue] = useState('');
    const debouncedSearchTerm = useDebounce(inputValue, delay || 250);

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef?.current?.focus(),
        reset: () => setSelected([]),
      }),
      [selected],
    );

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        inputRef.current.blur();
      }
    };

    const handleUnselect = useCallback(
      (option: Option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onRemove?.(option);
      },
      [onRemove, selected],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (input.value === '' && selected.length > 0) {
              handleUnselect(selected[selected.length - 1]);
            }
          }

          // This is not a default behavior of the <input /> field
          if (e.key === 'Escape') {
            input.blur();
          }
        }
      },
      [handleUnselect, selected],
    );

    useEffect(() => {
      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchend', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchend', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchend', handleClickOutside);
      };
    }, [open]);

    useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);

    useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return;
      }

      const newOption = transToGroupOption(arrayOptions || [], groupBy);
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

    useEffect(() => {
      /** sync search */
      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
      };

      const exec = async () => {
        if (!onSearchSync || !open) return;

        if (triggerSearchOnFocus) {
          doSearchSync();
        }

        if (debouncedSearchTerm) {
          doSearchSync();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

    useEffect(() => {
      /** async search */
      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
        setIsLoading(false);
      };

      const exec = async () => {
        if (!onSearch || !open) return;

        // Only trigger search on focus if there's no search term
        if (triggerSearchOnFocus && !debouncedSearchTerm) {
          await doSearch();
          return;
        }

        // Otherwise, only search when there's a search term
        if (debouncedSearchTerm) {
          await doSearch();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

    const CreatableItem = () => {
      if (!creatable) return undefined;

      if (
        isOptionsExist(options, [
          { value: inputValue, label: inputValue, id: '' },
        ]) ||
        selected.find((s) => s.value === inputValue)
      ) {
        return undefined;
      }

      const Item = (
        <CommandItem
          value={inputValue}
          className="cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          disabled={isPendingMutation}
          onSelect={(value: string) => {
            setSelected([
              ...selected,
              { value, label: value, color: 'Blue', name: value, id: '' },
            ]);
            onCreate?.({
              value,
              label: value,
              color: 'Blue',
              name: value,
              id: '',
            });
            setInputValue('');
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      );

      // For normal creatable
      if (!onSearch && inputValue.length > 0) {
        return Item;
      }

      // For async search creatable. avoid showing creatable item before loading at first.
      if (
        onSearch &&
        debouncedSearchTerm.length > 0 &&
        inputValue.length > 0 &&
        !isLoading
      ) {
        return Item;
      }

      return undefined;
    };

    const EmptyItem = useCallback(() => {
      if (!emptyIndicator) return undefined;

      // For async search that showing emptyIndicator
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem
            value="-"
            disabled
          >
            {emptyIndicator}
          </CommandItem>
        );
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [creatable, emptyIndicator, onSearch, options]);

    const selectables = useMemo<GroupOption>(
      () => removePickedOption(options, selected),
      [options, selected],
    );

    /** Avoid Creatable Selector freezing or lagging when paste a long string. */
    const commandFilter = useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
        };
      }

      // Using default filter in `cmdk`. We don't have to provide it.
      return undefined;
    }, [creatable, commandProps?.filter]);

    return (
      <Command
        ref={dropdownRef}
        {...commandProps}
        onKeyDown={(e) => {
          handleKeyDown(e);
          commandProps?.onKeyDown?.(e);
        }}
        className={cn(
          'h-auto overflow-visible bg-transparent',
          commandProps?.className,
        )}
        shouldFilter={
          commandProps?.shouldFilter !== undefined
            ? commandProps.shouldFilter
            : !onSearch
        } // When onSearch is provided, we don't want to filter the options. You can still override it.
        filter={commandFilter()}
      >
        <div
          className={cn(
            'border-input ring-offset-background focus-within:ring-ring min-h-10 rounded-md border text-base focus-within:ring-2 focus-within:ring-offset-2 md:text-sm',
            {
              'px-3 py-2': selected.length !== 0,
              'cursor-text': !disabled && selected.length !== 0,
              'opacity-70': isPendingMutation,
            },
            className,
          )}
          onClick={() => {
            if (disabled) return;
            inputRef?.current?.focus();
          }}
        >
          <div className="relative flex flex-wrap gap-1">
            {/* Add a loading spinner when isPendingMutation is true */}
            {isPendingMutation && (
              <div className="absolute inset-y-0 right-2 flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              </div>
            )}

            {selected.map((option) => {
              return (
                <TagBadge
                  key={option.value}
                  disabled={isPendingMutation || disabled}
                  tag={{
                    id: option.id,
                    name: option.label,
                    color: option.color,
                  }}
                  onRemove={() => {
                    handleUnselect(option);
                  }}
                />
              );
            })}

            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              disabled={disabled || isPendingMutation}
              onValueChange={(value) => {
                setInputValue(value);
                inputProps?.onValueChange?.(value);
              }}
              onBlur={(event) => {
                if (!onScrollbar) {
                  setOpen(false);
                }
                inputProps?.onBlur?.(event);
              }}
              onFocus={(event) => {
                setOpen(true);
                inputProps?.onFocus?.(event);
              }}
              placeholder={
                hidePlaceholderWhenSelected && selected.length !== 0
                  ? ''
                  : placeholder
              }
              className={cn(
                'placeholder:text-muted-foreground flex-1 bg-transparent outline-none',
                {
                  'w-full': hidePlaceholderWhenSelected,
                  'px-3 py-2': selected.length === 0,
                  'ml-1': selected.length !== 0,
                },
                inputProps?.className,
              )}
            />
          </div>
        </div>

        <div className="relative">
          {open && (
            <CommandList
              className="bg-popover text-popover-foreground animate-in absolute top-1 z-10 w-full rounded-md border shadow-md outline-none"
              onMouseLeave={() => {
                setOnScrollbar(false);
              }}
              onMouseEnter={() => {
                setOnScrollbar(true);
              }}
              onMouseUp={() => {
                inputRef?.current?.focus();
              }}
            >
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {EmptyItem()}
                  {CreatableItem()}
                  {!selectFirstItem && (
                    <CommandItem
                      value="-"
                      className="hidden"
                    />
                  )}
                  {Object.entries(selectables).map(([key, dropdowns]) => (
                    <CommandGroup
                      key={key}
                      heading={key}
                      className="h-full overflow-auto"
                    >
                      <>
                        {dropdowns.map((option) => {
                          return (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              disabled={
                                option.disable || disabled || isPendingMutation
                              }
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onSelect={() => {
                                setInputValue('');
                                const newOptions = [...selected, option];
                                setSelected(newOptions);
                                onSelect?.(option);
                              }}
                              className={cn(
                                'cursor-pointer',
                                option.disable &&
                                  'text-muted-foreground cursor-default',
                              )}
                            >
                              {option.label}
                            </CommandItem>
                          );
                        })}
                      </>
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    );
  },
);

MultipleSelector.displayName = 'MultipleSelector';
export default MultipleSelector;
