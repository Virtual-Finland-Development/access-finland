import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { useToast } from '@/context/toast-context';

export default function useErrorToast({
  title = 'Error',
  error,
}: {
  title: string;
  error: unknown;
}) {
  const toast = useToast();

  useEffect(() => {
    if (error) {
      const description =
        error instanceof AxiosError ? error.message : 'Something went wrong.';

      toast({
        status: 'error',
        title,
        content: description,
      });
    }
  }, [error, title, toast]);

  return null;
}
