import { Big } from 'big.js';

export function syncRateConverter(
  allRates: { fromCurrency: string; toCurrency: string; rate: string }[],
) {
  // 1. Index the rates into a Map for O(1) performance
  const rateMap = new Map(
    allRates.map((r) => [`${r.fromCurrency}_${r.toCurrency}`, r.rate]),
  );

  // 2. Return the lookup function
  return (from: string, to: string): string | null => {
    if (from === to) return '1';

    // Direct Match (e.g., USD -> THB)
    const directKey = `${from}_${to}`;
    if (rateMap.has(directKey)) return rateMap.get(directKey)!;

    // Cross-Rate / Pivot Logic (e.g., BTC -> USD -> THB)
    const fromToUsd = rateMap.get(`${from}_USD`);
    const usdToTarget = rateMap.get(`USD_${to}`);

    if (fromToUsd && usdToTarget) {
      try {
        return new Big(fromToUsd).times(new Big(usdToTarget)).toString();
      } catch {
        return null;
      }
    }

    return null;
  };
}
