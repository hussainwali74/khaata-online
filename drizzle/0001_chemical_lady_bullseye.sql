ALTER TABLE "invoices" ALTER COLUMN "discount_amount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "discount_amount" SET DEFAULT '0.0';--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "discount_percentage" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "discount_percentage" SET DEFAULT '0.0';