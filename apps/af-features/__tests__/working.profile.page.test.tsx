import WorkingProfilePage from '@pages/profile/working-profile.page';
import userEvent from '@testing-library/user-event';
import { EMPLOYMENT_TYPE_LABELS } from '@shared/lib/constants';
import {
  MOCK_AUTH_STATE,
  MOCK_JOB_APPLICANT_INFO,
} from '@shared/lib/testing/mocks/mock-values';
import {
  act,
  renderWithProviders,
  screen,
  within,
} from '@shared/lib/testing/utils/testing-library-utils';
import * as UtilsExports from '@shared/lib/utils/auth';

describe('Personal profile page', () => {
  it.only('renders a working profile page / form for authenticated user, with correct profile values', async () => {
    jest
      .spyOn(UtilsExports, 'getValidAuthState')
      .mockImplementation(async () => MOCK_AUTH_STATE);

    const user = userEvent.setup();

    await act(async () => {
      renderWithProviders(<WorkingProfilePage />);
    });

    // headers
    const profileHeader = await screen.findByRole('heading', {
      name: /your working profile/i,
    });
    expect(profileHeader).toBeInTheDocument();

    // assert some profile values
    const typeofEmploymentInput = await screen.findByRole('textbox', {
      name: /preferred type of employment/i,
    });
    expect(typeofEmploymentInput).toBeInTheDocument();
    expect(typeofEmploymentInput).toHaveValue(
      EMPLOYMENT_TYPE_LABELS[
        MOCK_JOB_APPLICANT_INFO.workPreferences.typeOfEmployment
      ]
    );

    const selectedOccupations = within(
      screen.getByTestId('occupation-selections')
    ).getAllByRole('button');
    expect(selectedOccupations).toHaveLength(
      MOCK_JOB_APPLICANT_INFO.occupations.length
    );

    // open occupations edit modal, by clicking one of the selected occupations (button)
    await user.click(selectedOccupations[0]);
    // jmf recommendations text
    expect(
      screen.queryByText(
        /please describe the occupations and skills you are looking for/i
      )
    ).toBeInTheDocument();
    // n selected occupations button should appear in modal
    const nSelectedButton = screen.getByRole('button', {
      name: content => {
        const subStrings = [
          `(${MOCK_JOB_APPLICANT_INFO.occupations.length})`,
          'Selected',
        ];
        return subStrings.every(s => content.includes(s));
      },
    });
    expect(nSelectedButton).toBeInTheDocument();
    // click the above button, takes user to edit phase of selected occupations
    await user.click(nSelectedButton);
    // editable occupations should appear, text inputs populated by employer information
    const employerInputs = screen.getAllByRole('textbox', {
      name: /employer/i,
    });
    expect(employerInputs).toHaveLength(
      MOCK_JOB_APPLICANT_INFO.occupations.length
    );
    expect(employerInputs[0]).toHaveValue(
      MOCK_JOB_APPLICANT_INFO.occupations[0].employer
    );
    expect(employerInputs[1]).toHaveValue(
      MOCK_JOB_APPLICANT_INFO.occupations[1].employer
    );
  });
});
