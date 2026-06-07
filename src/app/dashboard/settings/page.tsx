"use client";

import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">Settings</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your user profile parameters and system tier.</p>
      </div>

      <div className="max-w-2xl">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950 border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />
          <h3 className="font-bold text-white mb-6 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            Account Profile
          </h3>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold border border-emerald-500/10 flex-shrink-0">
              {session?.user?.name?.[0].toUpperCase() || "U"}
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <h4 className="font-semibold text-xl text-white truncate">{session?.user?.name || "User"}</h4>
              <p className="text-sm text-zinc-400 truncate">{session?.user?.email}</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-zinc-400">
                  Role: User
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/10 text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Tier: Basic (Free)
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
