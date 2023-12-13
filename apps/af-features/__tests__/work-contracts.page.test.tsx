import WorkContractsPage from '@pages/profile/employment/work-contracts.page';
import { MOCK_AUTH_STATE } from '@shared/lib/testing/mocks/mock-values';
import {
  act,
  renderWithProviders,
  screen,
  waitFor,
} from '@shared/lib/testing/utils/testing-library-utils';
import * as UtilsExports from '@shared/lib/utils/auth';

describe('Work contracts page', () => {
  beforeEach(async () => {
    jest
      .spyOn(UtilsExports, 'getValidAuthState')
      .mockImplementation(async () => MOCK_AUTH_STATE);
  });

  // TODO: implement consent check test

  it('shows work contracts, if consent is given', async () => {
    // TODO: mock consent check api call, consent accepted

    await act(async () => {
      renderWithProviders(<WorkContractsPage />);
    });

    // expect that consent sentry is not present
    await waitFor(() => {
      const consentSentryHeading = screen.queryByText(/consent required/i);
      expect(consentSentryHeading).not.toBeInTheDocument();

      // expect that contracts header is present
      const contractsHeader = screen.getByRole('heading', {
        name: /your work contracts/i,
      });
      expect(contractsHeader).toBeInTheDocument();

      // expect that mocked contract is present (mocked in handlers)
      const mockContractTitle = screen.queryAllByText(/abc inc./i)[0];
      expect(mockContractTitle).toBeInTheDocument();
    });
  });
});
