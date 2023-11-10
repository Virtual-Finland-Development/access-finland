import { Text } from 'suomifi-ui-components';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import PageSideNavLayout from './components/profile-side-nav-layout';

export default function PermitsPage() {
  return (
    <AuthSentry redirectPath="/profile">
      <PageSideNavLayout title="Work permits">
        <Page.Block className="bg-white">
          <div className="flex flex-col gap-6 items-start">
            <div className="flex flex-row items-center">
              <CustomHeading variant="h2" suomiFiBlue="dark">
                Work permits
              </CustomHeading>
            </div>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a
              diam eget felis aliquam dignissim. Sed euismod, nisl eget aliquam
              ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl
              vitae nunc.
            </Text>
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
