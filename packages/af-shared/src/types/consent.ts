export enum ConsentDataSource {
  WORK_PERMIT = 'dpp://virtual_finland:development@testbed.fi/Permits/WorkPermit_v0.1',
  WORK_CONTRACT = '',
  INCOME_TAX = '',
}

export enum ConsentStatus {
  VERIFY = 'verifyUserConsent',
  GRANTED = 'consentGranted',
}

export type ConsentSituation = {
  consentStatus: string;
  consentToken?: string;
  redirectUrl?: string;
};
