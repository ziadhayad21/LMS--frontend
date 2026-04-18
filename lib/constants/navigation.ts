import { Layout, BookOpen, PlusCircle, Trophy, Users, Award } from 'lucide-react';

export const TEACHER_NAV_ITEMS = [
    { href: '/teacher/dashboard', icon: Layout, label: 'Dashboard' },
    { href: '/teacher/students', icon: Users, label: 'Students Management' },
    { href: '/teacher/tracking', icon: Award, label: 'Student Tracking' },
    { href: '/teacher/courses', icon: BookOpen, label: 'ALL Courses' },
    { href: '/teacher/exams', icon: Trophy, label: 'Manage Exams' },
];

export const STUDENT_NAV_ITEMS = [
    { href: '/student/dashboard', icon: Layout, label: 'Overview' },
    { href: '/student/courses', icon: BookOpen, label: 'My Learning' },
    { href: '/student/exams', icon: Trophy, label: 'Exam Lab' },
    { href: '/student/results', icon: Award, label: 'Success Board' },
];
