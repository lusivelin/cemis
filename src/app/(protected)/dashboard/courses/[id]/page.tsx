import { notFound } from 'next/navigation';
import { api } from '@/trpc/server';
import CourseCard from '@/components/dashboard/course/card';

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;

  try {
    const course = await api.courses.detail.query({ id });

    if (!course) {
      notFound();
    }

    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold">Course Details</h1>
        <CourseCard course={course} id={id} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching course:', error);
    notFound();
  }
}
