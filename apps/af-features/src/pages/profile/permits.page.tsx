import migriLogo from '@shared/images/MIGRI_logo.svg';
import { Text } from 'suomifi-ui-components';
import { usePersonWorkPermits } from '@shared/lib/hooks/permits';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomImage from '@shared/components/ui/custom-image';
import Loading from '@shared/components/ui/loading';
import PermitsDetails from './components/permits-details';
import PageSideNavLayout from './components/profile-side-nav-layout';

export default function ResidencePermitsPage() {
  /**
   * TODO: implement consent check before fetching data
   */
  const { data: permits, isLoading } = usePersonWorkPermits();

  return (
    <AuthSentry redirectPath="/profile">
      <PageSideNavLayout title="Permits">
        <Page.Block className="bg-white">
          <div className="flex flex-col gap-6 items-start">
            <div className="flex flex-row items-center">
              <CustomHeading variant="h2" suomiFiBlue="dark">
                Permits
              </CustomHeading>
            </div>
            <div className="flex flex-col gap-2">
              <Text>
                Finnish Immigration Service (Migri) is the organization in
                charge of managing immigration, asylum, residency permits, and
                citizenship processes in Finland, helping people navigate legal
                requirements and settle into life in the country. Here you can
                find information about your residence permits issued by Migri.
              </Text>
              <Text></Text>
              <CustomImage src={migriLogo} alt="Migri" height={100} />
            </div>
            {isLoading ? <Loading /> : <PermitsDetails permits={permits} />}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
