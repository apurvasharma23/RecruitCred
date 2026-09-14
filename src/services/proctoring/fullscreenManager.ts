/**
 * Fullscreen Manager Utility
 * 
 * Provides cross-browser, WebKit/Safari-compatible fullscreen management
 * and event listener bindings for secure examination environments.
 */

export function isBrowserFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
}

export function isFullscreenSupported(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );
}

export async function requestBrowserFullscreen(element?: HTMLElement): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  const el = element || document.documentElement;

  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen();
      return true;
    } else if ((el as any).webkitRequestFullscreen) {
      await (el as any).webkitRequestFullscreen();
      return true;
    } else if ((el as any).mozRequestFullScreen) {
      await (el as any).mozRequestFullScreen();
      return true;
    } else if ((el as any).msRequestFullscreen) {
      await (el as any).msRequestFullscreen();
      return true;
    }
  } catch (err) {
    console.warn('[FullscreenManager] requestFullscreen rejected by browser:', err);
  }

  return isBrowserFullscreen();
}

export async function exitBrowserFullscreen(): Promise<void> {
  if (typeof document === 'undefined') return;

  try {
    if (isBrowserFullscreen()) {
      if (document.exitFullscreen) {
        await document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen().catch(() => {});
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen().catch(() => {});
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen().catch(() => {});
      }
    }
  } catch (err) {
    console.warn('[FullscreenManager] exitFullscreen notice:', err);
  }
}

export function addFullscreenChangeListener(listener: () => void): () => void {
  if (typeof document === 'undefined') return () => {};

  document.addEventListener('fullscreenchange', listener);
  document.addEventListener('webkitfullscreenchange', listener);
  document.addEventListener('mozfullscreenchange', listener);
  document.addEventListener('MSFullscreenChange', listener);

  return () => {
    document.removeEventListener('fullscreenchange', listener);
    document.removeEventListener('webkitfullscreenchange', listener);
    document.removeEventListener('mozfullscreenchange', listener);
    document.removeEventListener('MSFullscreenChange', listener);
  };
}
