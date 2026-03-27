'use server';

import { revalidatePath } from 'next/cache';
import { createAsset } from '@/services/assets';
import { addAssetFormSchema } from '@/validation/addAssetForm';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function addAssetAction(raw: unknown) {
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

  const validated = addAssetFormSchema.parse(raw);

  await createAsset({
    ...validated,
    currency: validated.currency.toUpperCase(),
    userId: user.id,
  });

  revalidatePath('/dashboard');
}
