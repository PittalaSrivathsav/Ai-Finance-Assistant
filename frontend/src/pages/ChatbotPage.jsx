import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { chatbotApi } from '../services/api';

const SAMPLE_PROMPTS = [
  'How do I add an expense?',
  'What is my current balance?',
  'Show my total income and expenses',
  'How does AI categorization work?',
  'Which category has the highest spending?',
  'How to set a budget limit?',
];

export const ChatbotPage = () => {
  const { user, totalIncome, totalExpenses, balance } = useFinance();
  const storageKey = `chatbot_history_${user?.id || user?.email || 'default'}`;

  const getInitialWelcomeMessage = () => [
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hi ${user?.name || 'there'}! I'm your AI Finance Assistant. How can I help you today? Ask me about your current balance, expenses, budgets, or how to use the application.`,
    },
  ];

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return getInitialWelcomeMessage();
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync with localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages, storageKey]);

  // When switching user accounts, load the corresponding user's chat
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    setMessages(getInitialWelcomeMessage());
  }, [user?.id, user?.email]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fallback client-side response generator
  const generateClientBotReply = (userQuery) => {
    const q = userQuery.toLowerCase();

    // 1. How-to Guides (checked first to prevent keyword overlap)
    if (q.includes('how do i add') || q.includes('add transaction') || q.includes('add expense') || q.includes('add income') || q.includes('how to add')) {
      return "To add an expense or income, navigate to the Transactions page and click '+ Add Transaction'. Type a description like 'Swiggy dinner 450' or 'Pet food 1200' and our AI will automatically classify the category and confidence score for you!";
    }
    if (q.includes('how does ai') || q.includes('categorization') || q.includes('ml') || q.includes('ai works')) {
      return "Our AI uses TF-IDF feature extraction and Machine Learning classification to automatically predict whether a transaction belongs to Food, Transport, Shopping, Bills, Pets, etc. as you type.";
    }

    // 2. Forecast
    if (q.includes('forecast') || q.includes('predict') || q.includes('next month')) {
      return "You can view your real-time AI spending forecast on the Dashboard, calculated via Linear Regression trend analysis from your historical transactions.";
    }

    // 3. Highest Spending
    if (q.includes('highest') || q.includes('top spending') || q.includes('most spent')) {
      return "Check your spending breakdown on the Dashboard to see your highest expenditure category and monthly trends.";
    }

    // 4. Specific Category
    const cats = ['pet food', 'pets', 'food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'education'];
    for (const cat of cats) {
      if (q.includes(cat) && (q.includes('spent') || q.includes('spend') || q.includes('how much') || q.includes('cost') || q.includes('on'))) {
        const catName = cat === 'pet food' ? 'Pets' : cat.charAt(0).toUpperCase() + cat.slice(1);
        return `You can filter transactions by category '${catName}' on the Transactions page to inspect individual itemized payments.`;
      }
    }

    // 5. Total Income & Expense Combined
    if (q.includes('income') && q.includes('expense')) {
      return `💰 Overview: Total Income is ₹${totalIncome.toLocaleString()}, Total Expenses are ₹${totalExpenses.toLocaleString()}, Net Balance is ₹${balance.toLocaleString()}.`;
    }

    // 6. Balance
    if (q.includes('balance')) {
      return `💳 Your current balance is ₹${balance.toLocaleString()}. (Total Income: ₹${totalIncome.toLocaleString()} - Total Expenses: ₹${totalExpenses.toLocaleString()})`;
    }

    // 7. Income
    if (q.includes('income') || q.includes('salary') || q.includes('earned')) {
      return `💵 Your total recorded income is ₹${totalIncome.toLocaleString()}.`;
    }

    // 8. General Expense
    if (q.includes('expense') || q.includes('spent') || q.includes('spending')) {
      return `📉 Your total recorded expenses amount to ₹${totalExpenses.toLocaleString()}.`;
    }

    // 9. Budgets
    if (q.includes('budget')) {
      return "You can view and create category budgets from the Budgets page to track your monthly spending limits.";
    }

    return "I'm your AI Finance Assistant! You can ask me about your balance, total spending, how to add transactions, or details on your budgets.";
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      // Call backend Chatbot endpoint
      const response = await chatbotApi.sendMessage(text.trim());
      const botReplyText = response?.reply || generateClientBotReply(text.trim());
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReplyText,
        },
      ]);
    } catch (err) {
      // Fallback to client generator if offline or network error
      const botReplyText = generateClientBotReply(text.trim());
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReplyText,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      const freshMessages = getInitialWelcomeMessage();
      setMessages(freshMessages);
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Header with Clear Chat button */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Finance Assistant</h1>
          <p className="text-xs text-slate-500">Ask me anything about your finances or using the application.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleClearChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-semibold transition-all cursor-pointer"
            title="Clear current chat history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Active</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-emerald-600 text-white shadow-sm'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 rounded-tl-none shadow-sm flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 sm:px-5 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Suggested:</span>
        {SAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
