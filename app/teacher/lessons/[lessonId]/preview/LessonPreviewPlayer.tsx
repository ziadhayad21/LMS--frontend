'use client';

import { Play } from 'lucide-react';

export default function LessonPreviewPlayer({ lesson }: { lesson: any }) {
  const videoUrl = lesson?.videoUrl
    ? lesson.videoUrl
    : null;

  return (
    <div className="animate-fade-in text-left">
      <div className="flex-1 flex flex-col justify-center bg-black relative rounded-3xl overflow-hidden shadow-2xl">
        <div className="w-full aspect-video max-h-[70vh]">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/20 border border-white/5 bg-slate-900 p-12 text-center">
              <Play className="w-20 h-20 mb-6 opacity-10" />
              <p className="text-xl font-bold">No Video Uploaded</p>
              <p className="text-sm mt-2 opacity-50">Please add a video or URL to this lesson.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

