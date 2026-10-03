import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Custom hook that runs fetchFn immediately and then on a fixed interval.
 * Returns { data, loading, error, refresh }.
 * - loading is true ONLY on the very first call (no UI flicker on refresh).
 * - Cleans up the interval on unmount.
 */
export function usePolling(fetchFn, intervalMs = 3000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // true only on first load
  const [error, setError] = useState(null);

  const isMounted = useRef(true);
  const isFirstLoad = useRef(true);
  const intervalRef = useRef(null);

  // Stable reference to the latest fetchFn so the interval never gets stale
  const fetchFnRef = useRef(fetchFn);
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const run = useCallback(async () => {
    // Show spinner only on the very first call
    if (isFirstLoad.current) {
      setLoading(true);
    }

    try {
      const result = await fetchFnRef.current();
      if (!isMounted.current) return;
      setData(result);
      setError(null);
    } catch (err) {
      if (!isMounted.current) return;
      setError(err.message || "Unknown error");
    } finally {
      if (isMounted.current) {
        setLoading(false);
        isFirstLoad.current = false;
      }
    }
  }, []);

  // Run immediately, then on interval
  useEffect(() => {
    isMounted.current = true;
    run();
    intervalRef.current = setInterval(run, intervalMs);

    return () => {
      isMounted.current = false;
      clearInterval(intervalRef.current);
    };
  }, [run, intervalMs]);

  // refresh() triggers an immediate fetch AND resets the interval timer
  const refresh = useCallback(() => {
    clearInterval(intervalRef.current);
    run();
    intervalRef.current = setInterval(run, intervalMs);
  }, [run, intervalMs]);

  return { data, loading, error, refresh };
}
