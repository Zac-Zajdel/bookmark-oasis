import { useEffect, useRef } from 'react';

/**
 * useDebounce - Custom hook to debounce a function call
 * @param func - The function to debounce
 * @param delay - Delay in milliseconds
 */
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
) {
  const functionTimeoutHandler = useRef<number | null>(null);

  const debouncedFunction = (...args: Parameters<T>) => {
    if (functionTimeoutHandler.current) {
      clearTimeout(functionTimeoutHandler.current);
    }

    functionTimeoutHandler.current = window.setTimeout(() => {
      func(...args);
    }, delay);
  };

  // Clean up the timeout when the component unmounts or when `delay`/`func` changes
  useEffect(() => {
    return () => {
      if (functionTimeoutHandler.current) {
        clearTimeout(functionTimeoutHandler.current);
      }
    };
  }, [func, delay]);

  return debouncedFunction;
}
