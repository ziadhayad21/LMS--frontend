'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function isAllowedPdfUrl(url: string) {
  // Only allow same-origin proxied paths
  return url.startsWith('/uploads/') || url.startsWith('/api/v1/');
}

/** Inner component — useSearchParams must live here, inside a Suspense boundary */
function PdfViewerInner() {
  const params = useSearchParams();
  const router = useRouter();
  const url = params.get('url') || '';
  const title = params.get('title') || 'PDF Viewer';

  const pdfUrl = useMemo(() => (isAllowedPdfUrl(url) ? url : ''), [url]);
  const [headOk, setHeadOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (!pdfUrl) {
      setHeadOk(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(pdfUrl, { method: 'HEAD', credentials: 'include' });
        if (cancelled) return;
        setHeadOk(res.ok);
      } catch {
        if (cancelled) return;
        setHeadOk(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-fade-in pb-12">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button onClick={() => router.back()} className="btn-secondary">
          ← Back
        </button>
        <div className="min-w-0">
          <h1 className="page-title truncate">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            If the PDF doesn't load, use the download button.
          </p>
        </div>
        {pdfUrl ? (
          <a className="btn-primary" href={pdfUrl} download>
            Download PDF
          </a>
        ) : null}
      </div>

      <div className="card overflow-hidden">
        {!pdfUrl || headOk === false ? (
          <div className="p-8 text-center">
            <p className="text-slate-700 font-semibold">Unable to display this PDF.</p>
            {pdfUrl ? (
              <p className="text-sm text-slate-500 mt-2">
                Try downloading it instead.
              </p>
            ) : (
              <p className="text-sm text-slate-500 mt-2">Invalid PDF URL.</p>
            )}
          </div>
        ) : (
          <iframe
            title={title}
            src={pdfUrl}
            className="w-full"
            style={{ height: '75vh' }}
          />
        )}
      </div>
    </div>
  );
}

/** Outer shell — wraps PdfViewerInner in Suspense so useSearchParams is safe */
export default function PdfViewerClient() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto p-8">
          <div className="card p-8 text-center text-slate-500">Loading PDF…</div>
        </div>
      }
    >
      <PdfViewerInner />
    </Suspense>
  );
}

