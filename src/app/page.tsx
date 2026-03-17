import { db } from '@/db';
import { users } from '@/db/schema';

export default async function Page() {
  const usersData = await db.select().from(users);
  return (
    <div>
      {usersData?.map((user) => (
        <div key={user.id}>{user.baseCurrency}</div>
      ))}
    </div>
  );
}
