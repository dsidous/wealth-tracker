import { db } from '@/db';
import { assets, exchangeRates, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { Big } from 'big.js';

export async function getDashboardData(externalId: string) {
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

  let maxTimestamp = 0;

  const processedAssets = results.map((row) => {
    const { asset, rate } = row;

    for (const d of [row.asset.updatedAt, row.rateUpdatedAt].filter(Boolean)) {
      const t = d?.getTime() ?? 0;
      if (t > maxTimestamp) maxTimestamp = t;
    }

    const multiplier =
      asset.currency === user.baseCurrency ? '1' : (rate ?? '0');

    const balanceValue = new Big(asset.balance);
    const rateValue = new Big(multiplier);
    const valueInBaseCurrency = balanceValue.times(rateValue);

    return {
      ...asset,
      currentRate: multiplier,
      valueInBaseCurrency: valueInBaseCurrency.toFixed(2),
    };
  });

  const totalNetWorth = processedAssets.reduce(
    (acc, curr) => acc.plus(new Big(curr.valueInBaseCurrency)),
    new Big(0),
  );

  const lastUpdated =
    maxTimestamp > 0 ? new Date(maxTimestamp) : new Date();

  return {
    assets: processedAssets,
    baseCurrency: user.baseCurrency,
    lastUpdated,
    totalNetWorth: totalNetWorth.toFixed(2),
  };
}
