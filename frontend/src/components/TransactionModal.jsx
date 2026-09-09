import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Utensils, 
  Car, 
  ShoppingBag, 
  FileText, 
  Gamepad2, 
  HeartPulse, 
  GraduationCap, 
  PawPrint,
  Wallet, 
  MoreHorizontal,
  Plus,
  ListFilter
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: FileText,
  Entertainment: Gamepad2,
  Health: HeartPulse,
  Education: GraduationCap,
  Pets: PawPrint,
  Income: Wallet,
  Others: MoreHorizontal,
};


export const TransactionModal = () => {
  const { 
    isTxnModalOpen, 
    setIsTxnModalOpen, 
    editingTxn, 
    setEditingTxn, 
    addTransaction, 
    updateTransaction,
    predictCategory,
    allCategories,
  } = useFinance();

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [autoDetectAI, setAutoDetectAI] = useState(true);
  const [prediction, setPrediction] = useState({ category: 'Food', confidence: 93 });
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    if (editingTxn) {
      setType(editingTxn.type);
      setAmount(editingTxn.amount);
      setDate(editingTxn.date);
      setDescription(editingTxn.description);
      setCategory(editingTxn.category);
      setIsCustomCategory(false);
      setCustomCategoryName('');
    } else {
      setType('expense');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setCategory('');
      setIsCustomCategory(false);
      setCustomCategoryName('');
      setPrediction({ category: 'Food', confidence: 93 });
    }
  }, [editingTxn, isTxnModalOpen]);

  // Trigger live AI category prediction on description change (with async resolution)
  useEffect(() => {
    let isCurrent = true;

    const executePrediction = async () => {
      if (autoDetectAI && description.trim().length > 1 && !isCustomCategory) {
        setIsPredicting(true);
        try {
          const pred = await predictCategory(description);
          if (isCurrent && pred && pred.category) {
            setPrediction(pred);
            if (type === 'expense') {
              setCategory(pred.category);
            }
          }
        } catch (err) {
          console.error('Error during live prediction:', err);
        } finally {
          if (isCurrent) setIsPredicting(false);
        }
      }
    };

    const timer = setTimeout(() => {
      executePrediction();
    }, 150);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [description, autoDetectAI, type, isCustomCategory]);

  if (!isTxnModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    let finalCategory = isCustomCategory ? customCategoryName.trim() : category;
    if (type === 'income') {
      finalCategory = 'Income';
    } else if (!finalCategory || finalCategory === '') {
      finalCategory = prediction?.category || 'Food';
    }

    if (editingTxn) {
      updateTransaction(editingTxn.id || editingTxn.transaction_id, {
        type,
        amount: parseFloat(amount),
        date,
        description,
        category: finalCategory,
      });
    } else {
      addTransaction({
        type,
        amount: parseFloat(amount),
        date,
        description,
        category: finalCategory,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setIsTxnModalOpen(false);
    setEditingTxn(null);
    setIsCustomCategory(false);
    setCustomCategoryName('');
  };

  const PredictedIcon = CATEGORY_ICONS[prediction.category] || MoreHorizontal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingTxn ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="text-xs text-slate-500">Record a new income or expense.</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Type</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={type === 'expense'}
                  onChange={() => setType('expense')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                Expense
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={type === 'income'}
                  onChange={() => {
                    setType('income');
                    setCategory('Income');
                  }}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                Income
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">₹</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Description</label>
            <input
              type="text"
              required
              placeholder="Enter description (e.g., Swiggy dinner, Uber ride, Salary)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all"
            />
          </div>

          {/* Category & AI section */}
          {type === 'expense' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-1">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</label>
                  
                  {/* Option to toggle custom category name */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(!isCustomCategory);
                      if (!isCustomCategory) {
                        setAutoDetectAI(false);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-1.5 py-0.5 rounded transition-colors"
                  >
                    {isCustomCategory ? <ListFilter className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    <span>{isCustomCategory ? 'List' : '+ Custom'}</span>
                  </button>
                </div>

                {isCustomCategory ? (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom category"
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all"
                  />
                ) : (
                  <>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setAutoDetectAI(false);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium transition-all"
                    >
                      <option value="">Select category (or let AI predict)</option>
                      {(allCategories || []).filter(c => c !== 'Income').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    <div className="mt-1.5 flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium cursor-pointer">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Auto-detect with AI</span>
                        <input
                          type="checkbox"
                          checked={autoDetectAI}
                          onChange={(e) => setAutoDetectAI(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors ${autoDetectAI ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                          <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${autoDetectAI ? 'translate-x-3.5' : 'translate-x-0'}`} />
                        </div>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* AI Category Prediction Box */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Category Prediction</span>
                  </div>
                  {isPredicting && (
                    <span className="text-[10px] text-emerald-600 animate-pulse font-medium">Analyzing...</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight mb-2.5">
                  Based on your description, we predict this transaction falls under:
                </p>
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <PredictedIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{prediction.category}</h4>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Confidence: {prediction.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
