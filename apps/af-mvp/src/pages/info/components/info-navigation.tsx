import { useRouter } from 'next/router';
import {
  ServiceNavigation,
  ServiceNavigationItem,
  Text,
} from 'suomifi-ui-components';
import { IconSupport } from 'suomifi-ui-components';
import useDimensions from '@shared/lib/hooks/use-dimensions';
import CustomRouterLink from '@shared/components/ui/custom-router-link';

const INFO_ROUTES = {
  aboutTheService: '/info/about-the-service',
  termsOfUse: '/info/terms-of-use',
  informationSecurityAndRegisterDescription:
    '/info/information-security-and-register-description',
};

const INFO_ROUTES_TITLES = {
  [INFO_ROUTES.aboutTheService]: 'About the Service',
  [INFO_ROUTES.termsOfUse]: 'Terms of Use',
  [INFO_ROUTES.informationSecurityAndRegisterDescription]:
    'Information Security and Register Description',
};

export default function InfoNavigation() {
  const router = useRouter();
  const { width } = useDimensions();

  return (
    <div className="w-full lg:w-[320px]">
      <div className="px-2 my-2 hidden lg:flex flex-row items-center gap-3">
        <IconSupport className="flex-shrink-0 h-10 w-10" />
        <Text className="!font-bold">Info</Text>
      </div>
      <ServiceNavigation
        aria-label="Info navigation"
        variant={width > 1024 ? 'default' : 'smallScreen'}
        smallScreenExpandButtonText={`Info / ${
          INFO_ROUTES_TITLES[router.route]
        }`}
        initiallyExpanded={false}
      >
        {Object.entries(INFO_ROUTES).map(([key, value]) => (
          <ServiceNavigationItem selected={router.route === value} key={key}>
            <CustomRouterLink href={value}>
              {INFO_ROUTES_TITLES[value]}
            </CustomRouterLink>
          </ServiceNavigationItem>
        ))}
      </ServiceNavigation>
    </div>
  );
}
