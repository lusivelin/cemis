export function formatTeacherName(course: {
  teacherFirstName?: string | null;
  teacherLastName?: string | null;
  teacherDisplayName?: string | null;
}) {
  if (course.teacherDisplayName) {
    return course.teacherDisplayName;
  } else if (course.teacherFirstName && course.teacherLastName) {
    return `${course.teacherFirstName} ${course.teacherLastName}`;
  } else {
    return 'No teacher assigned';
  }
}
