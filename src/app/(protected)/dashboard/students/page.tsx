// app/dashboard/students/page.tsx
import Link from 'next/link';
import { api } from '@/trpc/server';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '@/lib/components/ui/table';
import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import { GraduationCap, Eye, Pencil, UserPlus, Search } from 'lucide-react';
import { PaginationSection } from '@/components/dashboard/pagination';
// import { Search } from '@/components/dashboard/search';

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const search = searchParams.search || '';
  const pageSize = 10;

  const { data: students, meta } = await api.student.list.query({
    page: currentPage,
    limit: pageSize,
    search,
  });

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Link href="/dashboard/students/create">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        {/* <Search placeholder="Search by program..." /> */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.user?.name || 'N/A'}</TableCell>
                <TableCell>{student.user?.email || 'N/A'}</TableCell>
                <TableCell>{student.batch}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {student.program}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/students/${student.id}`}>
                      <Button variant="outline" size="icon" title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/students/${student.id}/edit`}>
                      <Button variant="outline" size="icon" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {students?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No students found. {search && "Try a different search term."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4">
        {meta?.totalPages > 0 && (
          <PaginationSection currentPage={currentPage} totalPages={meta.totalPages} />
        )}
      </div>
    </div>
  );
}