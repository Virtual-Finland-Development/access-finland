import { CompanyContextProvider } from '@shared/context/company-context';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CompanyWizard from '../components/company-wizard/company-wizard';

export default function DetailsPage() {
  return (
    <AuthSentry redirectPath="/company">
      <Page title="Company wizard - details" withBorder={false}>
        <CompanyWizard wizardType="company" />
      </Page>
    </AuthSentry>
  );
}

DetailsPage.provider = CompanyContextProvider;
