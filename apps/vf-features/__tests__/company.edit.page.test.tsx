import CompanyEditIndexPage from '@pages/company/edit/index.page';
import { MOCK_AUTH_STATE } from '@/lib/testing/mocks/mock-values';
import {
  renderWithProviders,
  screen,
} from '@/lib/testing/utils/testing-library-utils';
import * as UtilsExports from '@/lib/utils';

describe('Company edit index page', () => {
  it('renders a list of user created companies, if user is authenticated', async () => {
    jest
      .spyOn(UtilsExports, 'getValidAuthState')
      .mockImplementation(() => MOCK_AUTH_STATE);
    jest
      .spyOn(UtilsExports, 'getUserIdentifier')
      .mockImplementation(
        () => MOCK_AUTH_STATE.storedAuthState.profileData.userId
      );

    renderWithProviders(<CompanyEditIndexPage />);

    const companyLink = await screen.findByRole('link', {
      name: /daniela-ayaan ltd./i,
    });

    expect(companyLink).toBeInTheDocument();
  });
});
