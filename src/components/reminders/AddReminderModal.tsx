import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

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

const reminderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(3).max(3),
  category: z.enum(CATEGORIES),
  due_date: z.string().min(1, 'Due date is required'),
  frequency: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']),
});

type ReminderInputs = z.infer<typeof reminderSchema>;

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: ReminderInputs) => Promise<{ success: boolean; error?: string }>;
}

export const AddReminderModal = ({ isOpen, onClose, onAdd }: AddReminderModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const todayString = (new Date()).toISOString().split('T')[0];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReminderInputs>({
    resolver: zodResolver(reminderSchema),
    defaultValues: { currency: 'EUR', category: 'Housing & Utilities', frequency: 'MONTHLY' },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: ReminderInputs) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await onAdd(data);
    setIsSubmitting(false);

    if (result.success) {
      reset();
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to save reminder');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Recurring Bill / Reminder</h2>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Title</label>
            <input
              type="text"
              {...register('title')}
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Netflix, Rent, Electricity"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              {...register('category')} 
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                {...register('due_date')}
                min={todayString}
                className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select 
                {...register('frequency')} 
                className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 font-medium mt-2"
          >
            {isSubmitting ? 'Saving...' : 'Save Reminder'}
          </button>
        </form>
      </div>
    </div>
  );
};