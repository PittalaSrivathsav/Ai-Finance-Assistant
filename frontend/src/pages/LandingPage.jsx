import React from 'react';
import { 
  ReceiptText, 
  Sparkles, 
  TrendingUp, 
  Target, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  DollarSign,
  BarChart3,
  Bot
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useFinance } from '../context/FinanceContext';

export const LandingPage = () => {
  const { setActiveTab } = useFinance();

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart AI-Powered Personal Finance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Take Control of <br />
              <span className="text-emerald-600">Your Finances</span> with AI
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Track expenses, set budgets, get AI-powered insights and build a better financial future.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('signup')}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-200 transition-all flex items-center gap-2 hover:translate-y-[-1px]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm transition-all"
              >
                Learn More
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero configuration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Safe & Secure</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic / Illustration (Matching the mockup design) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-br from-emerald-500/10 via-emerald-50 to-white p-8 rounded-3xl border border-emerald-100 shadow-xl">
              {/* Floating Stat Widget 1 */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 flex items-center gap-4 mb-4 transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Monthly Savings Target</p>
                  <p className="text-lg font-bold text-slate-900">₹ 16,500 <span className="text-xs font-semibold text-emerald-600">(+12%)</span></p>
                </div>
              </div>

              {/* Floating AI Notification */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-emerald-100 flex items-start gap-3.5 mb-4 transform rotate-1 hover:rotate-0 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">AI Category Prediction</p>
                  <p className="text-xs text-slate-500 mt-0.5">"Swiggy dinner" automatically tagged as <span className="font-semibold text-emerald-700">Food (93%)</span></p>
                </div>
              </div>

              {/* Finance Assistant Chat snippet */}
              <div className="bg-white/90 rounded-2xl p-3.5 shadow-md border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">"Your food expenses are 18% higher"</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>
          </div>

        </div>

        {/* 4 Feature Cards at Bottom (Matching Screen 1) */}
        <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-200/70">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ReceiptText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Track Expenses</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Easily record income and expenses with date, amount, and custom notes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">AI Categorization</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automatic expense classification using machine learning with confidence scores.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Smart Insights</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Personalized recommendations and spending pattern alerts in real-time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Plan Better</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Set category-wise monthly budgets and receive alerts before you overspend.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 px-6 text-center text-xs text-slate-400">
        AI Finance Assistant © 2026. Built with Machine Learning & Modern Web Tech.
      </footer>
    </div>
  );
};
