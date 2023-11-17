import { useRouter } from 'next/router';
import { ComponentType } from 'react';
import {
  SideNavigation,
  SideNavigationItem,
  StaticIconProps,
} from 'suomifi-ui-components';
import { IconCatalog } from 'suomifi-ui-components';
import useDimensions from '@/lib/hooks/use-dimensions';
import CustomRouterLink from '@/components/ui/custom-router-link';
import { SideNavItem } from './page';

interface NavItemsProps {
  items: SideNavItem[];
  level?: number;
}

function NavItems(props: NavItemsProps) {
  const { items, level = 1 } = props;
  const router = useRouter();
  const { width } = useDimensions();
  const smallScreen = width <= 1024;

  if (level > 3)
    return (
      <span className="text-red-600 text-xs">
        Nav items can be three-level deep at max.
      </span>
    );

  return items.map(item => {
    const { label, href, children } = item;

    return (
      <SideNavigationItem
        key={href}
        subLevel={level as 1 | 2 | 3}
        content={<CustomRouterLink href={href}>{label}</CustomRouterLink>}
        selected={router.route === href}
        expanded={
          router.route.startsWith(href) || (item.children && smallScreen)
        }
      >
        {children && <NavItems items={children} level={level + 1} />}
      </SideNavigationItem>
    );
  });
}

interface Props {
  title: string;
  icon?: ComponentType<StaticIconProps>;
  items: SideNavItem[];
}

export default function PageSideNavigationMulti(props: Props) {
  const { title, icon: Icon, items } = props;
  const { width } = useDimensions();

  return (
    <div className="lg:shrink-0 bg-white lg:border-r z-10">
      <div className="w-full lg:w-[300px] lg:px-2">
        <SideNavigation
          heading={title}
          aria-label={`${title} navigation`}
          icon={Icon ? <Icon /> : <IconCatalog />}
          variant={width > 1024 ? 'default' : 'smallScreen'}
          initiallyExpanded={false}
        >
          <NavItems items={items} />
        </SideNavigation>
      </div>
    </div>
  );
}
