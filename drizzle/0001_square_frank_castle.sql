ALTER TABLE "invoices" ALTER COLUMN "discount_amount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "discount_percentage" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "discount_percentage" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "status" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "payment_received" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "remaining_amount" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "discount_percentage2";