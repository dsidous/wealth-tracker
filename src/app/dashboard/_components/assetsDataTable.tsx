import { DataTable } from '@/components/dataTable/dataTable';
import { columns } from './columns';
import type { AssetSummaryItem } from '@/services/assets';

type AssetsDataTableProps = {
  assets: AssetSummaryItem[];
};

export function AssetsDataTable({ assets }: AssetsDataTableProps) {
  return <DataTable columns={columns} data={assets} />;
}
