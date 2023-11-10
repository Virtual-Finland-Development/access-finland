import { useAuth } from '@shared/context/auth-context';
import Page from '@shared/components/layout/page';
import ProfileAuthenticated from '@shared/components/pages/profile/authenticated';
import ProfileNotAuthenticated from '@shared/components/pages/profile/not-authenticated';
import ProfileSideNavLayout from './components/profile-side-nav-layout';

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? (
    <Page title="Profile">
      <ProfileNotAuthenticated />
    </Page>
  ) : (
    <ProfileSideNavLayout title="Profile">
      <ProfileAuthenticated />
    </ProfileSideNavLayout>
  );
}
