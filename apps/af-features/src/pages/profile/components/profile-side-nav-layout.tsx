import { ReactNode } from 'react';
import { IconUserProfile } from 'suomifi-ui-components';
import Page from '@shared/components/layout/page';

const SIDE_NAV_ITEMS = [
  { label: 'Your profile', href: '/profile' },
  {
    label: 'Work permits',
    href: '/profile/work-permits',
  },
  {
    label: 'Taxes',
    href: '/profile/taxes',
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
