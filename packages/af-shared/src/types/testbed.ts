import {
  JobApplicantProfileSchema,
  PersonBasicInformationSchema,
  ProfileTosAgreementSchema,
  ProfileTosAgreementWriteSchema,
} from './profile';

export const DataProductShemas = {
  'test/lsipii/Service/Terms/Agreement': ProfileTosAgreementSchema,
  'test/lsipii/Service/Terms/Agreement/Write': ProfileTosAgreementWriteSchema,
  'draft/Person/BasicInformation': PersonBasicInformationSchema,
  'draft/Person/BasicInformation/Write': PersonBasicInformationSchema,
  'draft/Person/JobApplicantProfile': JobApplicantProfileSchema,
  'draft/Person/JobApplicantProfile/Write': JobApplicantProfileSchema,
};

export type DataProduct = keyof typeof DataProductShemas;
