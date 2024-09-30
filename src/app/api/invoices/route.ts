import { NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices, customers, invoiceItems, productsSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from "@clerk/nextjs/server";
import { getShopIdForUser } from '@/db/queries';
import { calculateInvoiceStatus } from "@/lib/invoiceHelpers";

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

  try {
    const shopId = await getShopIdForUser(userId);
    if (!shopId) {
      return new NextResponse("Shop not found", { status: 404 });
    }

    const body = await request.json();
    const { customerId, totalAmount, paymentReceived, remainingAmount, discountAmount, discountPercentage, dueDate, items } = body;

    const status = calculateInvoiceStatus(totalAmount, paymentReceived, new Date(dueDate));

    const [invoice] = await db.insert(invoices).values({
      shopId,
      customerId,
      totalAmount,
      paymentReceived,
      remainingAmount,
      discountAmount,
      discountPercentage,
      dueDate: new Date(dueDate),
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Add invoice items
    for (const item of items) {
      await db.insert(invoiceItems).values({
        invoiceId: invoice.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
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