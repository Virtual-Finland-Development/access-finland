import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useToast } from '@/context/toast-context';

// Display error message and clear query params, if api route returns sinuna error (af-mvp only)
// apps/af-mvp/src/pages/api/auth/login.route.ts
export default function useDisplaySinunaError(isMvpApp: boolean) {
  const router = useRouter();
  const { pathname, query } = router;
  const toast = useToast();

  useEffect(() => {
    if (isMvpApp && typeof query.sinunaError === 'string') {
      toast({
        title: 'Error',
        status: 'error',
        content: query.sinunaError,
      });
      router.replace({
        pathname,
        query: {},
      });
    }
  }, [isMvpApp, pathname, query.sinunaError, router, toast]);
}
