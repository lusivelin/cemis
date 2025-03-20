import { notFound } from 'next/navigation';
import { api } from '@/trpc/server';
import StudentCard from '@/components/dashboard/student/card';

interface StudentDetailPageProps {
  params: {
    id: string;
  };
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = params;

  try {
    const student = await api.students.detail.query({ id });

    if (!student) {
      notFound();
    }

    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold">Student Details</h1>
        <StudentCard student={student} id={id} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching student:', error);
    notFound();
  }
}
