import { createClient } from '@/server/supabase/server';
import { redirect } from 'next/navigation';

type Props = { children: React.ReactNode };

export default async function AuthLayout({ children }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user) {
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();

    if (userData?.role === 'admin') {
      redirect('/dashboard');
    } else {
      redirect('/portal');
    }
  }
  console.log({ user });

  return <>{children}</>;
}
