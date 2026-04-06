'use server';

import { revalidatePath } from 'next/cache';
import { updateAsset } from '@/services/assets';
import { editAssetFormSchema } from '@/validation/editAssetForm';
import { requireDashboardUser } from '@/server/requireDashboardUser';

export async function editAssetAction(raw: unknown) {
  const user = await requireDashboardUser();

  const validated = editAssetFormSchema.parse(raw);

  const updated = await updateAsset(validated.id, user.id, {
    name: validated.name,
    balance: validated.balance,
    currency: validated.currency.toUpperCase(),
    type: validated.type,
  });

  if (!updated) {
    throw new Error('Asset not found');
  }

  revalidatePath('/dashboard');
}
