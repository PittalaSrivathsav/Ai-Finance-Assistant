import React from 'react';
import { User, Mail, Shield, Sparkles, CheckCircle2, LogOut } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const ProfilePage = () => {
  const { user, setUser, setActiveTab, transactions, budgets } = useFinance();

  const handleLogout = () => {
    setUser({ name: '', email: '', isAuthenticated: false });
    setActiveTab('landing');
  };

  return (
    <div className="space-y-6 pb-10 max-w-3xl animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile & Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your personal account and preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl shadow-inner">
          {user.name ? user.name.charAt(0) : 'S'}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <h2 className="text-lg font-bold text-slate-900">{user.name || 'Srivathsav'}</h2>
          <p className="text-xs text-slate-500">{user.email || 'srivathsav@example.com'}</p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              Active Member
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              AI Categorizer Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Account Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Total Transactions</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{transactions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Active Budgets</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{budgets.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">ML Model Accuracy</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">94.8%</p>
        </div>
      </div>

      {/* Preferences & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Application Preferences</h3>
        
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-semibold text-slate-800">Automatic AI Categorization</p>
              <p className="text-xs text-slate-500">Auto-suggest categories on description entry</p>
            </div>
            <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 font-bold text-xs">Enabled</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-semibold text-slate-800">Monthly Spending Alerts</p>
              <p className="text-xs text-slate-500">Notify when budget reaches 80% capacity</p>
            </div>
            <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 font-bold text-xs">Enabled</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 font-semibold text-xs sm:text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out of account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
