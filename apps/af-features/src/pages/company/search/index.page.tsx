import FormInput from '@shared/components/form/form-input';
import FormSingleSelect from '@shared/components/form/form-single-select';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import DetailsExpander from '@shared/components/ui/details-expander/details-expander';
import Loading from '@shared/components/ui/loading';
import { useToast } from '@shared/context/toast-context';
import api from '@shared/lib/api';
import { COMPANY_DATA_LABELS } from '@shared/lib/constants';
import dummyCompanyDataFI from '@shared/lib/fake-data/company-search-fi.json';
import dummyCompanyDataNO from '@shared/lib/fake-data/company-search-no.json';
import dummyCompanyDataSE from '@shared/lib/fake-data/company-search-se.json';
import type {
  BenecifialOwners,
  CompanyBasicInformation,
  SignatoryRight,
  SignatoryRights,
} from '@shared/types';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, InlineAlert, Text } from 'suomifi-ui-components';

const SOURCE_OPTIONS = [
  { labelText: 'Norway', uniqueItemId: 'no' },
  { labelText: 'Sweden', uniqueItemId: 'se' },
  { labelText: 'Finland', uniqueItemId: 'fi' },
  { labelText: 'Virtual Finland', uniqueItemId: 'accessfinland' },
];

interface FormProps {
  nationalIdentifier: string;
  source: string;
}

interface DummyData {
  beneficialOwners: Partial<BenecifialOwners>;
  signatoryRights: Partial<SignatoryRight>[];
}

export default function CompanySearchPage() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormProps>();
  const [companyData, setCompanyData] = useState<
    undefined | CompanyBasicInformation
  >(undefined);
  const [dummyData, setDummyData] = useState<DummyData | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);
  const toast = useToast();

  const onSubmit: SubmitHandler<FormProps> = async values => {
    setNotFound(false);
    setCompanyData(undefined);

    switch (values.source) {
      case 'no':
        setDummyData(dummyCompanyDataNO as DummyData);
        break;
      case 'se':
        setDummyData(dummyCompanyDataSE as DummyData);
        break;
      case 'fi':
      case 'accessfinland':
        setDummyData(dummyCompanyDataFI as DummyData);
        break;
      default:
        setDummyData(dummyCompanyDataFI as DummyData);
    }

    try {
      const response = await api.company.getCompanyBasicInfo(values);
      setCompanyData(response);
    } catch (error: any) {
      if (
        error?.response?.status &&
        [404, 422].includes(error.response.status)
      ) {
        setNotFound(true);
        return;
      }
      toast({
        title: 'Error',
        content: error?.message || 'Something went wrong.',
        status: 'error',
      });
    }
  };

  return (
    <Page title="Search companies">
      <Page.Block className="bg-white">
        <div className="flex flex-col gap-4 mb-6">
          <CustomHeading variant="h3">Companies search</CustomHeading>
          <Text>
            Provide a valid national identifier and the source country.
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <FormInput
              name="nationalIdentifier"
              labelText="National identifier"
              control={control}
              rules={{ required: 'Please provide national identifier.' }}
            />
            <FormSingleSelect
              name="source"
              labelText="Select source"
              items={SOURCE_OPTIONS}
              control={control}
              rules={{ required: 'Please provide source.' }}
            />
          </div>
          <Button type="submit" iconRight="search" disabled={isSubmitting}>
            Search
          </Button>
        </form>

        <div className="mt-8 min-h-[120px]">
          {isSubmitting && <Loading />}

          {!isSubmitting && companyData && (
            <div className="flex flex-col gap-4 w-full">
              <CustomHeading variant="h3">
                {companyData.name || 'Company details'}
              </CustomHeading>
              <DetailsExpander<CompanyBasicInformation>
                title="1. Details"
                values={companyData}
                labels={COMPANY_DATA_LABELS}
              />

              <DetailsExpander<Partial<BenecifialOwners>>
                title="2. Benefical owners"
                values={dummyData!.beneficialOwners}
                labels={COMPANY_DATA_LABELS}
              />

              <DetailsExpander<Partial<SignatoryRights>>
                title="3. Signatory rights"
                values={{ signatoryRights: dummyData!.signatoryRights }}
                labels={COMPANY_DATA_LABELS}
              />
            </div>
          )}

          {!isSubmitting && notFound && (
            <InlineAlert className="mt-4">
              <Text>No company information found with given identifier.</Text>
            </InlineAlert>
          )}
        </div>
      </Page.Block>
    </Page>
  );
}
