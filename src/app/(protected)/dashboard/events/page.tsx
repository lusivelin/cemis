import { api } from '@/trpc/server';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '@/lib/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { PaginationSection } from '@/components/dashboard/pagination';

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 10;

  const { data: events, meta } = await api.events.list.query({
    page: currentPage,
    limit: pageSize,
  });

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Events</h1>

      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{event.type}</TableCell>
                <TableCell>
                  {format(new Date(event.startDate), 'MMM d, yyyy')} -{format(new Date(event.endDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>
                  <StatusBadge status={event.status || ''} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
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

function StatusBadge({ status }: { status: string }) {
  const colors = {
    Active: 'bg-green-500',
    Upcoming: 'bg-blue-500',
    Completed: 'bg-gray-500',
    Pending: 'bg-yellow-500',
    Cancelled: 'bg-red-500',
  };

  return <Badge className={`${colors[status as keyof typeof colors] || 'bg-gray-500'} text-white`}>{status}</Badge>;
}
