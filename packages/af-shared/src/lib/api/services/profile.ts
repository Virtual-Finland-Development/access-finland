import {
  JobApplicantProfile,
  PersonBasicInformation,
  ProfileTosAgreement,
} from '@/types';
import { isExportedApplication } from '@/lib/utils';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';
import { utilizeDataProduct } from './testbed-gw';

/**
 * Use internal api routes for MVP app (!isExport).
 * API routes defined for MVP app in apps/af-mvp/src/pages/api.
 */
const isExport = isExportedApplication();

const DUMMY_TOS_AGREEMENT = {
  termsOfServiceUrl: '',
  description: '',
  version: '',
  accepted: false,
  acceptedAt: '',
  acceptedPreviousVersion: false,
};

export async function getProfileTosAgreement(): Promise<ProfileTosAgreement> {
  // for Featarues app, provide dummy data
  if (isExport) {
    return Promise.resolve(DUMMY_TOS_AGREEMENT);
  }
  /* const { data } = await utilizeDataProduct(
    'test/lsipii/Service/Terms/Agreement'
  ); */
  const savedAgreement = localStorage.getItem('profileTosAgreement');
  const data = savedAgreement
    ? JSON.parse(savedAgreement)
    : DUMMY_TOS_AGREEMENT;

  return new Promise(resolve => {
    setTimeout(() => resolve(data), 2000);
  });
}

export async function saveProfileTosAgreement(): Promise<ProfileTosAgreement> {
  /* const { data } = await utilizeDataProduct(
    'test/lsipii/Service/Terms/Agreement/Write'
  ); */

  const agreement = {
    ...DUMMY_TOS_AGREEMENT,
    accepted: true,
    acceptedPreviousVersion: true,
  };

  localStorage.setItem('profileTosAgreement', JSON.stringify(agreement));

  return new Promise(resolve => {
    setTimeout(() => resolve(agreement), 2000);
  });
}

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
