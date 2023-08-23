import CompanyEditIndexPage from '@pages/company/edit/index.page';
import { MOCK_AUTH_STATE } from '@shared/lib/testing/mocks/mock-values';
import {
  act,
  renderWithProviders,
  screen,
} from '@shared/lib/testing/utils/testing-library-utils';
import * as UtilsExports from '@shared/lib/utils/auth';

describe('Company edit index page', () => {
  it('renders a list of user created companies, if user is authenticated', async () => {
    jest
      .spyOn(UtilsExports, 'getValidAuthState')
      .mockImplementation(async () => MOCK_AUTH_STATE);
    jest
      .spyOn(UtilsExports, 'getUserIdentifier')
      .mockImplementation(
        async () => MOCK_AUTH_STATE.storedAuthState.profileData.userId
      );

    await act(async () => {
      renderWithProviders(<CompanyEditIndexPage />);
    });

    const companyLink = await screen.findByRole('link', {
      name: /daniela-ayaan ltd./i,
    });

    expect(companyLink).toBeInTheDocument();
  });
});
