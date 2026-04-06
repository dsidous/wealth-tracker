'use server';

import { revalidatePath } from 'next/cache';
import { updateAsset } from '@/services/assets';
import { editAssetFormSchema } from '@/validation/editAssetForm';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function editAssetAction(raw: unknown) {
  const { userId: externalId } = await auth();

  if (!externalId) {
    throw new Error('Unauthorized');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.externalId, externalId),
  });

  if (!user) {
    throw new Error('User not found');
  }

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
