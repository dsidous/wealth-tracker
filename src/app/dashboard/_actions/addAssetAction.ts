'use server';

import { revalidatePath } from 'next/cache';
import { createAsset } from '@/services/assets';
import { addAssetFormSchema } from '@/validation/addAssetForm';

export async function addAssetAction(formData: FormData) {
  // 2. Validate the user (use Clerk/Auth here)
  const userId = 'ce7c4ef0-c5f1-4b1f-ad4a-e56e30fbb0c2';

  // 3. Validate the inputs
  const rawData = Object.fromEntries(formData.entries());
  const validated = addAssetFormSchema.parse(rawData);

  // 4. Call the Service
  await createAsset({
    ...validated,
    userId,
  });

  // 5. MAGIC: Tell Next.js to refresh the Dashboard data
  revalidatePath('/dashboard');
}
