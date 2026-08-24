import React, { useState, useEffect } from 'react';
import { useBudgets } from '../hooks/useBudgets';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constant/categories';



export const BudgetSetupPage = () => {
  const navigate = useNavigate();
  const { budgets, isLoading, saveAllBudgets } = useBudgets(CATEGORIES);
  const [limitValues, setLimitValues] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initialValues: { [key: string]: string } = {};
    budgets.forEach((b) => {
      initialValues[b.category] = b.limit ? b.limit.toString() : '';
    });
    setLimitValues(initialValues);
  }, [budgets]);

  const handleChange = (category: string, value: string) => {
    setLimitValues((prev) => ({ ...prev, [category]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = Object.entries(limitValues).map(([category, limit]) => ({
      category,
      limit: limit ? parseFloat(limit) : 0,
    }));

    await saveAllBudgets(payload);
    setIsSaving(false);
    navigate('/dashboard');
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading budget configuration...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 my-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Start Budgeting</h1>
          <p className="text-sm text-gray-500 mt-1">Set your maximum monthly spending budget for each category.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-gray-600 font-bold text-xl"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {budgets.map((item) => (
          <div key={item.category} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50">
            <label className="text-sm font-medium text-gray-700 w-1/2">{item.category}</label>
            <div className="relative w-1/2">
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={limitValues[item.category] || ''}
                onChange={(e) => handleChange(item.category, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Budgets'}
          </button>
        </div>
      </form>
    </div>
  );
};