// auth
export const MOCK_AUTH_STATE = {
  isValid: true,
  storedAuthState: {
    expiresAt: '',
    idToken: '',
    csfrToken: '',
    profileData: {
      email: '',
      userId: '123456',
    },
  },
};

// companies
export const MOCK_USER_COMPANIES = [
  {
    nationalIdentifier: '7318604-5',
    data: {
      registrant: {
        givenName: 'Juan',
        lastName: 'Coby',
        email: 'belen.byron@email.com',
        phoneNumber: '+1 231 231 2312',
      },
      companyDetails: {
        name: 'Daniela-Ayaan Ltd.',
        alternativeName: null,
        foundingDate: '2002-03-08',
        industrySector: '42.1',
        shareCapital: 200,
        capitalCurrency: 'EUR',
        settlementDeposit: 5000,
        depositCurrency: 'EUR',
        settlementDate: null,
        countryOfResidence: null,
      },
      shareSeries: [
        {
          shareSeriesClass: 'A',
          numberOfShares: 5,
          shareValue: 10,
          shareValueCurrency: 'EUR',
        },
      ],
      companyAddress: {
        fullAddress: 'Company address 50',
        thoroughfare: null,
        locatorDesignator: null,
        locatorName: null,
        addressArea: null,
        postCode: null,
        postName: null,
        poBox: null,
        adminUnitLevel1: null,
        adminUnitLevel2: null,
      },
      managingDirectors: [
        {
          role: 'director',
          givenName: 'Nola',
          middleNames: 'Kaley',
          lastName: 'Abdiel',
          dateOfBirth: '2009-12-21',
          nationality: 'FIN',
        },
      ],
      boardMembers: [
        {
          role: 'chairperson',
          givenName: 'Dalia',
          middleNames: 'Alexis',
          lastName: 'Hugo',
          dateOfBirth: '2021-12-25',
          nationality: 'FIN',
        },
      ],
      auditorDetails: {
        companyName: null,
        nationalIdentifier: null,
        givenName: null,
        lastName: null,
      },
    },
  },
];

// TOS agreement
export const MOCK_TOS_AGREEMENT = {
  currentTerms: {
    url: '',
    description: '',
    version: '',
  },
  acceptedVersion: '',
  acceptedAt: '',
  hasAcceptedLatest: true,
};

// profile
export const MOCK_PERSON_BASIC_INFO = {
  email: 'foo@bar.testbed.fi',
  givenName: 'Foo',
  lastName: 'Bar',
  phoneNumber: '+1 231 231 2312',
  residency: 'AFG',
};

export const MOCK_JOB_APPLICANT_INFO = {
  certifications: [
    {
      certificationName: 'Cert 1',
      escoIdentifier: [
        'http://data.europa.eu/esco/skill/fd4386c5-96f0-4c6e-970c-c08729ae0cc6',
      ],
      institutionName: 'Inst 1',
    },
  ],
  educations: [
    {
      educationField: '00',
      educationLevel: '2',
      educationName: 'Ed 1',
      graduationDate: '2023-05-10',
      institutionName: 'Inst 1',
    },
  ],
  languageSkills: [
    {
      escoIdentifier: 'http://data.europa.eu/esco/skill/L1',
      languageCode: 'af',
      skillLevel: 'B2',
    },
  ],
  occupations: [
    {
      employer: 'Employer Y',
      escoCode: '2144.1.9',
      escoIdentifier:
        'http://data.europa.eu/esco/occupation/8bc48c43-d976-458a-9e3c-ee784572351d',
      workExperience: 12,
    },
    {
      employer: 'Employer X',
      escoCode: '2152.1.4',
      escoIdentifier:
        'http://data.europa.eu/esco/occupation/4874fa37-0cd1-4a68-aed8-a838851f242d',
      workExperience: 24,
    },
  ],
  otherSkills: [
    {
      escoIdentifier:
        'http://data.europa.eu/esco/skill/21d2f96d-35f7-4e3f-9745-c533d2dd6e97',
      skillLevel: 'beginner',
    },
  ],
  permits: ['007', '003'],
  workPreferences: {
    naceCode: '41.10',
    preferredMunicipality: ['009'],
    preferredRegion: ['FI-17'],
    typeOfEmployment: 'temporary',
    workingLanguage: ['bm'],
    workingTime: '02',
  },
};

// codesets
export const MOCK_ISO_COUNTRIES = [
  {
    id: 'AW',
    displayName: 'Aruba',
    englishName: 'Aruba',
    nativeName: '',
    twoLetterISORegionName: 'AW',
    threeLetterISORegionName: 'ABW',
  },
  {
    id: 'AF',
    displayName: 'Afghanistan',
    englishName: 'Islamic Republic of Afghanistan',
    nativeName: '',
    twoLetterISORegionName: 'AF',
    threeLetterISORegionName: 'AFG',
  },
];

// work permits
export const MOCK_WORK_PERMITS = {
  permits: [
    {
      employerName: 'Staffpoint Oy',
      industries: ['79.1', '79.9'],
      permitAccepted: true,
      permitName: 'Seasonal work certificate',
      permitType: 'A',
      validityEnd: '2024-02-19T00:00:00',
      validityStart: '2023-11-07T00:00:00',
    },
    {
      employerName: 'Stuffpoint Oy',
      industries: ['79.1', '79.9'],
      permitAccepted: false,
      permitName: 'Permanent work certificate',
      permitType: 'B',
      validityEnd: '2024-02-19T00:00:00',
      validityStart: '2023-11-07T00:00:00',
    },
  ],
};
