import { z } from 'zod';
import { assetTypes } from '@/db/schema';

export const addAssetFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  balance: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: 'Balance must be a valid number',
  }),
  currency: z.string().length(3, 'Currency must be 3 letters'),
  type: z.enum(assetTypes.enumValues, {
    message: 'Select an asset type',
  }),
});

export type AddAssetFormValues = z.infer<typeof addAssetFormSchema>;
