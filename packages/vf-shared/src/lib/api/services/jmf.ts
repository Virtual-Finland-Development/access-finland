import type {
  JmfRecommendationsRequestPayload,
  JmfRecommendationsResponse,
} from '@/types';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';

export async function getRecommendations(
  payload: JmfRecommendationsRequestPayload
): Promise<JmfRecommendationsResponse> {
  const { data } = await apiClient.post(
    `${TESTBED_API_BASE_URL}/jmf/recommendations`,
    payload
  );
  return data;
}
