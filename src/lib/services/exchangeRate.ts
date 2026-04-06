import { Big } from 'big.js';

export function syncRateConverter(
  allRates: Array<{ code: string; rateFromUSD: string }>,
) {
  const rateMap = new Map(
    allRates.map((r) => [r.code, new Big(r.rateFromUSD)]),
  );

  return (amount: string, fromAsset: string, toTarget: string) => {
    const fromRate = rateMap.get(fromAsset);
    const toRate = rateMap.get(toTarget);

    if (!fromRate || !toRate) return null;

    return new Big(amount).div(fromRate).times(toRate).toFixed(2);
  };
}
