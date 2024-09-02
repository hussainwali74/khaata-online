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
    console.log('Attempting to fetch shop ID for user:', userId);
    const shopId = await getShopIdForUser(userId);
    console.log('Shop ID fetched:', shopId);
    return shopId;
  } catch (error) {
    console.error("Error fetching shop ID:", error);
    throw new Error("Failed to fetch shop ID");
  }
}