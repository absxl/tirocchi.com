"use client";

import { useCallback, useSyncExternalStore } from "react";

/** True when the page has been scrolled past `fraction` of the viewport height. */
export function useScrolledPast(fraction: number): boolean {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("scroll", callback, { passive: true });
    window.addEventListener("resize", callback);
    return () => {
      window.removeEventListener("scroll", callback);
      window.removeEventListener("resize", callback);
    };
  }, []);

  const getSnapshot = useCallback(
    () => window.scrollY > window.innerHeight * fraction,
    [fraction]
  );

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
