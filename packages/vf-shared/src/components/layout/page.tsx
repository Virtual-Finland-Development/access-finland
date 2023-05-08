import Head from 'next/head';
import { ReactNode } from 'react';
import { Block } from 'suomifi-ui-components';
import CustomHeading from '../ui/custom-heading';
import BackButton from './back-button';
import Breadcrumbs from './breadcrumbs';

interface Props {
  title: string;
  withBorder?: boolean;
  children: ReactNode;
  showHeading?: boolean;
}

function Page(props: Props) {
  const { title, withBorder = true, showHeading = true, children } = props;

  return (
    <>
      <Head>
        <title>{title} - Virtual Finland</title>
      </Head>

      <Breadcrumbs />

      {showHeading && (
        <div className="px-4 md:px-0">
          <CustomHeading variant="h1">
            <span className="text-3xl lg:text-[40px]">{title}</span>
          </CustomHeading>
        </div>
      )}

      <BackButton />

      <Block variant="main">
        <div
          className={`md:mb-8 mt-4 ${
            withBorder ? 'md:border border-gray-300' : ''
          }`}
        >
          {children}
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
  const className = `px-4 lg:px-16 py-5 ${propsClassName}`;

  return (
    <Block variant="section" className={className}>
      {children}
    </Block>
  );
}

Page.Block = PageBlock;

export default Page;
