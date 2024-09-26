'use server'

import { getShopIdForUser } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";

export async function getShopIdForCurrentUser() {
  
  const { userId } = auth();

  if (!userId) {
    console.log('No user ID found');
    throw new Error("User not authenticated");
  }

  try {
    const shopId = await getShopIdForUser(userId);
    return shopId;
  } catch (error) {
    console.error("Error fetching shop ID:", error);
    throw new Error("Failed to fetch shop ID");
  }
}