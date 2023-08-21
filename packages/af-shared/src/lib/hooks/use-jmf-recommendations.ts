import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import useErrorToast from './use-error-toast';

interface LimitOptions {
  maxNumberOfSkills: number;
  maxNumberOfOccupations: number;
}

export default function useJmfRecommendations(
  content: string | null,
  limitOptions: LimitOptions
) {
  const query = useQuery(
    ['recommendations'],
    async () => {
      if (content) {
        return await api.jmf.getRecommendations({
          text: content,
          language: 'en',
          ...limitOptions,
        });
      }
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  // display error in toast, if any
  useErrorToast({
    title: 'Could not fetch recommendations',
    error: query.error,
  });

  // Remove the query from cache on unmount.
  useEffect(() => {
    return () => query.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return query;
}
