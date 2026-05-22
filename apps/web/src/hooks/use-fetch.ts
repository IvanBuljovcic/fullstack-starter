import { useEffect, useRef, useState } from 'react';

type FetchState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

type FetchProps = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  onSuccess?: <T>(data: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
};

export const useFetch = <T>({
  url,
  method = 'GET',
  onSuccess,
  onError,
  onFinally,
}: FetchProps): FetchState<T> => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onFinallyRef = useRef(onFinally);

  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;
  onFinallyRef.current = onFinally;

  useEffect(() => {
    const abortController = new AbortController();

    setState({ data: null, error: null, loading: true });

    fetch(url, {
      method,
      signal: abortController.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((data: T) => {
        setState({ data, error: null, loading: false });
        onSuccessRef.current?.(data);
      })
      .catch((error: Error) => {
        if (error.name === 'AbortError') {
          return;
        }

        setState({ data: null, error, loading: false });
        onErrorRef.current?.(error);
      })
      .finally(() => {
        onFinallyRef.current?.();
      });

    return () => abortController.abort();
  }, [url, method]);

  return state;
};
