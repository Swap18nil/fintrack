
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchRates } from '../../../core/exchange';
import type { supabase } from '../../../core/supabaseClient';
import type { DisplayTransaction } from '../../../hooks/useTransactions';
import { useAuthStore } from '../../../store/useAuthStore';


const CATEGORIES = [
  'Housing & Utilities',
  'Food',
  'Transport',
  'Medical & Health',
  'Insurance',
  'Entertainment & Tech',
  'Education',
  'Savings & Investments',
  'Family Support',
  'Trip & Travel',
  'Personal Expenses'
] as const;

const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(3).max(3),
  category: z.enum(CATEGORIES),
  description: z.string().optional(), 
});

type TransactionInputs = z.infer<typeof transactionSchema>;

interface AddTransactionFormProps {
  onSuccess?: () => void;
  editingTransaction?: DisplayTransaction | null;
  onClearEdit?: () => void;
}

export const AddTransactionForm = ({ onSuccess, editingTransaction, onClearEdit }: AddTransactionFormProps) => {
  const user = useAuthStore((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionInputs>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'EXPENSE', currency: 'EUR', category: 'Personal Expenses' },
  });

  useEffect(() => {
    if (editingTransaction) {
      reset({
        type: editingTransaction.type,
        amount: editingTransaction.amount,
        currency: 'EUR', 
        category: (editingTransaction as any).category || 'Personal Expenses',
        description: editingTransaction.description || '',
      });
    } else {
      reset({ type: 'EXPENSE', currency: 'EUR', category: 'Personal Expenses', description: '', amount: undefined });
    }
  }, [editingTransaction, reset]);

  const onSubmit = async (data: TransactionInputs) => {
    if (!user) return;
    setIsSubmitting(true);
    setMessage(null);

    try {
      const rates = await fetchRates();
      const conversionRate = rates[data.currency] || 1;
      const amountInEur = data.amount / conversionRate;

      const payload = {
        type: data.type,
        amount: amountInEur,
        currency: 'EUR',
        category: data.category,
        description: data.description || '',
      };

      if (editingTransaction) {
        const { error } = await supabase.from('transactions')
          .update(payload)
          .eq('id', editingTransaction.id)
          .eq('user_id', user.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Transaction updated!' });
        if (onClearEdit) onClearEdit();
      } else {
        const { error } = await supabase.from('transactions').insert({
          ...payload,
          user_id: user.id,
          status: 'COMPLETED',
        });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Saved successfully!' });
      }

      reset();
      if (onSuccess) onSuccess(); 
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save transaction' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        {editingTransaction && (
          <button 
            type="button" 
            onClick={onClearEdit}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel Edit
          </button>
        )}
      </div>
      
      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              {...register('type')} 
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select 
              {...register('currency')} 
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="0.00"
          />
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            {...register('category')} 
            className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
          <input
            type="text"
            {...register('description')}
            className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Dinner with family, Flight tickets"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 font-medium mt-2"
        >
          {isSubmitting ? 'Saving...' : (editingTransaction ? 'Update Transaction' : 'Save Transaction')}
        </button>
      </form>
    </div>
  );
};