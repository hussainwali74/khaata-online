import { eq } from "drizzle-orm";
import { db } from ".";
import { shopAdmins, customers, invoices, shops } from "./schema";

export async function getShopIdForUser(userId: string) {
    const result = await db.select({ shopId: shopAdmins.shopId })
      .from(shopAdmins)
      .where(eq(shopAdmins.userId, userId))
      .limit(1);

    return result.length > 0 ? result[0].shopId : null;
}
export async function getShopCustomersByUserId(userId: string) {
    const shopId = await getShopIdForUser(userId);
    if (!shopId) {
        return [];
    }
    const shop_customers = await db.select().from(customers).where(eq(customers.shopId, shopId));
    return shop_customers;
}

export async function getCustomerInvoicesForUser(userId: string) {
    const shopId = await getShopIdForUser(userId);
    if (!shopId) {
        return [];
    }

    const customerInvoices = await db
      .select({
        id: invoices.id,
        customerName: customers.name,
        contactNumber: customers.phoneNumber,
        totalAmount: invoices.totalAmount,
        paymentReceived: invoices.paymentReceived,
        remainingAmount: invoices.remainingAmount,
        dueDate: invoices.dueDate,
      })
      .from(invoices)
      .innerJoin(customers, eq(invoices.customerId, customers.id))
      .where(eq(invoices.shopId, shopId));

    return customerInvoices;
}