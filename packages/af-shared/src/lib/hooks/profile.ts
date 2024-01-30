import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../api';
import useErrorToast from './use-error-toast';
import { formatErrorResponse } from './utils';

export const PROFILE_TOS_AGREEMENT_QUERY_KEYS = ['profile-tos-agreement'];
export const BASIC_INFO_QUERY_KEYS = ['basic-information'];
export const JOB_APPLICATION_QUERY_KEYS = ['job-application-profile'];

const QUERY_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: false,
};

/**
 * Get profile TOS agreement status.
 */
function useProfileTosAgreement(enabled: boolean = true) {
  const query = useQuery(
    PROFILE_TOS_AGREEMENT_QUERY_KEYS,
    async () => await api.profile.getProfileTosAgreement(),
    { ...QUERY_OPTIONS, enabled }
  );

  useErrorToast({
    title: 'Could not fetch profile TOS agreement status',
    error:
      query.error && (query.error as AxiosError).response?.status !== 404
        ? query.error
        : undefined,
  });

  const formattedError = formatErrorResponse(
    query.error,
    'Profile TOS Agreement'
  );

  return {
    ...query,
    formattedError,
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

  const formattedError = formatErrorResponse(
    query.error,
    'Person basic information'
  );

  return {
    ...query,
    formattedError,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
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

  const formattedError = formatErrorResponse(
    query.error,
    'Job applicant profile'
  );

  return {
    ...query,
    formattedError,
    isLoading: query.isLoading && query.fetchStatus !== 'idle',
  };
}

export { useProfileTosAgreement, usePersonBasicInfo, useJobApplicantProfile };
