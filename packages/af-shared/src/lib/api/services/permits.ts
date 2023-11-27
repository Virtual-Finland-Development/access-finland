import { PersonWorkPermit } from '@/types';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';

export async function getPersonWorkPermits(
  consentToken?: string
): Promise<{ permits: PersonWorkPermit[] }> {
  const { data } = await apiClient.post(
    `${TESTBED_API_BASE_URL}/testbed/data-product/Permits/WorkPermit_v0.1?source=virtual_finland:development`,
    {},
    {
      headers: {
        'x-consent-token': consentToken,
      },
    }
  );
  return data;
}
