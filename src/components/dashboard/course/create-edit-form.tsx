'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';
import { Button } from '@/lib/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/components/ui/form';
import { Input } from '@/lib/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { Textarea } from '@/lib/components/ui/textarea';
import { courseCreateSchema, CourseCreate } from '@/server/api/requests/course';
import { CourseDetailOutput } from '@/server/api/routers/course-router';
import { useToast } from '@/lib/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';

interface CourseFormProps {
  initialData?: CourseDetailOutput;
  id?: string;
  onSuccess?: () => void;
}

export default function CourseForm({ initialData, id, onSuccess }: CourseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);

  const { data: teachersData, isLoading: teachersLoading } = api.teachers.list.useQuery({
    limit: 100,
  });

  useEffect(() => {
    if (teachersData?.data) {
      const formattedTeachers = teachersData.data.map((teacher) => ({
        id: teacher.id,
        name: teacher.displayName || `${teacher.firstName} ${teacher.lastName}`,
      }));
      setTeachers(formattedTeachers);
    }
  }, [teachersData]);

  const form = useForm<CourseCreate>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: initialData
      ? {
          teacherId: initialData.teacherId || undefined,
          code: initialData.code,
          name: initialData.name,
          description: initialData.description,
          credits: initialData.credits,
        }
      : {
          teacherId: undefined,
          code: '',
          name: '',
          description: '',
          credits: 3,
        },
  });

  const apiUtils = api.useUtils();

  const invalidateOnSuccess = async () => {
    await apiUtils.courses.invalidate();
    setIsSubmitting(false);
    toast({
      title: id ? 'Course Updated' : 'Course Created',
      description: id
        ? 'Course information has been successfully updated.'
        : 'New course has been successfully created.',
    });
    onSuccess?.();
    router.refresh();
  };

  const onError = (error: any) => {
    console.error('Form submission error:', error);
    setIsSubmitting(false);
    toast({
      title: 'Error',
      description: error.message || 'An error occurred while saving the course information.',
      variant: 'destructive',
    });
  };

  const handleFormCancel = () => {
    toast({
      title: 'Action Cancelled',
      description: 'No changes were saved.',
      variant: 'default',
    });
    if (!id) {
      router.back();
    } else {
      onSuccess?.();
    }
  };

  const createMutation = api.courses.create.useMutation({
    onSuccess: invalidateOnSuccess,
    onError,
  });

  const updateMutation = api.courses.update.useMutation({
    onSuccess: invalidateOnSuccess,
    onError,
  });

  function onSubmit(data: CourseCreate) {
    setIsSubmitting(true);
    toast({
      title: 'Saving...',
      description: 'Please wait while we save the course information.',
      variant: 'default',
    });

    if (id) {
      updateMutation.mutate({ id, body: data });
    } else {
      createMutation.mutate(data);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? 'Edit Course' : 'Add New Course'}</CardTitle>
        <CardDescription>{id ? 'Update the course details' : 'Enter the course details'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="details">Details & Teacher</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Code</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., CS101" {...field} />
                        </FormControl>
                        <FormDescription>Unique identifier for the course</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credits</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter credits"
                            min={1}
                            max={12}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            value={field.value ?? undefined}
                          />
                        </FormControl>
                        <FormDescription>Number of credit hours (1-12)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter course description" className="min-h-32" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of the course content and objectives
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Teacher</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                        value={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a teacher" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {teachersLoading ? 'Loading teachers...' : 'Assign a teacher to this course or leave empty'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-4 bg-muted rounded-md">
                  <h3 className="text-sm font-medium mb-2">Additional Information</h3>
                  <p className="text-sm text-muted-foreground">
                    You can add more course details like prerequisites, schedule, and syllabus after creating the
                    course.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleFormCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : id ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
