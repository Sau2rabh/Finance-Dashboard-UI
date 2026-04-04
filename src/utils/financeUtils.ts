import type { Transaction } from '../types';

/**
 * Calculates the percentage change between current and previous month.
 */
export const calculateMoMChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Gets transactions for a specific month and year.
 */
export const getTransactionsByMonth = (transactions: Transaction[], month: number, year: number) => {
  return transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
};

/**
 * Calculates predictive spending for the current month.
 */
export const getPredictiveSpend = (transactions: Transaction[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentDay = now.getDate();

  const currentMonthExpenses = transactions
    .filter(tx => {
      const d = new Date(tx.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && tx.type === 'expense';
    })
    .reduce((acc, tx) => acc + tx.amount, 0);

  const averageDailySpend = currentDay > 0 ? currentMonthExpenses / currentDay : 0;
  const estimatedTotal = averageDailySpend * daysInMonth;

  return {
    estimatedTotal,
    averageDailySpend,
    remainingDays: daysInMonth - currentDay
  };
};

/**
 * Analyzes category spending for insights.
 */
export const getCategoryAnalysis = (transactions: Transaction[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  
  const currentMonthExpenses = transactions.filter(tx => 
    tx.type === 'expense' && new Date(tx.date).getMonth() === currentMonth
  );

  const byCategory = currentMonthExpenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);

  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const total = currentMonthExpenses.reduce((acc, tx) => acc + tx.amount, 0);

  return {
    topCategory: sorted[0] || null,
    total,
    breakdown: sorted.map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0
    }))
  };
};

/**
 * Generates smart alerts based on spending habits and budget.
 */
export const generateSmartAlerts = (transactions: Transaction[], budget: number) => {
  const alerts: string[] = [];
  const analysis = getCategoryAnalysis(transactions);
  const prediction = getPredictiveSpend(transactions);

  if (analysis.total > budget) {
    alerts.push(`⚠️ Critical: You have exceeded your monthly budget by ₹${(analysis.total - budget).toLocaleString()}!`);
  } else if (analysis.total > budget * 0.8) {
    alerts.push(`⚠️ Warning: You've used over 80% of your monthly budget.`);
  }

  if (prediction.estimatedTotal > budget && analysis.total <= budget) {
    alerts.push(`📅 At your current rate, you're projected to exceed your budget in ${Math.max(1, Math.floor((budget - analysis.total) / (prediction.averageDailySpend || 1)))} days.`);
  }

  const largeExpense = transactions
    .filter(tx => tx.type === 'expense' && tx.amount > 5000)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (largeExpense) {
    alerts.push(`💸 Note: A large expense of ₹${largeExpense.amount.toLocaleString()} in ${largeExpense.category} was recorded recently.`);
  }

  return alerts;
};
