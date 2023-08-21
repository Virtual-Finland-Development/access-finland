import { useAuth } from '@shared/context/auth-context';
import Page from '@shared/components/layout/page';
import ProfileAuthenticated from '@shared/components/pages/profile/authenticated';
import ProfileNotAuthenticated from '@shared/components/pages/profile/not-authenticated';

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();

  return (
    <Page title="Profile">
      {!isAuthenticated ? (
        <ProfileNotAuthenticated />
      ) : (
        <ProfileAuthenticated />
      )}
    </Page>
  );
}
