'use client';

import { Button } from '@/lib/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/lib/components/ui/dropdown-menu';
import { Separator } from '@/lib/components/ui/separator';
import { SidebarTrigger } from '@/lib/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ChevronRight, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function AppHeader() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  const pathSegments = pathname.split('/').filter((e) => e);

  const breadcrumbs = pathSegments.map((e, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const text = e.charAt(0).toUpperCase() + e.slice(1).replace(/-/g, ' ');
    return { text, link: href };
  });

  return (
    <header className="sticky top-0 w-full bg-background md:px-6 px-4 py-2.5 border-b flex items-center">
      <div className="flex items-center gap-4 justify-between w-full">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <Separator orientation="vertical" className="md:hidden mr-2 h-4" />
          <ul className="flex flex-wrap gap-y-1 items-center wrapper">
            {breadcrumbs.map((e, index) => {
              if (!e) return null;
              const isActive = breadcrumbs.length - 1 === index;

              return (
                <li key={e.text} className="flex items-center flex-wrap text-foreground">
                  {isActive ? (
                    <p className="font-semibold">{e.text}</p>
                  ) : (
                    <Link href={e.link} className="hover:underline">
                      {e.text}
                    </Link>
                  )}
                  {index !== breadcrumbs.length - 1 && <ChevronRight className="size-5 mx-2" />}
                </li>
              );
            })}
          </ul>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {['Light', 'Dark', 'System'].map((e) => {
              const value = e.toLowerCase();
              const isActive = value === theme;

              return (
                <DropdownMenuItem key={e} onClick={() => setTheme(value)} className={cn({ 'bg-accent': isActive })}>
                  {e}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
