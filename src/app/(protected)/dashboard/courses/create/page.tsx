import CourseForm from '@/components/dashboard/course/create-edit-form';

export default async function CourseCreatePage() {
  return (
    <div className="container mx-auto py-10">
      <CourseForm />
    </div>
  );
}
