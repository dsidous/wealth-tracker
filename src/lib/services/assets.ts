import { db } from '@/db';
import { assets, exchangeRates, transactions, users } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { Big } from 'big.js';
import { syncRateConverter } from './exchangeRate';
import { syncAllRates } from './syncAllRates';

function getLatestTimestamp(items: Array<{ updatedAt: Date | null }>): Date {
  const timestamps = items
    .flatMap((item) => item.updatedAt)
    .filter((d): d is Date => d != null);
  const max =
    timestamps.length > 0 ? Math.max(...timestamps.map((d) => d.getTime())) : 0;
  return max > 0 ? new Date(max) : new Date();
}

export async function getAssetSummary(externalId: string) {
  const [userWithAssets, initialRates] = await Promise.all([
    db.query.users.findFirst({
      where: eq(users.externalId, externalId),
      with: {
        assets: true,
      },
    }),
    db.select().from(exchangeRates),
  ]);

  if (!userWithAssets) throw new Error('User not found');

  let allRates = initialRates;
  const SIX_HOURS = 1000 * 60 * 60 * 6;
  const latestRateUpdate =
    allRates.length > 0 ? new Date(allRates[0].updatedAt ?? 0).getTime() : 0;

  if (Date.now() - latestRateUpdate > SIX_HOURS) {
    console.log('🔄 Rates are stale. Triggering Lazy Sync...');
    await syncAllRates();
    allRates = await db.select().from(exchangeRates);
  }

  const convert = syncRateConverter(allRates);

  const processedAssets = userWithAssets.assets.map((asset) => {
    const convertedValue = convert(
      asset.balance,
      asset.currency,
      userWithAssets.baseCurrency,
    );

    const unitRate = convert('1', asset.currency, userWithAssets.baseCurrency);

    const valueInBaseCurrency = convertedValue
      ? new Big(convertedValue)
      : new Big(0);

    return {
      ...asset,
      currentRate: unitRate ?? '0',
      valueInBaseCurrency: valueInBaseCurrency.toFixed(2),
      isRateMissing: !convertedValue && asset.balance !== '0',
    };
  });

  const totalNetWorth = processedAssets.reduce(
    (acc, curr) => acc.plus(new Big(curr.valueInBaseCurrency)),
    new Big(0),
  );

  const lastUpdated = getLatestTimestamp(userWithAssets.assets);

  return {
    assets: processedAssets,
    baseCurrency: userWithAssets.baseCurrency,
    lastUpdated,
    totalNetWorth: totalNetWorth.toFixed(2),
  };
}

export type AssetSummary = Awaited<ReturnType<typeof getAssetSummary>>;
export type AssetSummaryItem = AssetSummary['assets'][number];

export type NewAsset = typeof assets.$inferInsert;

export async function createAsset(data: NewAsset) {
  const [result] = await db.insert(assets).values(data).returning();
  return result;
}

export type AssetUpdateFields = Pick<
  NewAsset,
  'name' | 'balance' | 'currency' | 'type'
>;

export async function updateAsset(
  assetId: string,
  userId: string,
  data: AssetUpdateFields,
) {
  const [row] = await db
    .update(assets)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(assets.id, assetId), eq(assets.userId, userId)))
    .returning();

  return row ?? null;
}

export async function deleteAsset(assetId: string, userId: string) {
  return db.transaction(async (tx) => {
    await tx.delete(transactions).where(eq(transactions.assetId, assetId));
    const removed = await tx
      .delete(assets)
      .where(and(eq(assets.id, assetId), eq(assets.userId, userId)))
      .returning({ id: assets.id });
    return removed[0] ?? null;
  });
}
