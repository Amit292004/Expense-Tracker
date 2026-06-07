"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to get active user ID
async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  if (!user) throw new Error("User not found");
  return user.id;
}

export async function getOverviewData() {
  try {
    const userId = await getUserId();

    // 1. Fetch Wallets & Sum Balances
    const wallets = await prisma.wallet.findMany({
      where: { userId }
    });
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    // 2. Fetch Transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
        wallet: true
      },
      orderBy: { date: "desc" }
    });

    // 3. Current Month Stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d >= startOfMonth && d <= endOfMonth;
    });

    const income = monthTransactions
      .filter(t => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    // 4. Calculate dynamic cash flow for last 6 months
    const monthsName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const mTransactions = transactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= mStart && txDate <= mEnd;
      });

      const mIncome = mTransactions.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
      const mExpense = mTransactions.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0);

      chartData.push({
        name: monthsName[d.getMonth()],
        income: mIncome,
        expense: mExpense,
        value: mIncome - mExpense // Net cash flow
      });
    }

    // 5. Dynamic AI Health Score & local insights
    let healthScore = 100;
    const insights = [];

    if (income > 0) {
      const savingsRate = ((income - expenses) / income) * 100;
      if (savingsRate < 0) {
        healthScore = Math.max(30, 50 + savingsRate); // Negative savings rate hurts score
        insights.push({
          type: "ALERT",
          content: `Alert: Your spending exceeds your income by ₹${Math.abs(income - expenses).toFixed(2)} this month. Consider reviewing your variable expenses.`
        });
      } else if (savingsRate < 20) {
        healthScore = 75;
        insights.push({
          type: "SAVING_TIP",
          content: `Saving Tip: You saved ${savingsRate.toFixed(1)}% of your income. Aiming for 20% savings is a great standard rule of thumb!`
        });
      } else {
        healthScore = Math.min(100, 80 + Math.floor(savingsRate / 5));
        insights.push({
          type: "PREDICTION",
          content: `Excellent! You saved ${savingsRate.toFixed(1)}% of your income. Keep building your emergency fund!`
        });
      }
    } else {
      healthScore = expenses > 0 ? 50 : 80;
      insights.push({
        type: "PREDICTION",
        content: "No income logged this month. Try logging your salary or freelance earnings."
      });
    }

    // Category specific warning
    const foodSpend = monthTransactions
      .filter(t => t.type === "EXPENSE" && t.category?.name === "Food & Dining")
      .reduce((sum, t) => sum + t.amount, 0);
    if (foodSpend > 10000) {
      insights.push({
        type: "SAVING_TIP",
        content: `Your Food & Dining spending is currently at ₹${foodSpend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}. Preparing more meals at home could save you around ₹5,000.`
      });
    }

    const allTimeExpenses = transactions
      .filter(t => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance,
      allTimeExpenses,
      income,
      expenses,
      healthScore,
      chartData,
      insights,
      recentTransactions: transactions.slice(0, 5),
      allTransactions: transactions
    };
  } catch (error) {
    console.error("Error fetching overview data:", error);
    return {
      totalBalance: 0,
      allTimeExpenses: 0,
      income: 0,
      expenses: 0,
      healthScore: 80,
      chartData: [],
      insights: [
        { type: "ALERT", content: "Could not fetch dynamic insights. Check database configuration." }
      ],
      recentTransactions: []
    };
  }
}

export async function getWallets() {
  try {
    const userId = await getUserId();
    let userWallets = await prisma.wallet.findMany({
      where: { userId }
    });

    // Self-healing: if user has no wallets, create defaults on-the-fly
    if (userWallets.length === 0) {
      await prisma.wallet.createMany({
        data: [
          {
            userId,
            name: "Main Cash Wallet",
            type: "CASH",
            currency: "INR",
            balance: 10000.0,
          },
          {
            userId,
            name: "Chase Checking",
            type: "BANK",
            currency: "INR",
            balance: 50000.0,
          }
        ]
      });
      userWallets = await prisma.wallet.findMany({
        where: { userId }
      });
    }

    return userWallets;
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return [];
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" }
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getTransactionsList() {
  try {
    const userId = await getUserId();
    return await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
        wallet: true
      },
      orderBy: { date: "desc" }
    });
  } catch (error) {
    console.error("Error fetching transactions list:", error);
    return [];
  }
}

export async function addTransaction(formData: {
  amount: number;
  type: string;
  categoryId: string;
  walletId: string;
  date: string;
  description: string;
}) {
  try {
    const userId = await getUserId();

    // Verify wallet exists and belongs to user
    const wallet = await prisma.wallet.findFirst({
      where: { id: formData.walletId, userId }
    });
    if (!wallet) throw new Error("Wallet not found");

    // Start database transaction to create transaction and adjust wallet balance
    const result = await prisma.$transaction(async (tx) => {
      const newTx = await tx.transaction.create({
        data: {
          userId,
          walletId: formData.walletId,
          categoryId: formData.categoryId || null,
          amount: formData.amount,
          type: formData.type,
          date: new Date(formData.date),
          description: formData.description || ""
        }
      });

      // Calculate balance adjust
      const balanceChange = formData.type === "INCOME" ? formData.amount : -formData.amount;
      await tx.wallet.update({
        where: { id: formData.walletId },
        data: { balance: { increment: balanceChange } }
      });

      return newTx;
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/transactions");
    return { success: true, transaction: result };
  } catch (error: any) {
    console.error("Error adding transaction:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTransaction(transactionId: string) {
  try {
    const userId = await getUserId();

    const txItem = await prisma.transaction.findFirst({
      where: { id: transactionId, userId }
    });
    if (!txItem) throw new Error("Transaction not found");

    await prisma.$transaction(async (tx) => {
      // Revert wallet balance update
      const balanceChange = txItem.type === "INCOME" ? -txItem.amount : txItem.amount;
      await tx.wallet.update({
        where: { id: txItem.walletId },
        data: { balance: { increment: balanceChange } }
      });

      // Delete the transaction
      await tx.transaction.delete({
        where: { id: transactionId }
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/transactions");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: error.message };
  }
}
