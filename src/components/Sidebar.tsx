"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Receipt, PieChart, Settings, LogOut, BrainCircuit, Sparkles } from "lucide-react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Overview" },
    { href: "/dashboard/transactions", icon: <Receipt size={20} />, label: "Transactions" },
    { href: "/dashboard/budgets", icon: <PieChart size={20} />, label: "Budgets" },
    { href: "/dashboard/ai", icon: <BrainCircuit size={20} />, label: "AI Insights" },
    { href: "/dashboard/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-zinc-950 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2 border-b border-white/5">
        <div className="bg-emerald-500/20 p-2 rounded-lg">
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          ExpensIQ
        </span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 pl-3" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User profile section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            {user.name?.[0].toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate text-white">{user.name || "User"}</p>
            <p className="text-xs text-zinc-500 truncate w-36">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 text-left"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
