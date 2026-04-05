import React, { useState } from 'react';
import { 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownLeft, Target } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const OverviewCharts: React.FC = () => {
  const { transactions } = useFinance();
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d'>('7d');

  // Process data for Area Chart
  const areaData = React.useMemo(() => {
    const dayCount = timeFilter === '7d' ? 7 : 30;
    const days = Array.from({ length: dayCount }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (dayCount - 1 - i));
      return d.toISOString().split('T')[0];
    });

    return days.map(date => {
      const dayTxs = transactions.filter(t => t.date === date);
      const income = dayTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expense = dayTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      
      return {
        name: new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        date,
        income,
        expense
      };
    });
  }, [transactions, timeFilter]);

  const peakExpense = React.useMemo(() => {
    return [...areaData].sort((a, b) => b.expense - a.expense)[0];
  }, [areaData]);

  // Process data for Pie Chart
  const categoryData = Object.entries(
    transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const totalSpent = categoryData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
      const expense = payload.find((p: any) => p.dataKey === 'expense')?.value || 0;
      const diff = income - expense;

      return (
        <div className="bg-(--card-bg) border border-(--border-main) p-4 rounded-3xl shadow-2xl backdrop-blur-md">
          <p className="text-xs font-black text-(--text-muted) uppercase tracking-widest mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="text-emerald-500" size={14} />
                <span className="text-xs font-bold text-(--text-muted)">Income</span>
              </div>
              <span className="text-xs font-black text-emerald-500">₹{income.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="text-rose-500" size={14} />
                <span className="text-xs font-bold text-(--text-muted)">Expense</span>
              </div>
              <span className="text-xs font-black text-rose-500">₹{expense.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-(--border-main) flex items-center justify-between gap-6">
              <span className="text-[10px] font-black text-(--text-muted) uppercase">Net</span>
              <span className={cn(
                "text-xs font-black",
                diff >= 0 ? "text-emerald-500" : "text-rose-500"
              )}>
                {diff >= 0 ? '+' : ''}₹{diff.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      {/* Area Chart */}
      <div className="lg:col-span-2 p-6 bg-(--card-bg) border border-(--border-main) rounded-4xl min-h-[450px] flex flex-col transition-all duration-200 group shadow-lg shadow-black/5 dark:shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-(--text-primary) tracking-tight">Cash Flow Intelligence</h3>
            <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest leading-none">Activity & Trends Analysis</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-(--app-bg) p-1 rounded-xl border border-(--border-main)">
              {(['7d', '30d'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTimeFilter(mode)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all",
                    timeFilter === mode 
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20" 
                      : "text-(--text-muted) hover:text-(--text-primary)"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full min-h-[280px]">
          <ResponsiveContainer width="100%" height={280} minWidth={1}>
            <AreaChart data={areaData} margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b5df9" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b5df9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-surface-200 dark:text-surface-700/60" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', fontSize: 9, fontWeight: 800 }} 
                className="text-(--text-muted)"
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', fontSize: 9, fontWeight: 800 }}
                className="text-(--text-muted)"
                tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary-500)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="income" stroke="#3b5df9" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              
              {peakExpense && peakExpense.expense > 0 && (
                <ReferenceLine 
                  x={peakExpense.name} 
                  stroke="#ef4444" 
                  strokeDasharray="4 4" 
                  strokeWidth={2}
                  label={{ 
                    position: 'top', 
                    value: 'Peak Spend', 
                    fill: '#ef4444', 
                    fontSize: 10, 
                    fontWeight: 800,
                    className: 'uppercase tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  }} 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="p-6 bg-(--card-bg) border border-(--border-main) rounded-4xl min-h-[450px] flex flex-col transition-all duration-200 group shadow-lg shadow-black/5 dark:shadow-none">
        <div className="space-y-1 mb-6">
          <h3 className="text-xl font-black text-(--text-primary) tracking-tight">Spending Sectors</h3>
          <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest leading-none">Proportional Allocation</p>
        </div>
        
        <div className="flex-1 w-full relative min-h-[280px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height={240} minWidth={1}>
            <PieChart margin={{ top: 20, bottom: 20, left: 0, right: 0 }}>
              <Pie
                data={categoryData}
                innerRadius={65}
                outerRadius={75}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
                cornerRadius={12}
                cx="50%"
                cy="50%"
                animationBegin={200}
                animationDuration={1500}
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderRadius: '1.5rem', 
                  border: '1px solid var(--border-main)',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Target className="text-primary-500/20 mb-1" size={24} />
            <span className="text-[9px] font-black text-(--text-muted) uppercase tracking-[0.2em] leading-none">Impact</span>
            <span className="text-xl font-black text-(--text-primary)">₹{(totalSpent/1000).toFixed(1)}k</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {categoryData.slice(0, 4).map((item, index) => (
            <div key={item.name} className="flex items-center justify-between group cursor-pointer p-1.5 sm:p-2 hover:bg-(--app-bg) rounded-xl transition-all">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
                <div className="w-2.5 h-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[9px] sm:text-[10px] font-bold text-(--text-muted) group-hover:text-primary-500 transition-colors uppercase tracking-wider">{item.name}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-1">
                <span className="text-[9px] sm:text-[10px] font-black text-(--text-primary)">
                  ₹{item.value.toLocaleString()}
                </span>
                <span className="text-[8px] sm:text-[9px] font-black py-0.5 px-1.5 bg-white/5 dark:bg-black/20 rounded-full text-primary-500 shrink-0">
                  {((item.value / totalSpent) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
