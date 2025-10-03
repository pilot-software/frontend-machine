import {useCallback, useState} from 'react';

interface UseApiOptions {
  onError?: (error: string) => void;
}

export const useApi = <T = any>(options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    setStatusCode(null);

    try {
      const result = await apiCall();
      setData(result);
      setStatusCode(200);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setStatusCode(500);
      options.onError?.(errorMessage);

      // Don't throw auth errors, just log them
      if (errorMessage.includes('Authentication required') || errorMessage.includes('Service temporarily unavailable')) {
        console.log('API call failed:', errorMessage);
        return null;
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatusCode(null);
    setLoading(false);
  }, []);

  return { execute, loading, error, data, statusCode, reset };
};
