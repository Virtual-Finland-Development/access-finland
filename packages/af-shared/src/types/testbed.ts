import {
  JobApplicantProfileSchema,
  PersonBasicInformationSchema,
  ProfileTosAgreementSchema,
  ProfileTosAgreementWriteSchema,
} from './profile';

export const DataProductShemas = {
  'test/lsipii/Service/Terms/Agreement': ProfileTosAgreementSchema,
  'test/lsipii/Service/Terms/Agreement/Write': ProfileTosAgreementWriteSchema,
  'Person/BasicInformation': PersonBasicInformationSchema,
  'Person/BasicInformation/Write': PersonBasicInformationSchema,
  'Person/JobApplicantProfile': JobApplicantProfileSchema,
  'Person/JobApplicantProfile/Write': JobApplicantProfileSchema,
};

export type DataProduct = keyof typeof DataProductShemas;
