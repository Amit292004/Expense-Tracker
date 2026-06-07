"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, BrainCircuit, Sparkles, User, MessageSquare, ArrowUpRight, ShieldAlert, BadgeInfo } from "lucide-react";
import { chatWithAi } from "@/app/actions/ai";
import { getOverviewData } from "@/app/actions/transactions";

export default function AiPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content: "Hello! I'm ExpensIQ's AI advisor. I have loaded your live financial records. Ask me about your all-time spending, monthly expenses, or how to save money!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [stats, setStats] = useState<any>({
    totalBalance: 0,
    income: 0,
    expenses: 0,
    healthScore: 80
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load stats for context sidebar
  useEffect(() => {
    const loadStats = async () => {
      const result = await getOverviewData();
      setStats(result);
    };
    loadStats();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput("");
    
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await chatWithAi(newMessages);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error querying your profile. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };

  const suggestionChips = [
    "What is my all-time spending?",
    "How much did I spend?",
    "How can I save?",
    "Show my highest spending category"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">AI Financial Advisor</h1>
        <p className="text-zinc-400 text-sm mt-1">Get instant answers about your database records, budgets, and savings goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-h-[60vh]">
        {/* Chat Area */}
        <div className="lg:col-span-2 bg-zinc-950 border border-white/5 rounded-3xl flex flex-col h-[65vh] shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-zinc-900/20">
            <div className="p-2 bg-emerald-500/15 rounded-lg border border-emerald-500/10">
              <BrainCircuit className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">ExpensIQ Advisor</h3>
              <p className="text-xs text-zinc-500">Connected to your SQLite database</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${
                  m.role === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                  m.role === "user" 
                    ? "bg-zinc-800 text-zinc-300" 
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/10"
                }`}>
                  {m.role === "user" ? <User size={14} /> : <BrainCircuit size={14} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                  m.role === "user" 
                    ? "bg-zinc-900 border-white/5 text-zinc-200" 
                    : "bg-emerald-500/[0.03] border-emerald-500/10 text-zinc-300"
                }`}>
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 flex items-center justify-center text-xs">
                  <BrainCircuit size={14} />
                </div>
                <div className="bg-emerald-500/[0.03] border border-emerald-500/10 p-4 rounded-2xl text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestions */}
          <div className="px-6 py-2 flex flex-wrap gap-2">
            {suggestionChips.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(s)}
                className="bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 text-zinc-400 hover:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Footer Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-4 border-t border-white/5 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about your finances... (e.g. 'How much did I spend?')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
            <button 
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Diagnostics Sidebar */}
        <div className="space-y-6">
          {/* Health score status card */}
          <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[30px]" />
            <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Advisor Diagnostics
            </h3>
            
            <div className="space-y-4">
              {/* Stat */}
              <div>
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span>Savings Rate</span>
                  <span className="text-emerald-400 font-semibold">
                    {stats.income > 0 ? `${(((stats.income - stats.expenses) / stats.income) * 100).toFixed(0)}%` : "0%"}
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${stats.income > 0 ? Math.max(0, Math.min(100, ((stats.income - stats.expenses) / stats.income) * 100)) : 0}%` }}
                  />
                </div>
              </div>

              {/* Grid values */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-zinc-900/50 p-3 rounded-2xl border border-white/5">
                  <p className="text-zinc-500 text-[10px] uppercase font-semibold">Net Savings</p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    ₹{(stats.income - stats.expenses).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-2xl border border-white/5">
                  <p className="text-zinc-500 text-[10px] uppercase font-semibold">Health Score</p>
                  <p className="text-sm font-bold text-white mt-0.5">{stats.healthScore}/100</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick tips list */}
          <div className="bg-gradient-to-b from-zinc-950 to-[#09090b] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex-1">
            <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
              <BadgeInfo className="w-4 h-4 text-blue-400" />
              Dynamic Advice Tips
            </h3>
            <ul className="space-y-3 text-xs text-zinc-400 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-emerald-400">•</span>
                <span>Type in **"What is my all-time spending?"** to see your total expenses logged across all records.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">•</span>
                <span>Ask **"How much did I spend?"** to quickly query food, utilities, transport, and general shopping totals.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">•</span>
                <span>Ask **"How can I save?"** for recommendations based on your actual monthly savings rate.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
