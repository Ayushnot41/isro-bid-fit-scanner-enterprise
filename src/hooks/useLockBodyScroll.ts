import { useEffect } from "react";

export function useLockBodyScroll(lock: boolean = true) {
  useEffect(() => {
    if (!lock || typeof window === "undefined" || typeof document === "undefined" || !document.body) {
      return;
    }

    try {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        if (typeof document !== "undefined" && document.body) {
          document.body.style.overflow = originalStyle || "";
        }
      };
    } catch {
      // Safe fallback
    }
  }, [lock]);
}
