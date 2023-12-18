import IncomeTaxPage from '@pages/profile/employment/income-tax.page';
import { ConsentDataSource, ConsentStatus } from '@shared/types';
import {
  MOCK_AUTH_STATE,
  MOCK_INCOME_TAX,
} from '@shared/lib/testing/mocks/mock-values';
import {
  act,
  renderWithProviders,
  screen,
  waitFor,
} from '@shared/lib/testing/utils/testing-library-utils';
import * as UtilsExports from '@shared/lib/utils/auth';
import { interceptConsentCheck } from './utils';

describe('Income tax page', () => {
  beforeEach(async () => {
    jest
      .spyOn(UtilsExports, 'getValidAuthState')
      .mockImplementation(async () => MOCK_AUTH_STATE);
  });

  it('asks for consent for person income tax, if not given', async () => {
    interceptConsentCheck(ConsentStatus.VERIFY, ConsentDataSource.INCOME_TAX);

    await act(async () => {
      renderWithProviders(<IncomeTaxPage />);
    });

    // expect that consent sentry is present
    const consentSentryHeading = screen.getByRole('heading', {
      name: /consent required/i,
    });
    expect(consentSentryHeading).toBeInTheDocument();
  });

  it('shows tax income info, if consent is given', async () => {
    interceptConsentCheck(ConsentStatus.GRANTED, ConsentDataSource.INCOME_TAX);

    await act(async () => {
      renderWithProviders(<IncomeTaxPage />);
    });

    // expect that consent sentry is not present
    await waitFor(() => {
      const consentSentryHeading = screen.queryByText(/consent required/i);
      expect(consentSentryHeading).not.toBeInTheDocument();
    });

    // expect that mocked incom tax data is present (mocked in handlers)
    await waitFor(() => {
      const sectionsTexts = [
        'tax payer type',
        'tax rate',
        'additional withholding percentage',
        'income ceiling for the entire year',
        'validity',
      ];
      // section "headers"
      sectionsTexts.forEach(text => {
        const element = screen.queryByText(new RegExp(text, 'i'));
        expect(element).toBeInTheDocument();
      });
      // expect a correct value for mocked income tax tax payer type
      const element = screen.queryByText(
        new RegExp(MOCK_INCOME_TAX.taxPayerType, 'i')
      );
      expect(element).toBeInTheDocument();
    });
  });
});
