import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  AlertCircle, 
  Clock,
  ArrowRight,
  PieChart as PieIcon
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryAnalysis } from '../../utils/financeUtils';

export const InsightsSection: React.FC = () => {
  const { transactions, stats, setCurrentPage, setFilterType } = useFinance();

  const insights = useMemo(() => {
    const analysis = getCategoryAnalysis(transactions);
    const incomeToExpenseRatio = stats.totalIncome > 0 
      ? (stats.totalExpense / stats.totalIncome) * 100 
      : 0;

    return [
      {
        title: 'Spending Pattern',
        description: analysis.topCategory 
          ? `Your highest spending category is ${analysis.topCategory[0]} (₹${analysis.topCategory[1].toLocaleString()}), which is ${analysis.breakdown[0].percentage.toFixed(1)}% of your total expenses.`
          : 'Track more transactions to see your spending patterns.',
        icon: AlertCircle,
        status: analysis.topCategory && analysis.breakdown[0].percentage > 40 ? 'warning' : 'info',
        actionText: 'REVIEW EXPENSES',
        action: () => {
          setFilterType('expense');
          setCurrentPage('transactions');
        }
      },
      {
        title: 'Income Ratio',
        description: `You are spending ${incomeToExpenseRatio.toFixed(1)}% of your total income. ${incomeToExpenseRatio > 70 ? 'Try to limit non-essential costs.' : 'Your spending level is healthy.'}`,
        icon: PieIcon,
        status: incomeToExpenseRatio > 70 ? 'warning' : 'success',
        actionText: incomeToExpenseRatio > 70 ? 'ADJUST BUDGET' : 'VIEW BUDGET',
        action: () => setCurrentPage('budget')
      },
      {
        title: 'Daily Average',
        description: `Your average daily expense is ₹${(analysis.total / 30).toFixed(0)}. This is ${Math.abs(stats.expenseChange).toFixed(1)}% ${stats.expenseChange > 0 ? 'higher' : 'lower'} than last month.`,
        icon: Clock,
        status: stats.expenseChange > 15 ? 'warning' : 'success',
        actionText: 'ALL LOGS',
        action: () => {
          setFilterType('all');
          setCurrentPage('transactions');
        }
      }
    ];
  }, [transactions, stats]);

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-(--text-primary) flex items-center gap-2">
          <TrendingUp className="text-primary-500" />
          Smart Insights
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, idx) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="p-6 bg-(--card-bg) border border-(--border-main) rounded-4xl flex flex-col h-full transition-all relative overflow-hidden group shadow-lg shadow-black/5 dark:shadow-none"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl ${
                insight.status === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
                insight.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                'bg-primary-500/10 text-primary-500'
              } transition-transform duration-300 group-hover:scale-110`}>
                <insight.icon size={24} />
              </div>
              <h3 className="text-lg font-black text-(--text-primary) tracking-tight group-hover:translate-x-1 transition-transform">{insight.title}</h3>
            </div>
            
            <p className="text-sm text-(--text-muted) leading-relaxed mb-6 font-medium italic transition-colors">"{insight.description}"</p>
            
            <button 
              onClick={insight.action}
              className="mt-auto hidden md:flex items-center gap-2 text-xs font-black text-primary-600 uppercase tracking-widest hover:gap-3 transition-all group/btn"
              title={insight.actionText}
            >
              {insight.actionText} 
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
