import { ReactNode } from 'react';
import { IconUserProfile } from 'suomifi-ui-components';
import Page from '@shared/components/layout/page';

const SIDE_NAV_ITEMS = [
  { label: 'Your profile', href: '/profile' },
  {
    label: 'Residence permits',
    href: '/profile/residence-permits',
  },
  {
    label: 'Taxation',
    href: '/profile/taxation',
  },
  {
    label: 'Employment contracts',
    href: '/profile/employment-contracts',
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
    >
      {children}
    </Page>
  );
}
