import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { getAssetSummary } from '@/services/assets';
import { formatDate } from '@/utils';
import { AssetsDataTable } from './assetsDataTable';

export default async function DashboardContents() {
  const { assets, totalNetWorth, baseCurrency, lastUpdated } =
    await getAssetSummary('user_test_clerk_123');

  return (
    <div className='flex flex-col gap-4 justify-between'>
      <Card className='w-xs'>
        <CardHeader>
          <CardTitle>Total Net Worth</CardTitle>
          <CardContent className='text-3xl font-bold text-center'>
            {`${parseFloat(totalNetWorth).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} ${baseCurrency}`}
          </CardContent>
          <CardFooter className='flex justify-end border-none bg-transparent'>
            <p className='text-xs text-muted-foreground'>
              Last updated: {formatDate(lastUpdated)}
            </p>
          </CardFooter>
        </CardHeader>
      </Card>
      <AssetsDataTable assets={assets} />
    </div>
  );
}
