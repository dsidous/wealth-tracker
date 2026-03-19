import { db } from '@/db';
import { exchangeRates } from '@/db/schema';
import { Big } from 'big.js';

export async function createRateConverter() {
  const allRates = await db.select().from(exchangeRates);

  const rateMap = new Map(
    allRates.map((r) => [`${r.fromCurrency}_${r.toCurrency}`, r.rate]),
  );

  return (from: string, to: string): string | null => {
    if (from === to) return '1';

    const directKey = `${from}_${to}`;
    if (rateMap.has(directKey)) return rateMap.get(directKey)!;

    const fromToUsd = rateMap.get(`${from}_USD`);
    const usdToTarget = rateMap.get(`USD_${to}`);

    if (fromToUsd && usdToTarget) {
      return new Big(fromToUsd).times(new Big(usdToTarget)).toString();
    }

    return null;
  };
}
