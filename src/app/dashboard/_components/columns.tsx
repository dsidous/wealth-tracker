'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import type { AssetSummaryItem } from '@/services/assets';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditAssetDialog } from './editAssetDialog';

const assetTypeBadgeVariants = {
  CASH: 'secondary',
  STOCK: 'destructive',
  GOLD: 'outline',
  CRYPTO: 'default',
  REAL_ESTATE: 'secondary',
} as const;

export type AssetTableActions = {
  onRequestDelete: (asset: AssetSummaryItem) => void;
};

export function createAssetColumns({
  onRequestDelete,
}: AssetTableActions): ColumnDef<AssetSummaryItem>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Asset',
    },
    {
      accessorKey: 'type',
      header: () => <div className='text-center'>Type</div>,
      cell: ({ row }) => (
        <div className='flex items-center justify-center'>
          <Badge
            variant={
              assetTypeBadgeVariants[
                row.original.type as keyof typeof assetTypeBadgeVariants
              ]
            }
          >
            {row.original.type}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'currency',
      header: () => <div className='text-center'>Currency</div>,
      cell: ({ row }) => (
        <div className='font-mono text-center text-xs'>
          <Badge variant='outline'>{row.original.currency}</Badge>
        </div>
      ),
    },
    {
      accessorKey: 'currentRate',
      header: () => <div className='text-right'>Current Rate</div>,
      cell: ({ row }) => (
        <div className='font-mono text-right text-xs'>
          {`${parseFloat(row.original.currentRate).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        </div>
      ),
    },
    {
      accessorKey: 'balance',
      header: () => <div className='text-right'>Balance</div>,
      cell: ({ row }) => (
        <div className='font-mono text-right'>
          {`${parseFloat(row.original.balance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        </div>
      ),
      maxSize: 100,
    },

    {
      accessorKey: 'valueInBaseCurrency',
      header: () => <div className='text-right'>Value (THB)</div>,
      cell: ({ row }) => {
        const { valueInBaseCurrency } = row.original;

        return (
          <div className='font-mono text-right'>
            {`฿${parseFloat(valueInBaseCurrency).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className='text-right'>Actions</div>,
      cell: ({ row }) => (
        <div className='flex items-center justify-end gap-0.5'>
          <EditAssetDialog asset={row.original} />
          <Button
            type='button'
            variant='ghost'
            size='icon-xs'
            className='text-muted-foreground hover:text-destructive'
            aria-label={`Delete ${row.original.name}`}
            onClick={() => onRequestDelete(row.original)}
          >
            <Trash2 className='size-4 text-destructive' />
          </Button>
        </div>
      ),
      enableSorting: false,
      size: 72,
    },
  ];
}
