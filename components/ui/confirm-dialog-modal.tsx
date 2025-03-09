'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

export interface DialogAction {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
  icon?: React.ReactNode;
  isLoading?: boolean;
  loadingIndicator?: React.ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
}

interface ConfirmDialogProps {
  /**
   * Determines if modal is displayed.
   */
  open: boolean;

  /**
   * Enable or disable modal AlertDialog
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Title for action
   */
  title?: string;

  /**
   * Gives the user more context about said action.
   */
  description?: string;

  /**
   * Provide a custom node for advanced content if you don't
   * want to rely solely on the `title` and `description`.
   */
  children?: React.ReactNode;

  /**
   * If you want a dedicated cancel button, set this.
   * Otherwise, consider adding it yourself in the actions array.
   */
  showCancel?: boolean;

  /**
   * Customized label for default Cancel button
   */
  cancelLabel?: string;

  /**
   * Optional callback if you actions are necessary upon cancelling.
   */
  onCancel?: () => void;

  /**
   * The array of action buttons to show (OK, Delete, etc.).
   */
  actions?: DialogAction[];
}

export function ConfirmDialogModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  showCancel = true,
  cancelLabel = 'Cancel',
  onCancel,
  actions = [],
}: ConfirmDialogProps) {
  const isAnyActionLoading = actions.some((action) => action.isLoading);

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {description && (
            <AlertDialogDescription className="pb-2">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {children && <div className="pt-2">{children}</div>}

        <AlertDialogFooter>
          {showCancel && (
            <AlertDialogCancel
              disabled={isAnyActionLoading}
              onClick={() => {
                onCancel?.();
                onOpenChange(false);
              }}
            >
              {cancelLabel}
            </AlertDialogCancel>
          )}

          {/* Render each action button */}
          {actions.map((action, i) => {
            const IconOrSpinner = action.isLoading
              ? (action.loadingIndicator ?? (
                  <Loader className="mr-2 size-4 animate-spin" />
                ))
              : action.icon;

            return (
              <AlertDialogAction
                key={i}
                autoFocus={action.autoFocus}
                disabled={
                  isAnyActionLoading || action.disabled || action.isLoading
                }
                onClick={action.onClick}
                className={cn(
                  'mt-2 text-primary sm:mt-0',
                  buttonVariants({ variant: action.variant ?? 'default' }),
                )}
              >
                {IconOrSpinner}
                {action.label}
              </AlertDialogAction>
            );
          })}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
