import { ReactNode } from 'react';
import { IconUserProfile } from 'suomifi-ui-components';
import Page from '@shared/components/layout/page';

const SIDE_NAV_ITEMS = [
  { label: 'Your profile', href: '/profile' },
  {
    label: 'Permits',
    href: '/profile/permits',
  },
  {
    label: 'Employment',
    href: '/profile/employment',
    children: [
      { label: 'Work contracts', href: '/profile/employment/work-contracts' },
      { label: 'Income tax', href: '/profile/employment/income-tax' },
    ],
  },
];

interface Props {
  title: string;
  children: ReactNode;
}

export default function ProfileSideNavLayout(props: Props) {
  const { title, children } = props;

  return (
    <Page
      title={title}
      showBackButton={false}
      sideNavTitle="Profile"
      sideNavIcon={IconUserProfile}
      sideNavItems={SIDE_NAV_ITEMS}
      sideNavVariant="multi"
    >
      {children}
    </Page>
  );
}
