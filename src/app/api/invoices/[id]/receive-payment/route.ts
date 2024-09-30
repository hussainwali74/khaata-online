import { NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from "@clerk/nextjs/server";
import { calculateInvoiceStatus } from "@/lib/invoiceHelpers";

export async function POST(request: Request, { params }: { params: { id: string } }) {
	const { userId } = auth();
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const invoiceId = parseInt(params.id);
	const body = await request.json();
	const { amount } = body;

	try {
		const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId));

		if (!invoice) {
			return new NextResponse("Invoice not found", { status: 404 });
		}

		const newPaymentReceived = parseFloat(invoice.paymentReceived || '0') + amount;
		const newRemainingAmount = parseFloat(invoice.totalAmount) - newPaymentReceived;
		
		// Use current date if dueDate is null
		const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : new Date();
		const newStatus = calculateInvoiceStatus(parseFloat(invoice.totalAmount), newPaymentReceived, dueDate);

		const [updatedInvoice] = await db.update(invoices)
			.set({
				paymentReceived: newPaymentReceived.toString(),
				remainingAmount: newRemainingAmount.toString(),
				status: newStatus,
				updatedAt: new Date(),
			})
			.where(eq(invoices.id, invoiceId))
			.returning();

		return NextResponse.json(updatedInvoice);
	} catch (error) {
		console.error("Error processing payment:", error);
		return new NextResponse("Error processing payment", { status: 500 });
	}
}