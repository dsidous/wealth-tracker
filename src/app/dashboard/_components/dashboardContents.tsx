import { getAssetSummary } from '@/services/assets';
import { AssetsDataTable } from './assetsDataTable';
import { TotalNetWorth } from './totalNetWorth';

export default async function DashboardContents() {
  const { assets, totalNetWorth, baseCurrency, lastUpdated } =
    await getAssetSummary('user_test_clerk_123');

  return (
    <div className='flex flex-col gap-4 justify-between'>
      <TotalNetWorth
        totalNetWorth={totalNetWorth}
        baseCurrency={baseCurrency}
        lastUpdated={lastUpdated}
      />
      <AssetsDataTable assets={assets} />
    </div>
  );
}
