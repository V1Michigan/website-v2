"use client";

import { useEffect } from "react";

const VIEWPORT_HEIGHT_PROPERTY = "--join-v1-viewport-height";

export default function JoinViewportStability() {
  useEffect(() => {
    const root = document.documentElement;
    const previousValue = root.style.getPropertyValue(VIEWPORT_HEIGHT_PROPERTY);
    let layoutWidth = window.innerWidth;
    let orientationTimer: ReturnType<typeof setTimeout> | undefined;

    const setStableViewportHeight = () => {
      layoutWidth = window.innerWidth;
      root.style.setProperty(VIEWPORT_HEIGHT_PROPERTY, `${window.innerHeight}px`);
    };

    const handleResize = () => {
      // Mobile keyboards and browser chrome resize only the viewport height.
      // Keep the page geometry stable unless the device orientation actually changes.
      if (Math.abs(window.innerWidth - layoutWidth) > 1) {
        setStableViewportHeight();
      }
    };

    const handleOrientationChange = () => {
      clearTimeout(orientationTimer);
      orientationTimer = setTimeout(setStableViewportHeight, 250);
    };

    const keepFocusedFieldVisible = () => {
      const activeElement = document.activeElement;

      if (activeElement instanceof HTMLElement && activeElement.closest(".join-v1-form")) {
        requestAnimationFrame(() => {
          activeElement.scrollIntoView({ block: "center", behavior: "auto" });
        });
      }
    };

    setStableViewportHeight();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    window.visualViewport?.addEventListener("resize", keepFocusedFieldVisible);

    return () => {
      clearTimeout(orientationTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.visualViewport?.removeEventListener("resize", keepFocusedFieldVisible);

      if (previousValue) {
        root.style.setProperty(VIEWPORT_HEIGHT_PROPERTY, previousValue);
      } else {
        root.style.removeProperty(VIEWPORT_HEIGHT_PROPERTY);
      }
    };
  }, []);

  return null;
}
