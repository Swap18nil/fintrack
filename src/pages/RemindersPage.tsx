import { useState } from 'react';
import { AddReminderModal } from '../components/reminders/AddReminderModal';
import { Bell, Plus } from 'lucide-react';
import { useReminders } from '../hooks/useReminder';

export const RemindersPage = () => {
  const { reminders, isLoading, addReminder, markAsPaidAndLog } = useReminders();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Recurring Bills & Reminders</h1>
          <p className="text-sm text-gray-500">Track repeating expenses. Clicking 'Pay Now' automatically logs them to your ledger and schedules the next cycle.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-500 animate-pulse">
          Loading reminders...
        </div>
      ) : reminders.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500 text-center">
          <Bell className="w-10 h-10 text-gray-300 mb-3" />
          <p className="font-medium text-gray-700">No reminders set</p>
          <p className="text-sm text-gray-400 mb-4">Add your recurring subscriptions or utility bills to track them here.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 font-medium text-sm hover:underline"
          >
            Create your first reminder
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Frequency</th>
                  <th className="px-6 py-3 font-medium">Next Due</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reminders.map((reminder) => (
                  <tr key={reminder.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {reminder.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {reminder.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                      {reminder.frequency.toLowerCase()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">
                      {formatDate(reminder.due_date)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                      {reminder.amount} {reminder.currency}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        onClick={() => markAsPaidAndLog(reminder)}
                        className="bg-gray-900 text-white hover:bg-blue-600 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm"
                      >
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddReminderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addReminder}
      />
    </div>
  );
};