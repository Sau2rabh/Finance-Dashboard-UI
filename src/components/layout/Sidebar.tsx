import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptIndianRupee, 
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFinance } from '../../context/FinanceContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: ReceiptIndianRupee, label: 'Transactions', id: 'transactions' },
  { icon: BarChart3, label: 'Insights', id: 'insights' },
  { icon: TrendingUp, label: 'Budget', id: 'budget' },
] as const;

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage } = useFinance();

  return (
    <div className="w-20 lg:w-64 h-[calc(100vh-2rem)] m-4 flex flex-col fixed left-0 top-0 z-50 transition-all duration-400 ease-in-out rounded-4xl glass-effect">
      <div className="p-6 flex items-center gap-3 lg:justify-start justify-center">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
          <ReceiptIndianRupee size={22} />
        </div>
        <span className="text-xl font-bold bg-linear-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent hidden lg:block tracking-tight">
          FinPulse
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 lg:px-4 rounded-2xl transition-all duration-300 group relative font-semibold text-left",
              currentPage === item.id 
                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20" 
                : "text-(--text-muted) hover:bg-(--app-bg) hover:text-primary-600 border border-transparent hover:border-(--border-main)"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-transform duration-300 group-hover:scale-110 shrink-0",
              currentPage === item.id ? "text-white" : "text-(--text-muted) group-hover:text-primary-500"
            )} />
            <span className="hidden lg:block tracking-wide">{item.label}</span>
            {currentPage === item.id && (
              <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full lg:hidden" />
            )}
          </button>
        ))}
      </nav>


    </div>
  );
};
