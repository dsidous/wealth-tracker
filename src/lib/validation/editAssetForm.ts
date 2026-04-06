import { z } from 'zod';
import { addAssetFormSchema } from './addAssetForm';

export const editAssetFormSchema = addAssetFormSchema.extend({
  id: z.uuid('Invalid asset id'),
});

export type EditAssetFormValues = z.infer<typeof editAssetFormSchema>;
