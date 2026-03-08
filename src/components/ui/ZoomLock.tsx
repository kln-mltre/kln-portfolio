"use client";

import { useEffect } from "react";

/**
 * Headless component that disables browser zoom across all input methods.
 * Preserves normal single-finger scrolling on touch devices.
 * Mounted once in the root layout to enforce a fixed-scale viewport.
 *
 * Returns:
 *   null — renders no DOM elements.
 */
export default function ZoomLock() {
  // Runs once on mount; empty dependency array since listeners are static for the session lifetime
  useEffect(() => {
    // Blocks multi-touch pinch-to-zoom while allowing single-finger scroll
    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Blocks Ctrl/Cmd + scroll wheel zoom on desktop
    const preventDesktopZoomWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // Blocks keyboard zoom shortcuts (Ctrl/Cmd + Plus/Minus/Zero)
    const preventDesktopZoomKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0' || e.key === '=')) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventPinchZoom, { passive: false });
    document.addEventListener("wheel", preventDesktopZoomWheel, { passive: false });
    document.addEventListener("keydown", preventDesktopZoomKeyboard);

    return () => {
      document.removeEventListener("touchmove", preventPinchZoom);
      document.removeEventListener("wheel", preventDesktopZoomWheel);
      document.removeEventListener("keydown", preventDesktopZoomKeyboard);
    };
  }, []);

  return null;
}