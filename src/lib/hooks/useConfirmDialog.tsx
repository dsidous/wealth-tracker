'use client';

import { useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type ConfirmDialogOptions = {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Use destructive styling on the confirm button */
  destructive?: boolean;
};

/**
 * Imperative confirmation dialog. Render `confirmDialog` once in the tree, then `await confirm({ ... })`.
 *
 * @example
 * const { confirm, confirmDialog } = useConfirmDialog();
 * if (await confirm({ title: 'Delete?', destructive: true })) { ... }
 */
export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setOptions(opts);
      setOpen(true);
    });
  }, []);

  const settle = useCallback((value: boolean) => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    resolve?.(value);
    setOpen(false);
    setOptions(null);
  }, []);

  const onOpenChange = useCallback(
    (next: boolean) => {
      if (!next && resolveRef.current) {
        settle(false);
      }
    },
    [settle],
  );

  const handleConfirm = useCallback(() => {
    settle(true);
  }, [settle]);

  const handleCancel = useCallback(() => {
    settle(false);
  }, [settle]);

  const confirmDialog =
    options != null ? (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{options.title}</DialogTitle>
            {options.description != null ? (
              <DialogDescription>{options.description}</DialogDescription>
            ) : (
              <DialogDescription className='sr-only'>
                {options.title}
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className='flex-col gap-2 sm:flex-row sm:justify-end'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              {options.cancelLabel ?? 'Cancel'}
            </Button>
            <Button
              type='button'
              variant={options.destructive ? 'destructive' : 'default'}
              onClick={handleConfirm}
            >
              {options.confirmLabel ?? 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ) : null;

  return { confirm, confirmDialog };
}
