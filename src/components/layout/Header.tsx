import React from 'react';
import { Search, Moon, Sun, Plus, ReceiptIndianRupee, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const { role, setRole, theme, setTheme, openModal, setCurrentPage } = useFinance();
  const [navQuery, setNavQuery] = React.useState('');
  const prevRole = useRef(role);

  useEffect(() => {
    if (prevRole.current !== role) {
      toast.success(`Switched to ${role === 'admin' ? 'Administrator' : 'Viewer'} Mode`, {
        icon: role === 'admin' ? '🔐' : '👁️',
        duration: 2000,
        style: {
          borderRadius: '1rem',
          background: 'var(--card-bg)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-main)',
          fontWeight: 'bold',
          fontSize: '12px'
        }
      });
      prevRole.current = role;
    }
  }, [role]);

  const pages = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Transactions', id: 'transactions' },
    { name: 'Insights', id: 'insights' },
    { name: 'Budget', id: 'budget' },
  ];

  const handleNavigation = (e: React.FormEvent) => {
    e.preventDefault();
    const match = pages.find(p => p.name.toLowerCase() === navQuery.toLowerCase());
    if (match) {
      setCurrentPage(match.id as any);
      setNavQuery('');
    }
  };

  return (
    <header className="h-14 sm:h-18 px-3 sm:px-6 flex items-center justify-between glass-effect sticky top-3 sm:top-4 z-40 transition-all duration-300 rounded-2xl sm:rounded-4xl mx-3 sm:mx-4 mt-3 sm:mt-4 mb-2 gap-2 sm:gap-4">
      {/* Mobile Logo */}
      <div className="flex md:hidden items-center gap-1.5 shrink-0">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-500/30">
          <ReceiptIndianRupee size={20} />
        </div>
        <span className="text-lg font-bold bg-linear-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent tracking-tight hidden sm:block">
          FinPulse
        </span>
      </div>

      <form onSubmit={handleNavigation} className="flex-1 max-w-sm relative group min-w-[120px] sm:min-w-[160px] lg:min-w-[200px]">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-(--text-muted) group-focus-within:text-primary-500 transition-colors w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
        <input 
          type="text" 
          placeholder="Go to Dashboard..."
          value={navQuery}
          onChange={(e) => setNavQuery(e.target.value)}
          className="w-full bg-(--app-bg) border border-(--border-main) rounded-xl sm:rounded-2xl py-2 sm:py-2 pl-9 sm:pl-12 pr-3 sm:pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-xs sm:text-sm font-semibold text-(--text-primary) text-ellipsis whitespace-nowrap overflow-hidden"
        />
        {navQuery && (
          <div className="absolute top-full left-0 w-full mt-2 bg-(--card-bg) border border-(--border-main) rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
            {pages.filter(p => p.name.toLowerCase().includes(navQuery.toLowerCase())).map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setCurrentPage(p.id as any);
                  setNavQuery('');
                }}
                className="w-full text-left px-4 py-3 text-xs font-bold text-(--text-primary) hover:bg-primary-500/10 hover:text-primary-500 transition-all flex items-center justify-between group"
              >
                {p.name}
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity bg-primary-500/10 px-2 py-0.5 rounded text-primary-600">Enter</span>
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
        {/* Role Switcher */}
        <div className="hidden md:flex bg-(--app-bg) p-1 rounded-xl border border-(--border-main)">
          <button 
            onClick={() => setRole('admin')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              role === 'admin' 
                ? 'bg-(--card-bg) text-primary-600 shadow-sm border border-(--border-main)' 
                : 'text-(--text-muted) hover:text-(--text-primary)'
            }`}
          >
            Admin
          </button>
          <button 
            onClick={() => setRole('viewer')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              role === 'viewer' 
                ? 'bg-(--card-bg) text-primary-600 shadow-sm border border-(--border-main)' 
                : 'text-(--text-muted) hover:text-(--text-primary)'
            }`}
          >
            Viewer
          </button>
        </div>

        <button
          disabled={role === 'viewer'}
          onClick={() => openModal()}
          className={`flex items-center justify-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 shrink-0 ${
            role === 'viewer' 
              ? 'bg-(--border-main) text-(--text-muted) cursor-not-allowed opacity-60 grayscale' 
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/20'
          }`}
        >
          <Plus className="w-[20px] h-[20px] sm:w-[18px] sm:h-[18px]" />
          <span className="hidden xl:block text-sm">Add New</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 sm:p-2.5 bg-(--card-bg) border border-(--border-main) rounded-lg sm:rounded-xl hover:opacity-80 transition-all shadow-sm shrink-0"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Sun size={20} className="text-amber-500" />
          ) : (
            <Moon size={20} className="text-primary-500" />
          )}
        </button>

        <button className="flex items-center gap-2 sm:gap-3 pl-2 pr-2 xl:pr-4 py-1.5 bg-(--card-bg) border border-(--border-main) rounded-full hover:opacity-80 transition-all shadow-sm group shrink-0 min-w-0">
          <div className="hidden xl:flex flex-col items-end truncate">
            <p className="text-sm font-bold text-(--text-primary) leading-none mb-1 whitespace-nowrap">Saurabh Anand</p>
            <p className="text-[11px] font-medium text-(--text-muted) uppercase tracking-wider whitespace-nowrap">
            {role === 'admin' ? (
              <span className="flex items-center gap-1">
                <ShieldCheck size={10} className="text-emerald-500" />
                Admin
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ShieldAlert size={10} className="text-rose-500" />
                Viewer Mode
              </span>
            )}
            </p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-500/20 ring-2 ring-transparent group-hover:ring-primary-500/30 transition-all shrink-0">
            <span className="text-xs sm:text-sm font-black tracking-tight">SA</span>
          </div>
        </button>
      </div>
    </header>
  );
};
