import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { ensureUserByClerkId } from '@/services/users';

/** Clerk session + row in `users` (by `external_id`). Creates the row if the webhook has not run yet. */
export async function requireDashboardUser() {
  const { userId: externalId } = await auth();

  if (!externalId) {
    throw new Error('Unauthorized');
  }

  let user = await db.query.users.findFirst({
    where: eq(users.externalId, externalId),
  });

  if (!user) {
    await ensureUserByClerkId(externalId);
    user = await db.query.users.findFirst({
      where: eq(users.externalId, externalId),
    });
  }

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}
