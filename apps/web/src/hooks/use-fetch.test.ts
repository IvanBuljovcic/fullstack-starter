import { beforeEach } from 'node:test';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFetch } from './use-fetch';

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful fetch', async () => {
    const responseData = { id: 1, name: 'test' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => responseData,
    });

    const { result } = renderHook(() => useFetch({ url: '/api/test' }));

    // Initial state
    expect(result.current.loading).toBeTruthy();
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    // Wait for feth to complete
    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
    });

    expect(result.current.data).toEqual(responseData);
    expect(result.current.error).toBeNull();
  });
});
