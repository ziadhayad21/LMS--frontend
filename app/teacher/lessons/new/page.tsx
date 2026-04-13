import { redirect } from 'next/navigation';

/**
 * Lessons cannot be created without a course.
 * Redirect teachers to the courses page where they can select
 * a course and add lessons from within it.
 */
export default function NewLessonRedirectPage() {
  redirect('/teacher/courses');
}
