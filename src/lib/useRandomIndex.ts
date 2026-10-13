"use client";

import { useCallback, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const cache = new Map<string, number>();

/**
 * Random index in [0, count) that is stable for the session but different per
 * visit. Server snapshot is 0 so hydration matches; React swaps right after.
 */
export function useRandomIndex(count: number, key = "default"): number {
  const getSnapshot = useCallback(() => {
    const cacheKey = `${key}:${count}`;
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return cached;
    const value = Math.floor(Math.random() * Math.max(1, count));
    cache.set(cacheKey, value);
    return value;
  }, [count, key]);

  const getServerSnapshot = useCallback(() => 0, []);

  return useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshot);
}
