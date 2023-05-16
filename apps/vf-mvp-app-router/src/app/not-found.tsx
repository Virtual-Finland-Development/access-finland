'use client';

import { Block, Heading, Text } from 'suomifi-ui-components';
import Page from '@/components/layout/page';
import CustomLink from '@/components/ui/custom-link';

export default function NotFoundPage() {
  return (
    <Page title="404 Not Found">
      <Block variant="section" className="bg-white px-4 py-6">
        <div className="flex flex-col gap-8">
          <Heading variant="h1">Page was not found</Heading>
          <Text>
            The page you were looking for could not be found. This page is not
            available in English, or the page has moved. Please make sure that
            the address is spelled correctly.
          </Text>
          <CustomLink href="/">Go to the home page</CustomLink>
        </div>
      </Block>
    </Page>
  );
}
