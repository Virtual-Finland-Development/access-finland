import { Text } from 'suomifi-ui-components';
import { useCompanies } from '@shared/lib/hooks/companies';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomLink from '@shared/components/ui/custom-link';
import CustomText from '@shared/components/ui/custom-text';
import Loading from '@shared/components/ui/loading';

export default function CompanyEditIndexPage() {
  const { data: companies, isLoading, isFetching } = useCompanies();

  return (
    <AuthSentry redirectPath="/company">
      <Page title="Modify company">
        <Page.Block className="bg-white">
          <CustomHeading variant="h2" suomiFiBlue="dark">
            Modify company
          </CustomHeading>
          <div className="flex flex-col mt-8 gap-6 items-start">
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
              tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid
              ex ea commodi consequat. Quis aute iure reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              obcaecat cupiditat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </Text>

            {isLoading || isFetching ? (
              <Loading />
            ) : (
              <>
                {!companies?.length ? (
                  <CustomText $bold>No companies established.</CustomText>
                ) : (
                  <div className="flex flex-col gap-4">
                    {companies.map((company, index) => (
                      <CustomLink
                        key={company.nationalIdentifier}
                        href={`/company/edit/${company.nationalIdentifier}`}
                      >{`${index + 1}. ${
                        company.data.companyDetails.name
                      }`}</CustomLink>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </Page.Block>
      </Page>
    </AuthSentry>
  );
}
