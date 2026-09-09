import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  authApi, 
  transactionApi, 
  budgetApi, 
  dashboardApi, 
  insightsApi, 
  mlApi,
  forecastApi
} from '../services/api';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

const DEFAULT_BUDGET_CATEGORIES = [
  { id: 1, category: 'Food', limit: 5000, spent: 0 },
  { id: 2, category: 'Transport', limit: 3000, spent: 0 },
  { id: 3, category: 'Shopping', limit: 4000, spent: 0 },
  { id: 4, category: 'Bills', limit: 5000, spent: 0 },
  { id: 5, category: 'Entertainment', limit: 3000, spent: 0 },
  { id: 6, category: 'Pets', limit: 2500, spent: 0 },
  { id: 7, category: 'Others', limit: 2000, spent: 0 },
];

const BASE_CATEGORIES = [
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

export const FinanceProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (saved && token) {
      try {
        return { ...JSON.parse(saved), isAuthenticated: true };
      } catch (e) {
        return { name: '', email: '', isAuthenticated: false };
      }
    }
    return { name: '', email: '', isAuthenticated: false };
  });

  const [activeTab, setActiveTab] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return 'landing';
    const saved = localStorage.getItem('activeTab');
    const authenticated = ['dashboard', 'transactions', 'budgets', 'insights', 'chatbot', 'profile'];
    return saved && authenticated.includes(saved) ? saved : 'dashboard';
  });

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState(DEFAULT_BUDGET_CATEGORIES);
  const [insights, setInsights] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [loadingData, setLoadingData] = useState(false);

  // Modals
  const [isTxnModalOpen, setIsTxnModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Dynamic unified list of all available categories (base + user budgets + user transactions)
  const allCategories = useMemo(() => {
    const catSet = new Set(BASE_CATEGORIES);
    budgets.forEach(b => {
      if (b.category && b.category.trim()) catSet.add(b.category.trim());
    });
    transactions.forEach(t => {
      if (t.category && t.category.trim() && t.category.toLowerCase() !== 'income') {
        catSet.add(t.category.trim());
      }
    });
    return Array.from(catSet);
  }, [budgets, transactions]);

  // Fetch all user-specific data from backend
  const fetchAllUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoadingData(true);
    try {
      // 1. Transactions
      const txnRes = await transactionApi.getAll({ limit: 50 });
      setTransactions(txnRes.transactions || []);

      // 2. Budgets
      const budgetRes = await budgetApi.getAll('2026-09');
      if (budgetRes && budgetRes.length > 0) {
        setBudgets(budgetRes.map(b => ({
          id: b.budget_id,
          category: b.category,
          limit: b.limit_amount,
          spent: b.spent_amount || 0,
        })));
      } else {
        setBudgets(DEFAULT_BUDGET_CATEGORIES);
      }

      // 3. Dashboard Summary & Charts
      const dashRes = await dashboardApi.getSummary();
      setDashboardData(dashRes);

      // 4. Insights
      const insightsRes = await insightsApi.getAll();
      setInsights(insightsRes || []);

      // 5. AI Spending Forecast
      try {
        const fRes = await forecastApi.getForecast();
        setForecastData(fRes);
      } catch (fErr) {
        console.error('Error fetching spending forecast:', fErr);
      }
    } catch (err) {
      console.error('Error fetching user data from backend:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Fetch data whenever authenticated user changes
  useEffect(() => {
    if (user.isAuthenticated) {
      fetchAllUserData();
    } else {
      setTransactions([]);
      setBudgets(DEFAULT_BUDGET_CATEGORIES);
      setInsights([]);
      setDashboardData(null);
      setForecastData(null);
    }
  }, [user.isAuthenticated, fetchAllUserData]);

  const loginUser = async (email, password) => {
    const response = await authApi.login(email, password);
    const userData = {
      id: response.user.user_id,
      name: response.user.name,
      email: response.user.email,
      isAuthenticated: true,
    };
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setActiveTab('dashboard');
    return response;
  };

  const loginWithGoogle = async (idToken) => {
    const response = await authApi.googleAuth(idToken);
    const userData = {
      id: response.user.user_id,
      name: response.user.name,
      email: response.user.email,
      isAuthenticated: true,
    };
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setActiveTab('dashboard');
    return response;
  };

  const registerUser = async (name, email, password) => {
    const response = await authApi.register(name, email, password);
    const userData = {
      id: response.user.user_id,
      name: response.user.name,
      email: response.user.email,
      isAuthenticated: true,
    };
    setTransactions([]);
    setBudgets(DEFAULT_BUDGET_CATEGORIES);
    setInsights([]);
    setDashboardData(null);

    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setActiveTab('dashboard');
    return response;
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeTab');
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {
        // ignore if not loaded
      }
    }
    setUser({ name: '', email: '', isAuthenticated: false });
    setTransactions([]);
    setBudgets(DEFAULT_BUDGET_CATEGORIES);
    setInsights([]);
    setDashboardData(null);
    setForecastData(null);
    setActiveTab('landing');
  };


  // Real-time AI Categorization with custom user categories awareness & backend ML model
  const predictCategory = async (description) => {
    if (!description || description.trim() === '') {
      return { category: 'Others', confidence: 50 };
    }

    const text = description.toLowerCase().trim();

    // 1. Check user-defined custom categories first (e.g., "Pet Food", "Pets", "Gym", "Travel")
    const customCats = allCategories.filter(c => !BASE_CATEGORIES.includes(c));
    for (const customCat of customCats) {
      const catLower = customCat.toLowerCase();
      // Exact match or contains full custom category name
      if (text.includes(catLower)) {
        return { category: customCat, confidence: 96 };
      }
      // Substring/words matching (e.g., "pet" for "Pet Food")
      const words = catLower.split(' ').filter(w => w.length > 2);
      if (words.some(w => text.includes(w))) {
        if (text.includes('pet') || text.includes('dog') || text.includes('cat') || text.includes('pedigree') || text.includes('whiskas')) {
          if (catLower.includes('pet') || catLower.includes('dog') || catLower.includes('cat')) {
            return { category: customCat, confidence: 95 };
          }
        }
      }
    }

    // Explicit Priority Check for Pets / Pet Food (avoids generic Food misclassification)
    const petKeywords = ['pet', 'pets', 'dog', 'cat', 'puppy', 'kitten', 'pedigree', 'whiskas', 'drools', 'royal canin', 'kibble', 'vet', 'veterinary', 'aquarium'];
    if (petKeywords.some(k => text.includes(k))) {
      const petCategory = allCategories.find(c => c.toLowerCase() === 'pets' || c.toLowerCase().includes('pet'));
      return { category: petCategory || 'Pets', confidence: 96 };
    }

    // 2. Query backend ML model
    try {
      const res = await mlApi.predictCategory(description);
      if (res && res.predicted_category) {
        // Check if there is an exact or case-insensitive match in allCategories
        const matched = allCategories.find(c => c.toLowerCase() === res.predicted_category.toLowerCase());
        return {
          category: matched || res.predicted_category,
          confidence: res.confidence || 90,
        };
      }
    } catch (e) {
      // Fallback
    }

    // 3. Fallback NLP rule heuristics (Pets placed before Food to guarantee precedence)
    const rules = [
      { category: 'Pets', keywords: ['pet', 'pets', 'dog', 'cat', 'puppy', 'kitten', 'pedigree', 'whiskas', 'drools', 'royal canin', 'kibble', 'vet', 'veterinary', 'grooming', 'aquarium'], confidence: 95 },
      { category: 'Food', keywords: ['swiggy', 'zomato', 'dinner', 'lunch', 'food', 'restaurant', 'burger', 'pizza', 'cafe', 'coffee', 'starbucks', 'grocery', 'supermarket', 'mcdonald', 'kfc', 'subway', 'dominos', 'biryani'], confidence: 93 },
      { category: 'Transport', keywords: ['uber', 'ola', 'auto', 'metro', 'petrol', 'fuel', 'bus', 'train', 'flight', 'cab', 'ride', 'diesel', 'parking', 'fastag'], confidence: 91 },
      { category: 'Shopping', keywords: ['amazon', 'flipkart', 'myntra', 'zara', 'headphones', 'shoes', 'clothes', 'dress', 'shirt', 'mall', 'electronics', 'purchase', 'h&m', 'nike'], confidence: 89 },
      { category: 'Bills', keywords: ['electricity', 'wifi', 'bill', 'water', 'recharge', 'mobile', 'rent', 'broadband', 'gas', 'maintenance', 'airtel', 'jio'], confidence: 94 },
      { category: 'Entertainment', keywords: ['netflix', 'spotify', 'movie', 'cinema', 'game', 'gaming', 'concert', 'steam', 'hotstar', 'prime', 'pvr'], confidence: 92 },
      { category: 'Health', keywords: ['medicine', 'doctor', 'hospital', 'gym', 'pharmacy', 'clinic', 'dentist', 'apollo', 'medical', 'tablet'], confidence: 90 },
      { category: 'Education', keywords: ['udemy', 'coursera', 'book', 'course', 'tuition', 'school', 'college', 'exam', 'fees'], confidence: 88 },
      { category: 'Income', keywords: ['salary', 'freelance', 'bonus', 'dividend', 'interest', 'stipend', 'cashback', 'refund'], confidence: 96 }
    ];

    for (const rule of rules) {
      if (rule.keywords.some(k => text.includes(k))) {
        return { category: rule.category, confidence: rule.confidence };
      }
    }

    return { category: 'Others', confidence: 68 };
  };

  // Add Transaction via Backend API
  const addTransaction = async (txnData) => {
    try {
      await transactionApi.create({
        date: txnData.date,
        description: txnData.description,
        amount: parseFloat(txnData.amount),
        type: txnData.type,
        category: txnData.category,
      });
      await fetchAllUserData();
    } catch (err) {
      console.error('Failed to add transaction:', err);
      const newTxn = { id: Date.now(), ...txnData, amount: Number(txnData.amount) };
      setTransactions(prev => [newTxn, ...prev]);
    }
  };

  // Update Transaction via Backend API
  const updateTransaction = async (id, updatedData) => {
    try {
      await transactionApi.update(id, {
        date: updatedData.date,
        description: updatedData.description,
        amount: parseFloat(updatedData.amount),
        type: updatedData.type,
        category: updatedData.category,
      });
      await fetchAllUserData();
    } catch (err) {
      console.error('Failed to update transaction:', err);
      setTransactions(prev => prev.map(t => ((t.transaction_id || t.id) === id ? { ...t, ...updatedData } : t)));
    }
  };

  // Delete Transaction via Backend API
  const deleteTransaction = async (id) => {
    try {
      await transactionApi.delete(id);
      await fetchAllUserData();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      setTransactions(prev => prev.filter(t => (t.transaction_id || t.id) !== id));
    }
  };

  // Save Budget via Backend API
  const saveBudget = async (category, limit) => {
    try {
      await budgetApi.save({
        month: '2026-09',
        category,
        limit_amount: parseFloat(limit),
      });
      await fetchAllUserData();
    } catch (err) {
      console.error('Failed to save budget:', err);
      setBudgets(prev => {
        const exists = prev.find(b => b.category.toLowerCase() === category.toLowerCase());
        if (exists) {
          return prev.map(b => b.category.toLowerCase() === category.toLowerCase() ? { ...b, limit: Number(limit) } : b);
        }
        return [...prev, { id: Date.now(), category, limit: Number(limit), spent: 0 }];
      });
    }
  };

  // Calculated Totals from active transactions
  const totalIncome = transactions
    .filter(t => (t.type || '').toLowerCase() === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => (t.type || '').toLowerCase() === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const activeBudgetsNearLimit = budgets.filter(b => b.limit > 0 && (b.spent / b.limit) >= 0.8).length;

  return (
    <FinanceContext.Provider
      value={{
        user,
        setUser,
        activeTab,
        setActiveTab,
        loginUser,
        loginWithGoogle,
        registerUser,
        logoutUser,
        transactions,
        budgets,
        insights,
        allCategories,
        dashboardData,
        forecastData,
        selectedMonth,
        setSelectedMonth,
        isTxnModalOpen,
        setIsTxnModalOpen,
        editingTxn,
        setEditingTxn,
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        predictCategory,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        saveBudget,
        totalIncome,
        totalExpenses,
        balance,
        activeBudgetsNearLimit,
        loadingData,
        fetchAllUserData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
