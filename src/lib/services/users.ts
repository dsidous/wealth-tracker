import { db } from '@/db';
import { users } from '@/db/schema';

export async function upsertUser(clerkId: string) {
  return await db
    .insert(users)
    .values({
      externalId: clerkId,
      baseCurrency: 'THB',
    })
    .onConflictDoNothing({
      target: users.externalId,
    })
    .returning();
}
