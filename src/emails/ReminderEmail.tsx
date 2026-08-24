import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Button,
} from '@react-email/components';

interface ReminderEmailProps {
  title: string;
  amount: number;
  currency: string;
  dueDate: string;
  category: string;
}

export const ReminderEmail = ({
  title,
  amount,
  currency,
  dueDate,
  category,
}: ReminderEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb', padding: '20px' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <Heading style={{ color: '#1f2937', fontSize: '24px', marginBottom: '16px' }}>
            Upcoming Bill Reminder: {title}
          </Heading>
          
          <Text style={{ color: '#4b5563', fontSize: '16px', lineHeight: '24px' }}>
            This is a friendly reminder that your bill for <strong>{title}</strong> is due soon.
          </Text>

          <Section style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '6px', margin: '20px 0' }}>
            <Text style={{ margin: '4px 0', color: '#374151' }}><strong>Amount:</strong> {amount} {currency}</Text>
            <Text style={{ margin: '4px 0', color: '#374151' }}><strong>Category:</strong> {category}</Text>
            <Text style={{ margin: '4px 0', color: '#374151' }}><strong>Due Date:</strong> {dueDate}</Text>
          </Section>

          <Button
            href="http://localhost:5173/reminders"
            style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block', fontWeight: 'bold' }}
          >
            View in FinTrack
          </Button>
        </Container>
      </Body>
    </Html>
  );
};

export default ReminderEmail;