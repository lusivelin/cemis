import { SidebarInset, SidebarProvider } from '@/lib/components/ui/sidebar';
import { createClient } from '@/server/supabase/server';
import { redirect } from 'next/navigation';
import AppHeader from '@/components/dashboard/app-header';
import AppSidebar from '@/components/dashboard/app-sidebar';

type Props = { children: React.ReactNode };

export default async function DashboardLayout({ children }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <AppHeader />
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
