import { pgTable, serial, text, timestamp, decimal, integer, varchar } from "drizzle-orm/pg-core";

export const shops = pgTable("shops", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  contactNumber: varchar("contact_number", { length: 50 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shopAdmins = pgTable("shop_admins", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id")
    .notNull()
    .references(() => shops.id),
  userId: varchar("user_id", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Modify existing tables to include shopId
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id")
    .notNull()
    .references(() => shops.id),
  name: text("name").notNull(),
  cnic: text("cnic"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productsSchema = pgTable("products", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id")
    .notNull()
    .references(() => shops.id),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull().default(0),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  quantity: integer("quantity").notNull().default(0),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id")
    .notNull()
    .references(() => shops.id),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentReceived: decimal("payment_received", { precision: 10, scale: 2 }).default('0'),
  remainingAmount: decimal("remaining_amount", { precision: 10, scale: 2 }).default('0'),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default('0'),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default('0'),
  dueDate: timestamp("due_date"),
  status: varchar("status", { length: 20 }).notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const invoiceItems = pgTable("invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoices.id),
  productId: integer("product_id")
    .notNull()
    .references(() => productsSchema.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shopSettings = pgTable("shop_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  shopName: varchar("shop_name", { length: 255 }),
  shopAddress: text("shop_address"),
  shopContact: varchar("shop_contact", { length: 50 }),
  description: text("description"), // New field added
});
