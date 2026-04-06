'use client';

import { useCallback, useMemo } from 'react';
import { DataTable } from '@/components/dataTable/dataTable';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import type { AssetSummaryItem } from '@/services/assets';
import { deleteAssetAction } from '../_actions/deleteAssetAction';
import { createAssetColumns } from './columns';

type AssetsDataTableProps = {
  assets: AssetSummaryItem[];
};

export function AssetsDataTable({ assets }: AssetsDataTableProps) {
  const { confirm, confirmDialog } = useConfirmDialog();

  const handleRequestDelete = useCallback(
    async (asset: AssetSummaryItem) => {
      const ok = await confirm({
        title: 'Delete this asset?',
        description: (
          <>
            Remove <strong>{asset.name}</strong> from your portfolio. Linked
            transactions for this asset will also be removed. This cannot be
            undone.
          </>
        ),
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        destructive: true,
      });
      if (!ok) return;
      try {
        await deleteAssetAction({ assetId: asset.id });
      } catch {
        console.error('Failed to delete asset');
      }
    },
    [confirm],
  );

  const columns = useMemo(
    () =>
      createAssetColumns({
        onRequestDelete: handleRequestDelete,
      }),
    [handleRequestDelete],
  );

  return (
    <>
      <DataTable columns={columns} data={assets} />
      {confirmDialog}
    </>
  );
}
