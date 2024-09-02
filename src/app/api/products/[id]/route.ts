import { NextResponse } from 'next/server';
import { db } from '@/db';
import { productsSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await db.select().from(productsSchema).where(eq(productsSchema.id, parseInt(params.id))).execute();

  if (result.length === 0) {
    return new NextResponse("Product not found", { status: 404 });
  }

  return NextResponse.json(result[0]);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { updatedAt, ...updateData } = body;

  const result = await db.update(productsSchema)
    .set({ 
      ...updateData, 
      updatedAt: new Date()
    })
    .where(eq(productsSchema.id, parseInt(params.id)))
    .returning()
    .execute();

  if (result.length === 0) {
    return new NextResponse("Product not found", { status: 404 });
  }

  return NextResponse.json(result[0]);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await db.delete(productsSchema)
    .where(eq(productsSchema.id, parseInt(params.id)))
    .returning()
    .execute();

  if (result.length === 0) {
    return new NextResponse("Product not found", { status: 404 });
  }

  return NextResponse.json(result[0]);
}