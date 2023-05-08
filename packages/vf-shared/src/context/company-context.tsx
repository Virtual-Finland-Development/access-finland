import { useRouter } from 'next/router';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import lodash_get from 'lodash.get';
import lodash_merge from 'lodash.merge';
import type {
  BenecifialOwners,
  Country,
  Currency,
  NonListedCompany,
  SignatoryRights,
} from '@/types';
import api from '@/lib/api';
import { useCountries, useCurrencies } from '@/lib/hooks/codesets';
import {
  useBeneficialOwners,
  useCompany,
  useSignatoryRights,
} from '@/lib/hooks/companies';
import { useToast } from '@/context/toast-context';

interface CompanyContextValues {
  company: Partial<NonListedCompany>;
  beneficialOwners: Partial<BenecifialOwners>;
  signatoryRights: SignatoryRights;
}

type Step =
  | 'company.registrant'
  | 'company.companyDetails'
  | 'company.companyAddress'
  | 'company.shareSeries'
  | 'company.managingDirectors'
  | 'company.boardMembers'
  | 'company.auditorDetails'
  | 'beneficialOwners.shareSeries'
  | 'beneficialOwners.shareholders'
  | 'signatoryRights.signatoryRights';

const doneStepsInitial: Record<Step, boolean> = {
  'company.registrant': false,
  'company.companyDetails': false,
  'company.companyAddress': false,
  'company.shareSeries': false,
  'company.managingDirectors': false,
  'company.boardMembers': false,
  'company.auditorDetails': false,
  'beneficialOwners.shareSeries': false,
  'beneficialOwners.shareholders': false,
  'signatoryRights.signatoryRights': false,
};

interface CompanyContextProps {
  values: Partial<CompanyContextValues>;
  setValues: (values: Partial<CompanyContextValues>) => void;
  clearValues: (
    type: 'company' | 'beneficialOwners' | 'signatoryRights'
  ) => void;
  isStepDone: (step: Step) => boolean;
  isPrevStepDone: (currentStep: Step) => boolean;
  doneSteps: Record<Step, boolean>;
  setIsCurrentStepDone: (step: Step, done: boolean) => void;
  step: number;
  setStep: (step: number) => void;
  isSaving: boolean;
  nationalIdentifier?: string;
  codesets: {
    countries: Country[] | undefined;
    currencies: Currency[] | undefined;
  };
  saveCompany: () => void;
  saveIsSuccess: boolean;
  contextIsLoading: boolean;
}

interface CompanyProviderProps {
  children: ReactNode;
}

const CompanyContext = createContext<CompanyContextProps | undefined>(
  undefined
);
const CompanyContextConsumer = CompanyContext.Consumer;

function CompanyContextProvider(props: CompanyProviderProps) {
  const { children } = props;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Partial<CompanyContextValues>>({});
  const [doneSteps, setDoneSteps] = useState(doneStepsInitial);
  const [isSaving, setIsSaving] = useState(false);
  const [saveIsSuccess, setSaveIsSuccess] = useState(false);
  const [contextIsLoading, setContextIsLoading] = useState(false);
  const router = useRouter();
  const nationalIdentifier = router.query.nationalIdentifier
    ? (router.query.nationalIdentifier as string)
    : undefined;
  const toast = useToast();

  /**
   * Reset step on every route change.
   */
  useEffect(() => {
    const resetStep = () => setStep(0);
    router.events.on('routeChangeComplete', resetStep);
    return () => router.events.off('routeChangeComplete', resetStep);
  }, [router.events]);

  /**
   * [hooks] Fetch codesets.
   */
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies();
  const { data: countries, isLoading: countriesLoading } = useCountries();

  /**
   * [hooks] Fetch company related data, if nationalIdentifier was provided.
   */
  const { data: companyData, isFetching: companyLoading } = useCompany(
    nationalIdentifier || undefined
  );
  const { data: beneficialOwnersData, isFetching: beneficialOwnersLoading } =
    useBeneficialOwners(nationalIdentifier || undefined);
  const { data: signatoryRightsData, isFetching: signatoryRightsLoading } =
    useSignatoryRights(nationalIdentifier || undefined);

  const companyDataLoading =
    companyLoading || beneficialOwnersLoading || signatoryRightsLoading;
  const codeSetsLoading = currenciesLoading || countriesLoading;

  /**
   * Company context loading state, track company data / codesets loading states.
   */
  useEffect(() => {
    setContextIsLoading(companyDataLoading || codeSetsLoading);
  }, [codeSetsLoading, companyDataLoading]);

  /**
   * Set fetched company related data to state, if nationalIdentifier was provided and if data exists.
   * Set all steps to done.
   */
  useEffect(() => {
    if (
      nationalIdentifier &&
      !companyDataLoading &&
      companyData &&
      beneficialOwnersData &&
      signatoryRightsData
    ) {
      setValues({
        company: companyData,
        beneficialOwners: beneficialOwnersData,
        signatoryRights: signatoryRightsData,
      });
      setDoneSteps(prev => {
        return Object.keys(prev).reduce((acc, key) => {
          return {
            ...acc,
            [key]: true,
          };
        }, prev);
      });
    }
  }, [
    beneficialOwnersData,
    nationalIdentifier,
    companyData,
    companyDataLoading,
    signatoryRightsData,
  ]);

  const isStepDone = useCallback(
    (step: Step) => {
      return Boolean(lodash_get(doneSteps, step) || nationalIdentifier);
    },
    [nationalIdentifier, doneSteps]
  );

  const isPrevStepDone = useCallback(
    (currentStep: Step) => {
      switch (currentStep) {
        case 'company.registrant':
          return true;
        case 'company.companyDetails':
          return isStepDone('company.registrant');
        case 'company.companyAddress':
          return isStepDone('company.companyDetails');
        case 'company.shareSeries':
          return isStepDone('company.companyAddress');
        case 'company.managingDirectors':
          return isStepDone('company.shareSeries');
        case 'company.boardMembers':
          return isStepDone('company.managingDirectors');
        case 'company.auditorDetails':
          return isStepDone('company.boardMembers');
        case 'beneficialOwners.shareSeries':
          return true;
        case 'beneficialOwners.shareholders':
          return isStepDone('beneficialOwners.shareSeries');
        case 'signatoryRights.signatoryRights':
          return true;
        default:
          return false;
      }
    },
    [isStepDone]
  );

  const saveCompanyData = useCallback(async () => {
    setIsSaving(true);
    const { company, beneficialOwners, signatoryRights } = values;
    let payloadId: string = '';

    // hack: when updating existing company, we need to use direct call to PRH mock bypassing testbed,
    // because Establish/Write does not have the ability to update existing company
    try {
      if (!nationalIdentifier) {
        // productizer call, create
        await api.company.saveCompany(company as Partial<NonListedCompany>);
        // get created company from PRH mock, so we can get the created nationalIdentifier (productizer response does not include this)
        const createdCompany = await api.company.getLatestModifiedCompany();
        payloadId = createdCompany.nationalIdentifier;
      } else {
        // PRH mock call, company update
        payloadId = nationalIdentifier;
        await api.company.saveCompanyDirectlyToPRH(
          payloadId,
          company as Partial<NonListedCompany>
        );
      }
      // continue to create / update beneficial owners / signatory rights withnationalIdentifier, productizer calls
      await api.company.saveBeneficialOwners(
        payloadId,
        beneficialOwners as Partial<BenecifialOwners>
      );
      await api.company.saveSignatoryRights(
        payloadId,
        signatoryRights as Partial<SignatoryRights>
      );

      setSaveIsSuccess(true);
      toast({
        status: 'neutral',
        title: 'Success',
        content: 'Company information saved successfully!',
      });
    } catch (error: any) {
      toast({
        status: 'error',
        title: 'Error',
        content: error?.message || 'Something went wrong.',
      });
    } finally {
      setIsSaving(false);
    }
  }, [nationalIdentifier, toast, values]);

  const setContextValues = useCallback(
    (newValues: Partial<CompanyContextValues>) => {
      const mergedValues = lodash_merge(values, newValues);
      setValues(mergedValues);
    },
    [values]
  );

  const clearContextValues = useCallback(
    (type: 'company' | 'beneficialOwners' | 'signatoryRights') => {
      const clearedValues = { ...values, [type]: {} };
      setValues(clearedValues);
      setDoneSteps(prev => {
        return Object.keys(prev).reduce((acc, key) => {
          const isDone = key.startsWith(type)
            ? false
            : prev[key as keyof Record<Step, boolean>];
          return {
            ...acc,
            [key]: isDone,
          };
        }, prev);
      });
    },
    [values]
  );

  const setIsCurrentStepDone = useCallback((step: Step, done: boolean) => {
    setDoneSteps(prev => ({ ...prev, [step]: done }));
  }, []);

  const contextValue = {
    values,
    setValues: setContextValues,
    clearValues: clearContextValues,
    isStepDone,
    isPrevStepDone,
    doneSteps,
    setIsCurrentStepDone,
    step,
    setStep,
    isSaving: isSaving,
    nationalIdentifier,
    saveCompany: saveCompanyData,
    saveIsSuccess,
    contextIsLoading,
    codesets: {
      countries,
      currencies,
    },
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
}

function useCompanyContext() {
  const context = useContext(CompanyContext) as CompanyContextProps;

  if (!context) {
    throw new Error('useCompanyContext must be used within CompanyProvider.');
  }

  return context;
}

export type { Step };
export { CompanyContextProvider, CompanyContextConsumer, useCompanyContext };
