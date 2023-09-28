import {
  JobApplicantProfileSchema,
  PersonBasicInformationSchema,
} from './profile';

export const DataProductShemas = {
  'Person/BasicInformation': PersonBasicInformationSchema,
  'Person/BasicInformation/Write': PersonBasicInformationSchema,
  'Person/JobApplicantProfile': JobApplicantProfileSchema,
  'Person/JobApplicantProfile/Write': JobApplicantProfileSchema,
};

export type DataProduct = keyof typeof DataProductShemas;
