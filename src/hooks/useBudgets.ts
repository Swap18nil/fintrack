import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../core/supabaseClient';
import { useAuthStore } from '../store/useAuthStore';

export interface CategoryBudget {
  category: string;
  limit: number;
  spent: number;
}

export const useBudgets = (categories: string[]) => {
  const user = useAuthStore((state) => state.user);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBudgetComparison = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);

      if (budgetError) throw budgetError;

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'EXPENSE')
        .gte('created_at', startOfMonth);

      if (txError) throw txError;

      const combined: CategoryBudget[] = categories.map((cat) => {
        const foundBudget = budgetData?.find((b) => b.category === cat);
        const limit = foundBudget ? Number(foundBudget.monthly_limit) : 0;

        const spent = txData
          ?.filter((tx) => tx.category === cat)
          .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

        return { category: cat, limit, spent };
      });

      setBudgets(combined);
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, categories]);

  const saveAllBudgets = async (updatedBudgets: { category: string; limit: number }[]) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const records = updatedBudgets.map((b) => ({
        user_id: user.id,
        category: b.category,
        monthly_limit: b.limit,
      }));

      const { error } = await supabase
        .from('budgets')
        .upsert(records, { onConflict: 'user_id,category' });

      if (error) throw error;
      await fetchBudgetComparison();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchBudgetComparison();
  }, [fetchBudgetComparison]);

  return { budgets, isLoading, saveAllBudgets, refreshBudgets: fetchBudgetComparison };
};