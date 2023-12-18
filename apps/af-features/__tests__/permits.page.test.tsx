import PermitsPage from '@pages/profile/permits.page';
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

describe('Permits page', () => {
  beforeEach(async () => {
    jest
      .spyOn(UtilsExports, 'getValidAuthState')
      .mockImplementation(async () => MOCK_AUTH_STATE);
  });

  it('asks for consent for work permits, if not given', async () => {
    interceptConsentCheck(ConsentStatus.VERIFY, ConsentDataSource.WORK_PERMIT);

    await act(async () => {
      renderWithProviders(<PermitsPage />);
    });

    // expect that consent sentry is present
    const consentSentryHeading = screen.getByRole('heading', {
      name: /consent required/i,
    });
    expect(consentSentryHeading).toBeInTheDocument();
  });

  it('shows work permits, if consent is given', async () => {
    interceptConsentCheck(ConsentStatus.GRANTED, ConsentDataSource.WORK_PERMIT);

    let dom;

    await act(async () => {
      dom = renderWithProviders(<PermitsPage />);
    });

    // expect that consent sentry is not present
    await waitFor(() => {
      const consentSentryHeading = screen.queryByText(/consent required/i);
      expect(consentSentryHeading).not.toBeInTheDocument();

      // expect that permits header is present
      const permitsHeader = screen.getByRole('heading', {
        name: /your permits/i,
      });
      expect(permitsHeader).toBeInTheDocument();

      // expect that mocked permit is present (mocked in handlers)
      const mockPermitTitle = screen.queryByText(/seasonal work certificate/i);
      expect(mockPermitTitle).toBeInTheDocument();

      // expect two permit expanders to be present (2 mocked permits)
      const permitsExpanders = dom.container.querySelectorAll('.fi-expander');
      expect(permitsExpanders.length).toBe(2);
    });
  });
});
