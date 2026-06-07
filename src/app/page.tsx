"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Lock, PieChart, Sparkles, TrendingUp, Download, Filter, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-[#09090b] relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle glowing grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Animated glowing orbs */}
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full mix-blend-screen filter blur-[120px]" 
        />
        <motion.div 
          animate={{ y: [0, 40, 0], x: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-20 -right-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[120px]" 
        />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 p-2 rounded-xl border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
              <Sparkles className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              ExpensIQ
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-emerald-400 transition-colors">Features</Link>
            <Link href="#ai" className="hover:text-emerald-400 transition-colors">AI Capabilities</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-full hover:bg-emerald-400 hover:text-black transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-36 pb-16 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium tracking-wide">Next-Generation Personal Finance</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight mb-8 leading-[1.1]"
            >
              Master your money with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                AI Precision
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed"
            >
              Log your daily cash flow instantly, unlock AI-driven financial insights, and export dynamic PDF reports. <span className="text-zinc-200">Beautifully designed. Incredibly smart.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
            >
              <Link href="/register" className="group relative flex items-center justify-center gap-2 bg-emerald-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative">Start for free</span>
                <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#demo" className="group flex items-center justify-center gap-2 bg-zinc-900/50 border border-white/10 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/10 transition-all hover:-translate-y-1 backdrop-blur-md">
                View Demo
              </Link>
            </motion.div>
          </div>

          {/* Dashboard Preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-24 relative mx-auto max-w-5xl"
            style={{ perspective: "1000px" }}
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl p-2 shadow-[0_20px_70px_rgba(0,0,0,0.8)] ring-1 ring-white/5 relative z-20"
            >
              <div className="rounded-xl border border-white/5 bg-[#09090b]/80 overflow-hidden aspect-[16/9] relative">
                {/* Mock UI Elements inside */}
                <div className="absolute inset-0 flex">
                  {/* Sidebar Mock */}
                  <div className="w-64 border-r border-white/5 p-4 hidden md:flex flex-col gap-4">
                    <div className="h-8 w-32 bg-white/5 rounded-md mb-8" />
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-10 w-full bg-white/5 rounded-lg" />
                    ))}
                  </div>
                  {/* Main Content Mock */}
                  <div className="flex-1 p-8 flex flex-col gap-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-8 w-48 bg-white/5 rounded-lg" />
                      <div className="h-10 w-10 bg-white/5 rounded-full" />
                    </div>
                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-gradient-to-br from-white/5 to-white/0 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                           <div className="h-4 w-24 bg-white/10 rounded" />
                           <div className="h-8 w-32 bg-white/10 rounded" />
                        </div>
                      ))}
                    </div>
                    {/* Chart Mock */}
                    <div className="flex-1 border border-white/5 bg-white/5 rounded-2xl p-4">
                      <div className="w-full h-full bg-gradient-to-t from-emerald-500/20 to-transparent rounded-lg border-b border-emerald-500/50" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Everything you need. <span className="text-zinc-500">And more.</span></h2>
            <p className="text-zinc-400 text-lg">Powerful features wrapped in a beautiful, intuitive interface.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<BrainCircuit className="text-emerald-400" />}
              title="AI Financial Insights"
              description="Receive smart alerts, saving tips, and personalized financial forecasts based on your spending patterns."
            />
            <FeatureCard 
              icon={<MessageSquare className="text-blue-400" />}
              title="Ask AI Advisor"
              description="Chat directly with an AI advisor to get quick summaries of your all-time spending and financial health."
            />
            <FeatureCard 
              icon={<Download className="text-purple-400" />}
              title="Dynamic PDF Export"
              description="Export beautiful, color-coded PDF reports of your transactions for any custom date range."
            />
            <FeatureCard 
              icon={<PieChart className="text-pink-400" />}
              title="Visual Budgets"
              description="Set and track goals with stunning visual progress bars and category breakdown charts."
            />
            <FeatureCard 
              icon={<Filter className="text-yellow-400" />}
              title="Advanced Filtering"
              description="Easily filter your transactions by custom date ranges, categories, and income or expense types."
            />
            <FeatureCard 
              icon={<Lock className="text-cyan-400" />}
              title="Secure & Private"
              description="Your financial data is securely stored. You remain in full control of your personal information."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:bg-zinc-800/50 transition-colors">
      <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  )
}
