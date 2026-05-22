import { useEffect, useReducer, useRef } from 'react';
import type { HttpMethod } from '@/types/http-method';

type FetchState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

type FetchProps = {
  url: string;
  method?: HttpMethod;
  onSuccess?: <T>(data: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
};

const fetchActions = {
  start: 'FETCH_START',
  success: 'FETCH_SUCCESS',
  error: 'FETCH_ERROR',
} as const;

type FetchActions<T> =
  | { type: typeof fetchActions.start }
  | { type: typeof fetchActions.success; payload: T }
  | { type: typeof fetchActions.error; payload: Error };

const fetchReducer = <T>(
  state: FetchState<T>,
  action: FetchActions<T>
): FetchState<T> => {
  switch (action.type) {
    case fetchActions.start:
      return { data: null, error: null, loading: true };
    case fetchActions.success:
      return { data: action.payload, error: null, loading: false };
    case fetchActions.error:
      return { data: null, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const useFetchWithReducer = <T>({
  url,
  method = 'GET',
  onSuccess,
  onError,
  onFinally,
}: FetchProps): FetchState<T> => {
  const [state, dispatch] = useReducer(fetchReducer<T>, {
    data: null,
    error: null,
    loading: true,
  });

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onFinallyRef = useRef(onFinally);

  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;
  onFinallyRef.current = onFinally;

  useEffect(() => {
    const abortController = new AbortController();

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
        dispatch({ type: fetchActions.success, payload: data });
        onSuccessRef.current?.(data);
      })
      .catch((error: Error) => {
        if (error.name === 'AbortError') {
          return;
        }

        dispatch({ type: fetchActions.error, payload: error });
        onErrorRef.current?.(error);
      })
      .finally(() => {
        onFinallyRef.current?.();
      });

    return () => abortController.abort();
  }, [url, method]);

  return state;
};
