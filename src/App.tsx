import { FinanceProvider } from './context/FinanceContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';
import { Budget } from './pages/Budget';
import { TransactionModal } from './components/modals/TransactionModal';
import { DeleteConfirmationModal } from './components/modals/DeleteConfirmationModal';
import { useFinance } from './context/FinanceContext';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { cn } from './lib/utils';
import { motion } from 'framer-motion';

function BackgroundBlobs({ pause }: { pause: boolean }) {
  return (
    <div className={cn(
      "fixed inset-0 overflow-hidden pointer-events-none -z-10 transition-opacity duration-1000",
      pause ? "opacity-40" : "opacity-100"
    )}>
      <motion.div 
        animate={pause ? {} : {
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={pause ? {} : {
          x: [0, -80, 0],
          y: [0, 120, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={pause ? {} : {
          x: [0, 50, 0],
          y: [0, -100, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={pause ? {} : {
          x: [0, -120, 0],
          y: [0, -60, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[15%] left-[5%] w-[35%] h-[35%] bg-blue-400/10 rounded-full blur-[110px]"
      />
    </div>
  );
}

function AppContent() {
  const { isModalOpen, closeModal, editingTransaction, isDeleteModalOpen, currentPage } = useFinance();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isDeleteModalOpen]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'insights':
        return <Insights />;
      case 'budget':
        return <Budget />;
      default:
        return <Dashboard />;
    }
  };

  if (isAppLoading) {
    return (
      <>
        <BackgroundBlobs pause={false} />
        <div className="min-h-screen flex items-center justify-center bg-transparent relative z-50">
          <div className="flex flex-col items-center gap-6 glass-card p-12 rounded-4xl shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin shadow-[0_0_15px_rgba(59,93,249,0.5)]" />
              <div className="absolute inset-0 border-4 border-indigo-500/20 border-b-indigo-500 rounded-full animate-spin opacity-50" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black bg-linear-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent tracking-widest animate-pulse">FINPULSE</h2>
              <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-[0.3em]">Connecting securely...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <BackgroundBlobs pause={isModalOpen || isDeleteModalOpen} />
      <div 
        className={cn(
          "min-h-screen flex bg-transparent transition-all duration-200 relative",
          (isModalOpen || isDeleteModalOpen) && "blur-md brightness-90 saturate-150 pointer-events-none scale-[0.98] origin-center"
        )}
      >
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-28 lg:ml-80 min-h-screen flex flex-col transition-colors duration-200 bg-transparent pb-24 md:pb-0 min-w-0 overflow-x-hidden">
          <Header />
          <div className={cn(
            "flex-1 p-4 lg:p-8 overflow-y-auto",
            (isModalOpen || isDeleteModalOpen) && "overflow-hidden"
          )}>
            {renderPage()}
          </div>
        </main>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        editingTransaction={editingTransaction}
      />

      <DeleteConfirmationModal />
    </>
  );
}

function Root() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default Root;
