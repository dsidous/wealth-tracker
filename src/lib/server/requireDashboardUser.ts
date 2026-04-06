import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';

/** Clerk session + row in `users` (by `external_id`). Throws if missing. */
export async function requireDashboardUser() {
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

  return user;
}
