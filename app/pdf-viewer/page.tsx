import { Suspense } from 'react';
import PdfViewerClient from './PdfViewerClient';

export default function PdfViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto p-8">
          <div className="card p-8 text-center text-slate-500">Loading PDF…</div>
        </div>
      }
    >
      <PdfViewerClient />
    </Suspense>
  );
}

