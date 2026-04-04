import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Transaction, TransactionType, Role, Theme } from '../types';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

interface FinanceContextType {
  transactions: Transaction[];
  role: Role;
  theme: Theme;
  searchQuery: string;
  filterType: TransactionType | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  budget: number;
  setRole: (role: Role) => void;
  setTheme: (theme: Theme) => void;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: TransactionType | 'all') => void;
  setSortBy: (by: 'date' | 'amount') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setBudget: (amount: number) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  bulkDeleteTransactions: (ids: string[]) => void;
  filteredTransactions: Transaction[];
  stats: {
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
    incomeChange: number;
    expenseChange: number;
    trends: {
      balance: number[];
      income: number[];
      expense: number[];
    };
  };
  // Modal State
  isModalOpen: boolean;
  editingTransaction: Transaction | undefined;
  openModal: (tx?: Transaction) => void;
  closeModal: () => void;
  // Delete Modal State
  isDeleteModalOpen: boolean;
  txToDelete: Transaction | undefined;
  bulkDeleteIds: string[];
  openDeleteModal: (tx?: Transaction, ids?: string[]) => void;
  closeDeleteModal: () => void;
  // Navigation
  currentPage: 'dashboard' | 'transactions' | 'insights' | 'budget';
  setCurrentPage: (page: 'dashboard' | 'transactions' | 'insights' | 'budget') => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const version = localStorage.getItem('finance_data_version');
    const saved = localStorage.getItem('finance_transactions');
    // Clear old data if version mismatch — ensures fresh mock data on first load
    if (version !== 'v3' || !saved) {
      localStorage.setItem('finance_data_version', 'v3');
      localStorage.removeItem('finance_transactions');
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(saved);
  });

  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('finance_role');
    return (saved as Role) || 'admin';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('finance_theme');
    return (saved as Theme) || 'dark';
  });

  const [budget, setBudgetState] = useState<number>(() => {
    const saved = localStorage.getItem('finance_budget');
    return saved ? Number(saved) : 50000;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const openModal = (tx?: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<Transaction | undefined>();
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  const openDeleteModal = (tx?: Transaction, ids?: string[]) => {
    setTxToDelete(tx);
    setBulkDeleteIds(ids || []);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTxToDelete(undefined);
    setBulkDeleteIds([]);
  };

  // Navigation
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'transactions' | 'insights' | 'budget'>('dashboard');

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('finance_budget', budget.toString());
  }, [budget]);

  const setBudget = (amount: number) => {
    setBudgetState(amount);
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions([newTx, ...transactions]);
  };

  const editTransaction = (tx: Transaction) => {
    setTransactions(transactions.map((t) => (t.id === tx.id ? tx : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const bulkDeleteTransactions = (ids: string[]) => {
    setTransactions(transactions.filter((t) => !ids.includes(t.id)));
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             tx.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || tx.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const order = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'date') {
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * order;
        }
        return (a.amount - b.amount) * order;
      });
  }, [transactions, searchQuery, filterType, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonthRaw = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthTxs = transactions.filter(tx => {
      const d = new Date(tx.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const lastMonthTxs = transactions.filter(tx => {
      const d = new Date(tx.date);
      return d.getMonth() === lastMonthRaw && d.getFullYear() === lastMonthYear;
    });

    const income = currentMonthTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = currentMonthTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    const lastIncome = lastMonthTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const lastExpense = lastMonthTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    const incomeChange = lastIncome === 0 ? 100 : ((income - lastIncome) / lastIncome) * 100;
    const expenseChange = lastExpense === 0 ? 100 : ((expense - lastExpense) / lastExpense) * 100;

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    // Calculate trends (last 7 days)
    const trends = {
      balance: [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const txs = transactions.filter(tx => tx.date <= dateStr);
        const inc = txs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const exp = txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        return inc - exp;
      }),
      income: [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        return transactions
          .filter(tx => tx.date === dateStr && tx.type === 'income')
          .reduce((acc, t) => acc + t.amount, 0);
      }),
      expense: [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        return transactions
          .filter(tx => tx.date === dateStr && tx.type === 'expense')
          .reduce((acc, t) => acc + t.amount, 0);
      })
    };

    return {
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      incomeChange,
      expenseChange,
      trends
    };
  }, [transactions]);

  return (
    <FinanceContext.Provider value={{
      transactions, role, theme, searchQuery, filterType, sortBy, sortOrder, budget,
      setRole, setTheme, setSearchQuery, setFilterType, setSortBy, setSortOrder, setBudget,
      addTransaction, editTransaction, deleteTransaction, bulkDeleteTransactions,
      filteredTransactions, stats,
      isModalOpen, editingTransaction, openModal, closeModal,
      isDeleteModalOpen, txToDelete, bulkDeleteIds, openDeleteModal, closeDeleteModal,
      currentPage, setCurrentPage
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
