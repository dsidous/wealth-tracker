import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { HomeMarketing } from './_components/home-marketing';

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }

  return <HomeMarketing />;
}
