'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, ApiError, handleApiError } from '../api';
import type { ApiResponse } from '../api';

// Hook state interface
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
}

// Hook options interface
interface UseApiOptions<T = unknown> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

// Main useApi hook
export function useApi<T = unknown>(
  endpoint: string,
  options: UseApiOptions<T> = {}
) {
  const { immediate = false, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const execute = useCallback(async (customEndpoint?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response: ApiResponse<T> = await api.get(customEndpoint || endpoint);
      
      setState({
        data: response.data || null,
        loading: false,
        error: null,
        status: response.status,
      });
      
      if (onSuccess && response.data) {
        onSuccess(response.data);
      }
      
      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        status: error instanceof ApiError ? error.status : 0,
      });
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw error;
    }
  }, [endpoint, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      // Use a microtask to avoid synchronous setState calls in effects
      Promise.resolve().then(() => execute());
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    refetch: () => execute(),
  };
}

// Hook for POST requests
export function useApiPost<T = unknown, D = unknown>(
  endpoint: string,
  options: UseApiOptions<T> = {}
) {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const execute = useCallback(async (data: D, customEndpoint?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response: ApiResponse<T> = await api.post(customEndpoint || endpoint, data);
      
      setState({
        data: response.data || null,
        loading: false,
        error: null,
        status: response.status,
      });
      
      if (onSuccess && response.data) {
        onSuccess(response.data);
      }
      
      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        status: error instanceof ApiError ? error.status : 0,
      });
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw error;
    }
  }, [endpoint, onSuccess, onError]);

  return {
    ...state,
    execute,
  };
}

// Hook for PUT requests
export function useApiPut<T = unknown, D = unknown>(
  endpoint: string,
  options: UseApiOptions<T> = {}
) {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const execute = useCallback(async (data: D, customEndpoint?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response: ApiResponse<T> = await api.put(customEndpoint || endpoint, data);
      
      setState({
        data: response.data || null,
        loading: false,
        error: null,
        status: response.status,
      });
      
      if (onSuccess && response.data) {
        onSuccess(response.data);
      }
      
      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        status: error instanceof ApiError ? error.status : 0,
      });
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw error;
    }
  }, [endpoint, onSuccess, onError]);

  return {
    ...state,
    execute,
  };
}

// Hook for DELETE requests
export function useApiDelete<T = unknown>(
  endpoint: string,
  options: UseApiOptions<T> = {}
) {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const execute = useCallback(async (customEndpoint?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response: ApiResponse<T> = await api.delete(customEndpoint || endpoint);
      
      setState({
        data: response.data || null,
        loading: false,
        error: null,
        status: response.status,
      });
      
      if (onSuccess && response.data) {
        onSuccess(response.data);
      }
      
      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        status: error instanceof ApiError ? error.status : 0,
      });
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw error;
    }
  }, [endpoint, onSuccess, onError]);

  return {
    ...state,
    execute,
  };
}

// Hook for file uploads
export function useApiUpload<T = unknown>(
  endpoint: string,
  options: UseApiOptions<T> = {}
) {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    status: null,
  });

  const execute = useCallback(async (formData: FormData, customEndpoint?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response: ApiResponse<T> = await api.upload(customEndpoint || endpoint, formData);
      
      setState({
        data: response.data || null,
        loading: false,
        error: null,
        status: response.status,
      });
      
      if (onSuccess && response.data) {
        onSuccess(response.data);
      }
      
      return response;
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        status: error instanceof ApiError ? error.status : 0,
      });
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw error;
    }
  }, [endpoint, onSuccess, onError]);

  return {
    ...state,
    execute,
  };
}