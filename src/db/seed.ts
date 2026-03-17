import 'dotenv/config';
import { db } from './index';
import { users, assets, transactions, exchangeRates } from './schema';

async function main() {
  console.log('--- Seeding started ---');

  await db.transaction(async (tx) => {
    // 1. Clean the slate (Optional - remove if you want to keep existing data)
    await tx.delete(transactions);
    await tx.delete(assets);
    await tx.delete(users);
    await tx.delete(exchangeRates);

    // 2. Create the User (The anchor for everything)
    const [user] = await tx
      .insert(users)
      .values({
        externalId: 'user_test_clerk_123', // Dummy ID for now
        baseCurrency: 'THB',
      })
      .returning();

    console.log(`Created user: ${user.id}`);

    // 3. Create Assets
    const [bankAccount] = await tx
      .insert(assets)
      .values({
        userId: user.id,
        name: 'Bangkok Bank Savings',
        type: 'CASH',
        currency: 'THB',
        balance: '50000.00000000', // Note: Pass decimals as strings to avoid JS floating point issues
      })
      .returning();

    const [cryptoWallet] = await tx
      .insert(assets)
      .values({
        userId: user.id,
        name: 'Cold Storage (BTC)',
        type: 'CRYPTO',
        currency: 'BTC',
        balance: '0.04500000',
      })
      .returning();

    // 4. Create initial Transactions
    await tx.insert(transactions).values([
      {
        assetId: bankAccount.id,
        amount: '50000.00000000',
        category: 'Initial Deposit',
        note: 'Starting balance',
      },
      {
        assetId: cryptoWallet.id,
        amount: '0.04500000',
        category: 'Investment',
        note: 'Purchased on exchange',
      },
    ]);

    // 5. Seed Exchange Rates
    await tx.insert(exchangeRates).values([
      { fromCurrency: 'USD', toCurrency: 'THB', rate: '35.5000000000' },
      { fromCurrency: 'BTC', toCurrency: 'USD', rate: '65000.0000000000' },
    ]);
  });

  console.log('--- Seeding finished successfully ---');
}

main().catch((err) => {
  console.error('Seeding failed!');
  console.error(err);
  process.exit(1);
});
