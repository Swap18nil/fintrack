import emailjs from '@emailjs/browser';

export interface EmailPayload {
  toEmail: string;
  title: string;
  amount: number;
  currency: string;
  dueDate: string;
  category: string;
}

export const sendReminderEmailDirect = async ({
  toEmail,
  title,
  amount,
  currency,
  dueDate,
  category,
}: EmailPayload) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.error('Missing EmailJS environment variables in .env');
    return { success: false, error: 'EmailJS keys missing' };
  }

  try {
    const templateParams = {
      to_email: toEmail,
      title: title,
      amount: amount,
      currency: currency,
      due_date: dueDate,
      category: category,
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);

    console.log('EmailJS response:', response.status, response.text);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending email via EmailJS:', error);
    return { success: false, error: error.text || error.message };
  }
};