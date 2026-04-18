'use client';

import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function StudentDeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <Link
      href={`/teacher/students?deleteId=${id}`}
      className="inline-flex items-center justify-center w-12 h-12 bg-white hover:bg-rose-50 text-slate-300 hover:text-rose-500 border border-slate-100 hover:border-rose-100 rounded-2xl transition-all shadow-sm active:scale-90 group/btn"
      onClick={(e) => {
        if (!confirm(`Are you sure you want to delete student "${name}" and all their data? This action cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
    </Link>
  );
}
