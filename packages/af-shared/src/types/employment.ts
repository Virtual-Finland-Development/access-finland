/**
 * Work contract
 */
interface EmployerInfo {
  name: string;
  businessID: string;
  streetName: string;
  postalCode: string;
  city: string;
  signatureDate: string;
}

interface EmployeeInfo {
  name: string;
  streetAddress: string;
  postalCode?: string;
  city?: string;
  country?: string;
  signaruteDate: string;
}

interface TermsOfWork {
  employmentStart: string;
  employmentEnd?: string;
  groundsForFixedTerm?: string;
  workConditions?: string;
  industry?: string;
  locations?: string[];
  workingHours: number;
  collectiveAgreement?: string;
  probation: string;
  jobTitle: string;
}

interface Compensation {
  paymentGrounds: 'hourly' | 'monthly';
  salary: number;
  bonuses?: string;
  paymentTime?: string;
}

interface Benefit {
  benefit?: string;
  benefitType?: 'part of salary' | 'addition to salary';
  taxableValue?: number;
}

interface Holidays {
  paidHoliday: boolean;
  numberOfHolidays?: number;
  determinationOfHoliday?: 'annual holiday act' | 'collective agreement';
}

interface OtherTerm {
  termDescription: string;
}

export interface WorkContract {
  employerInfo: EmployerInfo;
  employeeInfo: EmployeeInfo;
  termsOfWork: TermsOfWork;
  compensation: Compensation;
  holidays?: Holidays;
  benefits: Benefit[];
  termination?: string;
  otherTerms: OtherTerm[];
}

/**
 * Income tax
 */
export interface IncomeTax {
  taxPayerType: 'resident' | 'non-resident';
  withholdingPercentage: number;
  incomeLimit: number;
  additionalPercentage: number;
  validityDate: string;
}
