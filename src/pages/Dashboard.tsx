import React from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { SmartAlerts } from '../components/dashboard/SmartAlerts';
import { PredictiveAnalytics } from '../components/dashboard/PredictiveAnalytics';
import { useFinance } from '../context/FinanceContext';
import { Wallet, ArrowUpCircle, ArrowDownCircle, LayoutDashboard, Sparkles, TrendingUp } from 'lucide-react';
import type { Transaction } from '../types';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { stats, openModal, setCurrentPage, budget } = useFinance();

  const handleEdit = (tx: Transaction) => {
    openModal(tx);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-(--text-primary) flex items-center gap-2 tracking-tight">
            <LayoutDashboard className="text-primary-500" size={28} />
            Welcome Back Saurabh Anand
          </h1>
          <p className="text-(--text-muted) mt-1 font-medium flex items-start sm:items-center gap-2">
            <Sparkles size={14} className="text-purple-500 mt-1 sm:mt-0 shrink-0" />
            <span>Your financial assistant is analyzing <span className="text-primary-500 font-bold underline">real-time data</span>.</span>
          </p>
        </div>
      </div>

      <SmartAlerts />

      <div className="glass-card rounded-4xl p-6 md:px-8 space-y-4 shadow-lg shadow-black/5 dark:shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-(--text-primary) tracking-tight">Monthly Budget Tracker</h3>
            <p className="text-[11px] sm:text-xs font-black text-(--text-muted) uppercase tracking-widest mt-1">
              {((stats.totalExpense / budget) * 100).toFixed(1)}% of your limit utilized
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-(--text-primary)">₹{stats.totalExpense.toLocaleString()}</span>
            <span className="text-xs sm:text-sm font-bold text-(--text-muted)"> / ₹{budget.toLocaleString()}</span>
          </div>
        </div>
        <div className="h-4 sm:h-5 w-full bg-(--app-bg) rounded-full border border-(--border-main) overflow-hidden p-[3px]">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out",
              (stats.totalExpense / budget) >= 0.9 ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" :
              (stats.totalExpense / budget) >= 0.7 ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            )} 
            style={{ width: `${Math.min((stats.totalExpense / budget) * 100, 100)}%` }} 
          />
        </div>
      </div>

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
