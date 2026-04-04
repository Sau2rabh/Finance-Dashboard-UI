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
    <div className="
      fixed z-50 glass-effect transition-all duration-400 ease-in-out
      
      /* Mobile: Bottom Nav */
      bottom-0 left-0 w-full h-20 flex flex-row items-center justify-around rounded-t-3xl border-t border-(--border-main) border-x-0 border-b-0 m-0 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]
      
      /* md & lg: Sidebar */
      md:top-0 md:bottom-auto md:h-[calc(100vh-2rem)] md:w-20 lg:w-64 md:flex-col md:m-4 md:rounded-4xl md:border-t-0 md:shadow-none md:border-x md:border-b
    ">
      <div className="hidden md:flex p-6 items-center gap-3 lg:justify-start justify-center">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
          <ReceiptIndianRupee size={22} />
        </div>
        <span className="text-xl font-bold bg-linear-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent hidden lg:block tracking-tight">
          FinPulse
        </span>
      </div>

      <nav className="flex flex-row md:flex-col w-full md:w-auto flex-1 items-center justify-around md:justify-start md:space-y-2 mt-0 md:mt-6 px-2 md:px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={cn(
              "flex items-center justify-center md:justify-start gap-3 p-3 lg:px-4 rounded-2xl transition-all duration-300 group relative font-semibold text-left",
              "md:w-full",
              currentPage === item.id 
                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20" 
                : "text-(--text-muted) hover:bg-(--app-bg) hover:text-primary-600 border border-transparent hover:border-(--border-main)"
            )}
          >
            <item.icon size={22} className={cn(
              "transition-transform duration-300 group-hover:scale-110 shrink-0",
              currentPage === item.id ? "text-white" : "text-(--text-muted) group-hover:text-primary-500"
            )} />
            <span className="hidden lg:block tracking-wide">{item.label}</span>
            {currentPage === item.id && (
              <div className="hidden md:block absolute left-0 w-1 h-6 bg-white rounded-r-full lg:hidden" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
