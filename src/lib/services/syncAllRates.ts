import { db } from '@/db';
import { exchangeRates } from '@/db/schema';
import { sql } from 'drizzle-orm';

/** https://www.exchangerate-api.com/docs/standard-requests */
type ExchangeRateApiLatestJson = {
  result: string;
  'error-type'?: string;
  conversion_rates?: Record<string, number>;
};

export async function syncAllRates() {
  const API_KEY = process.env.EXCHANGERATE_API_KEY;

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/THB`,
    );
    const data = (await response.json()) as ExchangeRateApiLatestJson;

    if (data.result !== 'success' || !data.conversion_rates) {
      throw new Error(`API Error: ${data['error-type'] ?? 'unknown'}`);
    }

    const values = Object.entries(data.conversion_rates).map(
      ([code, rate]) => ({
        code,
        rateFromUSD: rate.toString(), // decimal column; string for precision
        updatedAt: new Date(),
      }),
    );

    const cryptoRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`,
    );
    const cryptoData = await cryptoRes.json();

    if (cryptoData.error) {
      throw new Error(`API Error: ${cryptoData.error}`);
    }

    if (cryptoData.bitcoin?.usd) {
      const btcRateFromUSD = 1 / cryptoData.bitcoin.usd;
      values.push({
        code: 'BTC',
        rateFromUSD: btcRateFromUSD.toFixed(10),
        updatedAt: new Date(),
      });
    }

    await db
      .insert(exchangeRates)
      .values(values)
      .onConflictDoUpdate({
        target: exchangeRates.code,
        set: {
          rateFromUSD: sql`excluded.rate_from_usd`,
          updatedAt: sql`excluded.updated_at`,
        },
      });

    console.log(`✅ Successfully synced ${values.length} exchange rates.`);
  } catch (error) {
    console.error('❌ Failed to sync exchange rates:', error);
  }
}
