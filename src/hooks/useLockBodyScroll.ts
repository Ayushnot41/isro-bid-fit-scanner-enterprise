import { useEffect } from "react";

let activeLocksCount = 0;
let originalOverflow = "";
let originalPaddingRight = "";

/**
 * Robust Reference-Counted Body Scroll Lock Hook
 * Prevents background scroll when modals/drawers are open, while ensuring
 * document.body overflow is always cleanly restored when closed.
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    if (activeLocksCount === 0) {
      originalOverflow = document.body.style.overflow || "";
      originalPaddingRight = document.body.style.paddingRight || "";

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
    activeLocksCount++;

    return () => {
      activeLocksCount = Math.max(0, activeLocksCount - 1);
      if (activeLocksCount === 0) {
        document.body.style.overflow = originalOverflow || "";
        document.body.style.paddingRight = originalPaddingRight || "";
      }
    };
  }, [locked]);
}
