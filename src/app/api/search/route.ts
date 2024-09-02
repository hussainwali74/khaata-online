import { NextResponse } from 'next/server';
import { db } from '@/db';
import { customers, invoices, productsSchema } from '@/db/schema';
import { ilike, or } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');

  if (!term) {
    return NextResponse.json([]);
  }

  const likeTerm = `%${term}%`;

  const customerResults = await db
    .select({ id: customers.id, name: customers.name })
    .from(customers)
    .where(or(
      ilike(customers.name, likeTerm),
      ilike(customers.phoneNumber, likeTerm),
      ilike(customers.cnic, likeTerm)
    ))
    .limit(5)
    .execute();

  const productResults = await db
    .select({ id: productsSchema.id, name: productsSchema.name })
    .from(productsSchema)
    .where(ilike(productsSchema.name, likeTerm))
    .limit(5)
    .execute();

  const invoiceResults = await db
    .select({ id: invoices.id, name: invoices.id })
    .from(invoices)
      .where(ilike(invoices.id, likeTerm))
    .limit(5)
    .execute();

  const results = [
    ...customerResults.map(c => ({ type: 'customer' as const, id: c.id, name: c.name })),
    ...productResults.map(p => ({ type: 'product' as const, id: p.id, name: p.name })),
    ...invoiceResults.map(i => ({ type: 'invoice' as const, id: i.id, name: `Invoice #${i.id}` })),
  ];

  return NextResponse.json(results);
}