import React from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const DeleteConfirmationModal: React.FC = () => {
  const { 
    isDeleteModalOpen, 
    closeDeleteModal, 
    txToDelete, 
    bulkDeleteIds,
    deleteTransaction,
    bulkDeleteTransactions
  } = useFinance();

  const isBulk = bulkDeleteIds.length > 0;

  const handleDelete = () => {
    if (isBulk) {
      bulkDeleteTransactions(bulkDeleteIds);
      toast.success(`${bulkDeleteIds.length} transactions deleted Successfully!`, {
        icon: '🗑️',
        style: {
          borderRadius: '1.5rem',
          background: 'var(--card-bg)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-main)',
          fontWeight: 'bold',
          fontSize: '12px'
        }
      });
    } else if (txToDelete) {
      deleteTransaction(txToDelete.id);
      toast.success('Transaction deleted successfully!', {
        icon: '🚀',
        style: {
          borderRadius: '1.5rem',
          background: 'var(--card-bg)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-main)',
          fontWeight: 'bold',
          fontSize: '12px'
        }
      });
    }
    closeDeleteModal();
  };

  return (
    <AnimatePresence>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDeleteModal}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-card rounded-[3rem] border border-(--border-main) shadow-2xl overflow-hidden p-8"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-5 bg-rose-500/10 text-rose-500 rounded-3xl border border-rose-500/20 animate-pulse">
                <Trash2 size={32} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-(--text-primary) tracking-tight">
                  {isBulk ? 'Bulk Delete Transactions?' : 'Delete Transaction?'}
                </h2>
                <p className="text-sm font-medium text-(--text-muted) leading-relaxed px-4">
                  {isBulk ? (
                    <>Are you sure you want to delete <span className="text-rose-500 font-bold">{bulkDeleteIds.length}</span> transactions? This action cannot be undone.</>
                  ) : (
                    <>Are you sure you want to delete <span className="text-rose-500 font-bold">"{txToDelete?.description}"</span>? This will permanently remove it from your records.</>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                <AlertCircle size={18} className="text-rose-500 shrink-0" />
                <p className="text-[10px] font-black text-rose-500/80 uppercase tracking-widest text-left">
                  This action is irreversible. please double check before proceeding.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full pt-4">
                <button
                  onClick={handleDelete}
                  className="py-4 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-2xl transition-all shadow-xl shadow-rose-500/20 active:scale-95 uppercase tracking-widest"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="py-4 bg-(--app-bg) border border-(--border-main) text-(--text-primary) text-xs font-black rounded-2xl hover:bg-(--border-main) transition-all active:scale-95 uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </div>

            <button 
              onClick={closeDeleteModal}
              className="absolute top-6 right-6 p-2 text-(--text-muted) hover:text-(--text-primary) transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
