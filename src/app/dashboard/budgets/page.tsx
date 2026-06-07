"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getBudgetsWithSpend, setBudget } from "@/app/actions/budgets";
import { IndianRupee, Utensils, Home, Zap, Car, Film, ShoppingBag, HeartPulse, Plane, GraduationCap, Coins, Plus, Check, Edit2, AlertTriangle } from "lucide-react";

// Helper for category icons
const getCategoryIcon = (iconName: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    Utensils: <Utensils className="w-5 h-5" />,
    Home: <Home className="w-5 h-5" />,
    Zap: <Zap className="w-5 h-5" />,
    Car: <Car className="w-5 h-5" />,
    Film: <Film className="w-5 h-5" />,
    ShoppingBag: <ShoppingBag className="w-5 h-5" />,
    HeartPulse: <HeartPulse className="w-5 h-5" />,
    Plane: <Plane className="w-5 h-5" />,
    GraduationCap: <GraduationCap className="w-5 h-5" />,
    Coins: <Coins className="w-5 h-5" />,
    DollarSign: <IndianRupee className="w-5 h-5" />
  };
  return icons[iconName] || <IndianRupee className="w-5 h-5" />;
};

export default function BudgetsPage() {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempAmount, setTempAmount] = useState("");

  const fetchBudgets = async () => {
    setLoading(true);
    const data = await getBudgetsWithSpend();
    setBudgets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSaveBudget = async (categoryId: string) => {
    const val = parseFloat(tempAmount);
    if (isNaN(val) || val < 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const res = await setBudget(categoryId, val);
    if (res.success) {
      setEditingId(null);
      fetchBudgets();
    } else {
      alert(res.error || "Failed to update budget.");
    }
  };

  const startEditing = (catId: string, currentTarget: number) => {
    setEditingId(catId);
    setTempAmount(currentTarget > 0 ? currentTarget.toString() : "");
  };

  if (loading && budgets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading budget planning...</p>
        </div>
      </div>
    );
  }

  // Count items exceeding budget
  const exceededCount = budgets.filter(b => b.targetAmount > 0 && b.actualSpend > b.targetAmount).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">Budgets</h1>
        <p className="text-zinc-400 text-sm mt-1">Set monthly spend limits per category and track your daily spending habits.</p>
      </div>

      {/* Exceeded Alerts */}
      {exceededCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-3xl flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Budget Alert!</h3>
            <p className="text-xs text-zinc-300 mt-1">
              You have exceeded your spending limit in {exceededCount} {exceededCount === 1 ? "category" : "categories"} this month. Consider scaling back in these areas.
            </p>
          </div>
        </motion.div>
      )}

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {budgets.map((b) => {
          const isEditing = editingId === b.categoryId;
          const percentage = b.targetAmount > 0 ? Math.min(100, (b.actualSpend / b.targetAmount) * 100) : 0;
          const isOver = b.targetAmount > 0 && b.actualSpend > b.targetAmount;

          return (
            <motion.div 
              key={b.categoryId}
              className="bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2.5 rounded-xl"
                    style={{ 
                      backgroundColor: `${b.categoryColor || '#333333'}15`, 
                      color: b.categoryColor || '#ffffff',
                      border: `1px solid ${b.categoryColor || '#333333'}25` 
                    }}
                  >
                    {getCategoryIcon(b.categoryIcon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{b.categoryName}</h3>
                    <p className="text-xs text-zinc-500">Monthly budget target</p>
                  </div>
                </div>

                {/* Inline Editing Controls */}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="number"
                        placeholder="Limit"
                        value={tempAmount}
                        onChange={(e) => setTempAmount(e.target.value)}
                        className="bg-zinc-900 border border-white/10 rounded-lg pl-6 pr-2 py-1 text-xs text-white focus:outline-none w-24 font-semibold"
                        autoFocus
                      />
                    </div>
                    <button 
                      onClick={() => handleSaveBudget(b.categoryId)}
                      className="p-1 bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="p-1 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing(b.categoryId, b.targetAmount)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 border border-white/5 bg-white/5 hover:bg-emerald-500/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    {b.targetAmount > 0 ? "Edit Limit" : "Set Limit"}
                  </button>
                )}
              </div>

              {/* Progress and values */}
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-end text-xs">
                  <span className="text-zinc-400">
                    Spent: <strong className="text-white">₹{b.actualSpend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                  </span>
                  <span className="text-zinc-400">
                    Limit: <strong className="text-white">{b.targetAmount > 0 ? `₹${b.targetAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : "No limit set"}</strong>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver 
                        ? "bg-rose-500 shadow-[0_0_8px_#f43f5e50]" 
                        : percentage >= 80 
                        ? "bg-amber-500 shadow-[0_0_8px_#f59e0b50]" 
                        : "bg-emerald-500 shadow-[0_0_8px_#10b98150]"
                    }`}
                    style={{ width: `${b.targetAmount > 0 ? percentage : 0}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs mt-1">
                  <span className={`font-semibold ${
                    isOver ? "text-rose-400" : percentage >= 85 ? "text-amber-400" : "text-zinc-500"
                  }`}>
                    {b.targetAmount > 0 
                      ? `${percentage.toFixed(0)}% consumed` 
                      : "Define a budget to track progress"
                    }
                  </span>
                  {b.targetAmount > 0 && (
                    <span className="text-zinc-500">
                      {isOver 
                        ? `Exceeded by ₹${Math.abs(b.actualSpend - b.targetAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` 
                        : `Remaining: ₹${(b.targetAmount - b.actualSpend).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                      }
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
