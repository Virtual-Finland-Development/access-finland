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

  const errorResponse = (query.error as AxiosError)?.response;
  const errorCode = errorResponse?.status || undefined;
  const errorMsg = errorResponse?.statusText
    ? `Person basic information: ${errorResponse.statusText}`
    : undefined;

  return {
    ...query,
    errorCode,
    errorMsg,
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

  const errorResponse = (query.error as AxiosError)?.response;
  const errorCode = errorResponse?.status || undefined;
  const errorMsg = errorResponse?.statusText
    ? `Job applicant profile: ${errorResponse.statusText}`
    : undefined;

  return {
    ...query,
    errorCode,
    errorMsg,
  };
}

export { usePersonBasicInfo, useJobApplicantProfile };
