'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';

import { addAssetAction } from '../_actions/addAssetAction';
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
import {
  addAssetFormSchema,
  type AddAssetFormValues,
} from '@/validation/addAssetForm';

const addAssetFormDefaults: AddAssetFormValues = {
  name: '',
  balance: '',
  currency: '',
  type: 'CASH',
};

export function AddAssetDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<AddAssetFormValues>({
    resolver: zodResolver(addAssetFormSchema),
    defaultValues: addAssetFormDefaults,
  });

  const handleSubmit = async (values: AddAssetFormValues) => {
    await addAssetAction(values);
    form.reset(addAssetFormDefaults);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='flex w-full justify-end'>
          <Button size='sm' aria-label='Add Asset'>
            <Plus />
            Add Asset
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <HookForm form={form} className='space-y-4' onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Asset</DialogTitle>
            <DialogDescription>
              Add a new asset to your portfolio.
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
              Save Asset
            </Button>
          </DialogFooter>
        </HookForm>
      </DialogContent>
    </Dialog>
  );
}
