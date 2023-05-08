export type CompanyResponse = {
  nationalIdentifier: string;
  data: NonListedCompany;
};

/**
 * NonListedCompany
 */
export type Registrant = {
  givenName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type CompanyDetails = {
  name: string;
  alternativeName: string | null;
  foundingDate: string;
  industrySector: string;
  shareCapital: number;
  capitalCurrency: string;
  settlementDeposit: number;
  depositCurrency: string;
  settlementDate: number;
  countryOfResidence: string;
};

export type CompanyAddress = {
  fullAddress: string;
  thoroughfare: string;
  locatorDesignator: string;
  locatorName: string;
  addressArea: string;
  postCode: string;
  postName: string;
  poBox: string;
  adminUnitLevel1: string;
  adminUnitLevel2: string;
};

export type ShareSeries = {
  shareSeriesClass: 'A' | 'B' | 'C' | 'D' | 'E';
  numberOfShares: number;
  shareValue: number;
  shareValueCurrency: string;
};

export type ManagingDirector = {
  role: 'director' | 'deputy director';
  givenName: string;
  middleNames: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
};

export type BoardMember = {
  role: 'chairperson' | 'member' | 'deputy member';
  givenName: string;
  middleNames: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
};

export type AuditorDetails = {
  companyName: string;
  nationalIdentifier: string;
  givenName: string;
  lastName: string;
};

export interface NonListedCompany {
  registrant: Registrant;
  companyDetails: CompanyDetails;
  companyAddress: CompanyAddress;
  shareSeries: ShareSeries[];
  managingDirectors: ManagingDirector[];
  boardMembers: BoardMember[];
  auditorDetails: AuditorDetails;
}

/**
 * NonListedCompany/BeneficialOwners
 */

export type ShareSeries2 = Omit<
  ShareSeries,
  'shareValue' | 'shareValueCurrency'
> & {
  votesPerShare: number;
};

export type ShareOwrnership = {
  shareSeriesClass: 'A' | 'B' | 'C' | 'D' | 'E';
  quantity: number;
};

export type Shareholder = {
  name: string;
  shareOwnership: ShareOwrnership[];
};

export interface BenecifialOwners {
  shareSeries: ShareSeries2[];
  shareholders: Shareholder[];
}

/**
 * NonListedCompany/SignatoryRights
 */
export interface SignatoryRight {
  role:
    | 'director'
    | 'deputy director'
    | 'chairperson'
    | 'board member'
    | 'deputy board member'
    | 'other';
  personalId: string;
  givenName: string;
  middleNames: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  fullAddress: string;
  thoroughfare: string;
  locatorDesignator: string;
  locatorName: string;
  addressArea: string;
  postCode: string;
  postName: string;
  poBox: string;
  adminUnitLevel1: string;
  adminUnitLevel2: string;
}

export interface SignatoryRights {
  signatoryRights: SignatoryRight[];
}

/**
 * NSG company BasicInformation
 */
export interface CompanyBasicInformation {
  legalForm: string;
  legalStatus: string;
  name: string;
  registeredAddress: {
    addressArea: string;
    addressId: string;
    adminUnitLevel1: string;
    adminUnitLevel2: string;
    fullAddress: string;
    locatorDesignator: string;
    locatorName: string;
    poBox: string;
    postCode: string;
    postName: string;
    thoroughfare: string;
  };
  registrationDate: string;
}
