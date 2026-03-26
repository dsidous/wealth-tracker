'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { addAssetAction } from '../_actions/addAssetAction';
import { FormInputField, FormSelectField } from '@/components/formFields';
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
import { assetTypes } from '@/db/schema';
import {
  addAssetFormSchema,
  type AddAssetFormValues,
} from '@/validation/addAssetForm';

const assetTypeOptions = assetTypes.enumValues.map((t) => ({
  value: t,
  label: t,
}));

const addAssetFormDefaults: AddAssetFormValues = {
  name: '',
  balance: '',
  currency: '',
  type: 'CASH',
};

async function submitAddAssetForm(values: AddAssetFormValues) {
  const fd = new FormData();
  fd.set('name', values.name);
  fd.set('balance', values.balance);
  fd.set('currency', values.currency.toUpperCase());
  fd.set('type', values.type);
  await addAssetAction(fd);
}

export function AddAssetDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<AddAssetFormValues>({
    resolver: zodResolver(addAssetFormSchema),
    defaultValues: addAssetFormDefaults,
  });

  const handleSubmit = async (values: AddAssetFormValues) => {
    await submitAddAssetForm(values);
    form.reset(addAssetFormDefaults);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className='w-full'>
        <Button>Add Asset</Button>
      </DialogTrigger>
      <DialogContent>
        <HookForm form={form} className='space-y-4' onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Asset</DialogTitle>
            <DialogDescription>
              Add a new asset to your portfolio.
            </DialogDescription>
          </DialogHeader>
          <FormInputField
            name='name'
            label='Asset Name'
            placeholder='e.g. Cold Wallet BTC'
            autoComplete='off'
          />
          <div className='grid grid-cols-2 gap-4'>
            <FormInputField
              name='balance'
              label='Balance'
              type='number'
              step='any'
              placeholder='0.5'
            />
            <FormSelectField
              name='type'
              label='Asset Type'
              placeholder='Select an asset type'
              options={assetTypeOptions}
            />
            <FormInputField
              name='currency'
              label='Currency'
              placeholder='THB'
              autoCapitalize='characters'
              maxLength={3}
              className='col-span-2 sm:col-span-1'
            />
          </div>
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
