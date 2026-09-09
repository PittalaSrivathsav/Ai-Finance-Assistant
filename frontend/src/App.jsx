import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar } from './components/Sidebar';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { InsightsPage } from './pages/InsightsPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { ProfilePage } from './pages/ProfilePage';

const AppContent = () => {
  const { activeTab } = useFinance();

  // Non-authenticated standalone full pages
  if (activeTab === 'landing') {
    return <LandingPage />;
  }
  if (activeTab === 'login') {
    return <LoginPage />;
  }
  if (activeTab === 'signup') {
    return <SignUpPage />;
  }

  // Authenticated App Shell with Left Sidebar & Dynamic Main Area
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-screen">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'transactions' && <TransactionsPage />}
        {activeTab === 'budgets' && <BudgetsPage />}
        {activeTab === 'insights' && <InsightsPage />}
        {activeTab === 'chatbot' && <ChatbotPage />}
        {activeTab === 'profile' && <ProfilePage />}
      </main>

      {/* Global Modals */}
      <TransactionModal />
      <BudgetModal />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
