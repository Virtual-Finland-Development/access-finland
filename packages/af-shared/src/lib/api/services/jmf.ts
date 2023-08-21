import { isExportedApplication } from '@/lib/utils';
import type {
  JmfRecommendationsRequestPayload,
  JmfRecommendationsResponse,
} from '@/types';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';

export async function getRecommendations(
  payload: JmfRecommendationsRequestPayload
): Promise<JmfRecommendationsResponse> {

  const url = isExportedApplication()
  ? `${TESTBED_API_BASE_URL}/jmf/recommendations`
  : `/api/jmf/recommendations`;

  const { data } = await apiClient.post(
    url,
    payload
  );
  return data;
}