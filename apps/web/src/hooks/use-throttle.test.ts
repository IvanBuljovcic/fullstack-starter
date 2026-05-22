import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useThrottle } from './use-throttle';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic functionality', () => {
    it('should call callback immediately on first invocation', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useThrottle(callback, 1000));

      result.current();

      expect(callback).toHaveBeenCalledOnce();
    });

    it('should throttle subsequente calls within the limit', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useThrottle(callback, 1000));

      // First call
      result.current();
      expect(callback).toHaveBeenCalledTimes(1);

      // Advance timer by 500ms - Should NOT execute callback
      vi.advanceTimersByTime(500);
      result.current();
      expect(callback).toHaveBeenCalledTimes(1);

      // Advance by 499ms, still within limit - Should NOT execute callback
      vi.advanceTimersByTime(499);
      result.current();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should allow call after throttle limit has passed', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useThrottle(callback, 1000));

      // First call
      result.current();
      expect(callback).toHaveBeenCalledTimes(1);

      // Advance timer by 1000ms - Should execute callback
      vi.advanceTimersByTime(1000);
      result.current();
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('Argument handling', () => {
    it('should pass arguments to callback', () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        useThrottle((a: string, b: number) => callback(a, b), 1000)
      );

      result.current('test', 42);

      expect(callback).toHaveBeenCalledWith('test', 42);
    });

    it('should pass arguments from latest allowed call', () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        useThrottle((value: string) => callback(value), 1000)
      );

      // First call with "first"
      result.current('first');
      expect(callback).toHaveBeenCalledWith('first');

      // Second call within limit (throttled)
      vi.advanceTimersByTime(500);
      result.current('second');
      expect(callback).toHaveBeenCalledOnce();

      // Third call after limit passes
      vi.advanceTimersByTime(500);
      result.current('third');
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('third');
    });
  });

  describe('Different throttle limits', () => {
    it('should work with short throttle limit', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useThrottle(() => callback(), 10));

      result.current();
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(5);
      result.current();
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(5);
      result.current();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should work with longer throttle limit', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useThrottle(() => callback(), 5000));

      result.current();
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(4999);
      result.current();
      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1);
      result.current();
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('Multiple rapid calls', () => {
    it('should only execute first and post-throttle calls', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useThrottle(() => callback(), 1000));

      result.current();
      result.current();
      result.current();
      result.current();
      result.current();

      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      result.current();
      result.current();
      result.current();
      result.current();

      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('Hook updates', () => {
    it('should update when callback changes', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const { result, rerender } = renderHook(
        ({ cb }) => useThrottle(cb, 1000),
        { initialProps: { cb: callback1 } }
      );

      result.current();
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(0);

      rerender({ cb: callback2 });
      vi.advanceTimersByTime(1000);
      result.current();

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should update when limit changes', () => {
      const callback = vi.fn();
      const { result, rerender } = renderHook(
        ({ limit }) => useThrottle(callback, limit),
        {
          initialProps: { limit: 1000 },
        }
      );

      result.current();
      expect(callback).toHaveBeenCalledTimes(1);

      rerender({ limit: 500 });

      vi.advanceTimersByTime(500);
      result.current();

      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('Real-world use cases', () => {
    it('should throttle window resize events', () => {
      const handleResize = vi.fn();
      const { result } = renderHook(() => useThrottle(handleResize, 200));

      // Simulate rapid resize events
      for (let i = 0; i < 10; i++) {
        result.current();
        vi.advanceTimersByTime(50);
      }

      // Should have called multiple times (every 200ms);
      // 0ms, 200ms, 400ms = 3 calls
      expect(handleResize).toHaveBeenCalledTimes(3);
    });

    it('should throttle scroll events', () => {
      const handleScroll = vi.fn();
      const { result } = renderHook(() => useThrottle(handleScroll, 100));

      result.current(0);
      expect(handleScroll).toHaveBeenCalledWith(0);

      vi.advanceTimersByTime(50);
      result.current(100);
      expect(handleScroll).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(50);
      result.current(200);
      expect(handleScroll).toHaveBeenCalledTimes(2);
      expect(handleScroll).toHaveBeenCalledWith(200);
    });

    it('should throttle API calls', () => {
      const apiCall = vi.fn((_: string) => Promise.resolve({ results: [] }));
      const { result } = renderHook(() => useThrottle(apiCall, 500));

      // User types quickly
      result.current('a');
      result.current('ab');
      result.current('abc');

      expect(apiCall).toHaveBeenCalledTimes(1);
      expect(apiCall).toHaveBeenCalledWith('a');

      vi.advanceTimersByTime(500);
      result.current('abcd');

      expect(apiCall).toHaveBeenCalledTimes(2);
      expect(apiCall).toHaveBeenLastCalledWith('abcd');
    });
  });
});
