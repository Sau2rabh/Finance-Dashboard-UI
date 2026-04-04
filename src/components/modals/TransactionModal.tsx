import React, { useState, useEffect, useRef } from 'react';
import { X, Save, AlertCircle, ChevronDown } from 'lucide-react';
import type { Category, TransactionType, Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const CATEGORIES: Category[] = [
  'Salary', 'Food', 'Rent', 'Shopping', 'Transport', 
  'Utilities', 'Entertainment', 'Health', 'Others'
];

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: Transaction;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, onClose, editingTransaction 
}) => {
  const { addTransaction, editTransaction, role, theme } = useFinance();
  const [type, setType] = useState<TransactionType>(editingTransaction?.type || 'expense');
  const [category, setCategory] = useState<Category>(editingTransaction?.category || 'Food');
  const [amount, setAmount] = useState<string>(editingTransaction?.amount.toString() || '');
  const [description, setDescription] = useState(editingTransaction?.description || '');
  const [date, setDate] = useState(editingTransaction?.date || new Date().toISOString().split('T')[0]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync form state when modal opens or editingTransaction changes
  useEffect(() => {
    if (isOpen) {
      setType(editingTransaction?.type || 'expense');
      setCategory(editingTransaction?.category || 'Food');
      setAmount(editingTransaction?.amount.toString() || '');
      setDescription(editingTransaction?.description || '');
      setDate(editingTransaction?.date || new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const data = {
      type,
      category,
      amount: parseFloat(amount),
      description,
      date,
    };

    if (editingTransaction) {
      editTransaction({ ...editingTransaction, ...data });
    } else {
      addTransaction(data);
    }
    onClose();
  };

  const isViewer = role === 'viewer';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-(--card-bg) border border-(--border-main) rounded-4xl shadow-2xl overflow-visible"
          >
            <div className="p-6 border-b border-(--border-main) flex items-center justify-between">
              <h2 className={cn(
                "text-xl font-black transition-colors duration-300",
                type === 'expense' ? "text-rose-500" : "text-emerald-500"
              )}>
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 text-(--text-muted) hover:text-(--text-primary) transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {isViewer && (
                <div className="flex items-center gap-3 p-4 bg-amber-500/10 text-amber-600 rounded-2xl border border-amber-500/20">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">Read-only mode. Switch to Admin to make changes.</p>
                </div>
              )}

              <div className="flex p-1 bg-(--app-bg) rounded-2xl border border-(--border-main)">
                <button
                  type="button"
                  disabled={isViewer}
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${type === 'expense' ? 'bg-(--card-bg) text-rose-500 shadow-sm border border-(--border-main)' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  disabled={isViewer}
                  onClick={() => setType('income')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${type === 'income' ? 'bg-(--card-bg) text-emerald-500 shadow-sm border border-(--border-main)' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
                >
                  Income
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-(--text-muted) uppercase tracking-widest px-1">Date</label>
                  <input
                    type="date"
                    required
                    disabled={isViewer}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ colorScheme: theme }}
                    className="w-full px-4 py-2.5 bg-(--app-bg) border border-(--border-main) rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all disabled:opacity-50 text-(--text-primary) font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-(--text-muted) uppercase tracking-widest px-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    disabled={isViewer}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-(--app-bg) border border-(--border-main) rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all disabled:opacity-50 text-(--text-primary) font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2 relative" ref={categoryRef}>
                <label className="text-sm font-bold text-(--text-muted) uppercase tracking-widest px-1">Category</label>
                <div className="relative">
                  <button
                    type="button"
                    disabled={isViewer}
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-(--app-bg) border border-(--border-main) rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all disabled:opacity-50 text-(--text-primary) font-semibold text-left"
                  >
                    {category}
                    <ChevronDown className={cn("text-(--text-muted) transition-transform duration-300", showCategoryDropdown ? "rotate-180" : "rotate-0")} size={18} />
                  </button>
                  
                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-[calc(100%+8px)] bg-(--app-bg) backdrop-blur-2xl border border-(--border-main) rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[180px] overflow-y-auto custom-scrollbar"
                      >
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setCategory(cat);
                              setShowCategoryDropdown(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 text-sm font-semibold transition-all hover:bg-primary-500/10",
                              category === cat ? "text-primary-600 bg-primary-500/5" : "text-(--text-primary)"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-(--text-muted) uppercase tracking-widest px-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="What was this for?"
                  disabled={isViewer}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-(--app-bg) border border-(--border-main) rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all disabled:opacity-50 text-(--text-primary) font-semibold"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isViewer}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-(--border-main) disabled:text-(--text-muted) text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all active:scale-95"
                >
                  <Save size={20} />
                  <span>{editingTransaction ? 'Update' : 'Save'} Transaction</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
