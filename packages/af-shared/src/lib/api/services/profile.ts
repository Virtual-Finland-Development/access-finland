import { JobApplicantProfile, PersonBasicInformation } from '@/types';
import { isExportedApplication } from '@/lib/utils';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';
import { utilizeDataProduct } from './testbed-gw';

/**
 * Use internal api routes for MVP app (!isExport).
 * API routes defined for MVP app in apps/af-mvp/src/pages/api.
 */
const isExport = isExportedApplication();

export async function getPersonBasicInfo(): Promise<PersonBasicInformation> {
  const method = isExport
    ? apiClient.get(
        `${TESTBED_API_BASE_URL}/testbed/productizer/person/basic-information`
      )
    : utilizeDataProduct('draft/Person/BasicInformation');

  const { data } = await method;
  return data;
}

export async function savePersonBasicInfo(
  payload: PersonBasicInformation
): Promise<PersonBasicInformation> {
  const method = isExport
    ? apiClient.post(
        `${TESTBED_API_BASE_URL}/testbed/productizer/person/basic-information`,
        payload
      )
    : utilizeDataProduct('draft/Person/BasicInformation/Write', payload);

  const { data } = await method;
  return data;
}

export async function getJobApplicantProfile(): Promise<JobApplicantProfile> {
  const method = isExport
    ? apiClient.get(
        `${TESTBED_API_BASE_URL}/testbed/productizer/person/job-applicant-information`
      )
    : utilizeDataProduct('draft/Person/JobApplicantProfile');

  const { data } = await method;
  return data;
}

export async function saveJobApplicantProfile(
  payload: JobApplicantProfile
): Promise<JobApplicantProfile> {
  const method = isExport
    ? apiClient.post(
        `${TESTBED_API_BASE_URL}/testbed/productizer/person/job-applicant-information`,
        payload
      )
    : utilizeDataProduct('draft/Person/JobApplicantProfile/Write', payload);

  const { data } = await method;
  return data;
}

export async function deleteProfile() {
  const url = isExport
    ? `${TESTBED_API_BASE_URL}/users-api/user`
    : `/api/users-api`;

  const { data } = await apiClient.delete(url);
  return data;
}
