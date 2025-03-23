'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/lib/components/ui/input';
import { Button } from '@/lib/components/ui/button';

interface SearchBoxProps {
  placeholder?: string;
  defaultValue?: string;
}

export function SearchBox({ placeholder = 'Search...', defaultValue = '' }: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);

    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }

    // Reset to page 1 when searching
    params.set('page', '1');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(window.location.search);
    params.delete('search');
    params.set('page', '1');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative flex w-full">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-9 pr-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
            onClick={clearSearch}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
      <Button className="ml-2" size="sm" onClick={handleSearch} disabled={isPending}>
        Search
      </Button>
    </div>
  );
}
