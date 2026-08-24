import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuthStore } from '../store/useAuthStore';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setSession = useAuthStore((state) => state.setSession);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

   
    return () => subscription.unsubscribe();
  }, [setSession]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-lg font-semibold text-gray-600">Loading secure session...</div>
      </div>
    );
  }

  return <>{children}</>;
};