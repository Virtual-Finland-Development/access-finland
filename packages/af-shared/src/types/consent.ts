export enum ConsentDataSource {
  WORK_PERMIT = 'dpp://virtual_finland:development@testbed.fi/Permits/WorkPermit_v0.1',
  WORK_CONTRACT = '',
  INCOME_TAX = 'dpp://vero_demo@testbed.fi/Employment/IncomeTax_v0.2',
}

export enum ConsentStatus {
  VERIFY = 'verifyUserConsent',
  GRANTED = 'consentGranted',
}

export type ConsentSituation = {
  consentStatus: ConsentStatus;
  consentToken?: string;
  redirectUrl?: string;
  dataSource?: string;
};
