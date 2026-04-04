import React from 'react';
import { OverviewCharts } from '../components/dashboard/OverviewCharts';
import { InsightsSection } from '../components/insights/InsightsSection';
import { BarChart3, TrendingUp, Sparkles } from 'lucide-react';

export const Insights: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-(--text-primary) flex items-center gap-2 tracking-tight">
            <BarChart3 className="text-emerald-500" size={28} />
            Insights & Analytics
          </h1>
          <p className="text-(--text-muted) mt-1 font-medium flex items-center gap-2">
            <Sparkles size={14} className="text-purple-500" />
            AI-powered financial deep dive for smarter <span className="text-emerald-500 font-bold underline">decisions</span>.
          </p>
        </div>
      </div>

      <OverviewCharts />
      
      <div className="p-8 bg-linear-to-br from-emerald-600/5 to-indigo-600/5 border border-emerald-500/10 rounded-4xl shadow-xl shadow-emerald-500/5">
        <InsightsSection />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-(--card-bg) border border-(--border-main) rounded-4xl shadow-xl shadow-black/5 flex flex-col justify-center gap-4 group">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={32} />
          </div>
          <h3 className="text-2xl font-black text-(--text-primary)">Profit Growth</h3>
          <p className="text-(--text-muted) font-medium text-lg">Your income is growing at a rate of 12% per month. Keep it up!</p>
        </div>
        <div className="p-8 bg-(--card-bg) border border-(--border-main) rounded-4xl shadow-xl shadow-black/5 flex flex-col justify-center gap-4 group">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform duration-500">
            <Sparkles size={32} />
          </div>
          <h3 className="text-2xl font-black text-(--text-primary)">AI Advice</h3>
          <p className="text-(--text-muted) font-medium text-lg">You can save ₹12,000 more this month by reducing food delivery costs.</p>
        </div>
      </div>
    </div>
  );
};
