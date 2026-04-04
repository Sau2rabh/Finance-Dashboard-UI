import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingDown, AlertCircle, Edit2, Save, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryAnalysis } from '../../utils/financeUtils';
import { cn } from '../../lib/utils';

export const BudgetTracker: React.FC = () => {
  const { budget, setBudget, transactions, role } = useFinance();
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempBudget, setTempBudget] = React.useState(budget.toString());

  const analysis = React.useMemo(() => getCategoryAnalysis(transactions), [transactions]);
  const percentage = Math.min((analysis.total / budget) * 100, 100);
  const isOver = analysis.total > budget;

  const handleSave = () => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val > 0) {
      setBudget(val);
      setIsEditing(false);
    }
  };

  return (
    <div className="p-6 bg-(--card-bg) border border-(--border-main) rounded-4xl transition-all duration-400 group shadow-lg shadow-black/5 dark:shadow-none">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500/10 text-primary-500 rounded-xl">
            <Target size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-(--text-primary) tracking-tight">Monthly Budget</h3>
            <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest leading-none">Actual vs Planned Spend</p>
          </div>
        </div>

        {role === 'admin' && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <input 
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="w-24 bg-(--app-bg) border border-(--border-main) rounded-lg px-2 py-1 text-sm font-bold outline-none focus:border-primary-500"
                />
                <button onClick={handleSave} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors">
                  <Save size={16} />
                </button>
                <button onClick={() => { setIsEditing(false); setTempBudget(budget.toString()); }} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                  <X size={16} />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 text-(--text-muted) hover:text-primary-500 hover:bg-primary-500/10 rounded-xl transition-all"
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-3xl font-black text-(--text-primary)">
              ₹{analysis.total.toLocaleString()}
              <span className="text-sm font-bold text-(--text-muted) ml-1">/ ₹{budget.toLocaleString()}</span>
            </span>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border",
            isOver ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          )}>
            {isOver ? <AlertCircle size={12} /> : <TrendingDown size={12} />}
            {isOver ? 'Over Budget' : 'On Track'}
          </div>
        </div>

        <div className="relative h-4 bg-(--app-bg) rounded-full overflow-hidden border border-(--border-main)">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-colors duration-500",
              percentage > 90 ? "bg-rose-500" : percentage > 70 ? "bg-amber-500" : "bg-primary-500"
            )}
            style={{ 
              boxShadow: percentage > 90 ? '0 0 20px rgba(239, 68, 68, 0.3)' : '0 0 20px rgba(59, 130, 246, 0.3)' 
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-(--app-bg) rounded-2xl border border-(--border-main)">
            <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest mb-1">Percentage Used</p>
            <p className="text-lg font-black text-(--text-primary)">{percentage.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-(--app-bg) rounded-2xl border border-(--border-main)">
            <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest mb-1">Remaining</p>
            <p className={cn(
              "text-lg font-black",
              isOver ? "text-rose-500" : "text-emerald-500"
            )}>
              {isOver ? '-' : ''}₹{Math.abs(budget - analysis.total).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
