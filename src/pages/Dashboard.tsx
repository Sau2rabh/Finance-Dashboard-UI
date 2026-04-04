import React from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { SmartAlerts } from '../components/dashboard/SmartAlerts';
import { PredictiveAnalytics } from '../components/dashboard/PredictiveAnalytics';
import { useFinance } from '../context/FinanceContext';
import { Wallet, ArrowUpCircle, ArrowDownCircle, LayoutDashboard, Sparkles, TrendingUp } from 'lucide-react';
import type { Transaction } from '../types';

export const Dashboard: React.FC = () => {
  const { stats, openModal, setCurrentPage } = useFinance();

  const handleEdit = (tx: Transaction) => {
    openModal(tx);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-(--text-primary) flex items-center gap-2 tracking-tight">
            <LayoutDashboard className="text-primary-500" size={28} />
            Welcome Back Saurabh Anand
          </h1>
          <p className="text-(--text-muted) mt-1 font-medium flex items-center gap-2">
            <Sparkles size={14} className="text-purple-500" />
            Your financial assistant is analyzing <span className="text-primary-500 font-bold underline">real-time data</span>.
          </p>
        </div>
      </div>

      <SmartAlerts />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Balance" 
          amount={stats.totalBalance} 
          change={stats.incomeChange - stats.expenseChange} 
          icon={Wallet} 
          color="primary" 
          trend={stats.trends.balance}
        />
        <StatCard 
          title="Total Income" 
          amount={stats.totalIncome} 
          change={stats.incomeChange} 
          icon={ArrowUpCircle} 
          color="success" 
          trend={stats.trends.income}
        />
        <StatCard 
          title="Total Expense" 
          amount={stats.totalExpense} 
          change={stats.expenseChange} 
          icon={ArrowDownCircle} 
          color="danger" 
          trend={stats.trends.expense}
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-(--text-primary) tracking-tight">Future Predictions</h2>
          </div>
          <PredictiveAnalytics />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-(--text-primary) tracking-tight">Quick Navigation</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 h-full">
            <button 
              onClick={() => setCurrentPage('transactions')}
              className="p-6 h-[120px] flex flex-col items-center justify-center glass-card rounded-4xl hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all group"
            >
              <div className="text-primary-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                <Wallet size={28} />
              </div>
              <p className="font-bold text-(--text-primary)">Transactions</p>
            </button>
            <button 
              onClick={() => setCurrentPage('budget')}
              className="p-6 h-[120px] flex flex-col items-center justify-center glass-card rounded-4xl hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
            >
              <div className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp size={28} />
              </div>
              <p className="font-bold text-(--text-primary)">Budget Goals</p>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-(--text-primary) tracking-tight">Recent Activity</h2>
          <button 
            onClick={() => setCurrentPage('transactions')}
            className="px-4 py-2 glass-card rounded-2xl text-xs font-black uppercase tracking-widest text-primary-500 transition-colors"
          >
            View All Transactions
          </button>
        </div>
        <div className="glass-card rounded-4xl p-6">
          <TransactionTable onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
};
