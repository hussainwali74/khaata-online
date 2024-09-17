import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, invoiceItems, customers, shops, productsSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { calculateInvoiceStatus } from '@/lib/invoiceHelpers';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const invoiceId = parseInt(params.id);

    const invoice = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
    if (!invoice.length) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    const items = await db
      .select({
        invoiceItems: invoiceItems,
        products: productsSchema,
      })
      .from(invoiceItems)
      .leftJoin(productsSchema, eq(invoiceItems.productId, productsSchema.id))
      .where(eq(invoiceItems.invoiceId, invoiceId));

    const customer = await db.select().from(customers).where(eq(customers.id, invoice[0].customerId)).limit(1);
    const shop = await db.select().from(shops).where(eq(shops.id, invoice[0].shopId)).limit(1);

    if (!customer.length || !shop.length) {
      return new NextResponse("Customer or Shop not found", { status: 404 });
    }

    const subtotal = items.reduce((acc, item) => acc + parseFloat(item.invoiceItems.unitPrice) * item.invoiceItems.quantity, 0);
    const discountAmount = parseFloat(invoice[0].discountAmount || '0');
    const totalAmount = subtotal - discountAmount;
    const paymentReceived = parseFloat(invoice[0].paymentReceived || '0');
    const remainingAmount = totalAmount - paymentReceived;

    const invoiceData = {
      items: items.map((item) => ({
        id: item.invoiceItems.id,
        productName: item.products?.name || "Unknown Product",
        productId: item.products?.id || -1,
        price: parseFloat(item.invoiceItems.unitPrice),
        productDescription: item.products?.description || "",
        quantity: item.invoiceItems.quantity,
        lineTotal: parseFloat(item.invoiceItems.unitPrice) * item.invoiceItems.quantity,
      })),
      customerName: customer[0].name,
      customerId: customer[0].id,
      customerAddress: customer[0].address || "",
      invoiceDate: invoice[0].createdAt?.toISOString().split("T")[0] || "",
      invoiceId: invoice[0].id,
      dueDate: invoice[0].dueDate ? invoice[0].dueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      discountAmount: invoice[0].discountAmount, // Changed from discount_amount
      discountPercentage: invoice[0].discountPercentage, // Changed from discount_percentage
      shopName: shop[0].name || "",
      shopAddress: shop[0].address || "",
      totalAmount: totalAmount.toString(),
      paymentReceived: paymentReceived.toString(),
      remainingAmount: remainingAmount.toString(),
      status: invoice[0].status || 'amount due', // Add this line
    };

    return NextResponse.json(invoiceData);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const invoiceId = parseInt(params.id);
  const body = await request.json();
  console.log("---------------------------------------------------");
  console.log("body", body);
  console.log("---------------------------------------------------");
  const { customerId, status, items, shopId, discountAmount, dueDate, discountPercentage, paymentReceived, remainingAmount, totalAmount } = body;

  try {
    const dueDateObject = dueDate ? new Date(dueDate) : null;
    const calculatedStatus = calculateInvoiceStatus(parseFloat(totalAmount), parseFloat(paymentReceived));

    // Update the invoice
    await db
      .update(invoices)
      .set({
        customerId,
        status: calculatedStatus,
        discountPercentage,
        discountAmount,
        dueDate: dueDateObject,
        shopId,
        paymentReceived,
        remainingAmount,
        totalAmount,
      })
      .where(eq(invoices.id, invoiceId))
      .execute();

    // Delete existing items
    await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId)).execute();

    // Add new items
    let calculatedTotalAmount = 0;
    for (const item of items) {
      const [product] = await db.select().from(productsSchema).where(eq(productsSchema.id, item.productId));
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }

      await db.insert(invoiceItems).values({
        invoiceId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price.toString(),
      });

      calculatedTotalAmount += item.price * item.quantity;
    }

    // Calculate discounted total
    const discountedTotal = calculatedTotalAmount - (parseFloat(discountAmount) || 0);

    // Update the invoice total amount
    const [updatedInvoice] = await db
      .update(invoices)
      .set({ totalAmount: discountedTotal.toString() })
      .where(eq(invoices.id, invoiceId))
      .returning();

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return new NextResponse("Error updating invoice", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const invoiceId = parseInt(params.id);

  try {
    // Start a transaction
    await db.transaction(async (tx) => {
      // Delete invoice items first
      await tx.delete(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));

      // Then delete the invoice
      await tx.delete(invoices).where(eq(invoices.id, invoiceId));
    });

    return new NextResponse("Invoice deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return new NextResponse("Error deleting invoice", { status: 500 });
  }
}
