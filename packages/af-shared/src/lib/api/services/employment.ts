import { IncomeTax, WorkContract } from '@/types';
import { MOCK_WORK_CONTRACT } from '@/lib/testing/mocks/mock-values';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export async function getPersonWorkContracts(
  consentToken?: string
): Promise<WorkContract> {
  // TODO: Wait for testbed-api implementation

  /* const { data } = await apiClient.post(
    `${TESTBED_API_BASE_URL}/testbed/data-product/Employment/WorkContract_v0.1?source=`,
    {},
    {
      headers: {
        'x-consent-token': consentToken,
      },
    }
  );
  return data; */

  await sleep();
  return MOCK_WORK_CONTRACT as WorkContract;
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
