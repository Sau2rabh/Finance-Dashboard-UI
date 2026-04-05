import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  MoreVertical, 
  Trash2, 
  Search, 
  Filter,
  Download
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../lib/utils';

interface TransactionTableProps {
  onEdit: (transaction: any) => void;
}

const categoryColors = {
  Food: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  Transport: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  Shopping: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  Salary: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Entertainment: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  Utilities: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  Rent: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Health: 'bg-green-500/10 text-green-600 border-green-500/20',
  Others: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

export const TransactionTable: React.FC<TransactionTableProps> = ({ onEdit }) => {
  const { 
    filteredTransactions, 
    role,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    openDeleteModal
  } = useFinance();

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [showFilterMenu, setShowFilterMenu] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);

  // Close filter dropdown on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Date Formatter
  const formatDate = (iso: string, forCsv = false) => {
    const d = new Date(iso + 'T00:00:00');
    if (forCsv) {
      // Standard DD-MM-YYYY for CSV to avoid Excel's #### hiding (less likely than long names)
      return d.toLocaleDateString('en-GB').replace(/\//g, '-');
    }
    // Professional display for UI
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // CSV Export
  const handleDownload = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)', 'Net Amount'];
    const rows = filteredTransactions.map(tx => [
      `"${formatDate(tx.date, true)}"`,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.category,
      tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      tx.amount,
      tx.type === 'income' ? `+${tx.amount}` : `-${tx.amount}`
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const bom = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${filterType}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTransactions.map(tx => tx.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    openDeleteModal(undefined, selectedIds);
  };

  const confirmDelete = (tx: any) => {
    openDeleteModal(tx);
  };

  const SortIcon = ({ field }: { field: 'date' | 'amount' }) => {
    if (sortBy !== field) return <Filter size={12} className="opacity-20 ml-1 inline" />;
    return sortOrder === 'asc' 
      ? <ArrowUpRight size={12} className="ml-1 inline text-primary-500" /> 
      : <ArrowDownLeft size={12} className="ml-1 inline text-primary-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted) group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search recent activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-(--app-bg) border border-(--border-main) rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-semibold text-(--text-primary)"
          />
        </div>
        
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && role === 'admin' && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white text-xs font-black rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
            >
              <Trash2 size={16} />
              Delete ({selectedIds.length})
            </button>
          )}

          <div className="flex bg-(--app-bg) p-1 rounded-xl border border-(--border-main) shadow-sm">
            {(['all', 'income', 'expense'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterType(mode)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                  filterType === mode 
                    ? "bg-primary-600 text-white shadow-md" 
                    : "text-(--text-muted) hover:text-(--text-primary)"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleDownload}
            title="Download as CSV"
            className="hidden sm:flex items-center gap-1.5 p-2.5 bg-(--app-bg) border border-(--border-main) rounded-xl text-(--text-muted) hover:text-primary-500 hover:border-primary-500/30 transition-all shadow-sm"
          >
            <Download size={20} />
          </button>

          {/* Filter Dropdown */}
          <div ref={filterRef} className="relative hidden sm:block">
            <button
              onClick={() => setShowFilterMenu(v => !v)}
              title="Filter by type"
              className={cn(
                "flex items-center gap-1.5 p-2.5 border rounded-xl transition-all shadow-sm",
                showFilterMenu || filterType !== 'all'
                  ? "bg-primary-500/10 border-primary-500/30 text-primary-500"
                  : "bg-(--app-bg) border-(--border-main) text-(--text-muted) hover:text-primary-500 hover:border-primary-500/30"
              )}
            >
              <Filter size={20} />
              {filterType !== 'all' && (
                <span className="text-[10px] font-black uppercase">{filterType}</span>
              )}
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-(--app-bg) backdrop-blur-2xl border border-(--border-main) rounded-2xl shadow-2xl overflow-hidden z-50">
                <p className="px-4 pt-3 pb-1 text-[9px] font-black text-(--text-muted) uppercase tracking-widest">Filter by Type</p>
                {(['all', 'income', 'expense'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => { setFilterType(mode); setShowFilterMenu(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-all",
                      filterType === mode
                        ? "bg-primary-500/10 text-primary-600"
                        : "text-(--text-muted) hover:bg-(--app-bg) hover:text-(--text-primary)"
                    )}
                  >
                    <span className="capitalize">{mode === 'all' ? 'All Transactions' : mode === 'income' ? '💚 Income Only' : '🔴 Expense Only'}</span>
                    {filterType === mode && <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-4xl border border-(--border-main) bg-(--app-bg)/40 overflow-hidden">
        <div className="overflow-auto h-[450px] custom-scrollbar transition-all duration-200 pr-2">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-(--app-bg) backdrop-blur-md">
              <tr className="border-b border-(--border-main)">
                <th className="px-6 py-4 w-10 bg-inherit">
                  <input 
                    type="checkbox" 
                    className={cn(
                      "w-4 h-4 rounded border-(--border-main) text-primary-600 focus:ring-primary-500/20",
                      role === 'viewer' ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                    )}
                    checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                    onChange={toggleSelectAll}
                    disabled={role === 'viewer'}
                  />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-(--text-muted) uppercase tracking-widest">Transaction</th>
                <th className="px-6 py-4 text-xs font-bold text-(--text-muted) uppercase tracking-widest">Category</th>
                <th 
                  className="px-6 py-4 text-xs font-bold text-(--text-muted) uppercase tracking-widest cursor-pointer hover:text-primary-500 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  Date <SortIcon field="date" />
                </th>
                <th 
                  className="px-6 py-4 text-xs font-bold text-(--text-muted) uppercase tracking-widest text-right cursor-pointer hover:text-primary-500 transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  Amount <SortIcon field="amount" />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-(--text-muted) uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-main)">
              {filteredTransactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => onEdit(tx)}
                  className={cn(
                    "group hover:bg-primary-500/5 transition-all duration-200 cursor-pointer backdrop-blur-[2px]",
                    tx.amount > 5000 && tx.type === 'expense' && "bg-rose-500/5 shadow-[inset_0_0_20px_rgba(244,63,94,0.05)]"
                  )}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className={cn(
                        "w-4 h-4 rounded border-(--border-main) text-primary-600 focus:ring-primary-500/20",
                        role === 'viewer' ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                      )}
                      checked={selectedIds.includes(tx.id)}
                      onChange={() => toggleSelect(tx.id)}
                      disabled={role === 'viewer'}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2.5 rounded-xl border group-hover:scale-110 transition-transform duration-300",
                        tx.type === 'income' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}>
                        {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-(--text-primary) transition-colors duration-200">{tx.description}</span>
                        <span className="text-[10px] font-bold text-(--text-muted) uppercase tracking-tighter">{tx.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all duration-200",
                      categoryColors[tx.category as keyof typeof categoryColors] || 'bg-surface-500/10 text-surface-500 border-surface-500/20'
                    )}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-(--text-muted) group-hover:text-(--text-primary) transition-colors duration-300">
                      {formatDate(tx.date)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className={cn(
                        "text-sm font-black tracking-tighter transition-colors duration-200",
                        tx.type === 'income' ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                      {tx.amount > 5000 && tx.type === 'expense' && (
                        <span className="text-[8px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mt-0.5">High Expense</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => onEdit(tx)}
                        className={cn(
                          "p-2 rounded-lg transition-all text-(--text-muted) hover:text-primary-500 hover:bg-primary-500/10",
                          role === 'viewer' && "opacity-30 flex items-center gap-1"
                        )}
                        title={role === 'viewer' ? "Only Admin can Edit" : "Edit transaction"}
                      >
                        <MoreVertical size={18} />
                        {role === 'viewer' && <span className="text-[8px] font-black uppercase">Viewer</span>}
                      </button>
                      <button 
                        onClick={() => confirmDelete(tx)}
                        disabled={role === 'viewer'}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          role === 'viewer' 
                            ? "text-(--text-muted) opacity-30 cursor-not-allowed" 
                            : "text-(--text-muted) hover:text-rose-500 hover:bg-rose-500/10"
                        )}
                        title={role === 'viewer' ? "Only Admin can Delete" : "Delete transaction"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTransactions.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-(--text-muted)">
              <Search size={48} className="opacity-20 mb-4" />
              <p className="font-bold tracking-tight">No transactions found</p>
              <p className="text-xs uppercase tracking-widest opacity-60">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
