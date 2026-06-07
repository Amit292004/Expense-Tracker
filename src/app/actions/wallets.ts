"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  if (!user) throw new Error("User not found");
  return user.id;
}

export async function createWallet(formData: {
  name: string;
  type: string;
  balance: number;
  currency: string;
}) {
  try {
    const userId = await getUserId();
    
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: formData.name,
        type: formData.type,
        balance: formData.balance,
        currency: formData.currency || "INR"
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return { success: true, wallet };
  } catch (error: any) {
    console.error("Error creating wallet:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteWallet(walletId: string) {
  try {
    const userId = await getUserId();

    // Verify wallet belongs to user
    const wallet = await prisma.wallet.findFirst({
      where: { id: walletId, userId }
    });
    if (!wallet) throw new Error("Wallet not found");

    // Check if wallet is the last one
    const count = await prisma.wallet.count({
      where: { userId }
    });
    if (count <= 1) {
      throw new Error("You must have at least one wallet account.");
    }

    await prisma.wallet.delete({
      where: { id: walletId }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting wallet:", error);
    return { success: false, error: error.message };
  }
}
