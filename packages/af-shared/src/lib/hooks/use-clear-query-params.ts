import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useClearQueryParams() {
  const router = useRouter();
  const { pathname, query } = router;

  /**
   * Clear query params, if query.clear is true
   */
  useEffect(() => {
    if (query.clear === 'true') {
      router.replace({
        pathname,
        query: {},
      });
    }
  }, [pathname, query, router]);
}
