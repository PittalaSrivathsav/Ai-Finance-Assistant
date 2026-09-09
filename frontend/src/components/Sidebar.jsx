import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Wallet, 
  Sparkles, 
  Bot, 
  User, 
  LogOut,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const Sidebar = () => {
  const { activeTab, setActiveTab, logoutUser } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budgets', label: 'Budgets', icon: Wallet },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'chatbot', label: 'Chatbot', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    logoutUser();
  };


  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between py-6 px-4 shrink-0 select-none">
      <div>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-100 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight tracking-tight">AI Finance</h1>
            <p className="text-xs text-slate-500 font-medium">Assistant</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-8 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm shadow-emerald-50/50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'insights' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Logout Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
