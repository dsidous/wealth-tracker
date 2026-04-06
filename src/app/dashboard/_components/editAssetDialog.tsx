'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil } from 'lucide-react';

import { editAssetAction } from '../_actions/editAssetAction';
import { AssetFormFields } from './assetFormFields';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HookForm } from '@/components/ui/hookForm';
import type { AssetSummaryItem } from '@/services/assets';
import {
  editAssetFormSchema,
  type EditAssetFormValues,
} from '@/validation/editAssetForm';

function toFormValues(asset: AssetSummaryItem): EditAssetFormValues {
  return {
    id: asset.id,
    name: asset.name,
    balance: asset.balance,
    currency: asset.currency,
    type: asset.type,
  };
}

type EditAssetDialogProps = {
  asset: AssetSummaryItem;
};

export function EditAssetDialog({ asset }: EditAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const wasOpen = useRef(false);

  const form = useForm<EditAssetFormValues>({
    resolver: zodResolver(editAssetFormSchema),
    defaultValues: toFormValues(asset),
  });

  useEffect(() => {
    if (open && !wasOpen.current) {
      form.reset(toFormValues(asset));
    }
    wasOpen.current = open;
  }, [open, asset, form]);

  const handleSubmit = async (values: EditAssetFormValues) => {
    setOpen(false);
    try {
      await editAssetAction(values);
    } catch {
      setOpen(true);
      form.reset(toFormValues(asset));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon-xs'
          className='text-muted-foreground hover:text-foreground'
          aria-label={`Edit ${asset.name}`}
        >
          <Pencil className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <HookForm form={form} className='space-y-4' onSubmit={handleSubmit}>
          <input type='hidden' {...form.register('id')} />
          <DialogHeader>
            <DialogTitle>Edit asset</DialogTitle>
            <DialogDescription>
              Update name, balance, currency, or type. Changes apply
              immediately.
            </DialogDescription>
          </DialogHeader>
          <AssetFormFields />
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </HookForm>
      </DialogContent>
    </Dialog>
  );
}
