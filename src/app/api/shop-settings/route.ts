import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { shops, shopAdmins } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const shopAdmin = await db
      .select({ shopId: shopAdmins.shopId })
      .from(shopAdmins)
      .where(eq(shopAdmins.userId, userId))
      .limit(1);

    if (shopAdmin.length === 0) {
      return new NextResponse("No shop found", { status: 404 });
    }

    const shopSettings = await db.select().from(shops).where(eq(shops.id, shopAdmin[0].shopId));
    return NextResponse.json(shopSettings[0]);
  } catch (error) {
    console.error("Error fetching shop settings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, address, contactNumber, description } = body;

    const shopAdmin = await db
      .select({ shopId: shopAdmins.shopId })
      .from(shopAdmins)
      .where(eq(shopAdmins.userId, userId))
      .limit(1);

    if (shopAdmin.length === 0) {
      // Create new shop and associate with user
      const newShop = await db.transaction(async (tx) => {
        const [shop] = await tx.insert(shops).values({ name, address, contactNumber, description }).returning();

        await tx.insert(shopAdmins).values({ shopId: shop.id, userId, role: "owner" });

        return shop;
      });
      return NextResponse.json(newShop);
    } else {
      // Update existing shop
      const updatedShop = await db
        .update(shops)
        .set({ name, address, contactNumber, description })
        .where(eq(shops.id, shopAdmin[0].shopId))
        .returning();
      return NextResponse.json(updatedShop[0]);
    }
  } catch (error) {
    console.error("Error saving shop settings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
