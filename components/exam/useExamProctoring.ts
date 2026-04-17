import { useEffect, useMemo, useState } from 'react';

type ProctoringOptions = {
  enabled?: boolean;
  requireFullscreen?: boolean;
  onViolation?: (v: { type: string; detail?: string }) => void;
};

export function useExamProctoring(options: ProctoringOptions = {}) {
  const {
    enabled = true,
    requireFullscreen = true,
    onViolation,
  } = options;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [blurCount, setBlurCount] = useState(0);
  const [visibilityChangeCount, setVisibilityChangeCount] = useState(0);
  const [copyBlockedCount, setCopyBlockedCount] = useState(0);
  const [contextMenuBlockedCount, setContextMenuBlockedCount] = useState(0);

  const isSupported = useMemo(() => {
    if (typeof document === 'undefined') return false;
    return !!document.documentElement?.requestFullscreen;
  }, []);

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const onFsChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (requireFullscreen && !fs) {
        onViolation?.({ type: 'fullscreen_exit' });
      }
    };

    const onVisibility = () => {
      if (document.visibilityState !== 'visible') {
        setVisibilityChangeCount((c) => c + 1);
        onViolation?.({ type: 'tab_hidden' });
      }
    };

    const onBlur = () => {
      setBlurCount((c) => c + 1);
      onViolation?.({ type: 'window_blur' });
    };

    const onContextMenu = (e: Event) => {
      e.preventDefault();
      setContextMenuBlockedCount((c) => c + 1);
      onViolation?.({ type: 'context_menu' });
    };

    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setCopyBlockedCount((c) => c + 1);
      onViolation?.({ type: 'copy' });
    };

    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    window.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('copy', onCopy);

    // initial state
    onFsChange();

    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('copy', onCopy);
    };
  }, [enabled, requireFullscreen, onViolation]);

  const requestFullscreen = async () => {
    if (!enabled || !requireFullscreen) return;
    if (typeof document === 'undefined') return;
    const el = document.documentElement;
    if (!el?.requestFullscreen) return;
    await el.requestFullscreen();
  };

  return {
    isSupported,
    isFullscreen,
    requestFullscreen,
    blurCount,
    visibilityChangeCount,
    copyBlockedCount,
    contextMenuBlockedCount,
  };
}

