import { getAssetSummary } from '@/services/assets';
import { AssetsDataTable } from './assetsDataTable';
import { TotalNetWorth } from './totalNetWorth';
import { AddAssetDialog } from './addAssetDialog';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardContents() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const { assets, totalNetWorth, baseCurrency, lastUpdated } =
    await getAssetSummary(userId);

  return (
    <div className='container mx-auto space-y-5'>
      <TotalNetWorth
        totalNetWorth={totalNetWorth}
        baseCurrency={baseCurrency}
        lastUpdated={lastUpdated}
      />
      <AddAssetDialog />
      <AssetsDataTable assets={assets} />
    </div>
  );
}
