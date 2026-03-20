import { db } from '@/db';
import { assets, exchangeRates, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { Big } from 'big.js';
import { createRateConverter } from './exchangeRate';

function getLatestTimestamp(
  rows: Array<{ asset: { updatedAt: Date | null }; rateUpdatedAt: Date | null }>,
): Date {
  const timestamps = rows.flatMap((row) =>
    [row.asset.updatedAt, row.rateUpdatedAt].filter(
      (d): d is Date => d != null,
    ),
  );
  const max =
    timestamps.length > 0 ? Math.max(...timestamps.map((d) => d.getTime())) : 0;
  return max > 0 ? new Date(max) : new Date();
}

export async function getAssetSummary(externalId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.externalId, externalId),
  });

  if (!user) throw new Error('User not found');

  const results = await db
    .select({
      asset: assets,
      rate: exchangeRates.rate,
      rateUpdatedAt: exchangeRates.updatedAt,
    })
    .from(assets)
    .leftJoin(
      exchangeRates,
      and(
        eq(exchangeRates.fromCurrency, assets.currency),
        eq(exchangeRates.toCurrency, user.baseCurrency),
      ),
    )
    .where(eq(assets.userId, user.id));

  const convert = await createRateConverter();

  const processedAssets = results.map((row) => {
    const { asset } = row;
    const balanceValue = new Big(asset.balance);
    const rateValue = convert(asset.currency, user.baseCurrency) ?? '0';
    const valueInBaseCurrency = balanceValue.times(rateValue);

    return {
      ...asset,
      currentRate: rateValue,
      valueInBaseCurrency: valueInBaseCurrency.toFixed(2),
    };
  });

  const totalNetWorth = processedAssets.reduce(
    (acc, curr) => acc.plus(new Big(curr.valueInBaseCurrency)),
    new Big(0),
  );

  const lastUpdated = getLatestTimestamp(results);

  return {
    assets: processedAssets,
    baseCurrency: user.baseCurrency,
    lastUpdated,
    totalNetWorth: totalNetWorth.toFixed(2),
  };
}

export type AssetSummary = Awaited<ReturnType<typeof getAssetSummary>>;
export type AssetSummaryItem = AssetSummary['assets'][number];
