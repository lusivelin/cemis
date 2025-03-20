import StudentForm from "@/components/dashboard/student/create-edit-form";

export default async function StudentCreatePage() {
  return (
    <div className="container mx-auto py-10">
      <StudentForm />
    </div>
  );
}
