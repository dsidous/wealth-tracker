'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { deleteAsset } from '@/services/assets';
import { requireDashboardUser } from '@/server/requireDashboardUser';

const deleteAssetPayload = z.object({
  assetId: z.uuid(),
});

export async function deleteAssetAction(raw: unknown) {
  const user = await requireDashboardUser();

  const { assetId } = deleteAssetPayload.parse(raw);

  const removed = await deleteAsset(assetId, user.id);

  if (!removed) {
    throw new Error('Asset not found');
  }

  revalidatePath('/dashboard');
}
