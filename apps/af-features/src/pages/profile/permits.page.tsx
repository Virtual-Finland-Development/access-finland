import migriLogo from '@shared/images/MIGRI_logo.svg';
import { Text } from 'suomifi-ui-components';
import { ConsentDataSource } from '@shared/types';
import { useDataSourceConsent } from '@shared/lib/hooks/consent';
import { usePersonWorkPermits } from '@shared/lib/hooks/permits';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import Alert from '@shared/components/ui/alert';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomImage from '@shared/components/ui/custom-image';
import Loading from '@shared/components/ui/loading';
import ConsentSentry from './components/consent-sentry';
import WorkPermitsDetails from './components/permits-details';
import PageSideNavLayout from './components/profile-side-nav-layout';

export default function PermitsPage() {
  // get consent situation for permits
  const {
    data: consentSituation,
    giveConsent,
    error: consentError,
    isLoading: consentLoading,
  } = useDataSourceConsent(ConsentDataSource.WORK_PERMIT);

  // get permits, if consent is granted
  const {
    data,
    error: permitsError,
    isLoading: permitsLoading,
  } = usePersonWorkPermits(consentSituation);

  const isLoading = consentLoading || permitsLoading;
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
            {isLoading ? (
              <Loading />
            ) : (
              <ConsentSentry
                consentSituation={consentSituation}
                giveConsent={giveConsent}
                error={consentError}
              >
                <WorkPermitsDetails
                  permits={data?.permits}
                  error={permitsError}
                />
              </ConsentSentry>
            )}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
