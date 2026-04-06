import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  pgEnum,
  decimal,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const assetTypes = pgEnum('asset_types', [
  'CASH',
  'STOCK',
  'GOLD',
  'CRYPTO',
  'REAL_ESTATE',
]);

export const users = pgTable('users', {
  baseCurrency: varchar('base_currency', { length: 3 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  externalId: text('external_id').notNull().unique(),
  id: uuid('id').primaryKey().defaultRandom().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  assets: many(assets),
}));

export const assets = pgTable(
  'assets',
  {
    balance: decimal('balance', { precision: 18, scale: 8 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    currency: varchar('currency', { length: 3 }).notNull(),
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    type: assetTypes('type').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
  },
  (table) => [index('assets_user_id_index').on(table.userId)],
);

export const assetsRelations = relations(assets, ({ one }) => ({
  user: one(users, {
    fields: [assets.userId],
    references: [users.id],
  }),
}));

export const transactions = pgTable('transactions', {
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  assetId: uuid('asset_id')
    .references(() => assets.id)
    .notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  note: text('note').notNull(),
});

export const exchangeRates = pgTable('exchange_rates', {
  code: varchar('code', { length: 10 }).primaryKey().notNull(), // 'THB', 'GBP', 'BTC'
  rateFromUSD: decimal('rate_from_usd', { precision: 19, scale: 10 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
