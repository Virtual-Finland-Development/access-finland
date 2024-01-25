import WorkContractsPage from '@pages/profile/employment/work-contracts.page';
import { ConsentDataSource, ConsentStatus } from '@shared/types';
import { MOCK_AUTH_STATE } from '@shared/lib/testing/mocks/mock-values';
import {
  act,
  renderWithProviders,
  screen,
  waitFor,
} from '@shared/lib/testing/utils/testing-library-utils';
import * as UtilsExports from '@shared/lib/utils/auth';
import { interceptConsentCheck } from './utils';

describe('Work contracts page', () => {
  beforeEach(async () => {
    jest
      .spyOn(UtilsExports, 'getValidAuthState')
      .mockImplementation(async () => MOCK_AUTH_STATE);
  });

  it('asks for consent for person income tax, if not given', async () => {
    interceptConsentCheck(
      ConsentStatus.VERIFY,
      ConsentDataSource.WORK_CONTRACT
    );

    await act(async () => {
      renderWithProviders(<WorkContractsPage />);
    });

    // expect that consent sentry is present
    const consentSentryHeading = screen.queryByText(/consent required/i);
    expect(consentSentryHeading).toBeInTheDocument();
  });

  it('shows work contracts, if consent is given', async () => {
    interceptConsentCheck(
      ConsentStatus.GRANTED,
      ConsentDataSource.WORK_CONTRACT
    );

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
