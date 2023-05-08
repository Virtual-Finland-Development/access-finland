import { useRouter } from 'next/router';
import { CompanyContextProvider } from '@shared/context/company-context';
import { useCompanyContext } from '@shared/context/company-context';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import Loading from '@shared/components/ui/loading';
import CompanyWizard from '../../components/company-wizard/company-wizard';

export default function DetailsPage() {
  const router = useRouter();
  const { nationalIdentifier } = router.query;
  const { contextIsLoading } = useCompanyContext();
  if (!nationalIdentifier) return null;

  return (
    <AuthSentry redirectPath="/company">
      <Page title="Company edit - details" withBorder={false}>
        {contextIsLoading ? (
          <Loading />
        ) : (
          <CompanyWizard wizardType="company" />
        )}
      </Page>
    </AuthSentry>
  );
}

DetailsPage.provider = CompanyContextProvider;
