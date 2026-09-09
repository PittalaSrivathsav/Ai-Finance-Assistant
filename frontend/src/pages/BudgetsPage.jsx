import React from 'react';
import { 
  Plus, 
  Utensils, 
  Car, 
  ShoppingBag, 
  FileText, 
  Gamepad2, 
  HeartPulse,
  GraduationCap,
  PawPrint,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const CATEGORY_CONFIG = {
  Food: { icon: Utensils, bg: 'bg-rose-50', text: 'text-rose-600', bar: 'bg-rose-500' },
  Transport: { icon: Car, bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
  Shopping: { icon: ShoppingBag, bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500' },
  Bills: { icon: FileText, bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500' },
  Entertainment: { icon: Gamepad2, bg: 'bg-pink-50', text: 'text-pink-600', bar: 'bg-pink-500' },
  Health: { icon: HeartPulse, bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500' },
  Education: { icon: GraduationCap, bg: 'bg-indigo-50', text: 'text-indigo-600', bar: 'bg-indigo-500' },
  Pets: { icon: PawPrint, bg: 'bg-teal-50', text: 'text-teal-600', bar: 'bg-teal-500' },
  Others: { icon: MoreHorizontal, bg: 'bg-slate-100', text: 'text-slate-600', bar: 'bg-slate-500' },
};

export const BudgetsPage = () => {
  const { budgets, setIsBudgetModalOpen } = useFinance();

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-200">
      
      {/* Top Header matching Mockup Screen 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Budgets</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Set and track your monthly budgets.
          </p>
        </div>

        <button
          onClick={() => setIsBudgetModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-200 transition-all hover:shadow self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Grid of Budget Cards matching Mockup Screen 7 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {budgets.map((b) => {
          const config = CATEGORY_CONFIG[b.category] || CATEGORY_CONFIG.Others;
          const Icon = config.icon;
          const percentage = Math.min(100, Math.round((b.spent / b.limit) * 100));
          const isNearLimit = percentage >= 80;

          return (
            <div 
              key={b.id || b.category}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
            >
              {/* Category Icon */}
              <div className={`w-12 h-12 rounded-xl ${config.bg} ${config.text} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>

              {/* Budget Details & Progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 text-sm">{b.category}</h3>
                  <div className="flex items-center gap-1.5">
                    {isNearLimit && (
                      <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{percentage}%</span>
                      </span>
                    )}
                    {!isNearLimit && (
                      <span className="text-xs font-bold text-slate-600">
                        {percentage}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium mb-2.5">
                  <span className="text-slate-900 font-bold">₹ {b.spent.toLocaleString()}</span> / ₹ {b.limit.toLocaleString()}
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isNearLimit ? 'bg-rose-500' : config.bar}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
