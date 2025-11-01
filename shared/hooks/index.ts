import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { PaginatedResponse } from '@/shared/types';

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Loading state hook
export function useLoadingState(initialState: boolean = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setErrorState = useCallback((errorMessage: string) => {
    setIsLoading(false);
    setIsError(true);
    setError(errorMessage);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
  }, []);

  return {
    isLoading,
    isError,
    error,
    startLoading,
    stopLoading,
    setErrorState,
    reset,
  };
}

// Pagination hook
export function usePagination(initialPage: number = 1, initialPageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  }, []);

  const updateFromResponse = useCallback((response: PaginatedResponse) => {
    setTotal(response.meta.total);
    setCurrentPage(response.meta.current_page);
    setPageSize(response.meta.per_page);
  }, []);

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    updateFromResponse,
    setTotal,
  };
}

// Previous route hook
export function usePreviousRoute() {
  const router = useRouter();
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);

  useEffect(() => {
    // Store current route as previous when component mounts
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setPreviousRoute(window.location.pathname);
    }, 0);
  }, []);

  const goBack = useCallback(() => {
    if (previousRoute) {
      router.push(previousRoute);
    } else {
      router.back();
    }
  }, [router, previousRoute]);

  return { previousRoute, goBack };
}

// Click outside hook
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
}

// Media query hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setMatches(media.matches);
    }, 0);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Copy to clipboard hook
export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setIsCopied(false);
      return false;
    }
  }, []);

  return { isCopied, copyToClipboard };
}

// Form validation hook
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback((field: keyof T) => {
    const value = values[field];
    const validator = validationRules[field];
    
    if (validator) {
      const error = validator(value);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
      return !error;
    }
    
    return true;
  }, [values, validationRules]);

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const validator = validationRules[field as keyof T];
      const value = values[field as keyof T];
      const error = validator(value);
      
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

// Hooks are already exported individually above