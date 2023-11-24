import { PersonWorkPermit } from '@/types';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

const MOCK_DATA: PersonWorkPermit[] = [
  {
    permitName: 'Seasonal work certificate',
    permitAccepted: true,
    permitType: 'A',
    validityStart: '2023-11-07',
    validityEnd: '2024-02-19',
    industries: ['79.1', '79.9'],
    employerName: 'Staffpoint Oy',
  },
  {
    permitName: 'First residence permit',
    permitAccepted: false,
    permitType: 'B',
    validityStart: '',
    validityEnd: '',
    industries: ['89.1', '89.9'],
    employerName: 'Staffpoint Oy',
  },
];

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
