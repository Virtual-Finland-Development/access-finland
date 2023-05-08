export const MOCK_AUTH_STATE = {
  isValid: true,
  storedAuthState: {
    expiresAt: '',
    idToken: '',
    profileData: {
      email: '',
      userId: '123456',
    },
  },
};

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
