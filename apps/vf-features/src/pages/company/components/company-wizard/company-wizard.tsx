import { useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Block } from 'suomifi-ui-components';
import type {
  BenecifialOwners,
  NonListedCompany,
  SignatoryRights,
} from '@shared/types';
import {
  nullifyUndefinedValues,
  pickRandomDateString,
  pickRandomName,
} from '@shared/lib/utils';
import { useCompanyContext } from '@shared/context/company-context';
import BeneficialOwnersShareSeries from '../form-inputs/beneficial-owners-inputs-1-share-series';
import BeneficialOwnersShareholders from '../form-inputs/beneficial-owners-inputs-2-share-holders';
import CompanyRegistrant from '../form-inputs/company-inputs-1-registrant';
import CompanyDetails from '../form-inputs/company-inputs-2-company-details';
import CompanyAddress from '../form-inputs/company-inputs-3-company-address';
import CompanyShares from '../form-inputs/company-inputs-4-share-series';
import CompanyDirectors from '../form-inputs/company-inputs-5-managing-directors';
import CompanyMembers from '../form-inputs/company-inputs-6-board-members';
import CompanyAuditor from '../form-inputs/company-inputs-7-auditor';
import SignatoryRightsInputs from '../form-inputs/signatory-rights-inputs-1';
import Preview from '../preview';
import CompanyWizardActionButtons from './company-wizard-action-buttons';
import CompanyWizardNav from './company-wizard-nav';

interface FormProps {
  company: Partial<NonListedCompany>;
  beneficialOwners: Partial<BenecifialOwners>;
  signatoryRights: SignatoryRights;
}

const WIZARD_STEPS = {
  company: [
    <CompanyRegistrant key="1" />,
    <CompanyDetails key="2" />,
    <CompanyAddress key="3" />,
    <CompanyShares key="4" />,
    <CompanyDirectors key="5" />,
    <CompanyMembers key="6" />,
    <CompanyAuditor key="7" />,
    <Preview key="8" previewType="company" stageHeader="Stage 8/8" />,
  ],
  beneficialOwners: [
    <BeneficialOwnersShareSeries key="1" />,
    <BeneficialOwnersShareholders key="2" />,
    <Preview key="4" previewType="beneficialOwners" stageHeader="Stage 3/3" />,
  ],
  signatoryRights: [
    <SignatoryRightsInputs key="1" />,
    <Preview key="2" previewType="signatoryRights" stageHeader="Stage 2/2" />,
  ],
};

const DEFAULT_VALUES = {
  company: {
    registrant: {
      givenName: pickRandomName('firstName'),
      lastName: pickRandomName('lastName'),
      email: `${pickRandomName(
        'lastName'
      ).toLocaleLowerCase()}.${pickRandomName(
        'lastName'
      ).toLocaleLowerCase()}@email.com`,
      phoneNumber: '+1 231 231 2312',
    },
    companyDetails: {
      name: `${pickRandomName('firstName')}-${pickRandomName('lastName')} Ltd.`,
      industrySector: '42.1',
      shareCapital: 200,
      capitalCurrency: 'EUR',
      settlementDeposit: 5000,
      depositCurrency: 'EUR',
      foundingDate: pickRandomDateString(),
    },
    companyAddress: {
      fullAddress: `Company address ${Math.floor(Math.random() * 100)}`,
    },
    shareSeries: [
      {
        shareSeriesClass: 'A' as const,
        numberOfShares: 5,
        shareValue: 10,
        shareValueCurrency: 'EUR',
      },
    ],
    managingDirectors: [
      {
        role: 'director' as const,
        givenName: pickRandomName('firstName'),
        lastName: pickRandomName('lastName'),
        middleNames: pickRandomName('firstName'),
        dateOfBirth: pickRandomDateString(),
        nationality: 'FIN',
      },
    ],
    boardMembers: [
      {
        role: 'chairperson' as const,
        givenName: pickRandomName('firstName'),
        lastName: pickRandomName('lastName'),
        middleNames: pickRandomName('firstName'),
        dateOfBirth: pickRandomDateString(),
        nationality: 'FIN',
      },
    ],
  },
  beneficialOwners: {
    shareSeries: [
      {
        shareSeriesClass: 'A' as const,
        numberOfShares: Math.floor(Math.random() * 100) + 1,
        votesPerShare: Math.floor(Math.random() * 100) + 1,
      },
    ],
    shareholders: [
      {
        name: `${pickRandomName('lastName')}-${pickRandomName(
          'firstName'
        )} Ltd`,
        shareOwnership: [
          {
            shareSeriesClass: 'A' as const,
            quantity: Math.floor(Math.random() * 100) + 1,
          },
        ],
      },
    ],
  },
  signatoryRights: {
    signatoryRights: [
      {
        role: 'director' as const,
        givenName: pickRandomName('firstName'),
        middleNames: pickRandomName('firstName'),
        lastName: pickRandomName('lastName'),
        dateOfBirth: pickRandomDateString(),
        nationality: 'FIN',
      },
    ],
  },
};

interface Props {
  wizardType: 'company' | 'beneficialOwners' | 'signatoryRights';
}

export default function CompanyWizard(props: Props) {
  const { wizardType } = props;
  const { values, setValues, step, setStep, nationalIdentifier } =
    useCompanyContext();

  /**
   * Form methods, passed to form provider (react-hook-form).
   * Each section of wizard can connect to form context by using 'useFormContext' hook.
   */
  const formMethods = useForm<FormProps>({
    mode: 'onSubmit',
    defaultValues: {
      [wizardType]: {
        ...(!nationalIdentifier && DEFAULT_VALUES[wizardType]),
        ...values[wizardType],
      },
    },
  });

  /**
   * Handle form submission, save values to context.
   */
  const onSubmit: SubmitHandler<FormProps> = useCallback(
    values => {
      const submitValues = nullifyUndefinedValues<Partial<FormProps>>(values);
      setValues(submitValues);
    },
    [setValues]
  );

  /**
   * On form action buttons click (previvous / next / save).
   * Submit form on next step, set current step.
   */
  const onFormActionClick = useCallback(
    (next?: boolean) => {
      if (next) {
        formMethods.handleSubmit(values => {
          onSubmit(values);
          setStep(step + 1);
        })();
      } else {
        setStep(step - 1);
      }
      window.scrollTo(0, 0);
    },
    [formMethods, onSubmit, setStep, step]
  );

  /**
   * On every wizard nav 'next page' change, execute form submit handler first.
   * This way each page data gets saved to context / inputs gets validated.
   */
  const onWizardNavChange = useCallback(
    (clickedStep: number) => {
      if (clickedStep > step) {
        formMethods.handleSubmit(values => {
          onSubmit(values);
          setStep(clickedStep);
        })();
      } else {
        setStep(clickedStep);
      }
    },
    [formMethods, onSubmit, setStep, step]
  );

  return (
    <FormProvider {...formMethods}>
      <div className="block lg:hidden pb-4 px-4 md:px-0">
        <div className="border border-suomifi-light">
          <CompanyWizardNav
            wizardType={wizardType}
            onWizardNavChange={onWizardNavChange}
          />
        </div>
      </div>

      <div className="flex flex-row w-full items-start">
        <div className="hidden lg:block bg-white flex-shrink-0 mr-8 h-full border border-gray-300 py-6">
          <div className="min-w-[240px]">
            <CompanyWizardNav
              wizardType={wizardType}
              onWizardNavChange={onWizardNavChange}
            />
          </div>
        </div>

        <Block
          variant="section"
          className="bg-white md:border border-gray-300 flex flex-col w-full px-4 py-6"
        >
          <form>
            {WIZARD_STEPS[wizardType][step]}

            <div className="flex flex-row gap-4 mt-14 w-full">
              <CompanyWizardActionButtons
                key={step}
                onFormActionClick={onFormActionClick}
                isLastStep={step === WIZARD_STEPS[wizardType].length - 1}
              />
            </div>
          </form>
        </Block>
      </div>
    </FormProvider>
  );
}
