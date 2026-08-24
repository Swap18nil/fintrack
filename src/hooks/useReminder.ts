import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../core/supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import type { Database } from '../core/types/database.types';
import { sendReminderEmailDirect } from '../services/emailService';

type Reminder = Database['public']['Tables']['reminders']['Row'];
type ReminderInsert = Database['public']['Tables']['reminders']['Insert'];

export const useReminders = () => {
  const user = useAuthStore((state) => state.user);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReminders = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addReminder = async (newReminder: Omit<ReminderInsert, 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    try {
      const { error } = await supabase
        .from('reminders')
        .insert({ ...newReminder, user_id: user.id });

      if (error) throw error;
      await fetchReminders();

      if (user?.email) {
        const emailResult = await sendReminderEmailDirect({
          toEmail: user.email,
          title: newReminder.title,
          amount: newReminder.amount,
          currency: newReminder.currency,
          dueDate: newReminder.due_date,
          category: newReminder.category,
        });

        if (emailResult.success) {
          console.log('Reminder email sent successfully via EmailJS!');
        }
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const markAsPaidAndLog = async (reminder: Reminder) => {
    if (!user) return;
    try {
      const currentDueDate = new Date(reminder.due_date);
      if (reminder.frequency === 'MONTHLY') {
        currentDueDate.setMonth(currentDueDate.getMonth() + 1);
      } else if (reminder.frequency === 'YEARLY') {
        currentDueDate.setFullYear(currentDueDate.getFullYear() + 1);
      } else if (reminder.frequency === 'WEEKLY') {
        currentDueDate.setDate(currentDueDate.getDate() + 7);
      }
      const nextDueDateString = currentDueDate.toISOString().split('T')[0];

      await supabase
        .from('reminders')
        .update({ due_date: nextDueDateString })
        .eq('id', reminder.id);

      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'EXPENSE',
          amount: reminder.amount,
          currency: reminder.currency,
          category: reminder.category,
          description: `Paid: ${reminder.title}`,
          status: 'COMPLETED'
        });

      await fetchReminders();
    } catch (error) {
      console.error('Error settling reminder:', error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return { reminders, isLoading, addReminder, markAsPaidAndLog, refreshReminders: fetchReminders };
};