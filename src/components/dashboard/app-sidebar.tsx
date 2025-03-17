'use client';

import { Avatar } from '@/lib/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/lib/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/lib/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/lib/components/ui/sidebar';
import { signOut } from '@/server/auth/actions';
import type { User } from '@supabase/supabase-js';
import { ChevronRight, ChevronsUpDown, Home, ListOrdered, LogOut, Star, User as UserIcon, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = { user: User };

export default function AppSidebar({ user }: Props) {
  const pathname = usePathname();

  const items = [
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
    {
      title: 'Students',
      url: '/students',
      icon: Star,
      children: [
        {
          title: 'All Students',
          url: '/students',
          icon: Users,
        },
      ]
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="p-2">
          <strong>CEMIS</strong>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((e) => {
                const href = `/dashboard${e.url === '/' ? '' : e.url}`;
                const isActive = href === pathname;

                if (!e.children?.length) {
                  return (
                    <SidebarMenuItem key={e.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={href}>
                          <e.icon />
                          <span>{e.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <Collapsible key={e.title} asChild defaultOpen={true} className="group/collapsible">
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip={e.title} isActive={isActive}>
                        <Link href={href} className="flex items-center gap-2 w-full">
                          <e.icon className="size-4" />
                          <span>{e.title}</span>
                        </Link>

                        <CollapsibleTrigger asChild>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </CollapsibleTrigger>
                      </SidebarMenuButton>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {e.children.map((l) => {
                            const href2 = `/dashboard${l.url === '/' ? '' : l.url}`;
                            const isActive2 = href2 === pathname;

                            return (
                              <SidebarMenuSubItem key={l.title}>
                                <SidebarMenuSubButton asChild isActive={isActive2}>
                                  <Link href={href2}>
                                    <l.icon />
                                    <span>{l.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 flex items-center justify-center rounded-lg">
                <UserIcon size={20} />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.email}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 flex items-center justify-center rounded-lg">
                  <UserIcon size={20} />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.email}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
