import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCustomerInvoicesForUser } from '@/db/queries';

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
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customerInvoices = await getCustomerInvoicesForUser(userId);

    return NextResponse.json(customerInvoices);
  } catch (error) {
    console.error('Error fetching customer invoices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}