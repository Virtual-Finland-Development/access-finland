import { JobApplicantProfile, PersonBasicInformation } from '@/types';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';

export async function getPersonBasicInfo(): Promise<PersonBasicInformation> {
  const { data } = await apiClient.get(
    `${TESTBED_API_BASE_URL}/testbed/productizer/person/basic-information`
  );
  return data;
}

export async function savePersonBasicInfo(
  payload: PersonBasicInformation
): Promise<PersonBasicInformation> {
  const { data } = await apiClient.post(
    `${TESTBED_API_BASE_URL}/testbed/productizer/person/basic-information`,
    payload
  );
  return data;
}

export async function getJobApplicantProfile(): Promise<JobApplicantProfile> {
  const { data } = await apiClient.get(
    `${TESTBED_API_BASE_URL}/testbed/productizer/person/job-applicant-information`
  );
  return data;
}

export async function saveJobApplicantProfile(
  payload: JobApplicantProfile
): Promise<JobApplicantProfile> {
  const { data } = await apiClient.post(
    `${TESTBED_API_BASE_URL}/testbed/productizer/person/job-applicant-information`,
    payload
  );
  return data;
}

export async function deleteProfile() {
  const { data } = await apiClient.delete(
    `${TESTBED_API_BASE_URL}/users-api/user`
  );
  return data;
}
