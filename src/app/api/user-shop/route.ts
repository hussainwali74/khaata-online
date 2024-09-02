import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { shopAdmins } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userShop = await db.select().from(shopAdmins).where(eq(shopAdmins.userId, userId)).limit(1);

    if (userShop.length === 0) {
      return new NextResponse("No shop found", { status: 404 });
    }

    return NextResponse.json(userShop[0]);
  } catch (error) {
    console.error("Error fetching user shop:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
