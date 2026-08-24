import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { TransactionList } from '../components/layout/transactions/TransactionList';
import { TransactionChart } from '../components/layout/transactions/TransationChart';
import { BudgetComparisonCard } from '../components/BudgetComparisonCard';
import { useBudgets } from '../hooks/useBudgets';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constant/categories';



export const DashboardPage = () => {
  const [displayCurrency, setDisplayCurrency] = useState('EUR');
  const { metrics, transactions, isLoading } = useTransactions(displayCurrency);
  const { budgets, saveAllBudgets } = useBudgets(CATEGORIES);
  const navigation = useNavigate()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: displayCurrency,
    }).format(amount);
  };

  const openBudget =() =>{
    navigation('/budget-setup')

  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Overview</h1>
          <p className="text-sm text-gray-500">Welcome back! Here is your current cash flow summary.</p>
        </div>
        <div>
          <select 
            value={displayCurrency} 
            onChange={(e) => setDisplayCurrency(e.target.value)}
            className="rounded-lg border border-gray-300 p-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Wallet className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Net Balance</p>
            <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(metrics.balance)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Income</p>
            <h3 className="text-2xl font-bold text-green-600">{formatCurrency(metrics.income)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><TrendingDown className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
            <h3 className="text-2xl font-bold text-red-600">{formatCurrency(metrics.expenses)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <TransactionChart transactions={transactions} displayCurrency={displayCurrency} />
        </div>
        <div className="lg:col-span-2">
          {/* Read-Only Feed: Passing a no-op function or adjusting table props */}
          <TransactionList 
            transactions={transactions} 
            displayCurrency={displayCurrency} 
            isLoading={isLoading} 
            onEditClick={() => {}} 
          />
        </div>
      </div>

      <BudgetComparisonCard 
        budgets={budgets} 
        isLoading={isLoading} 
        onOpenSetup={() => openBudget()} 
      />
    </div>
  );
};