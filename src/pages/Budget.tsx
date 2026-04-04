import React from 'react';
import { BudgetTracker } from '../components/dashboard/BudgetTracker';
import { PredictiveAnalytics } from '../components/dashboard/PredictiveAnalytics';
import { TrendingUp, Target, CreditCard, Wallet } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const Budget: React.FC = () => {
  const { stats, budget } = useFinance();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-(--text-primary) flex items-center gap-2 tracking-tight">
            <TrendingUp className="text-primary-500" size={28} />
            Budget & Planning
          </h1>
          <p className="text-(--text-muted) mt-1 font-medium flex items-center gap-2">
            <Target size={14} className="text-rose-500" />
            Plan your future and keep your spending <span className="text-primary-500 font-bold underline">under control</span>.
          </p>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-(--card-bg) border border-(--border-main) rounded-3xl overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-500/10 rounded-xl text-primary-600">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-primary-600 tracking-widest uppercase mb-0.5">SPENDING LIMIT</p>
              <p className="text-2xl font-black text-(--text-primary)">₹{stats.totalExpense.toLocaleString()}</p>
            </div>
          </div>
          <div className="w-full bg-(--app-bg) h-2 rounded-full overflow-hidden border border-(--border-main)">
            <div 
              className="bg-primary-500 h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${Math.min((stats.totalExpense / budget) * 100, 100)}%` }} 
            />
          </div>
          <p className="text-xs mt-3 text-(--text-muted) font-medium">Monthly limit: ₹{budget.toLocaleString()}</p>
        </div>

        <div className="p-6 bg-(--card-bg) border border-(--border-main) rounded-3xl overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-0.5">SAVINGS GOAL</p>
              <p className={`text-2xl font-black ${stats.totalBalance < 0 ? 'text-rose-500' : 'text-(--text-primary)'}`}>
                {stats.totalBalance < 0 ? '-' : ''}₹{Math.abs(stats.totalBalance).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="w-full bg-(--app-bg) h-2 rounded-full overflow-hidden border border-(--border-main)">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${stats.totalBalance < 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(Math.max((stats.totalBalance / 200000) * 100, 0), 100)}%` }} 
            />
          </div>
          <p className="text-xs mt-3 text-(--text-muted) font-medium">
            {stats.totalBalance < 0 
              ? '⚠️ Total expenses exceed total income' 
              : `Goal: ₹2,00,000 · ${((stats.totalBalance / 200000) * 100).toFixed(1)}% reached`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <BudgetTracker />
        <PredictiveAnalytics />
      </div>
    </div>
  );
};
