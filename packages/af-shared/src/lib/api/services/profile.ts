import {
  JobApplicantProfile,
  PersonBasicInformation,
  ProfileTosAgreement,
  ProfileTosAgreementWrite,
} from '@/types';
import { isExportedApplication } from '@/lib/utils';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';
import { utilizeDataProduct } from './dataspace';

/**
 * Use internal api routes for MVP app (!isExport).
 * API routes defined for MVP app in apps/af-mvp/src/pages/api.
 */
const isExport = isExportedApplication();

export async function getProfileTosAgreement(): Promise<ProfileTosAgreement> {
  const { data } = await apiClient.get('/api/users-api/terms-of-service', {
    csrfTokenRequired: true,
  });
  return data;
}

export async function saveProfileTosAgreement(
  payload: ProfileTosAgreementWrite
): Promise<ProfileTosAgreement> {
  const { data } = await apiClient.post(
    '/api/users-api/terms-of-service',
    payload,
    { csrfTokenRequired: true }
  );
  return data;
}

export async function getPersonBasicInfo(): Promise<PersonBasicInformation> {
  const method = isExport
    ? apiClient.get(
        `${TESTBED_API_BASE_URL}/testbed/productizer/person/basic-information`,
        { idTokenRequired: true }
      )
    : utilizeDataProduct('Person/BasicInformation');

  const { data } = await method;
  return data;
}

export async function savePersonBasicInfo(
  payload: PersonBasicInformation
): Promise<PersonBasicInformation> {
  const method = isExport
    ? apiClient.post(
        `${TESTBED_API_BASE_URL}/testbed/productizer/person/basic-information`,
        payload,
        { idTokenRequired: true }
      )
    : utilizeDataProduct('Person/BasicInformation/Write', payload);

  const { data } = await method;
  return data;
}

export async function getJobApplicantProfile(): Promise<JobApplicantProfile> {
  const method = isExport
    ? apiClient.get(
        `${TESTBED_API_BASE_URL}/testbed/productizer/person/job-applicant-information`,
        { idTokenRequired: true }
      )
    : utilizeDataProduct('Person/JobApplicantProfile');

  const { data } = await method;
  return data;
}

export async function saveJobApplicantProfile(
  payload: JobApplicantProfile
): Promise<JobApplicantProfile> {
  const method = isExport
    ? apiClient.post(
        `${TESTBED_API_BASE_URL}/testbed/productizer/person/job-applicant-information`,
        payload,
        { idTokenRequired: true }
      )
    : utilizeDataProduct('Person/JobApplicantProfile/Write', payload);

  const { data } = await method;
  return data;
}

export async function deleteProfile() {
  const url = isExport
    ? `${TESTBED_API_BASE_URL}/users-api/user`
    : `/api/users-api/user`;

  const { data } = await apiClient.delete(url, {
    idTokenRequired: isExport,
    csrfTokenRequired: !isExport,
  });
  return data;
}
