import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, TrendingDown, Clock, Scale } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getPredictiveSpend } from '../../utils/financeUtils';
import { cn } from '../../lib/utils';

export const PredictiveAnalytics: React.FC = () => {
  const { transactions, budget } = useFinance();
  const prediction = React.useMemo(() => getPredictiveSpend(transactions), [transactions]);

  // Calculate current month's income
  const currentMonthIncome = React.useMemo(() => {
    const now = new Date();
    return transactions
      .filter(tx => {
        const d = new Date(tx.date);
        return tx.type === 'income' &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear();
      })
      .reduce((acc, tx) => acc + tx.amount, 0);
  }, [transactions]);

  // Expected savings = what you'll actually have left this month
  const projectedSavings = currentMonthIncome - prediction.estimatedTotal;
  const isNegative = projectedSavings < 0;

  // Budget utilisation % (vs spending limit)
  const budgetUsagePct = Math.min(100, (prediction.estimatedTotal / budget) * 100);

  return (
    <div className="p-6 bg-(--card-bg) border border-(--border-main) rounded-4xl transition-all duration-400 group shadow-lg shadow-black/5 dark:shadow-none">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-(--text-primary) tracking-tight">AI Predictions</h3>
            <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest leading-none">Trends based on behavior</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-5 bg-(--app-bg) rounded-3xl border border-(--border-main) relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary-500/5 rounded-full blur-xl" />
          <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-(--text-muted) uppercase tracking-widest">
            <Clock size={12} className="text-primary-500" />
            Estimated Total (Month)
          </div>
          <div className="text-2xl font-black text-(--text-primary)">₹{prediction.estimatedTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-500">
            <TrendingDown size={12} />
            Trend: ₹{prediction.averageDailySpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}/day
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="p-5 bg-(--app-bg) rounded-3xl border border-(--border-main) relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
          <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-(--text-muted) uppercase tracking-widest">
            <Scale size={12} className="text-emerald-500" />
            Expected Savings
          </div>
          <div className={cn(
            "text-2xl font-black",
            isNegative ? "text-rose-500" : "text-emerald-500"
          )}>
            {isNegative ? '-' : '+'}₹{Math.abs(projectedSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="mt-2 text-[10px] font-bold text-(--text-muted) italic">
            {isNegative ? 'Expenses may exceed your income.' : 'You are on track to save.'}
          </p>
        </motion.div>
      </div>

      <div className="mt-6 p-4 bg-primary-500/5 border border-primary-500/10 rounded-2xl">
        <div className="flex gap-3">
          <TrendingUp className="text-primary-500 shrink-0" size={18} />
          <p className="text-xs font-semibold text-(--text-muted) leading-relaxed">
            Based on your last <span className="text-primary-500 font-black">{new Date().getDate()}</span> days, 
            you're projected to spend <span className="text-primary-500 font-black">{budgetUsagePct.toFixed(0)}%</span> of your <span className="text-primary-500 font-black">₹{budget.toLocaleString()}</span> budget this month.
          </p>
        </div>
      </div>
    </div>
  );
};
