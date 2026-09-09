import React, { useState } from 'react';
import { X, Wallet, Plus, ListFilter, Sparkles } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Pets',
  'Others',
];

export const BudgetModal = () => {
  const { isBudgetModalOpen, setIsBudgetModalOpen, saveBudget } = useFinance();
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [category, setCategory] = useState('Food');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [limit, setLimit] = useState('');

  if (!isBudgetModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory = isCustomCategory ? customCategoryName.trim() : category;
    if (!finalCategory || !limit) return;

    saveBudget(finalCategory, limit);
    setIsBudgetModalOpen(false);
    setLimit('');
    setCustomCategoryName('');
    setIsCustomCategory(false);
  };

  const handleClose = () => {
    setIsBudgetModalOpen(false);
    setCustomCategoryName('');
    setIsCustomCategory(false);
    setLimit('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Set Category Budget</h2>
              <p className="text-xs text-slate-500">Define monthly limit for tracking.</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Input Header with Toggle Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Category
              </label>
              
              {/* Button to Enter Custom Category Name */}
              <button
                type="button"
                onClick={() => {
                  setIsCustomCategory(!isCustomCategory);
                  if (!isCustomCategory) {
                    setCustomCategoryName('');
                  }
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-0.5 rounded-lg transition-colors"
              >
                {isCustomCategory ? (
                  <>
                    <ListFilter className="w-3.5 h-3.5" />
                    <span>Select from list</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Enter New Category</span>
                  </>
                )}
              </button>
            </div>

            {/* Custom text input or Select dropdown */}
            {isCustomCategory ? (
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Enter category name (e.g., Travel, Pets, Gym)"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all"
                />
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustomCategory(true);
                    setCustomCategoryName('');
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all cursor-pointer"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="__custom__" className="text-emerald-600 font-semibold">+ Enter new custom category...</option>
              </select>
            )}
          </div>

          {/* Monthly Limit */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Monthly Limit (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">₹</span>
              <input
                type="number"
                required
                placeholder="e.g. 5000"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-200 transition-all hover:shadow"
            >
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
