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
import FormInput from '@shared/components/form/form-input';
import Alert from '@shared/components/ui/alert';
import CustomHeading from '@shared/components/ui/custom-heading';
import Loading from '@shared/components/ui/loading';

interface SubmitProps {
  text: string;
}

interface FormProps {
  handleFormSubmit: (value: string) => Promise<void>;
  title?: string;
}

type EmailForm = { email: string };
type CodeForm = { code: string };

function Submit({ text }: SubmitProps) {
  return (
    <div className="flex flex-row gap-3 items-center relative">
      <Button type="submit" className="!w-full">
        {text}
      </Button>
    </div>
  );
}

function EmailForm({ handleFormSubmit, title }: FormProps) {
  const { handleSubmit, control } = useForm<EmailForm>();

  const onSubmit: SubmitHandler<EmailForm> = async ({ email }) => {
    await handleFormSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <CustomHeading variant="h3">{title ?? 'Log in'}</CustomHeading>
        <Text>
          Enter your email address you use in Access Finland. We will send you a
          verification code to your email address.
        </Text>
        <FormInput
          name="email"
          type="email"
          labelText="Your email address"
          control={control}
          rules={{ required: 'Email is required' }}
          fullWidth
        />
        <Submit text="Send me a code" />
      </div>
    </form>
  );
}

function CodeForm({ handleFormSubmit }: FormProps) {
  const { handleSubmit, control } = useForm<CodeForm>();

  const onSubmit: SubmitHandler<CodeForm> = async ({ code }) => {
    await handleFormSubmit(code);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <CustomHeading variant="h3">Enter the vefication code</CustomHeading>
        <Text>
          If you did not receive a verification code in your email, please check
          your spam folder. Also make sure you entered the same email address
          you used to sign in to Access Finland.
        </Text>
        <FormInput
          name="code"
          type="text"
          labelText="Your code"
          control={control}
          rules={{ required: 'Code is required' }}
          fullWidth
        />
        <Submit text="Sign in with code" />
      </div>
    </form>
  );
}

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setCodeSent] = useState(false);
  const [authError, setAuthError] = useState<CognitoError | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

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
      setCodeSent(true);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (code: string) => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const isSignedIn = await confirmSignIn(code);

      if (isSignedIn) {
        router.reload();
      } else {
        setIsLoading(false);
      }
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
            title={showRegisterForm ? 'Register' : 'Login'}
            handleFormSubmit={
              showRegisterForm ? handleSignUpSubmit : handleSignInSubmit
            }
          />
        ) : (
          <CodeForm handleFormSubmit={handleCodeSubmit} />
        )}
        <div className="flex flex-row gap-2 !text-base bottom-0">
          <Text className="!text-base">
            {!showRegisterForm
              ? "Don't have an account yet?"
              : 'Already have an account?'}
          </Text>
          <button
            className="text-blue-600 hover:text-blue-800 visited:text-purple-600 !text-base underline"
            onClick={() => setShowRegisterForm(!showRegisterForm)}
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
          </>
        </Alert>
      )}
    </div>
  );
}
