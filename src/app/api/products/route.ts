import { NextResponse } from "next/server";
import { db } from "@/db";
import { productsSchema } from "@/db/schema";

import { eq, ilike, or, desc, asc, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { getShopIdForUser } from "@/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const sortField = searchParams.get("sortField") as keyof typeof productsSchema | null;
  const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" | null;
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const shopId = await getShopIdForUser(userId);
  if (!shopId) {
    return new NextResponse("Shop not found", { status: 404 });
  }

  const offset = (page - 1) * limit;

  try {
    let query = db.select().from(productsSchema) ;
    let orderBy: any[] = [];
    query = query.where(eq(productsSchema.shopId, shopId)) as typeof query;
    if (search) {
      const searchLower = search.toLowerCase();
      query = query.where(
        or(ilike(productsSchema.name, `%${searchLower}%`), ilike(productsSchema.description, `%${searchLower}%`))
      ) as typeof query;
    }

    if (sortField && sortOrder) {
      if (sortField in productsSchema) {
        const column = productsSchema[sortField as keyof typeof productsSchema];
        if (sortField === "price") {
          // Cast price to numeric for correct sorting
          orderBy.push(
            sortOrder === "asc" ? asc(sql`CAST(${column} AS NUMERIC)`) : desc(sql`CAST(${column} AS NUMERIC)`)
          );
        } else {
          orderBy.push(sortOrder === "asc" ? asc(column as any) : desc(column as any));
        }
      }
    }

    if (orderBy.length === 0) {
      // Default sorting
      orderBy.push(desc(productsSchema.id));
    }

    query = query
      .orderBy(...orderBy)
      .limit(limit)
      .offset(offset) as typeof query;

    const [productResults, countResult] = await Promise.all([
      query,
      db
        .select({ count: sql`count(*)` })
        .from(productsSchema)
        .where(
          search
            ? or(
                ilike(productsSchema.name, `%${search.toLowerCase()}%`),
                ilike(productsSchema.description, `%${search.toLowerCase()}%`)
              )
            : undefined
        ),
    ]);

    const totalProducts = Number(countResult[0].count);
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      products: productResults,
      currentPage: page,
      totalPages: totalPages,
      totalProducts: totalProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, price, quantity, shopId } = body;

  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const product: typeof productsSchema.$inferInsert = {
      name,
      description,
      price: price.toString(), // Convert price to a number
      shopId: parseInt(shopId), // Convert userId to a number
      imageUrl: body.imageUrl, // Add this if it's part of your schema
      createdAt: new Date(), // Add this if it's part of your schema
      updatedAt: new Date(), // Add this if it's part of your schema
      quantity: quantity.toString(), // Convert quantity to a number
    };
    const newProduct = await db.insert(productsSchema).values(product).returning();

    return NextResponse.json(newProduct[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    await db.delete(productsSchema).where(eq(productsSchema.id, parseInt(id)));
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
