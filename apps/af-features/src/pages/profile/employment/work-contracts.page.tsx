import { Text } from 'suomifi-ui-components';
import { usePersonWorkContracts } from '@shared/lib/hooks/employment';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';
import PageSideNavLayout from '../components/profile-side-nav-layout';
import WorkContractsDetails from '../components/work-contracts-details';

export default function WorkContractsPage() {
  /**
   * TODO: implement consent check before fetching data
   */
  const { data: contracts, isLoading } = usePersonWorkContracts();

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
              This is your place to check out your work contracts in Finland.
              Everything you need to know about your work arrangements in one
              easy spot. Get the details on your terms, conditions, and work
              specifics here.
            </Text>
            {isLoading ? (
              <Loading />
            ) : (
              <WorkContractsDetails contracts={contracts} />
            )}
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
