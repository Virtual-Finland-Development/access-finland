import {
  JobApplicantProfileSchema,
  PersonBasicInformationSchema,
} from './profile';

export const DataProductShemas = {
  'draft/Person/BasicInformation': PersonBasicInformationSchema,
  'draft/Person/BasicInformation/Write': PersonBasicInformationSchema,
  'draft/Person/JobApplicantProfile': JobApplicantProfileSchema,
  'draft/Person/JobApplicantProfile/Write': JobApplicantProfileSchema,
};

export type DataProduct = keyof typeof DataProductShemas;
