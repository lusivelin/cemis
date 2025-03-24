'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/lib/components/ui/collapsible';
import { Button } from '@/lib/components/ui/button';
import { Badge } from '@/lib/components/ui/badge';
import {
  ChevronDown,
  ChevronUp,
  Mail,
  BookOpen,
  GraduationCap,
  User,
  Calendar,
  X,
  AlertTriangle,
  Hash,
  CreditCard,
} from 'lucide-react';
import { api } from '@/trpc/react';
import CourseForm from '@/components/dashboard/course/create-edit-form';
import { format } from 'date-fns';
import { CourseDetailOutput } from '@/server/api/routers/course-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/lib/components/ui/alert-dialog';
import { useToast } from '@/lib/hooks/use-toast';
import { formatTeacherName } from '@/utils/local/format-teacher-name';

interface CourseCardProps {
  course: CourseDetailOutput;
  id?: string;
}

export default function CourseCard({ course, id }: CourseCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleEditClick = () => {
    setIsEditing(true);
    setIsOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const utils = api.useUtils();
  const deleteMutation = api.courses.delete.useMutation({
    onSuccess: () => {
      utils.courses.invalidate();
      toast({
        title: 'Course Deleted',
        description: `${course.name} has been successfully removed.`,
        variant: 'default',
      });
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    },
    onError: (error) => {
      console.error('Delete error:', error);
      let errorMessage = 'Failed to delete course. Please try again.';

      if (error.message.includes('foreign key constraint')) {
        errorMessage =
          'Cannot delete this course because it has active enrollments. Please remove all course enrollments first.';
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate({ id: course.id });
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const teacherName = formatTeacherName({
    teacherFirstName: course.teacherFirstName,
    teacherLastName: course.teacherLastName,
    teacherDisplayName: course.teacherDisplayName,
  });

  if (isEditing) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Edit Course</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CourseForm
            initialData={course}
            id={id}
            onSuccess={() => {
              setIsEditing(false);
              toast({
                title: 'Course Updated',
                description: 'Course information has been successfully updated.',
              });
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">{course.name}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  {course.code}
                </CardDescription>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="default" className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                {course.credits} {course.credits === 1 ? 'Credit' : 'Credits'}
              </Badge>
              {course.teacherId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {teacherName}
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created {format(new Date(course.createdAt), 'MMM d, yyyy')}
              </Badge>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="pt-4">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Course Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Course Name:</span> {course.name}
                    </div>
                    <div>
                      <span className="font-medium">Course Code:</span> {course.code}
                    </div>
                    <div>
                      <span className="font-medium">Credits:</span> {course.credits}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {format(new Date(course.createdAt), 'PPP')}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Description</h4>
                  <div className="text-sm whitespace-pre-line">{course.description}</div>
                </div>

                {course.teacherId && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Teacher Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {teacherName}
                      </div>
                      {course.teacherEmail && (
                        <div>
                          <span className="font-medium">Email:</span> {course.teacherEmail}
                        </div>
                      )}
                      {course.teacherDepartment && (
                        <div>
                          <span className="font-medium">Department:</span> {course.teacherDepartment}
                        </div>
                      )}
                      {course.teacherDesignation && (
                        <div>
                          <span className="font-medium">Designation:</span> {course.teacherDesignation}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-2">
                  <Button variant="outline" onClick={handleEditClick} className="flex items-center gap-2">
                    Edit Course
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteClick}
                    className="flex items-center gap-2"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Course'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span>
                Are you sure you want to delete <strong>{course.name}</strong> ({course.code})? This action cannot be
                undone.
              </span>
            </AlertDialogDescription>
            <AlertDialogDescription className="space-y-2">
              <span className="font-medium text-amber-600 mt-2">
                Note: If this course has enrollments, you must remove those enrollments first before deleting the
                course.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Course'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
