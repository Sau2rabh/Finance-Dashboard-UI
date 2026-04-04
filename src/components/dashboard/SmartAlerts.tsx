import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Calendar, DollarSign, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { generateSmartAlerts } from '../../utils/financeUtils';

export const SmartAlerts: React.FC = () => {
  const { transactions, budget } = useFinance();
  const [closedAlerts, setClosedAlerts] = React.useState<string[]>([]);
  
  const alerts = React.useMemo(() => {
    return generateSmartAlerts(transactions, budget).filter(a => !closedAlerts.includes(a));
  }, [transactions, budget, closedAlerts]);

  if (alerts.length === 0) return null;

  const getIcon = (text: string) => {
    if (text.includes('Critical')) return <AlertTriangle className="text-rose-500" size={18} />;
    if (text.includes('Warning')) return <AlertTriangle className="text-amber-500" size={18} />;
    if (text.includes('projected')) return <Calendar className="text-primary-500" size={18} />;
    return <DollarSign className="text-emerald-500" size={18} />;
  };

  const getColorClass = (text: string) => {
    if (text.includes('Critical')) return 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400';
    if (text.includes('Warning')) return 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400';
    return 'bg-primary-500/10 border-primary-500/20 text-primary-700 dark:text-primary-400';
  };

  return (
    <div className="space-y-3 mb-8">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert}
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
            className={`flex items-center justify-between p-4 rounded-2xl border ${getColorClass(alert)} shadow-sm group backdrop-blur-md`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/50 dark:bg-black/20 rounded-xl">
                {getIcon(alert)}
              </div>
              <p className="text-sm font-bold tracking-tight">{alert}</p>
            </div>
            <button 
              onClick={() => setClosedAlerts([...closedAlerts, alert])}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
