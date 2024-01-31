import { AxiosError } from 'axios';
import { ConsentSituation } from '@/types';
import { generateAppContextHash } from '@/lib/utils';
import apiClient from '../api-client';
import { AUTH_GW_BASE_URL } from '../endpoints';

/**
 *
 * @param dataSources, list of data sources to check consent for
 * consentToken, if provided the consent token is verified, otherwise a new consent token is requested from the testbed consent api
 */
export async function checkConsent(
  dataSources: { uri: string; consentToken?: string | null }[]
): Promise<ConsentSituation[]> {
  try {
    const response = await apiClient.post(
      `${AUTH_GW_BASE_URL}/consents/testbed/consent-check`,
      JSON.stringify({
        appContext: generateAppContextHash(),
        dataSources,
      }),
      {
        idTokenRequired: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200 || !(response.data instanceof Array)) {
      throw new Error('Invalid consent data response');
    }

    const consentSituations = response.data;

    const invalidResponse = consentSituations.some(
      (situation: { dataSource: string }) =>
        !dataSources.some(dataSource => dataSource.uri === situation.dataSource)
    );

    if (invalidResponse) {
      throw new Error('Invalid consent data response');
    }

    return consentSituations;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new AxiosError(error.message);
  }
}

export function directToConsentService(consentSituation: ConsentSituation) {
  if (!consentSituation.redirectUrl) {
    throw new Error('Invalid consent situation');
  }

  const redirectBackUrl = new URL(window.location.href);
  redirectBackUrl.searchParams.set('clear', 'true'); // Applies an url param cleanup after consent flow

  const redirectToServiceUrl = new URL(consentSituation.redirectUrl);
  redirectToServiceUrl.searchParams.set(
    'appContext',
    generateAppContextHash({ redirectUrl: redirectBackUrl })
  );

  window.location.assign(redirectToServiceUrl);
}
