import {
  Output,
  array,
  boolean,
  length,
  nativeEnum,
  nullable,
  number,
  object,
  string,
} from 'valibot';

/**
 * Profile TOS Agreement
 */
export const ProfileTosAgreementSchema = object({
  currentTerms: object({
    url: string(),
    description: string(),
    version: string(),
  }),
  acceptedVersion: nullable(string()),
  acceptedAt: nullable(string()),
  hasAcceptedLatest: boolean(),
});
export type ProfileTosAgreement = Output<typeof ProfileTosAgreementSchema>;

export const ProfileTosAgreementWriteSchema = object({
  version: string(),
  accepted: boolean(),
});
export type ProfileTosAgreementWrite = Output<
  typeof ProfileTosAgreementWriteSchema
>;

/**
 * Person/BasicInformation
 */
export const PersonBasicInformationSchema = object({
  givenName: nullable(string()),
  lastName: nullable(string()),
  email: string(),
  phoneNumber: nullable(string()),
  residency: nullable(string([length(3)])), // ISO 3166-1 alpha-3
});
export type PersonBasicInformation = Output<
  typeof PersonBasicInformationSchema
>;

export const EducationSchema = object({
  educationName: string(),
  educationLevel: string(),
  educationField: string(),
  graduationDate: string(),
  institutionName: string(),
});
export type Education = Output<typeof EducationSchema>;

export enum SkillLevel {
  'beginner' = 'beginner',
  'intermediate' = 'intermediate',
  'master' = 'master',
}
export const SkillLevelSchema = nativeEnum(SkillLevel);

export const OtherSkillSchema = object({
  escoIdentifier: string(),
  skillLevel: SkillLevelSchema,
});
export type OtherSkill = Output<typeof OtherSkillSchema>;

export const LanguageSkillSchema = object({
  escoIdentifier: string(),
  languageCode: string(),
  skillLevel: string(),
});
export type LanguageSkill = Output<typeof LanguageSkillSchema>;

export const CertificationSchema = object({
  certificationName: string(),
  escoIdentifier: array(string()),
  institutionName: string(),
});
export type Certification = Output<typeof CertificationSchema>;

export enum EmploymentType {
  'permanent',
  'temporary',
  'seasonal',
  'summerJob',
}
export const EmploymentTypeSchema = nativeEnum(EmploymentType);

export enum WorkingTime {
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
}
export const WorkingTimeSchema = nativeEnum(WorkingTime);

export const UserOccupationSchema = object({
  escoIdentifier: string(),
  escoCode: string(),
  workExperience: number(),
  employer: string(),
});
export type UserOccupation = Output<typeof UserOccupationSchema>;

export const JobApplicantProfileSchema = object({
  occupations: array(UserOccupationSchema),
  educations: array(EducationSchema),
  languageSkills: array(LanguageSkillSchema),
  otherSkills: array(OtherSkillSchema),
  certifications: array(CertificationSchema),
  permits: array(string()),
  workPreferences: object({
    preferredRegion: array(string()),
    preferredMunicipality: array(string()),
    typeOfEmployment: nullable(EmploymentTypeSchema),
    workingTime: nullable(WorkingTimeSchema),
    workingLanguage: array(string()),
    naceCode: nullable(string()),
  }),
});
export type JobApplicantProfile = Output<typeof JobApplicantProfileSchema>;
