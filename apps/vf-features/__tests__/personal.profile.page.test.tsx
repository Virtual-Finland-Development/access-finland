import PersonalProfilePage from '@pages/profile/personal-profile.page';
import * as UtilsExports from '@/lib/utils/auth';
import {
  MOCK_AUTH_STATE,
  MOCK_ISO_COUNTRIES,
  MOCK_PERSON_BASIC_INFO,
} from '@shared/lib/testing/mocks/mock-values';
import {
  renderWithProviders,
  screen,
} from '@shared/lib/testing/utils/testing-library-utils';

describe('Personal profile page', () => {
  it('renders a personal profile page / form for authenticated user, with correct profile values', async () => {
    jest
      .spyOn(UtilsExports, 'getValidAuthState')
      .mockImplementation(async () => MOCK_AUTH_STATE);

    renderWithProviders(<PersonalProfilePage />);

    // headers
    const profileHeader = await screen.findByRole('heading', {
      name: /your personal profile/i,
    });
    const personalInfoHeader = await screen.findByRole('heading', {
      name: /personal information/i,
    });
    expect(profileHeader).toBeInTheDocument();
    expect(personalInfoHeader).toBeInTheDocument();

    // assert some profile values
    const firstNameInput = screen.getByRole('textbox', {
      name: /given name/i,
    });
    const lastNameInput = screen.getByRole('textbox', {
      name: /last name/i,
    });
    const countrySelectTextInput = screen.getByRole('textbox', {
      name: /country of residence/i,
    });
    expect(firstNameInput).toHaveValue(MOCK_PERSON_BASIC_INFO.givenName);
    expect(lastNameInput).toHaveValue(MOCK_PERSON_BASIC_INFO.lastName);
    expect(countrySelectTextInput).toHaveValue(
      MOCK_ISO_COUNTRIES.find(
        c => c.threeLetterISORegionName === MOCK_PERSON_BASIC_INFO.residency
      )?.englishName
    );
  });
});
