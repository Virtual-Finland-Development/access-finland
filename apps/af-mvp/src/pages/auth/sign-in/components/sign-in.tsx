import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  CognitoError,
  CognitoErrorTypes,
  confirmSignIn,
  parseCognitoError,
  signIn,
  signUp,
} from '@mvp/lib/frontend/aws-cognito';
import { Button, Text } from 'suomifi-ui-components';
import FormCodeInput from '@shared/components/form/form-code-input';
import FormInput from '@shared/components/form/form-input';
import Alert from '@shared/components/ui/alert';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';

interface SubmitProps {
  text: string;
  disabled?: boolean;
}

interface FormProps {
  handleFormSubmit: (value: string) => Promise<void>;
  title?: string;
}

interface EmailFormProps extends FormProps {
  type: 'register' | 'login';
}

interface CodeFormProps extends FormProps {
  tryCount: number;
  maxTries: number;
}

type EmailForm = { email: string };
type CodeForm = { code: string };

function Submit(props: SubmitProps) {
  const { text, disabled } = props;

  return (
    <div className="flex flex-row gap-3 items-center relative">
      <Button type="submit" className="!w-full" disabled={disabled}>
        {text}
      </Button>
    </div>
  );
}

function EmailForm(props: EmailFormProps) {
  const { handleFormSubmit, title, type } = props;
  const { handleSubmit, control } = useForm<EmailForm>();

  const onSubmit: SubmitHandler<EmailForm> = async ({ email }) => {
    await handleFormSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <CustomHeading variant="h3">{title ?? 'Log in'}</CustomHeading>
        <Text>
          {type === 'register'
            ? "To register, all you need is an email address - we don't collect any other personal information about you."
            : 'Enter your email address you use in Access Finland. We will send you a verification code to your email address.'}
        </Text>
        <FormInput
          name="email"
          type="email"
          labelText="Your email address"
          control={control}
          rules={{ required: 'Email is required' }}
          fullWidth
        />
        <Submit
          text={
            type === 'register'
              ? 'Register and send me a code'
              : 'Send me a code'
          }
        />
      </div>
    </form>
  );
}

function CodeForm(props: CodeFormProps) {
  const { handleFormSubmit, tryCount, maxTries } = props;
  const { handleSubmit, control } = useForm<CodeForm>();

  const onSubmit: SubmitHandler<CodeForm> = async ({ code }) => {
    await handleFormSubmit(code);
  };

  const isDisabled = tryCount >= maxTries;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <CustomHeading variant="h3">Enter the vefication code</CustomHeading>
        <Text>
          If you did not receive a verification code in your email, please check
          your spam folder. Also make sure you entered the same email address
          you used to sign in to Access Finland.
        </Text>
        <FormCodeInput
          name="code"
          labelText="Your code"
          control={control}
          rules={{
            required: 'Code is required',
            validate: value => value.length === 6 || 'Code must be 6 digits',
          }}
          numInputs={6}
          fullWidth
        />
        <Submit text="Sign in with code" disabled={isDisabled} />
      </div>
    </form>
  );
}

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [authError, setAuthError] = useState<CognitoError | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [codeSubmitTries, setCodeSubmitTries] = useState(0);
  const codeSubmitMaxTries = 3;

  const handleError = (error: Error) => {
    const cognitoError = parseCognitoError(error);
    setAuthError(cognitoError);
  };

  const handleSignUpSubmit = async (email: string) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      await signUp(email);
      await handleSignInSubmit(email);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSubmit = async (email: string) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      await signIn(email);
      setIsCodeSent(true);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (code: string) => {
    setAuthError(null);
    setIsLoading(true);
    setCodeSubmitTries(codeSubmitTries + 1);

    try {
      await confirmSignIn(code);
      router.reload(); // Success, reload the page to login to the app
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col justify-center gap-3">
      {isLoading && (
        <div className="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
          <Loading />
        </div>
      )}

      <div className="flex flex-col gap-4 items-start">
        {!isCodeSent ? (
          <EmailForm
            type={showRegisterForm ? 'register' : 'login'}
            title={showRegisterForm ? 'Register' : 'Login'}
            handleFormSubmit={
              showRegisterForm ? handleSignUpSubmit : handleSignInSubmit
            }
          />
        ) : (
          <CodeForm
            handleFormSubmit={handleCodeSubmit}
            tryCount={codeSubmitTries}
            maxTries={codeSubmitMaxTries}
          />
        )}
        <div className="flex flex-row gap-2">
          <Text className="!text-base">
            {!showRegisterForm
              ? "Don't have an account yet?"
              : 'Already have an account?'}
          </Text>
          <button
            className="text-[14px] font-semibold text-blue-600 hover:text-blue-800 visited:text-purple-600 underline"
            onClick={() => {
              setAuthError(null);
              setIsCodeSent(false);
              setShowRegisterForm(!showRegisterForm);
            }}
          >
            {!showRegisterForm ? 'Register' : 'Login'} here
          </button>
        </div>
      </div>

      {authError && (
        <Alert status="error" labelText={authError.message}>
          <>
            {authError.type === CognitoErrorTypes.UsernameExistsException && (
              <Text className="!text-base">
                You already have an account. Please sign in with your email.
              </Text>
            )}
            {authError.type === CognitoErrorTypes.UserNotFoundException && (
              <Text className="!text-base">
                You don&apos;t have an account yet. Please register with your
                email.
              </Text>
            )}
            {authError.type === CognitoErrorTypes.CodeMismatchException && (
              <Text className="!text-base">
                The code you entered is incorrect. You have{' '}
                {Math.max(codeSubmitMaxTries - codeSubmitTries, 0)} tries left
                to enter the code. Please try again.
              </Text>
            )}
            {authError.type ===
              CognitoErrorTypes.MaxCodeAttemptsExceededException && (
              <Text className="!text-base">
                You have reached the maximum number of tries to enter the code.
                Please try again later.
              </Text>
            )}
          </>
        </Alert>
      )}
    </div>
  );
}
