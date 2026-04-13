'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import api from '@/src/api/axios';

interface DeleteCourseButtonProps {
    courseId: string;
}

export default function DeleteCourseButton({ courseId }: DeleteCourseButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this course? All related lessons and exams will be orphaned or deleted.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await api.delete(`/courses/${courseId}`);
            router.refresh();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete course');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn-secondary !border-rose-100 !text-rose-600 hover:!bg-rose-50 hover:!border-rose-200 !py-2 text-[10px] flex items-center justify-center gap-2"
            title="Delete Course"
        >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    );
}
