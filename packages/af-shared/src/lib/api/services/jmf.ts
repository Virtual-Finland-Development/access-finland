import type {
  JmfRecommendationsRequestPayload,
  JmfRecommendationsResponse,
} from '@/types';
import { isExportedApplication } from '@/lib/utils';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';

const isExport = isExportedApplication();

export async function getRecommendations(
  payload: JmfRecommendationsRequestPayload
): Promise<JmfRecommendationsResponse> {
  const url = isExport
    ? `${TESTBED_API_BASE_URL}/jmf/recommendations`
    : `/api/jmf/recommendations`;

  const { data } = await apiClient.post(url, payload, {
    csrfTokenRequired: !isExport,
    isTraceable: !isExport,
  });
  return data;
}
