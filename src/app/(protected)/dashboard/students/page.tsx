import Link from 'next/link';
import { api } from '@/trpc/server';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/lib/components/ui/table';
import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import { GraduationCap, Eye, Pencil, UserPlus, Search, Download } from 'lucide-react';
import { PaginationSection } from '@/components/dashboard/pagination';
import { SearchBox } from '@/components/dashboard/search-box';
import { Avatar, AvatarFallback, AvatarImage } from '@/lib/components/ui/avatar';

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const { page, search } = await searchParams
  const currentPage = Number(page) || 1;
  const pageSize = 10;

  const { data: students, meta } = await api.student.list.query({
    page: currentPage,
    limit: pageSize,
    search,
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/dashboard/students/create">
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="w-72">
          <SearchBox 
            placeholder="Search students..." 
            defaultValue={search}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Student</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Guardian</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="" alt={`${student.firstName} ${student.lastName}`} />
                      <AvatarFallback>
                        {getInitials(student.firstName, student.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{student.displayName || `${student.firstName} ${student.lastName}`}</div>
                      <div className="text-xs text-muted-foreground">{student.nationality || "—"}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{student.email}</div>
                  <div className="text-xs text-muted-foreground">{student.phone || "—"}</div>
                </TableCell>
                <TableCell>{student.batch}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {student.program}
                  </Badge>
                </TableCell>
                <TableCell>
                  {student.guardianName ? (
                    <div>
                      <div className="text-sm">{student.guardianName}</div>
                      <div className="text-xs text-muted-foreground">{student.guardianRelationship || "Guardian"}</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Not provided</span>
                  )}
                </TableCell>
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
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium text-lg mb-1">No students found</h3>
                    <p className="text-muted-foreground mb-4">
                      {search 
                        ? "No results match your search criteria. Try a different search term." 
                        : "Get started by adding your first student."}
                    </p>
                    {!search && (
                      <Link href="/dashboard/students/create">
                        <Button>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Student
                        </Button>
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-6">
        {meta?.totalPages > 0 && (
          <PaginationSection currentPage={currentPage} totalPages={meta.totalPages} />
        )}
      </div>
    </div>
  );
}