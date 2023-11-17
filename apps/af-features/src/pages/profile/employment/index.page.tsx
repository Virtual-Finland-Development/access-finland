import { Text } from 'suomifi-ui-components';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomLink from '@shared/components/ui/custom-link';
import PageSideNavLayout from '../components/profile-side-nav-layout';

export default function EmploymentPage() {
  return (
    <AuthSentry redirectPath="/profile">
      <PageSideNavLayout title="Employment">
        <Page.Block className="bg-white">
          <div className="flex flex-col gap-6 items-start">
            <div className="flex flex-row items-center">
              <CustomHeading variant="h2" suomiFiBlue="dark">
                Employment
              </CustomHeading>
            </div>
            <div className="flex flex-col gap-4">
              <Text>
                Working in Finland offers a wealth of opportunities in diverse
                industries. The country’s supportive work environment and
                emphasis on equality make it an attractive destination. From
                tech and healthcare to education and innovation, there are
                chances for career growth. Finland’s inclusive policies and high
                living standards make it an inviting place to work, offering a
                great work-life balance for those seeking new horizons.
              </Text>
              <Text>
                Here’s where you’ll find information about your work contracts
                and income taxes.
              </Text>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <CustomLink href="employment/work-contracts" disableVisited>
                View Your work contracts here
              </CustomLink>
              <CustomLink href="employment/income-tax" disableVisited>
                View Your taxation information here
              </CustomLink>
            </div>
          </div>
        </Page.Block>
      </PageSideNavLayout>
    </AuthSentry>
  );
}
