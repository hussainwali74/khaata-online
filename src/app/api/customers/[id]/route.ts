import { NextResponse } from 'next/server';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await db.select().from(customers).where(eq(customers.id, parseInt(params.id))).execute();

  if (result.length === 0) {
    return new NextResponse("Customer not found", { status: 404 });
  }

  return NextResponse.json(result[0]);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();

    const { updatedAt, createdAt, ...updateData } = body;

    const result = await db.update(customers)
      .set({ 
        ...updateData, 
        updatedAt: new Date()
      })
      .where(eq(customers.id, parseInt(params.id)))
      .returning()
      .execute();

    if (result.length === 0) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error in PUT /api/customers/[id]:', error);
    return new NextResponse(JSON.stringify({ message: error instanceof Error ? error.message : 'An unexpected error occurred' }), { status: 500 });
  }
}