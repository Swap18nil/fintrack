import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Line, LineChart, XAxis, YAxis } from 'recharts';
import type { DisplayTransaction } from '../../../hooks/useTransactions';

interface TransactionChartProps {
  transactions: DisplayTransaction[];
  displayCurrency: string;
}

export const TransactionChart = ({ transactions, displayCurrency }: TransactionChartProps) => {
  const expenseTotal = transactions
    .filter((tx) => tx.type === 'EXPENSE')
    .reduce((sum, tx) => sum + tx.display_amount, 0);

  const incomeTotal = transactions
    .filter((tx) => tx.type === 'INCOME')
    .reduce((sum, tx) => sum + tx.display_amount, 0);

  const data = [
    { name: 'Income', value: incomeTotal, color: '#16a34a' }, 
    { name: 'Expenses', value: expenseTotal, color: '#dc2626' }
  ];

  const formatTooltip = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: displayCurrency,
    }).format(value);
  };

  if (expenseTotal === 0 && incomeTotal === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[340px] text-gray-500">
        <p>No data to visualize yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Cash Flow Analysis</h2>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50} 
              outerRadius={90}
              paddingAngle={0} 
              dataKey="value"
              stroke="none" 
              isAnimationActive = {true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatTooltip(value)}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>

          
        </ResponsiveContainer>

 
      </div>
    </div>
  );
};