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
  const { customerId, shopId, items, dueDate, discountAmount, discountPercentage } = body;

  try {
    // Verify that the shopId from the request matches the user's shop
    const userShopId = await getShopIdForUser(userId);
    if (userShopId !== shopId) {
      return new NextResponse("Invalid shop ID", { status: 400 });
    }

    // Calculate total amount
    let invoiceTotal = 0;
    for (const item of items) {
      const [product] = await db.select().from(productsSchema).where(eq(productsSchema.id, item.productId));
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      invoiceTotal += product.price * item.quantity;
    }

    // Apply discount
    const discountedAmount = invoiceTotal - (discountAmount || 0);
    const finalAmount = discountedAmount * (1 - (discountPercentage || 0) / 100);

    // Create the invoice
    const [invoice] = await db.insert(invoices)
      .values({
        customerId,
        shopId,
        totalAmount: finalAmount.toFixed(2),
        paymentReceived: '0',
        remainingAmount: finalAmount.toFixed(2),
        discountAmount: (discountAmount || 0).toFixed(2),
        discountPercentage: (discountPercentage || 0).toFixed(2),
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Add invoice items
    for (const item of items) {
      const [product] = await db.select().from(productsSchema).where(eq(productsSchema.id, item.productId));
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      await db.insert(invoiceItems).values({
        invoiceId: invoice.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    return new NextResponse("Error creating invoice", { status: 500 });
  }
}