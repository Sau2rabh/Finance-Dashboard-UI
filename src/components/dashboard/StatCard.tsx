import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: number;
  change: number;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'danger';
  trend?: number[];
}

const iconBg = {
  primary: 'bg-primary-500/10 text-primary-600',
  success: 'bg-emerald-500/10 text-emerald-600',
  danger: 'bg-rose-500/10 text-rose-600',
};

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 24;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const colorClass = color === 'primary' ? 'text-primary-500' : color === 'success' ? 'text-emerald-500' : 'text-rose-500';

  return (
    <svg width={width} height={height} className={`overflow-visible ${colorClass}`}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
      />
    </svg>
  );
};

export const StatCard: React.FC<StatCardProps> = ({ title, amount, change, icon: Icon, color, trend }) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="p-6 glass-card rounded-4xl flex flex-col h-full transition-all relative overflow-hidden group"
    >
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${iconBg[color]} transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
          isPositive 
            ? 'bg-emerald-500/10 text-emerald-600' 
            : 'bg-rose-500/10 text-rose-600'
        }`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-bold text-(--text-muted) uppercase tracking-widest leading-none mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-(--text-primary) tracking-tighter transition-colors duration-200">
            ₹{amount.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-bold text-(--text-muted) uppercase">INR</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-(--border-main) flex items-center justify-between">
        <span className="text-[11px] font-medium text-(--text-muted)">vs. last month</span>
        {trend && (
          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
            <Sparkline data={trend} color={color} />
          </div>
        )}
      </div>
    </motion.div>
  );
};
