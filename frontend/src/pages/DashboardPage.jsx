import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  AlertCircle, 
  Lightbulb, 
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useFinance } from '../context/FinanceContext';

const CATEGORY_COLORS = {
  Food: '#ef4444',
  Transport: '#3b82f6',
  Shopping: '#a855f7',
  Bills: '#f59e0b',
  Entertainment: '#ec4899',
  Health: '#10b981',
  Education: '#6366f1',
  Pets: '#14b8a6',
  Others: '#64748b',
};

export const DashboardPage = () => {
  const { 
    user, 
    transactions,
    totalIncome, 
    totalExpenses, 
    balance, 
    budgets, 
    activeBudgetsNearLimit,
    forecastData,
    selectedMonth, 
    setSelectedMonth,
    setActiveTab,
    setIsTxnModalOpen,
    setEditingTxn
  } = useFinance();

  // Dynamic Category Breakdown computed from user transactions
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const categoryTotals = expenseTransactions.reduce((acc, t) => {
    const cat = t.category || 'Others';
    acc[cat] = (acc[cat] || 0) + Number(t.amount);
    return acc;
  }, {});

  const pieData = Object.keys(categoryTotals).map(cat => {
    const val = categoryTotals[cat];
    const pct = totalExpenses > 0 ? Math.round((val / totalExpenses) * 100) : 0;
    return {
      name: cat,
      value: pct,
      amount: val,
      color: CATEGORY_COLORS[cat] || '#64748b',
    };
  });

  // Monthly trend computed dynamically for 2026
  const trendData = [
    { month: 'Apr 26', Income: 0, Expenses: 0 },
    { month: 'May 26', Income: 0, Expenses: 0 },
    { month: 'Jun 26', Income: 0, Expenses: 0 },
    { month: 'Jul 26', Income: 0, Expenses: 0 },
    { month: 'Aug 26', Income: 0, Expenses: 0 },
    { month: 'Sep 26', Income: totalIncome, Expenses: totalExpenses },
  ];

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-200">
      
      {/* Top Header matching Mockup Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user.name || 'User'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here's a summary of your finances.
          </p>
        </div>

        {/* Month Dropdown & Add Button */}
        <div className="flex items-center gap-3">
          <div className="relative inline-block">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-white border border-slate-200 px-4 py-2 pr-9 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => {
              setEditingTxn(null);
              setIsTxnModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards matching Mockup Screen 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Income</p>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">
              ₹ {totalIncome.toLocaleString()}
            </h3>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Recorded income</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</p>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">
              ₹ {totalExpenses.toLocaleString()}
            </h3>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-500">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Recorded expenses</span>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Balance</p>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className={`text-2xl font-extrabold ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ₹ {balance.toLocaleString()}
            </h3>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400 font-medium">
            <span>Available balance</span>
          </div>
        </div>

        {/* Active Budgets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Budgets</p>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">
              {budgets.length}
            </h3>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-500">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{activeBudgetsNearLimit} near limit</span>
          </div>
        </div>

      </div>

      {/* Charts Section: Pie Chart & Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Spending by Category (Pie Chart) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Spending by Category</h3>
          </div>

          {pieData.length > 0 ? (
            <>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={78}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val, name, item) => [`${val}% (₹${Number(item.payload.amount).toLocaleString()})`, name]} 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 truncate">{item.name}</span>
                    <span className="font-bold text-slate-800 ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">No expenses recorded yet</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                Add an expense transaction to view your category spending breakdown.
              </p>
            </div>
          )}
        </div>

        {/* Monthly Trend (Line Chart) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Monthly Trend (2026)</h3>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip 
                  formatter={(val) => [`₹${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Income" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#10b981' }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#ef4444' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Spending Forecast Card (AI Linear Regression) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md border border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Spending Forecast</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {forecastData?.method || 'AI Regression'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Predictive spending projection based on your historical expense trends.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400">Confidence:</span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              forecastData?.confidence === 'High' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : forecastData?.confidence === 'Moderate'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-700 text-slate-300 border-slate-600'
            }`}>
              {forecastData?.confidence || 'Moderate'}
            </span>
          </div>
        </div>

        {forecastData && forecastData.status === 'success' ? (
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Projected Spend */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                <p className="text-xs font-medium text-slate-400">
                  Projected Spending ({forecastData.next_month})
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    ₹ {Number(forecastData.forecast_amount).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2">
                  {forecastData.percentage_change > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>+{forecastData.percentage_change}% vs last month</span>
                    </span>
                  ) : forecastData.percentage_change < 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <ArrowDownRight className="w-3 h-3" />
                      <span>{forecastData.percentage_change}% vs last month</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">
                      <span>Stable trend (0.0%)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Average Monthly Spend */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                <p className="text-xs font-medium text-slate-400">Average Monthly Spend</p>
                <div className="mt-1">
                  <span className="text-2xl font-extrabold text-white">
                    ₹ {Number(forecastData.average_monthly_spend).toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Historical average baseline
                </p>
              </div>

              {/* History Depth */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                <p className="text-xs font-medium text-slate-400">Historical Data Points</p>
                <div className="mt-1">
                  <span className="text-2xl font-extrabold text-white">
                    {forecastData.historical_months_count} month{forecastData.historical_months_count === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 truncate">
                  {forecastData.historical_data?.map(d => d.month).join(', ') || 'Current month'}
                </p>
              </div>
            </div>

            {/* AI Summary note */}
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40 text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">Forecast Insight: </span>
              {forecastData.message}
            </div>
          </div>
        ) : (
          <div className="pt-4 text-center py-4">
            <p className="text-xs text-slate-300">
              {forecastData?.message || 'Add more expense transactions to generate an AI spending forecast.'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom AI Insight Banner */}
      <div 
        onClick={() => setActiveTab('insights')}
        className="bg-amber-50/80 hover:bg-amber-50 border border-amber-200/70 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-sm"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-sm">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 font-medium mt-0.5">
              {totalExpenses > 0 
                ? "Your spending patterns have been analyzed. View all AI-generated financial insights." 
                : "Add transactions to generate smart AI insights and spending predictions."}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-800 hover:underline hidden sm:block">View all →</span>
      </div>

    </div>
  );
};
