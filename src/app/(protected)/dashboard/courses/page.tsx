import Link from 'next/link';
import { api } from '@/trpc/server';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/lib/components/ui/table';
import { Badge } from '@/lib/components/ui/badge';
import { Button } from '@/lib/components/ui/button';
import { BookOpen, Eye, Pencil, Plus, Search, Download } from 'lucide-react';
import { PaginationSection } from '@/components/dashboard/pagination';
import { SearchBox } from '@/components/dashboard/search-box';
import { formatTeacherName } from '@/server/api/routers/course-router';

export default async function CoursesPage({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const { page, search } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 10;

  const { data: courses, meta } = await api.courses.list.query({
    page: currentPage,
    limit: pageSize,
    search,
  });

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/dashboard/courses/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="w-72">
          <SearchBox placeholder="Search courses..." defaultValue={search} />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Course</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses?.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Created {new Date(course.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                    {course.code}
                  </Badge>
                </TableCell>
                <TableCell>
                  {course.credits} {course.credits === 1 ? 'credit' : 'credits'}
                </TableCell>
                <TableCell>
                  {course.teacherId ? (
                    <div className="text-sm">
                      {formatTeacherName({
                        teacherFirstName: course.teacherFirstName,
                        teacherLastName: course.teacherLastName,
                        teacherDisplayName: course.teacherDisplayName,
                      })}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Not assigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm line-clamp-1 max-w-xs">{course.description}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/courses/${course.id}`}>
                      <Button variant="outline" size="icon" title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!courses || courses.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium text-lg mb-1">No courses found</h3>
                    <p className="text-muted-foreground mb-4">
                      {search
                        ? 'No results match your search criteria. Try a different search term.'
                        : 'Get started by adding your first course.'}
                    </p>
                    {!search && (
                      <Link href="/dashboard/courses/create">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Course
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
        {meta?.totalPages > 0 && <PaginationSection currentPage={currentPage} totalPages={meta.totalPages} />}
      </div>
    </div>
  );
}
