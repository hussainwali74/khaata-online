import { NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices, customers } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET handler for fetching customer invoices
 * 
 * This function retrieves pending invoices along with customer information.
 * It joins the invoices and customers tables to get the required data.
 * 
 * @returns {Promise<NextResponse>} JSON response containing customer invoices or an error message
 */
export async function GET() {
  try {
    // Query to fetch pending invoices with customer details
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
      // .where(eq(invoices.status, 'pending'));

    // Return the fetched data as JSON response
    return NextResponse.json(customerInvoices);
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error('Error fetching customer invoices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}