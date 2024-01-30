import { ReactNode } from 'react';
import { IconSupport } from 'suomifi-ui-components';
import Page from '@shared/components/layout/page';

const SIDE_NAV_ITEMS = [
  { label: 'Terms of use', href: '/info/terms-of-use' },
  {
    label: 'Data protection statement',
    href: '/info/data-protection-statement',
  },
];

interface Props {
  title: string;
  children: ReactNode;
}

export default function InfoPagesLayout(props: Props) {
  const { title, children } = props;

  return (
    <Page
      title={title}
      showBackButton={false}
      sideNavTitle="Info"
      sideNavIcon={IconSupport}
      sideNavItems={SIDE_NAV_ITEMS}
    >
      <Page.Block className="bg-white">{children}</Page.Block>
    </Page>
  );
}
