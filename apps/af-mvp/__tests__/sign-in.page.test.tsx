import { useRouter } from 'next/router';
import SignInPage from '@mvp/pages/auth/sign-in/index.page';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import server from '@shared/lib/testing/mocks/server';
import {
  act,
  renderWithProviders,
  screen,
} from '@shared/lib/testing/utils/testing-library-utils';

function interceptSystemLoginRequest() {
  server.use(
    rest.post('http://localhost/api/auth/system/login', (_, res, ctx) =>
      res(ctx.json({ message: 'Login successful' }))
    )
  );
}

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockRouter = {
  reload: jest.fn(),
};
(useRouter as jest.Mock).mockReturnValue(mockRouter);

jest.mock('@mvp/lib/frontend/aws-cognito', () => {
  const fetchAuthIdToken = jest
    .fn()
    .mockImplementationOnce(async () => Promise.resolve(null)) // first test, user is not logged in
    .mockImplementationOnce(async () => Promise.resolve(null)) // second test, user is not logged in
    .mockImplementationOnce(async () => Promise.resolve('asd123')); // third test, user is logged in (idToken returned)
  return {
    fetchAuthIdToken,
    signIn: jest.fn(async () => Promise.resolve()),
    confirmSignIn: jest.fn(async () => Promise.resolve()),
  };
});

describe('Sign-in page tests', () => {
  beforeEach(async () => {
    interceptSystemLoginRequest();

    await act(async () => {
      renderWithProviders(<SignInPage />);
    });
  });

  it('renders a sign-in page and asks user to login', async () => {
    const loginText = screen.getByText(
      /Enter your email address you use in Access Finland./i
    );
    expect(loginText).toBeInTheDocument();
  });

  it('asks user to login, user inputs email, verifies with code and submits, gets logged in', async () => {
    const emailInput = screen.getByLabelText(/Your email address/i);
    expect(emailInput).toBeInTheDocument();

    const submitButton = screen.getByRole('button', {
      name: /Send me a code/i,
    });
    expect(submitButton).toBeInTheDocument();

    // user inputs email, submits
    await userEvent.type(emailInput, 'test@email.com');
    await userEvent.click(submitButton);

    // asks for code verification after
    const codeHeader = screen.getByRole('heading', {
      name: /Enter the vefication code/i,
    });
    expect(codeHeader).toBeInTheDocument();

    const verifyButton = screen.getByRole('button', {
      name: /Sign in with code/i,
    });
    expect(verifyButton).toBeInTheDocument();

    // user inputs code
    // expect code input length and code value to match
    // user submits, gets 'logged in' in cognito, router reloads
    const codeValue = '654321';
    const otpInputsContainer = screen.getByTestId('otp-inputs-container');
    expect(otpInputsContainer).toBeInTheDocument();
    const inputs = otpInputsContainer.querySelectorAll('input');
    expect(inputs).toHaveLength(codeValue.length); // 6

    for (let i = 0; i < inputs.length; i++) {
      await userEvent.type(inputs[i], `${codeValue.split('')[i]}`);
    }

    const code = Array.from(inputs)
      .map(input => input.value)
      .join('');
    expect(code).toBe(codeValue);

    await userEvent.click(verifyButton);
    expect(mockRouter.reload).toHaveBeenCalled();
  });

  it('renders logged in sign-in page for authenticated user', async () => {
    const text1 = screen.getByText(/Finish login to the Access Finland/i);
    const text2 = screen.getByText(
      /Logout from your Virtual Finland login session/i
    );
    expect(text1).toBeInTheDocument();
    expect(text2).toBeInTheDocument();
  });
});
