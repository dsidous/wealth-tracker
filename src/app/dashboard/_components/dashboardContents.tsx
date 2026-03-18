import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { getDashboardData } from '@/services/assets/assets';
import { formatDate } from '@/utils';

export default async function DashboardContents() {
  const { assets, totalNetWorth, baseCurrency, lastUpdated } =
    await getDashboardData('user_test_clerk_123');

  console.log(assets, totalNetWorth, baseCurrency, lastUpdated);

  return (
    <div className='flex flex-row gap-4 justify-between'>
      <Card className='w-xs'>
        <CardHeader>
          <CardTitle>
            Total Net Worth: {totalNetWorth} {baseCurrency}
          </CardTitle>
          <CardDescription>
            Last updated: {formatDate(lastUpdated)}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className='w-lg'>
        <CardHeader>
          <CardTitle>Total Net Worth</CardTitle>
          <CardDescription>
            The total value of all your assets minus your liabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>...</div>
        </CardContent>
      </Card>
    </div>
  );
}
