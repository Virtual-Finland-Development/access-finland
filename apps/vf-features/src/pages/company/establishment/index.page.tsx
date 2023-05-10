import { Button, InlineAlert, Text } from 'suomifi-ui-components';
import {
  CompanyContextProvider,
  useCompanyContext,
} from '@shared/context/company-context';
import AuthSentry from '@shared/components/auth-sentry';
import Page from '@shared/components/layout/page';
import CustomHeading from '@shared/components/ui/custom-heading';
import CustomLink from '@shared/components/ui/custom-link';
import Loading from '@shared/components/ui/loading';
import Preview from '../components/preview';

export default function CompanyEstablishmentPage() {
  const { doneSteps, saveCompany, isSaving, saveIsSuccess } =
    useCompanyContext();

  const doneStepValues = Object.values(doneSteps);
  const allStepsDone = doneStepValues.every(isDone => isDone);

  return (
    <AuthSentry redirectPath="/company">
      <Page title="Company establishment">
        <Page.Block className="bg-white">
          <CustomHeading variant="h2" className="!text-2xl">
            Required information to provide for establishing a company in
            Finland
          </CustomHeading>
          <div className="flex flex-col mt-4 gap-6 items-start">
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
              tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid
              ex ea commodi consequat. Quis aute iure reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
              obcaecat cupiditat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </Text>

            {!isSaving && !saveIsSuccess && <Preview previewType="all" />}

            {isSaving && (
              <div className="w-full flex items-center justify-center h-[212px]">
                <Loading text="Saving..." />
              </div>
            )}

            <div className="flex flex-col w-full">
              <div>
                {!saveIsSuccess ? (
                  <InlineAlert status="warning">
                    <Text className="!font-bold">
                      Before you submit, be sure to preview all the information
                      you provide to make sure it´s correct and up-to-date.
                    </Text>
                  </InlineAlert>
                ) : (
                  <InlineAlert status="neutral">
                    <div className="flex flex-col gap-2">
                      <Text className="!font-bold">
                        Company information received, pending registration.
                      </Text>
                      <CustomLink href="/company/edit">
                        View created companies
                      </CustomLink>
                    </div>
                  </InlineAlert>
                )}
              </div>

              {!saveIsSuccess && (
                <div className="mt-5 border-t pt-5">
                  <Button
                    disabled={!allStepsDone || isSaving}
                    onClick={saveCompany}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Page.Block>
      </Page>
    </AuthSentry>
  );
}

CompanyEstablishmentPage.provider = CompanyContextProvider;
