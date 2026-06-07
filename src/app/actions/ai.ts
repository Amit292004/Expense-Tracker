"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });
  
  if (!user) throw new Error("User not found");
  return user.id;
}

export async function chatWithAi(messages: { role: string; content: string }[]) {
  try {
    const userId = await getUserId();
    const lastMessage = messages[messages.length - 1].content.toLowerCase();

    // 1. Fetch user data for context
    const wallets = await prisma.wallet.findMany({ where: { userId } });
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth }
      },
      include: { category: true }
    });

    const income = transactions
      .filter(t => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate all-time spending
    const allTransactions = await prisma.transaction.findMany({
      where: { userId }
    });
    const allTimeExpenses = allTransactions
      .filter(t => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    // Group expenses by category
    const categorySpend: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === "EXPENSE" && t.category)
      .forEach(t => {
        const catName = t.category!.name;
        categorySpend[catName] = (categorySpend[catName] || 0) + t.amount;
      });

    // Find highest expense category
    let highestCategory = "";
    let highestAmount = 0;
    Object.entries(categorySpend).forEach(([cat, amt]) => {
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCategory = cat;
      }
    });

    // 2. Process query rules
    let reply = "";

    if (lastMessage.includes("all-time spending") || lastMessage.includes("all time") || lastMessage.includes("total spend")) {
      reply = `Your total all-time spending logged across all transaction records is **₹${allTimeExpenses.toFixed(2)}**.`;
    } 
    else if (lastMessage.includes("balance") || lastMessage.includes("how much money")) {
      reply = `Since you haven't connected external wallets, your live balance is not tracked. However, your total logged all-time spending is **₹${allTimeExpenses.toFixed(2)}**.`;
    } 
    
    else if (lastMessage.includes("spend") || lastMessage.includes("expense") || lastMessage.includes("outgoings")) {
      if (expenses === 0 && allTimeExpenses === 0) {
        reply = "You haven't logged any expenses yet! Once you start logging transactions, I can show you your spending statistics.";
      } else {
        reply = `You have spent a total of **₹${expenses.toFixed(2)}** this month. Your all-time spending across all logged transactions is **₹${allTimeExpenses.toFixed(2)}**. `;
        if (highestCategory) {
          reply += `Your highest spending category this month is **${highestCategory}** at **₹${highestAmount.toFixed(2)}**, which accounts for ${((highestAmount / expenses) * 100).toFixed(0)}% of your monthly expense.`;
        }
      }
    } 
    
    else if (lastMessage.includes("income") || lastMessage.includes("earn") || lastMessage.includes("salary")) {
      if (income === 0) {
        reply = "You haven't logged any incomes this month. You can add salary, freelance earnings, or investment returns using the 'Log Transaction' modal.";
      } else {
        reply = `You have earned a total of **₹${income.toFixed(2)}** this month.`;
      }
    } 
    
    else if (lastMessage.includes("saving") || lastMessage.includes("save") || lastMessage.includes("budget")) {
      const netSavings = income - expenses;
      const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;
      
      if (income === 0) {
        reply = `Currently, you have spent ₹${expenses.toFixed(2)} and have no logged income. To build savings, we need to log your income streams and align on budgeting.`;
      } else if (netSavings < 0) {
        reply = `Warning: Your current monthly savings is negative (**-₹${Math.abs(netSavings).toFixed(2)}**) because your spending (₹${expenses.toFixed(2)}) is higher than your earnings (₹${income.toFixed(2)}). I advise setting strict budgets on your top categories, especially ${highestCategory || "dining and retail"}.`;
      } else {
        reply = `You are saving **₹${netSavings.toFixed(2)}** this month, resulting in a savings rate of **${savingsRate.toFixed(1)}%**. This is excellent! I suggest directing at least 15% of your savings into investments or a high-yield checking wallet, and the rest to a Cash emergency fund.`;
      }
    } 
    
    else if (lastMessage.includes("food") || lastMessage.includes("dining") || lastMessage.includes("eat")) {
      const food = categorySpend["Food & Dining"] || 0;
      reply = `You have spent **₹${food.toFixed(2)}** on Food & Dining this month. Preparing more meals at home could save you around ₹5,000 monthly.`;
    } 
    
    else {
      // General response
      reply = `Hello! I'm ExpensIQ's AI advisor. I analyze your database transactions in real-time. 
      
Here are some topics you can ask me about:
* **"What is my all-time spending?"** - to see your total logged expenses across all records.
* **"How much did I spend?"** - to see monthly expenses and top categories.
* **"How can I save?"** - to analyze your current savings rate and get recommendations.
* **"How much did I earn?"** - to review your monthly income streams.`;
    }

    return { role: "assistant", content: reply };
  } catch (error: any) {
    console.error("AI Advisor error:", error);
    return { role: "assistant", content: "Sorry, I ran into an error connecting to your financial database. Please try again." };
  }
}
