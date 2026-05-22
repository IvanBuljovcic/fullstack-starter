import { useCallback, useEffect, useRef, useState } from 'react';

export const useDebounce = <T>(data: T, delay: number = 500): T => {
  const [debouncedData, setDebouncedData] = useState<T>(data);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedData(data);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [data, delay]);

  return debouncedData;
};

export const useDebouncedCallback = <
  T extends (...args: Parameters<T>) => void
>(
  callback: T,
  delay: number = 500
) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
};
