"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Lock, PieChart, Sparkles, TrendingUp, Download, Filter, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-[#09090b]">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/20 p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              ExpensIQ
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#ai" className="hover:text-white transition-colors">AI Capabilities</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>Meet the future of personal finance</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-tight"
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
              className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl"
            >
              ExpensIQ automatically categorizes your spending, predicts future expenses, and acts as your personal financial advisor. Beautifully designed. Incredibly smart.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link href="/register" className="flex items-center justify-center gap-2 bg-emerald-500 text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-emerald-400 transition-colors">
                Start for free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#demo" className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/10 transition-colors backdrop-blur-md">
                View Demo
              </Link>
            </motion.div>
          </div>

          {/* Dashboard Preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-2 shadow-2xl">
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
            </div>
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
