import { getAssetSummary } from '@/services/assets';
import { AssetsDataTable } from './assetsDataTable';
import { TotalNetWorth } from './totalNetWorth';
import { AddAssetDialog } from './addAssetDialog';
import { auth } from '@clerk/nextjs/server';

export default async function DashboardContents() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const { assets, totalNetWorth, baseCurrency, lastUpdated } =
    await getAssetSummary(userId);

  return (
    <div className='flex flex-col gap-4 justify-between'>
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
