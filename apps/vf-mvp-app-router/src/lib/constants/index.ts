import { AppContextObj } from '@/types';

export const baseAppContextObj: AppContextObj = {
  appName: 'living-in-finland',
  redirectUrl: '',
};

export const LOCAL_STORAGE_AUTH_KEY = 'virtual-finland-auth';
export const LOCAL_STORAGE_REDIRECT_KEY = 'redirect-path';

export const REQUEST_NOT_AUTHORIZED = 'rna';

export const COMPANY_DATA_LABELS: Record<string, any> = {
  registrant: 'Registrant',
  givenName: 'Given name',
  lastName: 'Last name',
  email: 'Email',
  phoneNumber: 'Phone number',
  companyDetails: 'Company details',
  name: 'Name',
  alternativeName: 'Alternative name',
  foundingDate: 'Founding date',
  industrySector: 'Industry sector',
  shareCapital: 'Share capital',
  capitalCurrency: 'Capital currency',
  settlementDeposit: 'Settlement deposit',
  depositCurrency: 'Deposit currency',
  settlementDate: 'Settlement date',
  countryOfResidence: 'Country of residence',
  shareSeries: 'Share series',
  shareSeriesClass: 'Share series class',
  numberOfShares: 'Number of shares',
  shareValue: 'Share value',
  companyAddress: 'Company address',
  fullAddress: 'Full address',
  thoroughfare: 'Thoroughfare',
  locatorDesignator: 'Locator designator',
  locatorName: 'Locator name',
  addressArea: 'Address area',
  postCode: 'Post code',
  postName: 'Post name',
  poBox: 'Post box',
  adminUnitLevel1: 'Admin unit level 1',
  adminUnitLevel2: 'Admin unit level 2',
  managingDirectors: 'Managing directors',
  role: 'Role',
  middleNames: 'Middle names',
  dateOfBirth: 'Date of birth',
  nationality: 'Nationality',
  boardMembers: 'Board members',
  auditorDetails: 'Auditor details',
  companyName: 'Company name',
  nationalIdentifier: 'National identifier',
  votesPerShare: 'Votes per share',
  shareholders: 'Shareholders',
  shareOwnership: 'Share ownership',
  quantity: 'Quantity',
  signinRights: 'Signin rights',
  personalId: 'Personal ID',
  shareValueCurrency: 'Share value currency',
  legalForm: 'Legal form',
  legalStatus: 'Legal status',
  registeredAddress: 'Registered address',
  registrationDate: 'Registration date',
  addressId: 'Address ID',
};

export const PROFILE_DATA_LABELS: Record<string, any> = {
  email: 'Email',
  givenName: 'Given name',
  lastName: 'Last name',
  phoneNumber: 'Phone number',
  residency: 'Country of residence',
  certifications: 'Certifications',
  educations: 'Educations',
  languageSkills: 'Language skills',
  occupations: 'Occupations',
  otherSkills: 'Other skills',
  permits: 'Acquired permits',
  workPreferences: 'Work preferences',
  certificationName: 'Certification name',
  institutionName: 'Institution name',
  educationField: 'Education field',
  educationLevel: 'Education level',
  educationName: 'Education name',
  graduationDate: 'Graduation date',
  languageCode: 'Language',
  skillLevel: 'Skill level',
  employer: 'Employer',
  escoCode: 'Occupation',
  workExperience: 'Work experience',
  escoIdentifier: 'Skill',
  naceCode: 'Preferred industry',
  preferredMunicipality: 'Preferred municipalities to work in',
  preferredRegion: 'Preferred regions to work in',
  typeOfEmployment: 'Preferred type of employment',
  workingTime: 'Preferred working time',
  workingLanguage: 'Working languages',
};

export const SHARE_SERIES_CLASS_OPTIONS = [
  {
    labelText: 'A',
    uniqueItemId: 'A',
  },
  {
    labelText: 'B',
    uniqueItemId: 'B',
  },
  {
    labelText: 'C',
    uniqueItemId: 'C',
  },
  {
    labelText: 'D',
    uniqueItemId: 'D',
  },
  {
    labelText: 'E',
    uniqueItemId: 'E',
  },
];

export const MANAGING_DIRECTORS_ROLE_OPTIONS = [
  { labelText: 'Director', uniqueItemId: 'director' },
  { labelText: 'Debuty director', uniqueItemId: 'debuty director' },
];

export const BOARD_MEMBERS_ROLE_OPTIONS = [
  { labelText: 'Chair person', uniqueItemId: 'chairperson' },
  { labelText: 'Member', uniqueItemId: 'member' },
  { labelText: 'Debuty member', uniqueItemId: 'debuty member' },
];

export const SIGNING_RIGHTS_ROLE_OPTIONS = [
  { labelText: 'Director', uniqueItemId: 'director' },
  { labelText: 'Debuty director', uniqueItemId: 'debuty director' },
  { labelText: 'Board member', uniqueItemId: 'board member' },
  { labelText: 'Debuty board member', uniqueItemId: 'deputy board member' },
  { labelText: 'Other', uniqueItemId: 'other' },
];

export const EMPLOYMENT_TYPE_LABELS = {
  permanent: 'Permanent',
  temporary: 'Temporary',
  seasonal: 'Seasonal',
  summerJob: 'Summer job',
};

export const SKILL_LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  master: 'Master',
};

export const WORKING_TIME_LABELS = {
  '01': 'Day shift',
  '02': 'Evening shift',
  '03': 'Night shift',
  '04': 'Work in episodes',
  '05': 'Flexible hours',
  '06': 'Normal days',
  '07': 'Weekend hours',
  '08': 'Work in shifts',
};
