import { IncomeTax, WorkContract } from '@/types';
import {
  MOCK_TAX_INCOME,
  MOCK_WORK_CONTRACTS,
} from '@/lib/testing/mocks/mock-values';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export async function getPersonWorkContracts(): Promise<WorkContract[]> {
  // TODO: Wait for testbed-api implementation

  /* const { data } = await apiClient.get(
    `${TESTBED_API_BASE_URL}/testbed/productizer/employment/income-tax`
  );
  return data; */
  await sleep();
  return MOCK_WORK_CONTRACTS as WorkContract[];
}

export async function getPersonIncomeTax(): Promise<IncomeTax> {
  // TODO: Wait for testbed-api implementation

  /* const { data } = await apiClient.get(
    `${TESTBED_API_BASE_URL}/testbed/productizer/employment/income-tax`
  );
  return data; */
  await sleep();
  return MOCK_TAX_INCOME as IncomeTax;
}
