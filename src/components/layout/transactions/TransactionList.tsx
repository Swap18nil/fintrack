import { useLocation } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DisplayTransaction } from '../../../hooks/useTransactions';

interface TransactionListProps {
  transactions: DisplayTransaction[];
  displayCurrency: string;
  isLoading: boolean;
  onEditClick: (tx: DisplayTransaction) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange?: (newPage: number) => void;
}

export const TransactionList = ({ 
  transactions, 
  displayCurrency, 
  isLoading, 
  onEditClick,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange
}: TransactionListProps) => {
  const location = useLocation();
  const showAction = location.pathname.includes('transactions');

  const formatListCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: displayCurrency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-500 animate-pulse">
        Loading transactions...
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
        <p className="font-medium text-gray-700">No transactions recorded yet.</p>
        <p className="text-sm text-gray-400">Add a transaction to start seeing your history.</p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-sm text-gray-500 bg-gray-50/50">
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Note</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium text-right">Amount</th>
              {showAction && <th className="px-6 py-3 font-medium text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                  {(tx as any).category || 'Personal Expenses'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {tx.description || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(tx.created_at)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    tx.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {tx.type === 'INCOME' ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-semibold text-right flex items-center justify-end ${
                  tx.type === 'INCOME' ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {tx.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />}
                  {formatListCurrency(tx.display_amount)}
                </td>
                {showAction && (
                  <td className="px-6 py-4 text-sm text-center">
                    <button 
                      onClick={() => onEditClick(tx)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors inline-flex"
                      title="Edit Transaction"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing <span className="font-medium text-gray-700">{startIndex + 1}</span> to{' '}
            <span className="font-medium text-gray-700">{endIndex}</span> of{' '}
            <span className="font-medium text-gray-700">{totalCount}</span> entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-gray-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};