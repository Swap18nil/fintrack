import React from 'react';
import type { CategoryBudget } from '../hooks/useBudgets';

interface Props {
  budgets: CategoryBudget[];
  isLoading: boolean;
  onOpenSetup: () => void;
}

export const BudgetComparisonCard: React.FC<Props> = ({ budgets, isLoading, onOpenSetup }) => {
  if (isLoading) return <div className="p-4 text-gray-500">Loading budgets...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Category Budgets vs Spent</h3>
        <button
          onClick={onOpenSetup}
          className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          Start / Edit Budgeting
        </button>
      </div>

      <div className="space-y-4">
        {budgets.map((item) => {
          const percentage = item.limit > 0 ? Math.min(Math.round((item.spent / item.limit) * 100), 100) : 0;
          const isOverBudget = item.limit > 0 && item.spent > item.limit;

          return (
            item.category !== 'Income' && (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{item.category}</span>
                <span className="text-gray-500">
                  <strong className={isOverBudget ? 'text-red-600' : 'text-gray-800'}>
                    {item.spent}
                  </strong>{' '}
                  / {item.limit} spent
                </span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            )

          );
        })}
      </div>
    </div>
  );
};