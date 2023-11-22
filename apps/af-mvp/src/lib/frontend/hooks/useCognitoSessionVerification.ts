import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiClient from '@shared/lib/api/api-client';
import { isWafProtected } from '@shared/lib/utils';

export default function useCognitoSessionVerification() {
  const [cognitoChecked, setCognitoChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function verifyCognitoSession() {
      if (!cognitoChecked) {
        setCognitoChecked(true);

        try {
          // Check if waf-cognito frontend cookie present and valid
          await apiClient.get('/api/auth/cognito/verify');
        } catch (error) {
          // If not, reload and let the WAF take care of the rest
          router.reload();
        }
      }
    }

    if (isWafProtected()) {
      verifyCognitoSession();
    }
  }, [cognitoChecked, setCognitoChecked, router]);
}
