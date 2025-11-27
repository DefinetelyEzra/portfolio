'use client';

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: SetValue<T>) => void;
  removeValue: () => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for managing localStorage with TypeScript support
 * Provides error handling, loading states, and JSON serialization
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      if (globalThis.window === undefined) {
        setStoredValue(initialValue);
        setIsLoading(false);
        return;
      }

      const item = globalThis.localStorage.getItem(key);

      if (item === null) {
        setStoredValue(initialValue);
      } else {
        const parsedValue = JSON.parse(item);
        setStoredValue(parsedValue);
      }
    } catch (err) {
      console.error(`Error reading localStorage key "${key}":`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStoredValue(initialValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue]);

  // Update localStorage and state
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        setError(null);

        // Allow value to be a function so we have the same API as useState
        const valueToStore = typeof value === 'function'
          ? (value as (val: T) => T)(storedValue)
          : value;

        setStoredValue(valueToStore);

        // Save to localStorage
        if (globalThis.window !== undefined) {
          globalThis.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (err) {
        console.error(`Error setting localStorage key "${key}":`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage and reset to initial value
  const removeValue = useCallback(() => {
    try {
      setError(null);
      setStoredValue(initialValue);

      if (globalThis.window !== undefined) {
        globalThis.localStorage.removeItem(key);
      }
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
    error,
  };
}

/**
 * Hook for managing localStorage with automatic sync across tabs
 */
export function useLocalStorageSync<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const localStorage = useLocalStorage(key, initialValue);

  // Listen for storage events to sync across tabs
  useEffect(() => {
    if (globalThis.window === undefined) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          localStorage.setValue(newValue);
        } catch (error) {
          console.error('Error syncing localStorage change:', error);
        }
      }
    };

    globalThis.window.addEventListener('storage', handleStorageChange);

    return () => {
      globalThis.window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, localStorage]);

  return localStorage;
}

/**
 * Hook for managing localStorage with expiration
 */
export function useLocalStorageWithExpiry<T>(
  key: string,
  initialValue: T,
  expirationMs: number = 24 * 60 * 60 * 1000 // Default: 24 hours
): UseLocalStorageReturn<T> {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Read from localStorage with expiry check
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      if (globalThis.window === undefined) {
        setStoredValue(initialValue);
        setIsLoading(false);
        return;
      }

      const item = globalThis.localStorage.getItem(key);

      if (item === null) {
        setStoredValue(initialValue);
      } else {
        const { value, timestamp } = JSON.parse(item);
        const now = Date.now();

        if (now - timestamp > expirationMs) {
          // Expired, remove and use initial value
          globalThis.localStorage.removeItem(key);
          setStoredValue(initialValue);
        } else {
          setStoredValue(value);
        }
      }
    } catch (err) {
      console.error(`Error reading localStorage with expiry key "${key}":`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStoredValue(initialValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue, expirationMs]);

  // Update localStorage with timestamp
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        setError(null);

        const valueToStore = typeof value === 'function'
          ? (value as (val: T) => T)(storedValue)
          : value;

        setStoredValue(valueToStore);

        if (globalThis.window !== undefined) {
          const dataWithTimestamp = {
            value: valueToStore,
            timestamp: Date.now(),
          };
          globalThis.localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
        }
      } catch (err) {
        console.error(`Error setting localStorage with expiry key "${key}":`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setError(null);
      setStoredValue(initialValue);

      if (globalThis.window !== undefined) {
        globalThis.localStorage.removeItem(key);
      }
    } catch (err) {
      console.error(`Error removing localStorage with expiry key "${key}":`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
    error,
  };
}