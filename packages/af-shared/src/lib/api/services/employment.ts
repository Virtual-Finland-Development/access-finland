import { IncomeTax, WorkContract } from '@/types';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';

export async function getPersonWorkContracts(
  consentToken?: string
): Promise<WorkContract> {
  const { data } = await apiClient.post(
    `${TESTBED_API_BASE_URL}/testbed/data-product/Employment/WorkContract_v0.3?source=staffpoint_demo`,
    {},
    {
      headers: {
        'x-consent-token': consentToken,
      },
    }
  );
  return data;
}

export async function getPersonIncomeTax(
  consentToken?: string
): Promise<IncomeTax> {
  const { data } = await apiClient.post(
    `${TESTBED_API_BASE_URL}/testbed/data-product/Employment/IncomeTax_v0.2?source=vero_demo`,
    {},
    {
      headers: {
        'x-consent-token': consentToken,
      },
    }
  );
  return data;
}
