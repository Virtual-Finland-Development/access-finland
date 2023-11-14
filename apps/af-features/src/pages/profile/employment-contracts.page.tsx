import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import PageSideNavLayout from './components/profile-side-nav-layout';

export default function EmploymentContractsPage() {
  return (
    <AuthSentry redirectPath="/profile">
      <PageSideNavLayout title="Taxation">
        <Page.Block className="bg-white">Employment Contracts Page</Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
