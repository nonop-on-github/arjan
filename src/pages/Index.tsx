import { useState, useEffect, useRef } from "react";
import { Transaction } from "@/types/finance";
import { Card } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";
import Dashboard from "@/components/Dashboard";
import TransactionList from "@/components/TransactionList";
import Header from "@/components/Header";
import IncomeConfetti from "@/components/IncomeConfetti";
import { useTheme } from "next-themes";
import { useTransactions } from "@/hooks/useTransactions";
import { useChannels } from "@/hooks/useChannels";
import { PlusCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChannelManagement from "@/components/ChannelManagement";
const Index = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showChannelManager, setShowChannelManager] = useState(false);
  const {
    setTheme,
    theme
  } = useTheme();
  const {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactions();
  const {
    channels,
    setChannels,
    isLoading: channelsLoading
  } = useChannels();
  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.removeEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [setTheme]);
  useEffect(() => {
    const handleScroll = () => {
      if (!pageRef.current) return;
      setShowFloatingButton(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleSubmitTransaction = async (transaction: Transaction) => {
    const success = editingTransaction ? await updateTransaction(transaction) : await addTransaction(transaction);
    if (success) {
      if (!editingTransaction && transaction.type === "income") {
        setShowConfetti(true);
      }
      setShowTransactionForm(false);
      setEditingTransaction(null);
    }
  };
  if (!mounted) {
    return null;
  }
  return <div className="min-h-screen bg-background p-3 sm:p-6 animate-fadeIn" ref={pageRef}>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <Header onNewTransaction={() => setShowTransactionForm(true)} />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          
          <Button variant="outline" onClick={() => setShowChannelManager(true)} className="flex items-center gap-2 w-full sm:w-auto" size="sm">
            <Wallet className="h-4 w-4" />
            <span className="whitespace-nowrap">Gérer mes canaux</span>
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Dashboard transactions={transactions} channels={channels} />
        </div>

        <Card className="p-3 sm:p-6">
          <TransactionList transactions={transactions} onEdit={setEditingTransaction} onDelete={deleteTransaction} />
        </Card>

        {(showTransactionForm || editingTransaction) && <TransactionForm transaction={editingTransaction} onSubmit={handleSubmitTransaction} onClose={() => {
        setShowTransactionForm(false);
        setEditingTransaction(null);
      }} channels={channels} />}
        
        {showChannelManager && <ChannelManagement open={showChannelManager} onClose={() => setShowChannelManager(false)} channels={channels} onChannelsUpdate={setChannels} />}
        
        <IncomeConfetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
        
        {showFloatingButton ? <Button onClick={() => setShowTransactionForm(true)} className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-lg bg-black dark:bg-primary text-white p-0 flex items-center justify-center transition-all duration-300 animate-scale-in hover:scale-110 z-20">
            <PlusCircle size={54} />
          </Button> : null}
      </div>
    </div>;
};
export default Index;