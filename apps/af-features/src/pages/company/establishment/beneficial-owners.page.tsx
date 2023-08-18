import { CompanyContextProvider } from '@shared/context/company-context';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CompanyWizard from '../components/company-wizard/company-wizard';

export default function BeneficialOwnersPage() {
  return (
    <AuthSentry redirectPath="/company">
      <Page title="Company wizard - beneficial owners" withBorder={false}>
        <CompanyWizard wizardType="beneficialOwners" />
      </Page>
    </AuthSentry>
  );
}

BeneficialOwnersPage.provider = CompanyContextProvider;
