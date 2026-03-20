import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { formatDate } from '@/utils';

type TotalNetWorthProps = {
  totalNetWorth: string;
  baseCurrency: string;
  lastUpdated: Date;
};

export const TotalNetWorth = ({
  totalNetWorth,
  baseCurrency,
  lastUpdated,
}: TotalNetWorthProps) => {
  return (
    <Card className='w-xs'>
      <CardHeader>
        <CardTitle>Total Net Worth</CardTitle>
        <CardContent className='text-3xl font-bold text-center'>
          <div className='font-mono flex items-center justify-center gap-2'>
            {`${parseFloat(totalNetWorth).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} ${baseCurrency}`}
          </div>
        </CardContent>
        <CardFooter className='flex justify-end border-none bg-transparent pt-0'>
          <p className='text-xs text-muted-foreground'>
            Last updated: {formatDate(lastUpdated)}
          </p>
        </CardFooter>
      </CardHeader>
    </Card>
  );
};
