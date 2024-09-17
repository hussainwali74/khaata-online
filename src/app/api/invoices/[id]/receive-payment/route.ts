import { NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
	const { userId } = auth();
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const invoiceId = parseInt(params.id);
	const body = await request.json();
	const { amount } = body;

	try {
		// Fetch the current invoice
		const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId));

		if (!invoice) {
			return new NextResponse("Invoice not found", { status: 404 });
		}

		// Calculate new values
		const newPaymentReceived = parseFloat(invoice?.paymentReceived || '0') + amount;
		const newRemainingAmount = parseFloat(invoice.totalAmount) - newPaymentReceived;
		const newStatus = newRemainingAmount <= 0 ? 'paid' : 'partial';

		// Update the invoice
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