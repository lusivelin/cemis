import Link from 'next/link';
import { api } from '@/trpc/server';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '@/lib/components/ui/table';
import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import { Building2, Eye } from 'lucide-react';
import { PaginationSection } from '@/components/dashboard/pagination';

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page, search } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 10;

  const { data: hotels, meta } = await api.hotels.list.query({
    page: currentPage,
    limit: pageSize,
    search,
  });

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <Link href="/dashboard/trip-category/hotels/create">
          <Button className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Add Hotel
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels?.map((hotel) => (
              <TableRow key={hotel.id}>
                <TableCell className="font-medium">{hotel.name}</TableCell>
                <TableCell>{hotel.address}</TableCell>
                <TableCell>{hotel.city}</TableCell>
                <TableCell>{hotel.country}</TableCell>
                <TableCell>
                  <StatusBadge active={hotel.active ?? false} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/trip-category/hotels/detail?id=${hotel.id}`}>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>
            <PaginationSection currentPage={currentPage} totalPages={meta.totalPages} />
          </TableCaption>
        </Table>
      </div>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge className={`${active ? 'bg-green-500' : 'bg-red-500'} text-white`}>{active ? 'Active' : 'Inactive'}</Badge>
  );
}
