"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, IndianRupee, BrainCircuit, Activity, Plus, ShoppingBag, Utensils, Home, Zap, Car, Film, HeartPulse, Plane, GraduationCap, Coins, Briefcase, Laptop, TrendingUp, Gift } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getOverviewData, deleteTransaction } from "@/app/actions/transactions";
import AddTransactionModal from "@/components/AddTransactionModal";

// Helper for category icons
const getCategoryIcon = (iconName: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    Utensils: <Utensils className="w-4 h-4" />,
    Home: <Home className="w-4 h-4" />,
    Zap: <Zap className="w-4 h-4" />,
    Car: <Car className="w-4 h-4" />,
    Film: <Film className="w-4 h-4" />,
    ShoppingBag: <ShoppingBag className="w-4 h-4" />,
    HeartPulse: <HeartPulse className="w-4 h-4" />,
    Plane: <Plane className="w-4 h-4" />,
    GraduationCap: <GraduationCap className="w-4 h-4" />,
    Coins: <Coins className="w-4 h-4" />,
    Briefcase: <Briefcase className="w-4 h-4" />,
    Laptop: <Laptop className="w-4 h-4" />,
    TrendingUp: <TrendingUp className="w-4 h-4" />,
    Gift: <Gift className="w-4 h-4" />,
    DollarSign: <IndianRupee className="w-4 h-4" />
  };
  return icons[iconName] || <IndianRupee className="w-4 h-4" />;
};

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datePreset, setDatePreset] = useState("ALL"); // ALL, TODAY, 7DAYS, 30DAYS, MONTH, YEAR, CUSTOM
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [data, setData] = useState<any>({
    totalBalance: 0,
    allTimeExpenses: 0,
    income: 0,
    expenses: 0,
    healthScore: 80,
    chartData: [],
    insights: [],
    recentTransactions: [],
    allTransactions: []
  });

  const fetchData = async () => {
    setLoading(true);
    const result = await getOverviewData();
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      const res = await deleteTransaction(id);
      if (res.success) {
        fetchData();
      } else {
        alert(res.error || "Failed to delete transaction.");
      }
    }
  };

  const getFilteredSum = (type: "INCOME" | "EXPENSE") => {
    const transactions = data.allTransactions || [];
    const now = new Date();
    
    const filtered = transactions.filter((t: any) => {
      if (t.type !== type) return false;
      const txDate = new Date(t.date);
      
      if (datePreset === "ALL") return true;
      if (datePreset === "TODAY") {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return txDate >= today;
      }
      if (datePreset === "7DAYS") {
        const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        return txDate >= sevenDaysAgo;
      }
      if (datePreset === "30DAYS") {
        const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        return txDate >= thirtyDaysAgo;
      }
      if (datePreset === "MONTH") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return txDate >= startOfMonth;
      }
      if (datePreset === "YEAR") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return txDate >= startOfYear;
      }
      if (datePreset === "CUSTOM") {
        let startMatch = true;
        let endMatch = true;
        if (startDate) {
          const startLimit = new Date(startDate);
          startLimit.setHours(0, 0, 0, 0);
          startMatch = txDate >= startLimit;
        }
        if (endDate) {
          const endLimit = new Date(endDate);
          endLimit.setHours(23, 59, 59, 999);
          endMatch = txDate <= endLimit;
        }
        return startMatch && endMatch;
      }
      return true;
    });
    
    return filtered.reduce((sum: number, t: any) => sum + t.amount, 0);
  };

  const getPresetLabel = (preset: string) => {
    const labels: { [key: string]: string } = {
      ALL: "All Time",
      TODAY: "Today",
      "7DAYS": "Last 7 Days",
      "30DAYS": "Last 30 Days",
      MONTH: "This Month",
      YEAR: "This Year",
      CUSTOM: "Custom Range"
    };
    return labels[preset] || "All Time";
  };

  const getFilteredExpenses = () => {
    const transactions = data.allTransactions || [];
    const now = new Date();
    
    const filtered = transactions.filter((t: any) => {
      if (t.type !== "EXPENSE") return false;
      const txDate = new Date(t.date);
      
      if (datePreset === "ALL") return true;
      if (datePreset === "TODAY") {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return txDate >= today;
      }
      if (datePreset === "7DAYS") {
        const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        return txDate >= sevenDaysAgo;
      }
      if (datePreset === "30DAYS") {
        const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        return txDate >= thirtyDaysAgo;
      }
      if (datePreset === "MONTH") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return txDate >= startOfMonth && txDate <= endOfMonth;
      }
      if (datePreset === "YEAR") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
        return txDate >= startOfYear && txDate <= endOfYear;
      }
      if (datePreset === "CUSTOM") {
        let startMatch = true;
        let endMatch = true;
        if (startDate) {
          const startLimit = new Date(startDate);
          startLimit.setHours(0, 0, 0, 0);
          startMatch = txDate >= startLimit;
        }
        if (endDate) {
          const endLimit = new Date(endDate);
          endLimit.setHours(23, 59, 59, 999);
          endMatch = txDate <= endLimit;
        }
        return startMatch && endMatch;
      }
      return true;
    });
    
    return filtered.reduce((sum: number, t: any) => sum + t.amount, 0);
  };

  const getCardTitle = (preset: string) => {
    const titles: { [key: string]: string } = {
      ALL: "All-Time Spending",
      TODAY: "Today's Spending",
      "7DAYS": "This Week's Spending",
      "30DAYS": "Last 30 Days Spending",
      MONTH: "This Month's Spending",
      YEAR: "This Year's Spending",
      CUSTOM: "Custom Range Spending"
    };
    return titles[preset] || "All-Time Spending";
  };

  const getExpensesForPeriod = (days: number | "MONTH" | "ALL") => {
    const transactions = data.allTransactions || [];
    const now = new Date();
    
    const filtered = transactions.filter((t: any) => {
      if (t.type !== "EXPENSE") return false;
      const txDate = new Date(t.date);
      
      if (days === "ALL") return true;
      if (days === "MONTH") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return txDate >= startOfMonth && txDate <= endOfMonth;
      }
      
      const limitDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
      limitDate.setHours(0, 0, 0, 0);
      return txDate >= limitDate;
    });
    
    return filtered.reduce((sum: number, t: any) => sum + t.amount, 0);
  };

  if (loading && data.chartData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Overview</h1>
          <p className="text-zinc-400 text-sm mt-1">Real-time metrics and dynamic spend tracking.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer appearance-none font-semibold h-[46px] min-w-[130px]"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="7DAYS">Last 7 Days</option>
            <option value="30DAYS">Last 30 Days</option>
            <option value="MONTH">This Month</option>
            <option value="YEAR">This Year</option>
            <option value="CUSTOM">Custom Range</option>
          </select>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 text-black px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer h-[46px]"
          >
            <Plus className="w-4 h-4" />
            Log Expense / Income
          </button>
        </div>
      </div>

      {/* Custom Date Inputs Row */}
      {datePreset === "CUSTOM" && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-wrap gap-6 p-4 bg-zinc-950 border border-white/5 rounded-3xl items-center"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </motion.div>
      )}

      {/* Stats row - Dynamic spending card next to fixed Today and Month cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title={getCardTitle(datePreset)} 
          amount={`₹${getFilteredExpenses().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          trend={getPresetLabel(datePreset)} 
          isPositive={false} 
          icon={<IndianRupee className="w-5 h-5 text-emerald-400" />} 
        />
        <StatCard 
          title="Today's Expenses" 
          amount={`₹${getExpensesForPeriod(0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          trend="Today" 
          isPositive={false} 
          icon={<ArrowDownRight className="w-5 h-5 text-rose-400" />} 
        />
        <StatCard 
          title="This Month's Expenses" 
          amount={`₹${getExpensesForPeriod("MONTH").toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          trend="This Month" 
          isPositive={false} 
          icon={<ShoppingBag className="w-5 h-5 text-blue-400" />} 
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-2xl"
        >
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Cash Flow Overview</h2>
              <p className="text-xs text-zinc-500">6-month comparison of net earnings vs expenses</p>
            </div>
          </div>
          <div className="h-72 w-full">
            {data.chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                No transaction data available yet. Try logging some expenses or incomes!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Net Flow']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* AI Assistant Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-b from-zinc-950 to-[#09090b] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/10">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white">ExpensIQ AI Insights</h2>
            </div>

            <div className="space-y-4">
              {data.insights.length === 0 ? (
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-sm text-zinc-400">
                  Waiting for transaction patterns to build personalized financial suggestions.
                </div>
              ) : (
                data.insights.map((ins: any, index: number) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border ${
                      ins.type === "ALERT" 
                        ? "bg-rose-500/5 border-rose-500/10 text-zinc-300" 
                        : ins.type === "SAVING_TIP"
                        ? "bg-amber-500/5 border-amber-500/10 text-zinc-300"
                        : "bg-emerald-500/5 border-emerald-500/10 text-zinc-300"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-zinc-400">
                      {ins.type === "ALERT" ? "Budget Alert" : ins.type === "SAVING_TIP" ? "Smart Savings" : "Financial Forecast"}
                    </p>
                    <p className="text-sm leading-relaxed">{ins.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <button className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-colors border border-white/10 text-sm">
            Configure Budgets & Targets
          </button>
        </motion.div>

      </div>

      {/* Recent Transactions list */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-2xl mt-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
            <p className="text-xs text-zinc-500">Your latest logged incomes and daily expenses</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {data.recentTransactions.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm border border-dashed border-white/5 rounded-2xl">
              No transactions logged yet. Click "Log Expense / Income" above to add your first daily transaction.
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentTransactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ 
                        backgroundColor: `${tx.category?.color || '#333333'}20`, 
                        color: tx.category?.color || '#ffffff',
                        border: `1px solid ${tx.category?.color || '#333333'}30` 
                      }}
                    >
                      {getCategoryIcon(tx.category?.icon)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{tx.description || tx.category?.name || "Uncategorized"}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                        <span>{tx.category?.name || "General"}</span>
                        <span>•</span>
                        <span>{new Date(tx.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-bold ${tx.type === "INCOME" ? "text-emerald-400" : "text-zinc-300"}`}>
                      {tx.type === "INCOME" ? "+" : "-"}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <button 
                      onClick={() => handleDelete(tx.id)}
                      className="text-zinc-600 hover:text-rose-400 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Log Transaction Modal */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
}

function StatCard({ title, amount, trend, isPositive, icon }: { title: string, amount: string, trend: string, isPositive: boolean, icon: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-xl border border-white/5">
          {icon}
        </div>
        <div className={`text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {trend}
        </div>
      </div>
      <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{amount}</p>
    </motion.div>
  );
}
