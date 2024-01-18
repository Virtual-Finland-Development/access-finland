import Head from 'next/head';
import { ComponentType, ReactNode } from 'react';
import { Block, StaticIconProps } from 'suomifi-ui-components';
import CustomHeading from '@/components/ui/custom-heading';
import BackButton from './back-button';
import Breadcrumbs from './breadcrumbs';
import PageSideNavigationMulti from './page-side-navigation-multi';
import PageSideNavigationSingle from './page-side-navigation-single';

export interface SideNavItem {
  label: string;
  href: string;
  children?: SideNavItem[];
}

// shared util function for side navigations
export function getSideNavSmallScreenHeading(
  title: string,
  items: SideNavItem[],
  route: string
) {
  let post = '';

  for (const item of items) {
    if (item.href === route && !item.children) {
      post = item.label;
      break;
    }

    if (item.children) {
      post = item.label;
      const childMatch = item.children.find(child => child.href === route);

      if (childMatch) {
        post = `${post} / ${childMatch.label}`;
        break;
      }
    }
  }

  return post ? `${title} / ${post}` : title;
}

interface Props {
  title: string;
  withBorder?: boolean;
  children: ReactNode;
  showHeading?: boolean;
  showBackButton?: boolean;
  sideNavTitle?: string;
  sideNavIcon?: ComponentType<StaticIconProps>;
  sideNavItems?: SideNavItem[] | undefined;
  sideNavVariant?: 'multi' | 'single';
}

// Outer variable to keep track of whether the page has a side navigation or not.
// Taken into account in PageBlock component.
let pageHasSideNav = false;

function Page(props: Props) {
  const {
    title,
    withBorder = true,
    showHeading = true,
    showBackButton = true,
    sideNavTitle = '',
    sideNavIcon,
    sideNavItems = undefined,
    sideNavVariant = 'single',
    children,
  } = props;

  pageHasSideNav = Boolean(sideNavItems);

  const SideNav =
    sideNavVariant === 'multi'
      ? PageSideNavigationMulti
      : PageSideNavigationSingle;

  return (
    <>
      <Head>
        <title>{title} - Access Finland</title>
      </Head>

      <Breadcrumbs />

      <Block variant="main">
        {showHeading && (
          <div className="px-4 md:px-0">
            <CustomHeading variant="h1">
              <span className="text-3xl lg:text-[40px]">{title}</span>
            </CustomHeading>
          </div>
        )}

        {showBackButton && <BackButton />}

        <div
          className={`md:mb-8 mt-2 ${
            withBorder ? 'md:border border-gray-300' : ''
          }`}
        >
          {sideNavItems ? (
            <div className="flex flex-col lg:flex-row overflow-hidden">
              <SideNav
                title={sideNavTitle}
                icon={sideNavIcon}
                items={sideNavItems}
              />
              <div className="flex flex-col w-full">{children}</div>
            </div>
          ) : (
            <>{children}</>
          )}
        </div>
      </Block>
    </>
  );
}

interface PageBlockProps {
  className?: string;
  children: ReactNode;
}

function PageBlock(props: PageBlockProps) {
  const { className: propsClassName = '', children } = props;
  const largeSceenHorizontalPadding = pageHasSideNav ? 'lg:px-6' : 'lg:px-14';
  const className = `relative px-4 ${largeSceenHorizontalPadding} py-5 grow ${propsClassName}`;

  return (
    <Block variant="section" className={className}>
      {children}
    </Block>
  );
}

Page.Block = PageBlock;

export default Page;
