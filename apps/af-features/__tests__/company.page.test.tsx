import { act } from 'react-dom/test-utils';
import CompanyPage from '@pages/company/index.page';
import { MOCK_AUTH_STATE } from '@shared/lib/testing/mocks/mock-values';
import {
  renderWithProviders,
  screen,
} from '@shared/lib/testing/utils/testing-library-utils';
import * as UtilsExports from '@shared/lib/utils/auth';

describe('Company index page', () => {
  it('renders a identification button, if user is not authenticated', async () => {
    await act(async () => {
      renderWithProviders(<CompanyPage />);
    });

    const loginButton = screen.getByRole('button', {
      name: /identification/i,
    });

    expect(loginButton).toBeInTheDocument();
  });

  it('renders a company establishment button, if user is authenticated', async () => {
    jest
      .spyOn(UtilsExports, 'getValidAuthState')
      .mockImplementation(async () => MOCK_AUTH_STATE);

    await act(async () => {
      renderWithProviders(<CompanyPage />);
    });

    const establishCompanyButton = screen.getByRole('button', {
      name: /establish company/i,
    });

    expect(establishCompanyButton).toBeInTheDocument();
  });
});
