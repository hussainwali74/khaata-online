import { NextResponse } from "next/server";
import { db } from "@/db";
import { shops, shopAdmins } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { getShopIdForUser } from "@/db/queries";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const existingShop = await getShopIdForUser(userId);
  if (existingShop) {
    return NextResponse.json({ error: "Shop already exists" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { shopName, shopAddress, shopContact, description } = body;
    const newShop = await db
      .insert(shops)
      .values({
        name: shopName,
        address: shopAddress,
        contactNumber: shopContact,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    await db
      .insert(shopAdmins)
      .values({
        shopId: newShop[0].id,
        userId,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .catch((error) => {
        console.log("---------------------------------------------------");
        console.log("error shopAdmin", error);
        console.log("---------------------------------------------------");
      });

    return NextResponse.json(newShop, { status: 201 });
    //   return newShop;
    // });
  } catch (error) {
    console.error("Error creating shop:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
