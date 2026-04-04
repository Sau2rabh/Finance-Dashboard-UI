import React from 'react';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { useFinance } from '../context/FinanceContext';
import { ReceiptIndianRupee } from 'lucide-react';
import type { Transaction } from '../types';

export const Transactions: React.FC = () => {
  const { role, openModal } = useFinance();

  const handleEdit = (tx: Transaction) => {
    openModal(tx);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-(--text-primary) flex items-center gap-2 tracking-tight">
            <ReceiptIndianRupee className="text-primary-500" size={28} />
            Transactions
          </h1>
          <p className="text-(--text-muted) mt-1 font-medium">
            Manage and track all your financial activities in one place.
          </p>
        </div>
      </div>

      <div className="p-6 bg-(--card-bg) border border-(--border-main) rounded-4xl shadow-xl shadow-black/5 dark:shadow-none">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-(--text-primary)">All Transactions</h2>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest bg-(--app-bg) border border-(--border-main) px-3 py-1 rounded-full">
                Role: {role}
              </span>
            </div>
          </div>
          <TransactionTable onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
};
