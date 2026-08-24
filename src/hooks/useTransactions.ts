import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../core/supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import { fetchRates } from '../core/exchange';

export interface DisplayTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  display_amount: number;
  currency: string;
  category: string;
  description?: string;
  created_at: string;
}

export const useTransactions = (displayCurrency: string = 'EUR', pageSize: number = 10) => {
  const user = useAuthStore((state) => state.user);
  const [transactions, setTransactions] = useState<DisplayTransaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const [metrics, setMetrics] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });

  const fetchPageData = useCallback(async (page: number) => {
    if (!user) return;
    setIsLoading(true);

    try {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;

      const { data, count, error } = await supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex);

      if (error) throw error;

      const { data: allData, error: metricsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      if (metricsError) throw metricsError;

      const rates = await fetchRates();
      const conversionRate = rates[displayCurrency] || 1;

      const formattedPageTransactions = (data || []).map((tx) => ({
        ...tx,
        display_amount: tx.amount * conversionRate,
      }));

      setTransactions(formattedPageTransactions);
      if (count !== null) setTotalCount(count);

      let totalIncome = 0;
      let totalExpenses = 0;

      (allData || []).forEach((tx) => {
        const converted = tx.amount * conversionRate;
        if (tx.type === 'INCOME') {
          totalIncome += converted;
        } else {
          totalExpenses += converted;
        }
      });

      setMetrics({
        income: totalIncome,
        expenses: totalExpenses,
        balance: totalIncome - totalExpenses,
      });

    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, displayCurrency, pageSize]);

  useEffect(() => {
    fetchPageData(currentPage);
  }, [fetchPageData, currentPage]);

  return {
    transactions,
    metrics,
    totalCount,
    currentPage,
    setCurrentPage,
    totalPages: Math.ceil(totalCount / pageSize) || 1,
    isLoading,
    refreshData: () => fetchPageData(currentPage),
  };
};