import { useRouter } from 'next/router';
import { ComponentType } from 'react';
import {
  ServiceNavigation,
  ServiceNavigationItem,
  StaticIconProps,
  Text,
} from 'suomifi-ui-components';
import { IconCatalog } from 'suomifi-ui-components';
import useDimensions from '@/lib/hooks/use-dimensions';
import CustomRouterLink from '@/components/ui/custom-router-link';
import { SideNavItem } from './page';

interface Props {
  title: string;
  icon?: ComponentType<StaticIconProps>;
  items: SideNavItem[];
}

export default function PageSideNavigationSingle(props: Props) {
  const { title, icon: Icon, items } = props;
  const router = useRouter();
  const { width } = useDimensions();

  return (
    <div className="lg:shrink-0 bg-white lg:border-r z-10">
      <div className="w-full lg:w-[300px]">
        <div className="px-[15px] my-2 hidden lg:flex flex-row items-center gap-3">
          {Icon ? (
            <Icon className="flex-shrink-0 h-10 w-10" />
          ) : (
            <IconCatalog className="flex-shrink-0 h-10 w-10" />
          )}
          <Text className="!font-bold">{title}</Text>
        </div>
        <ServiceNavigation
          aria-label={`${title} navigation`}
          variant={width > 1024 ? 'default' : 'smallScreen'}
          smallScreenExpandButtonText={`${title} / ${
            items.find(item => item.href === router.route)?.label
          }`}
          initiallyExpanded={false}
        >
          {items.map(item => (
            <ServiceNavigationItem
              key={item.href}
              selected={router.route === item.href}
            >
              <CustomRouterLink href={item.href}>{item.label}</CustomRouterLink>
            </ServiceNavigationItem>
          ))}
        </ServiceNavigation>
      </div>
    </div>
  );
}
