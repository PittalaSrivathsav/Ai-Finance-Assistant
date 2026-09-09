import React from 'react';
import { Leaf } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const Navbar = () => {
  const { setActiveTab } = useFinance();

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">AI Finance Assistant</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button onClick={() => setActiveTab('landing')} className="hover:text-emerald-600 transition-colors">Home</button>
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <a href="#about" className="hover:text-emerald-600 transition-colors">About</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('login')}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-200 transition-all hover:shadow"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};
