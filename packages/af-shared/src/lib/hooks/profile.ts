import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../api';
import useErrorToast from './use-error-toast';

export const BASIC_INFO_QUERY_KEYS = ['basic-information'];
export const JOB_APPLICATION_QUERY_KEYS = ['job-application-profile'];

const QUERY_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: false,
};

function formatErrorResponse(
  error: AxiosError | undefined,
  messagePrefix: string
) {
  const errorResponse = error?.response;

  if (!errorResponse || !errorResponse.data) {
    return undefined;
  }

  const statusCode = errorResponse.status;
  const message = `${messagePrefix}: ${
    errorResponse.statusText || 'something went wrong'
  }`;

  return {
    statusCode,
    message,
    shouldPrintError: statusCode !== 404,
  };
}

/**
 * Get person basic information.
 */
function usePersonBasicInfo(enabled: boolean = true) {
  const query = useQuery(
    BASIC_INFO_QUERY_KEYS,
    async () => await api.profile.getPersonBasicInfo(),
    { ...QUERY_OPTIONS, enabled }
  );

  useErrorToast({
    title: 'Could not fetch person basic information',
    error:
      query.error && (query.error as AxiosError).response?.status !== 404
        ? query.error
        : undefined,
  });

  const errorResponse = formatErrorResponse(
    query.error as AxiosError,
    'Person basic information'
  );

  return {
    ...query,
    errorResponse,
  };
}

/**
 * Get person job applicant profile.
 */
function useJobApplicantProfile(enabled: boolean = true) {
  const query = useQuery(
    JOB_APPLICATION_QUERY_KEYS,
    async () => await api.profile.getJobApplicantProfile(),
    { ...QUERY_OPTIONS, enabled }
  );

  useErrorToast({
    title: 'Could not fetch person job application profile.',
    error:
      query.error && (query.error as AxiosError).response?.status !== 404
        ? query.error
        : undefined,
  });

  const errorResponse = formatErrorResponse(
    query.error as AxiosError,
    'Job applicant profile'
  );

  return {
    ...query,
    errorResponse,
  };
}

export { usePersonBasicInfo, useJobApplicantProfile };
