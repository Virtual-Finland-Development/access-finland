import { useEffect, useState } from 'react';
import { Text } from 'suomifi-ui-components';
import { WorkContract } from '@shared/types';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';
import PageSideNavLayout from '../components/profile-side-nav-layout';
import WorkContractsDetails from '../components/work-contracts-details';

const DATA: WorkContract[] = [
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
      employmentEnd: '2023-01-01',
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
      paidHolidayIncluded: true,
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
      paidHolidayIncluded: true,
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

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

async function MOCK_DATA() {
  await sleep();
  return DATA;
}

export default function WorkContractsPage() {
  const [data, setData] = useState<WorkContract[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await MOCK_DATA();
        setData(response);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AuthSentry redirectPath="/profile">
      <PageSideNavLayout title="Work contracts">
        <Page.Block className="bg-white">
          <div className="flex flex-col gap-6 items-start">
            <div className="flex flex-row items-center">
              <CustomHeading variant="h2" suomiFiBlue="dark">
                Work Contracts
              </CustomHeading>
            </div>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a
              diam eget felis aliquam dignissim. Sed euismod, nisl eget aliquam
              ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl
              vitae nunc.
            </Text>
            {isLoading ? (
              <Loading />
            ) : (
              <WorkContractsDetails contracts={data} />
            )}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
