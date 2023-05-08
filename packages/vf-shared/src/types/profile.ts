/**
 * Person/BasicInformation
 */
export interface PersonBasicInformation {
  givenName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  residency: string;
}

export interface Education {
  educationName: string;
  educationLevel: string;
  educationField: string;
  graduationDate: string;
  institutionName: string;
}

export enum SkillLevel {
  'beginner' = 'beginner',
  'intermediate' = 'intermediate',
  'master' = 'master',
}

export interface OtherSkill {
  escoIdentifier: string;
  skillLevel: SkillLevel;
}

export interface LanguageSkill {
  escoIdentifier: string;
  languageCode: string;
  skillLevel: string;
}

export interface Certification {
  certificationName: string;
  escoIdentifier: string[];
  institutionName: string;
}

export enum EmploymentType {
  'permanent',
  'temporary',
  'seasonal',
  'summerJob',
}

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

export interface UserOccupation {
  escoIdentifier: string;
  escoCode: string;
  workExperience: number;
  employer: string;
}
export interface JobApplicantProfile {
  occupations: UserOccupation[];
  educations: Education[];
  languageSkills: LanguageSkill[];
  otherSkills: OtherSkill[];
  certifications: Certification[];
  permits: string[];
  workPreferences: {
    preferredRegion: string[];
    preferredMunicipality: string[];
    typeOfEmployment: EmploymentType | null;
    workingTime: WorkingTime | null;
    workingLanguage: string[];
    naceCode: string | null;
  };
}
