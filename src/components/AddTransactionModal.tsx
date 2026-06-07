"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, IndianRupee, Calendar, FileText, Wallet, Tag } from "lucide-react";
import { getCategories, getWallets, addTransaction } from "@/app/actions/transactions";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTransactionModal({ isOpen, onClose, onSuccess }: AddTransactionModalProps) {
  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("EXPENSE"); // EXPENSE or INCOME
  const [walletId, setWalletId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch wallets and categories when open
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const [fetchedWallets, fetchedCategories] = await Promise.all([
          getWallets(),
          getCategories()
        ]);
        setWallets(fetchedWallets);
        setCategories(fetchedCategories);
        
        // Auto-select first wallet if available
        if (fetchedWallets.length > 0) {
          setWalletId(fetchedWallets[0].id);
        }
      };
      fetchData();
      
      // Reset form on open
      setAmount("");
      setType("EXPENSE");
      setCategoryId("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setError("");
    }
  }, [isOpen]);

  // Filter categories based on transaction type
  const filteredCategories = categories.filter(cat => cat.type === type);

  // Set default category when type or categories change
  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    } else {
      setCategoryId("");
    }
  }, [type, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }
    
    if (!walletId) {
      setError("Please select a wallet.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addTransaction({
        amount: parsedAmount,
        type,
        walletId,
        categoryId,
        date,
        description
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to add transaction.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          {/* Backdrop click */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg overflow-hidden bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl z-10"
          >
            {/* Ambient glows */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] pointer-events-none transition-colors duration-500 ${
              type === "INCOME" ? "bg-emerald-500/10" : "bg-rose-500/10"
            }`} />
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Log Transaction</span>
              </h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type selector tabs */}
            <div className="flex bg-zinc-900 p-1 rounded-xl mb-6 border border-white/5">
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  type === "EXPENSE" 
                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/20" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("INCOME")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  type === "INCOME" 
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Income
              </button>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs mb-4">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-semibold text-lg"
                  />
                </div>
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Tag className="w-4 h-4" />
                  </div>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer text-sm"
                  >
                    {filteredCategories.length === 0 ? (
                      <option value="">No categories available</option>
                    ) : (
                      filteredCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Description / Notes</label>
                <div className="relative">
                  <div className="absolute top-3 inset-y-0 left-0 pl-3 flex items-start pointer-events-none text-zinc-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    placeholder="e.g. Weekly grocery shopping"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 rounded-xl border border-white/5 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !walletId}
                  className={`flex-1 font-semibold py-3 rounded-xl transition-all text-sm ${
                    type === "INCOME" 
                      ? "bg-emerald-500 hover:bg-emerald-400 text-black" 
                      : "bg-rose-500 hover:bg-rose-400 text-white"
                  } disabled:opacity-50`}
                >
                  {isSubmitting ? "Saving..." : !walletId ? "Initializing..." : "Save Transaction"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
