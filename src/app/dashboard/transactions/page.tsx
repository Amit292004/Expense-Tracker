"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Trash2, Filter, Utensils, Home, Zap, Car, Film, ShoppingBag, HeartPulse, Plane, GraduationCap, Coins, Briefcase, Laptop, TrendingUp, Gift, IndianRupee, Calendar, Tag, CreditCard, Download } from "lucide-react";
import { getTransactionsList, deleteTransaction } from "@/app/actions/transactions";
import AddTransactionModal from "@/components/AddTransactionModal";
import { useSession } from "next-auth/react";

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

export default function TransactionsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL"); // ALL, EXPENSE, INCOME
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [datePreset, setDatePreset] = useState("ALL"); // ALL, TODAY, 7DAYS, 30DAYS, MONTH, YEAR, CUSTOM
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    const list = await getTransactionsList();
    setTransactions(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      const res = await deleteTransaction(id);
      if (res.success) {
        fetchTransactions();
      } else {
        alert(res.error || "Failed to delete transaction.");
      }
    }
  };

  // Get unique categories present in list for filter dropdown
  const uniqueCategories = Array.from(new Set(transactions.map(t => t.category?.name).filter(Boolean)));

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      (t.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.category?.name || "").toLowerCase().includes(search.toLowerCase());
      
    const matchesType = filterType === "ALL" || t.type === filterType;
    const matchesCategory = filterCategory === "ALL" || t.category?.name === filterCategory;
    
    // Date Filtering
    const txDate = new Date(t.date);
    const now = new Date();
    let matchesDate = true;
    
    if (datePreset === "TODAY") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      matchesDate = txDate >= today;
    } else if (datePreset === "7DAYS") {
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      matchesDate = txDate >= sevenDaysAgo;
    } else if (datePreset === "30DAYS") {
      const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      matchesDate = txDate >= thirtyDaysAgo;
    } else if (datePreset === "MONTH") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      matchesDate = txDate >= startOfMonth;
    } else if (datePreset === "YEAR") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      matchesDate = txDate >= startOfYear;
    } else if (datePreset === "CUSTOM") {
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
      matchesDate = startMatch && endMatch;
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  const handleExportPDF = async () => {
    if (filteredTransactions.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Colors
      const primaryColor = [24, 24, 27]; // #18181b
      const accentColor = [16, 185, 129]; // #10b981 (emerald)
      const greyColor = [82, 82, 91]; // #52525b

      // Header Brand
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("ExpensIQ Financial Report", 14, 20);

      // Accent Line
      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setLineWidth(1);
      doc.line(14, 23, 196, 23);

      // Metadata
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(greyColor[0], greyColor[1], greyColor[2]);
      
      const todayStr = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      doc.text(`Generated on: ${todayStr}`, 14, 28);

      let periodStr = "All Time";
      if (datePreset === "TODAY") periodStr = "Today";
      else if (datePreset === "7DAYS") periodStr = "Last 7 Days";
      else if (datePreset === "30DAYS") periodStr = "Last 30 Days";
      else if (datePreset === "MONTH") periodStr = "This Month";
      else if (datePreset === "YEAR") periodStr = "This Year";
      else if (datePreset === "CUSTOM") {
        const startLabel = startDate ? new Date(startDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : "Beginning";
        const endLabel = endDate ? new Date(endDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : "Present";
        periodStr = `${startLabel} - ${endLabel}`;
      }
      doc.text(`Period: ${periodStr}`, 14, 33);

      if (session?.user?.email) {
        doc.text(`Email: ${session.user.email}`, 196, 28, { align: "right" });
      }

      // Summaries Calculation
      const pdfIncome = filteredTransactions
        .filter((t: any) => t.type === "INCOME")
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      const pdfExpenses = filteredTransactions
        .filter((t: any) => t.type === "EXPENSE")
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      const pdfNet = pdfIncome - pdfExpenses;

      // Summary Cards (Rounded Rectangles)
      const cardY = 38;
      const cardHeight = 22;
      const cardWidth = 56;

      // Card 1: Total Income
      doc.setFillColor(244, 244, 245);
      doc.roundedRect(14, cardY, cardWidth, cardHeight, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(113, 113, 122);
      doc.text("TOTAL INCOME", 18, cardY + 6);
      doc.setFontSize(13);
      doc.setTextColor(5, 150, 105);
      doc.text(`INR ${pdfIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 18, cardY + 14);

      // Card 2: Total Expenses
      doc.setFillColor(244, 244, 245);
      doc.roundedRect(77, cardY, cardWidth, cardHeight, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(113, 113, 122);
      doc.text("TOTAL EXPENSES", 81, cardY + 6);
      doc.setFontSize(13);
      doc.setTextColor(220, 38, 38);
      doc.text(`INR ${pdfExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 81, cardY + 14);

      // Card 3: Net Savings
      doc.setFillColor(244, 244, 245);
      doc.roundedRect(140, cardY, cardWidth, cardHeight, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(113, 113, 122);
      doc.text("NET SAVINGS", 144, cardY + 6);
      doc.setFontSize(13);
      if (pdfNet >= 0) {
        doc.setTextColor(5, 150, 105);
      } else {
        doc.setTextColor(220, 38, 38);
      }
      doc.text(`INR ${pdfNet.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 144, cardY + 14);

      // Ledger Table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("Transaction Details", 14, 68);

      // Construct table body
      const tableBody = filteredTransactions.map((tx: any) => {
        const dateFormatted = new Date(tx.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
        const typeLabel = tx.type === "INCOME" ? "Income" : "Expense";
        const amtPrefix = tx.type === "INCOME" ? "+" : "-";
        const amountFormatted = `${amtPrefix}INR ${tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        return [
          dateFormatted,
          tx.description || tx.category?.name || "Uncategorized",
          tx.category?.name || "General",
          typeLabel,
          amountFormatted
        ];
      });

      autoTable(doc, {
        startY: 72,
        head: [["Date", "Description", "Category", "Type", "Amount"]],
        body: tableBody,
        foot: [["Total", "Total sum of amount", "", "", `${pdfNet >= 0 ? '+' : '-'}INR ${Math.abs(pdfNet).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`]],
        theme: "striped",
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
          halign: "left"
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [39, 39, 42]
        },
        footStyles: {
          fillColor: [244, 244, 245],
          textColor: [24, 24, 27],
          fontSize: 8.5,
          fontStyle: "bold",
          halign: "left"
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        },
        columnStyles: {
          4: { halign: "right", fontStyle: "bold" }
        },
        didParseCell: (data) => {
          if (data.column.index === 4 && (data.section === "body" || data.section === "foot")) {
            const cellValue = data.cell.raw as string;
            if (cellValue.startsWith("+")) {
              data.cell.styles.textColor = [5, 150, 105];
            } else if (cellValue.startsWith("-")) {
              data.cell.styles.textColor = [220, 38, 38];
            }
          }
          if (data.column.index === 3 && data.section === "body") {
            const cellValue = data.cell.raw as string;
            if (cellValue === "Income") {
              data.cell.styles.textColor = [5, 150, 105];
            } else {
              data.cell.styles.textColor = [113, 113, 122];
            }
          }
        },
        margin: { left: 14, right: 14 },
        styles: { font: "helvetica" }
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(161, 161, 170);
        doc.text("ExpensIQ — Smart Financial Analytics", 14, 287);
        doc.text(`Page ${i} of ${pageCount}`, 196 - 15, 287, { align: "right" });
      }

      // Save PDF
      doc.save(`ExpensIQ_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Transactions</h1>
          <p className="text-zinc-400 text-sm mt-1">Review and manage your logged daily income and expenses.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportPDF}
            disabled={filteredTransactions.length === 0 || isGeneratingPdf}
            className="bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            {isGeneratingPdf ? "Generating..." : "Export PDF"}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 text-black px-4 py-3 rounded-xl font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" />
            Log Transaction
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search description or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Type Filter */}
            <div className="relative flex-1 md:flex-initial">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-40 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer appearance-none"
              >
                <option value="ALL">All Types</option>
                <option value="EXPENSE">Expenses Only</option>
                <option value="INCOME">Incomes Only</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative flex-1 md:flex-initial">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-44 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer appearance-none"
              >
                <option value="ALL">All Categories</option>
                {uniqueCategories.map((cat: any) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date Preset Filter */}
            <div className="relative flex-1 md:flex-initial">
              <select
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value)}
                className="w-full md:w-40 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer appearance-none"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="7DAYS">Last 7 Days</option>
                <option value="30DAYS">Last 30 Days</option>
                <option value="MONTH">This Month</option>
                <option value="YEAR">This Year</option>
                <option value="CUSTOM">Custom Range</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom Date Inputs Row */}
        {datePreset === "CUSTOM" && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-wrap gap-6 pt-4 border-t border-white/5 items-center"
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
      </div>

      {/* Transactions Table/List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-2xl"
      >
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-sm border border-dashed border-white/5 rounded-2xl">
            {transactions.length === 0 
              ? "No transactions found. Log your first daily expense or income above!" 
              : "No transactions match your current filters."}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx: any) => (
              <motion.div 
                layout
                key={tx.id} 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-zinc-900/40 border border-white/5 rounded-2xl hover:border-white/10 transition-colors gap-4"
              >
                {/* Details */}
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="p-3 rounded-xl flex-shrink-0"
                    style={{ 
                      backgroundColor: `${tx.category?.color || '#333333'}15`, 
                      color: tx.category?.color || '#ffffff',
                      border: `1px solid ${tx.category?.color || '#333333'}25` 
                    }}
                  >
                    {getCategoryIcon(tx.category?.icon)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{tx.description || tx.category?.name || "Uncategorized"}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-zinc-500" />
                        {tx.category?.name || "General"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {new Date(tx.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount and delete */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                  <span className={`text-base font-bold ${tx.type === "INCOME" ? "text-emerald-400" : "text-zinc-200"}`}>
                    {tx.type === "INCOME" ? "+" : "-"}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <button 
                    onClick={() => handleDelete(tx.id)}
                    className="text-zinc-500 hover:text-rose-400 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Log Transaction Modal */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTransactions} 
      />
    </div>
  );
}
