import { act } from 'react-dom/test-utils';
import IncomeTaxPage from '@pages/profile/employment/income-tax.page';
import {
  MOCK_AUTH_STATE,
  MOCK_TAX_INCOME,
} from '@shared/lib/testing/mocks/mock-values';
import {
  renderWithProviders,
  screen,
  waitFor,
} from '@shared/lib/testing/utils/testing-library-utils';
import * as UtilsExports from '@shared/lib/utils/auth';

describe('Income tax page', () => {
  beforeEach(async () => {
    jest
      .spyOn(UtilsExports, 'getValidAuthState')
      .mockImplementation(async () => MOCK_AUTH_STATE);
  });

  // TODO: implemeent consent check test

  it('shows tax income info, if consent is given', async () => {
    // TODO: mock consent check api call, consent accepted

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
      // values, omit few that needs formatting (dates, currency)
      for (const [key, value] of Object.entries(MOCK_TAX_INCOME)) {
        if (
          [
            'taxPayerType',
            'withholdingPercentage',
            'additionalPercentage',
          ].includes(key)
        ) {
          const element = screen.queryByText(new RegExp(value.toString(), 'i'));
          expect(element).toBeInTheDocument();
        }
      }
    });
  });
});
