'use server';

import { revalidatePath } from 'next/cache';
import { createAsset } from '@/services/assets';
import {
  addAssetFormSchema,
  AddAssetFormValues,
} from '@/validation/addAssetForm';
import { requireDashboardUser } from '@/server/requireDashboardUser';

export async function addAssetAction(values: AddAssetFormValues) {
  const user = await requireDashboardUser();

  const validated = addAssetFormSchema.parse(values);

  await createAsset({
    ...validated,
    currency: validated.currency.toUpperCase(),
    userId: user.id,
  });

  revalidatePath('/dashboard');
}
