import { IncomeTax, WorkContract } from '@/types';
import apiClient from '../api-client';
import { TESTBED_API_BASE_URL } from '../endpoints';

const CONTRACTS_MOCK_DATA: WorkContract[] = [
  {
    employerInfo: {
      name: 'ABC Inc.',
      businessID: '1234567-8',
      streetName: 'Main Street 1',
      postalCode: '00100',
      city: 'Helsinki',
      signatureDate: '2022-01-01',
    },
    employeeInfo: {
      name: 'John Doe',
      streetAddress: 'Second Street 2',
      postalCode: '00200',
      city: 'Helsinki',
      signaruteDate: '2022-01-01',
    },
    termsOfWork: {
      employmentStart: '2022-01-01',
      groundsForFixedTerm: 'Temporary replacement',
      workDuties: 'Software development',
      workConditions: 'Remote work',
      industry: 'IT',
      locations: ['Helsinki', 'Tampere'],
      workingHours: 37.5,
      collectiveAgreement: 'IT',
      overtimeRules: 'As agreed',
      probation: '6 months',
    },
    compensation: {
      paymentGrounds: 'monthly',
      salary: 5000,
      bonuses: 'Performance-based',
      paymentTime: 'End of month',
    },
    holidays: {
      paidHoliday: true,
      numberOfHolidays: 25,
      determinationOfHoliday: 'annual holiday act',
    },
    benefits: [
      {
        benefit: 'Lunch benefit',
        benefitType: 'partOfSalary',
        taxableValue: 100,
      },
      {
        benefit: 'Healthcare',
        benefitType: 'additionToSalary',
        taxableValue: 50,
      },
    ],
    termination: 'Notice period of 3 months',
    otherTerms: [
      {
        termDescription: 'Confidentiality agreement',
      },
    ],
  },
  {
    employerInfo: {
      name: 'XYZ Ltd.',
      businessID: '9876543-2',
      streetName: 'Third Street 3',
      postalCode: '00300',
      city: 'Helsinki',
      signatureDate: '2022-01-01',
    },
    employeeInfo: {
      name: 'Jane Doe',
      streetAddress: 'Fourth Street 4',
      postalCode: '00400',
      city: 'Helsinki',
      signaruteDate: '2022-01-01',
    },
    termsOfWork: {
      employmentStart: '2022-01-01',
      employmentEnd: '2023-01-01',
      groundsForFixedTerm: 'Temporary replacement',
      workDuties: 'Marketing',
      workConditions: 'Office work',
      industry: 'Marketing',
      locations: ['Helsinki'],
      workingHours: 37.5,
      collectiveAgreement: 'Marketing',
      overtimeRules: 'As agreed',
      probation: '6 months',
    },
    compensation: {
      paymentGrounds: 'monthly',
      salary: 4000,
      bonuses: 'Performance-based',
      paymentTime: 'End of month',
    },
    holidays: {
      paidHoliday: true,
      numberOfHolidays: 25,
      determinationOfHoliday: 'annual holiday act',
    },
    benefits: [
      {
        benefit: 'Lunch benefit',
        benefitType: 'partOfSalary',
        taxableValue: 100,
      },
    ],
    termination: 'Notice period of 3 months',
    otherTerms: [
      {
        termDescription: 'Confidentiality agreement',
      },
    ],
  },
];

const TAX_MOCK_DATA = {
  taxPayerType: 'resident' as IncomeTax['taxPayerType'],
  withholdingPercentage: 15.5,
  additionalPercentage: 40.2,
  incomeLimit: 30000,
  validityDate: '2023-12-31',
};

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export async function getPersonWorkContracts(): Promise<WorkContract[]> {
  // TODO: Wait for testbed-api implementation

  /* const { data } = await apiClient.get(
    `${TESTBED_API_BASE_URL}/testbed/productizer/employment/income-tax`
  );
  return data; */
  await sleep();
  return CONTRACTS_MOCK_DATA;
}

export async function getPersonIncomeTax(): Promise<IncomeTax> {
  // TODO: Wait for testbed-api implementation

  /* const { data } = await apiClient.get(
    `${TESTBED_API_BASE_URL}/testbed/productizer/employment/income-tax`
  );
  return data; */
  await sleep();
  return TAX_MOCK_DATA;
}
