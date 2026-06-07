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

export async function getBudgetsWithSpend() {
  try {
    const userId = await getUserId();
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-indexed
    const currentYear = now.getFullYear();

    // 1. Fetch all expense categories
    const expenseCategories = await prisma.category.findMany({
      where: { type: "EXPENSE" }
    });

    // 2. Fetch all expense transactions of this month
    const startOfMonth = new Date(currentYear, now.getMonth(), 1);
    const endOfMonth = new Date(currentYear, now.getMonth() + 1, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // 3. Fetch budgets defined for this month
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        month: currentMonth,
        year: currentYear
      }
    });

    // 4. Combine data
    const budgetList = expenseCategories.map(cat => {
      // Calculate actual spending for this category
      const actualSpend = transactions
        .filter(t => t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);

      // Find budget target
      const budgetRecord = budgets.find(b => b.categoryId === cat.id);
      const targetAmount = budgetRecord ? budgetRecord.targetAmount : 0;

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        categoryColor: cat.color,
        categoryIcon: cat.icon,
        actualSpend,
        targetAmount,
        budgetId: budgetRecord ? budgetRecord.id : null
      };
    });

    return budgetList;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }
}

export async function setBudget(categoryId: string, targetAmount: number) {
  try {
    const userId = await getUserId();
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId,
        categoryId,
        month: currentMonth,
        year: currentYear
      }
    });

    if (existingBudget) {
      await prisma.budget.update({
        where: { id: existingBudget.id },
        data: { targetAmount }
      });
    } else {
      await prisma.budget.create({
        data: {
          userId,
          categoryId,
          targetAmount,
          month: currentMonth,
          year: currentYear
        }
      });
    }

    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error setting budget:", error);
    return { success: false, error: error.message };
  }
}
