import Head from 'next/head';
import { ComponentType, ReactNode } from 'react';
import { Block, StaticIconProps } from 'suomifi-ui-components';
import CustomHeading from '@/components/ui/custom-heading';
import BackButton from './back-button';
import Breadcrumbs from './breadcrumbs';
import PageSideNavigation from './page-side-navigation';

interface Props {
  title: string;
  withBorder?: boolean;
  children: ReactNode;
  showHeading?: boolean;
  showBackButton?: boolean;
  sideNavTitle?: string;
  sideNavIcon?: ComponentType<StaticIconProps>;
  sideNavItems?: { label: string; href: string }[] | undefined;
}

function Page(props: Props) {
  const {
    title,
    withBorder = true,
    showHeading = true,
    showBackButton = true,
    sideNavTitle = '',
    sideNavIcon,
    sideNavItems = undefined,
    children,
  } = props;

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
              <PageSideNavigation
                title={sideNavTitle}
                icon={sideNavIcon}
                items={sideNavItems}
              />
              <div className="flex flex-col w-full lg:-mx-8">{children}</div>
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
  const className = `px-4 lg:px-14 py-5 grow ${propsClassName}`;

  return (
    <Block variant="section" className={className}>
      {children}
    </Block>
  );
}

Page.Block = PageBlock;

export default Page;
