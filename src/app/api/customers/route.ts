import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { getShopCustomersByUserId, getShopIdForUser } from "@/db/queries";

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const shopId = await getShopIdForUser(userId);
  if (!shopId) {
    return new NextResponse("Shop not found", { status: 404 });
  }
  const customers = await getShopCustomersByUserId(userId);
  return NextResponse.json(customers);
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
    const { name, cnic, phoneNumber, address } = body;

    const newCustomer = await db
      .insert(customers)
      .values({
        shopId,
        name,
        cnic,
        phoneNumber,
        address,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newCustomer[0], { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // ... (keep the existing DELETE method implementation)
}
