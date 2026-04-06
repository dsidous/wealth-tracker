'use server';

import { revalidatePath } from 'next/cache';
import { createAsset } from '@/services/assets';
import { addAssetFormSchema } from '@/validation/addAssetForm';
import { requireDashboardUser } from '@/server/requireDashboardUser';

export async function addAssetAction(raw: unknown) {
  const user = await requireDashboardUser();

  const validated = addAssetFormSchema.parse(raw);

  await createAsset({
    ...validated,
    currency: validated.currency.toUpperCase(),
    userId: user.id,
  });

  revalidatePath('/dashboard');
}
