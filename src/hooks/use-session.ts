import { createClient } from '@/server/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useSession() {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return {
    session,
    user: session?.user ?? null,
    loading,
  };
}
