CREATE TYPE "public"."asset_types" AS ENUM('CASH', 'STOCK', 'GOLD', 'CRYPTO', 'REAL_ESTATE');--> statement-breakpoint
CREATE TABLE "assets" (
	"balance" numeric(18, 8) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"currency" varchar(3) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" "asset_types" NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"code" varchar(10) PRIMARY KEY NOT NULL,
	"rate_from_usd" numeric(19, 10) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"amount" numeric(18, 8) NOT NULL,
	"asset_id" uuid NOT NULL,
	"category" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"base_currency" varchar(3) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"external_id" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "users_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assets_user_id_index" ON "assets" USING btree ("user_id");