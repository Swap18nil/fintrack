import { useEffect, useState } from 'react';
import { supabase } from '../core/supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import { sendReminderEmailDirect } from '../services/emailService';

export const TriggerRemindersPage = () => {
  const user = useAuthStore((state) => state.user);
  const [statusMessage, setStatusMessage] = useState('Checking reminders...');

  useEffect(() => {
    const checkAndTriggerEmails = async () => {
      if (!user?.email) {
        setStatusMessage('Error: Please log in to your account first.');
        return;
      }

      try {
        const { data: reminders, error } = await supabase
          .from('reminders')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        if (!reminders || reminders.length === 0) {
          setStatusMessage('No reminders found.');
          return;
        }

        let sentCount = 0;
        const today = new Date();

        for (const reminder of reminders) {
          const dueDate = new Date(reminder.due_date);
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 2 && diffDays >= 0) {
            const result = await sendReminderEmailDirect({
              toEmail: user.email, 
              title: reminder.title,
              amount: reminder.amount,
              currency: reminder.currency,
              dueDate: reminder.due_date,
              category: reminder.category,
            });

            if (result.success) {
              sentCount++;
            }
          }
        }

        setStatusMessage(`Done! Successfully sent ${sentCount} reminder email(s) to ${user.email}.`);
      } catch (err: any) {
        console.error('Error:', err);
        setStatusMessage(`Failed: ${err.message}`);
      }
    };

    checkAndTriggerEmails();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h2>Reminder Trigger Page</h2>
        <p style={{ color: '#4b5563', marginTop: '10px' }}>{statusMessage}</p>
      </div>
    </div>
  );
};