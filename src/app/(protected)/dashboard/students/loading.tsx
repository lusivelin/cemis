import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/lib/components/ui/table';
import { Button } from '@/lib/components/ui/button';
import { Building2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <Button className="flex items-center gap-2" disabled>
          <Building2 className="h-4 w-4" />
          Add Student
        </Button>
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
            {[...Array(10)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-[140px]" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-[200px]" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-[100px]" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-[100px]" />
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-[60px]" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
