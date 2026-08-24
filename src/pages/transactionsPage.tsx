import { useState } from 'react';
import { useTransactions, type DisplayTransaction } from '../hooks/useTransactions';
import { AddTransactionForm } from '../components/layout/transactions/AddTransactionForm';
import { TransactionList } from '../components/layout/transactions/TransactionList';

export const TransactionsPage = () => {
  const [displayCurrency, setDisplayCurrency] = useState('EUR');
  const [editingTransaction, setEditingTransaction] = useState<DisplayTransaction | null>(null);

  const { transactions, isLoading, refreshData } = useTransactions(displayCurrency);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Transactions Management</h1>
        <p className="text-sm text-gray-500">Create, edit, and review all your financial entries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <AddTransactionForm 
            onSuccess={refreshData} 
            editingTransaction={editingTransaction}
            onClearEdit={() => setEditingTransaction(null)}
          />
        </div>

        <div className="lg:col-span-2">
          <TransactionList 
            transactions={transactions} 
            displayCurrency={displayCurrency} 
            isLoading={isLoading} 
            onEditClick={(tx) => setEditingTransaction(tx)}
          />
        </div>
      </div>
    </div>
  );
};