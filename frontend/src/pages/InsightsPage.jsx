import React from 'react';
import { 
  Flame, 
  AlertTriangle, 
  TrendingUp, 
  PieChart, 
  PiggyBank, 
  Sparkles,
  Info
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const INSIGHT_ICONS = {
  high_expense: { icon: Flame, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
  budget_alert: { icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  positive_trend: { icon: TrendingUp, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  top_category: { icon: PieChart, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  savings_opportunity: { icon: PiggyBank, bg: 'bg-yellow-50', text: 'text-amber-600', border: 'border-amber-100' },
};

export const InsightsPage = () => {
  const { insights } = useFinance();

  return (
    <div className="space-y-6 pb-10 max-w-4xl animate-in fade-in duration-200">
      
      {/* Top Header matching Mockup Screen 8 */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Financial Insights</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Personalized insights based on your spending patterns (September 2026).
        </p>
      </div>

      {/* Feed of Insight Cards matching Mockup Screen 8 */}
      <div className="space-y-4">
        {insights.length > 0 ? (
          insights.map((item) => {
            const config = INSIGHT_ICONS[item.insight_type || item.type] || INSIGHT_ICONS.high_expense;
            const Icon = config.icon;

            return (
              <div 
                key={item.insight_id || item.id}
                className={`bg-white p-5 rounded-2xl border ${config.border} shadow-sm hover:shadow-md transition-all flex items-start gap-4`}
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl ${config.bg} ${config.text} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Sep 8, 2026'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.insight_text || item.text}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No Insights Generated Yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Add transactions to allow the AI engine to detect spending spikes, budget thresholds, and savings opportunities.
            </p>
          </div>
        )}
      </div>

      {/* Educational Note */}
      <div className="flex items-center gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          Insights are generated automatically by analyzing historical trends and budget thresholds. They are intended for educational and tracking purposes.
        </span>
      </div>

    </div>
  );
};
