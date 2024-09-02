import { NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices, customers, invoiceItems, productsSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from "@clerk/nextjs/server";
import { getShopIdForUser } from '@/db/queries';

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const shopId = await getShopIdForUser(userId);
    if (!shopId) {
      return new NextResponse("Shop not found", { status: 404 });
    }

    const allInvoices = await db.select({
      id: invoices.id,
      customerName: customers.name,
      totalAmount: invoices.totalAmount,
      status: invoices.status,
      createdAt: invoices.createdAt,
    })
    .from(invoices)
    .leftJoin(customers, eq(invoices.customerId, customers.id))
    .where(eq(invoices.shopId, shopId));

    return NextResponse.json(allInvoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { customerId, shopId, items } = body;

  try {
    // Verify that the shopId from the request matches the user's shop
    const userShopId = await getShopIdForUser(userId);
    if (userShopId !== shopId) {
      return new NextResponse("Invalid shop ID", { status: 400 });
    }

    // Create the invoice
    const [invoice] = await db.insert(invoices)
      .values({
        customerId,
        shopId,
        totalAmount: 0,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Add invoice items and calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const [product] = await db.select().from(productsSchema).where(eq(productsSchema.id, item.productId));
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      await db.insert(invoiceItems).values({
        invoiceId: invoice.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price.toString(), // Convert price to string
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      totalAmount += product.price * item.quantity;
    }

    // Update the invoice total amount
    const [updatedInvoice] = await db.update(invoices)
      .set({ 
        totalAmount: parseFloat(totalAmount.toFixed(2))!,
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, invoice.id))
      .returning();

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    return new NextResponse("Error creating invoice", { status: 500 });
  }
}