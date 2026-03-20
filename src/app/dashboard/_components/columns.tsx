'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { AssetSummaryItem } from '@/services/assets';

export const columns: ColumnDef<AssetSummaryItem>[] = [
  {
    accessorKey: 'name',
    header: 'Asset',
  },
  {
    accessorKey: 'balance',
    header: 'Balance',
    cell: ({ row }) => (
      <div className='font-mono'>
        {row.original.balance} {row.original.currency}
      </div>
    ),
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    cell: ({ row }) => <div className='font-mono'>{row.original.currency}</div>,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <div className='font-mono'>{row.original.type}</div>,
  },
  {
    accessorKey: 'valueInBaseCurrency',
    header: () => <div className='text-right'>Value (THB)</div>,
    cell: ({ row }) => {
      const { valueInBaseCurrency } = row.original;

      return (
        <div className='flex items-center justify-end gap-2 font-medium'>
          {`฿${parseFloat(valueInBaseCurrency).toLocaleString()}`}
        </div>
      );
    },
  },
];
